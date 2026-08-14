from django.shortcuts import get_object_or_404

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.models import Cart, CartItem
from apps.products.models import Product

from .serializers import (
    AddToCartSerializer,
    CartSerializer,
    RemoveFromCartSerializer,
)
class CartAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        serializer = CartSerializer(cart)

        return Response(serializer.data)


class AddToCartAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        serializer = AddToCartSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        cart, _ = Cart.objects.get_or_create(
            user=request.user
        )

        product = get_object_or_404(
            Product,
            id=serializer.validated_data["product_id"],
        )

        quantity = serializer.validated_data["quantity"]

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={
                "quantity": quantity,
            },
        )

        if not created:

            cart_item.quantity += quantity

            cart_item.save()

        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_200_OK,
        )

class RemoveFromCartAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        serializer = RemoveFromCartSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        cart = get_object_or_404(
            Cart,
            user=request.user,
        )

        CartItem.objects.filter(
            cart=cart,
            product_id=serializer.validated_data["product_id"],
        ).delete()

        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_200_OK,
        )    

class ClearCartAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        cart = get_object_or_404(
            Cart,
            user=request.user,
        )

        cart.items.all().delete()

        return Response(
            {
                "message": "Cart cleared successfully."
            },
            status=status.HTTP_200_OK,
        )
    