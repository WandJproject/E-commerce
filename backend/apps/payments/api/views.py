from decimal import Decimal

from django.shortcuts import get_object_or_404

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order
from apps.payments.models import Payment
from apps.payments.services import (
    fulfill_payment,
    initialize_payment,
    verify_payment,
    verify_webhook_signature,
)

from .serializers import (
    InitializePaymentSerializer,
    PaymentSerializer,
)


class PaymentListAPIView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):

        payments = (
            Payment.objects
            .filter(user=request.user)
            .select_related("order")
            .order_by("-created_at")
        )

        serializer = PaymentSerializer(
            payments,
            many=True,
        )

        return Response(serializer.data)


class InitializePaymentAPIView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):

        serializer = InitializePaymentSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True
        )

        order = get_object_or_404(
            Order,
            id=serializer.validated_data["order_id"],
            user=request.user,
        )

        if order.status != Order.Status.PENDING:
            return Response(
                {
                    "error": (
                        "Only pending orders can be paid."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        amount = int(
            Decimal(order.total_amount) * 100
        )

        response = initialize_payment(
            request.user.email,
            amount,
        )

        if not response.get("status"):

            return Response(
                response,
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = response["data"]

        payment, created = Payment.objects.get_or_create(
            order=order,
            defaults={
                "user": request.user,
                "reference": data["reference"],
                "amount": order.total_amount,
                "currency": "NGN",
            },
        )

        if not created:

            if payment.status == Payment.Status.SUCCESS:
                return Response(
                    {
                        "error": (
                            "This order has already been paid."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            payment.reference = data["reference"]
            payment.amount = order.total_amount
            payment.currency = "NGN"
            payment.status = Payment.Status.PENDING

            payment.save(
                update_fields=[
                    "reference",
                    "amount",
                    "currency",
                    "status",
                    "updated_at",
                ]
            )

        return Response(
            {
                "authorization_url": (
                    data["authorization_url"]
                ),
                "reference": payment.reference,
            },
            status=status.HTTP_200_OK,
        )


class VerifyPaymentAPIView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, reference):

        payment = get_object_or_404(
            Payment,
            reference=reference,
            user=request.user,
        )

        if payment.status == Payment.Status.SUCCESS:
            return Response(
                PaymentSerializer(payment).data,
                status=status.HTTP_200_OK,
            )

        response = verify_payment(reference)

        if not response.get("status"):

            return Response(
                {
                    "error": (
                        response.get(
                            "message",
                            "Payment verification failed.",
                        )
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        gateway_data = response.get("data", {})

        if gateway_data.get("status") != "success":

            payment.status = Payment.Status.FAILED

            payment.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            return Response(
                PaymentSerializer(payment).data,
                status=status.HTTP_200_OK,
            )

        try:

            payment = fulfill_payment(
                payment,
                gateway_data,
            )

        except ValueError as exc:

            return Response(
                {
                    "error": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_200_OK,
        )


class PaystackWebhookAPIView(APIView):

    permission_classes = [
        permissions.AllowAny
    ]

    authentication_classes = []

    def post(self, request):

        signature = request.headers.get(
            "x-paystack-signature"
        )

        if not verify_webhook_signature(
            request.body,
            signature,
        ):
            return Response(
                {
                    "error": "Invalid webhook signature."
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        event = request.data

        if event.get("event") != "charge.success":
            return Response(
                {
                    "message": "Event received."
                },
                status=status.HTTP_200_OK,
            )

        gateway_data = event.get("data", {})

        reference = gateway_data.get(
            "reference"
        )

        if not reference:
            return Response(
                {
                    "error": "Missing payment reference."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment = Payment.objects.filter(
            reference=reference
        ).first()

        if not payment:
            return Response(
                {
                    "error": "Payment not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        try:

            fulfill_payment(
                payment,
                gateway_data,
            )

        except ValueError as exc:

            return Response(
                {
                    "error": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message": "Webhook processed successfully."
            },
            status=status.HTTP_200_OK,
        )