from decimal import Decimal

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.models import Cart
from apps.orders.models import Order, OrderItem

from .serializers import OrderSerializer

class CheckoutAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        cart = get_object_or_404(
            Cart,
            user=request.user,
        )
        if not cart.items.exists():

            return Response(
                {
                    "error": "Your cart is empty."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        order = Order.objects.create(
            user=request.user,
        )

        total = Decimal("0.00")

        for item in cart.items.select_related("product"):

            if item.quantity > item.product.stock_quantity:

                return Response(
                    {
                        "error": (
                            f"Not enough stock for "
                            f"{item.product.name}."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                ) 

            price = (
                item.product.discount_price
                if item.product.discount_price
                else item.product.price
            )    

            subtotal = price * item.quantity

            OrderItem.objects.create(

                order=order,

                product=item.product,

                price=price,

                quantity=item.quantity,

                subtotal=subtotal,
            )    

            total += subtotal

            item.product.stock_quantity -= item.quantity

            if item.product.stock_quantity <= 0:

                item.product.is_available = False

            item.product.save()            

        order.total_amount = total

        order.save()

        cart.items.all().delete()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

class OrderListAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        queryset = (
            Order.objects
            .filter(user=request.user)
            .prefetch_related("items")
            .order_by("-created_at")
        )

        serializer = OrderSerializer(
            queryset,
            many=True,
        )

        return Response(serializer.data)

class OrderDetailAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):

        order = get_object_or_404(
            Order,
            pk=pk,
            user=request.user,
        )

        serializer = OrderSerializer(order)

        return Response(serializer.data)