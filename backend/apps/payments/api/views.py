from decimal import Decimal

from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.models import Cart
from apps.orders.models import Order
from apps.payments.models import Payment
from apps.payments.services import (
    initialize_payment,
    verify_payment,
)

from .serializers import (
    InitializePaymentSerializer,
    PaymentSerializer,
)


class PaymentListAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        payments = Payment.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = PaymentSerializer(
            payments,
            many=True,
        )

        return Response(serializer.data)


class InitializePaymentAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        serializer = InitializePaymentSerializer(
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        order = get_object_or_404(
            Order,
            id=serializer.validated_data["order_id"],
            user=request.user,
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

        payment, _ = Payment.objects.get_or_create(
            order=order,
            defaults={
                "user": request.user,
                "reference": data["reference"],
                "amount": order.total_amount,
            },
        )

        return Response(
            {
                "authorization_url": data["authorization_url"],
                "reference": payment.reference,
            }
        )


class VerifyPaymentAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, reference):

        payment = get_object_or_404(
            Payment,
            reference=reference,
            user=request.user,
        )

        response = verify_payment(reference)

        if (
            response["status"]
            and response["data"]["status"] == "success"
        ):

            payment.status = Payment.Status.SUCCESS
            payment.paid_at = timezone.now()
            payment.save()

            order = payment.order
            order.status = Order.Status.PAID
            order.save(update_fields=["status"])

            for item in order.items.select_related("product"):

                product = item.product

                product.stock_quantity -= item.quantity

                if product.stock_quantity <= 0:
                    product.stock_quantity = 0
                    product.is_available = False

                product.save()

            cart = Cart.objects.filter(
                user=request.user
            ).first()

            if cart:
                cart.items.all().delete()

            return Response(
                PaymentSerializer(payment).data
            )

        payment.status = Payment.Status.FAILED
        payment.save(update_fields=["status"])

        return Response(
            PaymentSerializer(payment).data
        )