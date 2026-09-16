from django.shortcuts import get_object_or_404

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.models import Product
from apps.wishlist.models import WishlistItem

from .serializers import (
    AddToWishlistSerializer,
    RemoveFromWishlistSerializer,
    WishlistItemSerializer,
)

class WishlistAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        queryset = WishlistItem.objects.filter(
            user=request.user
        ).select_related("product").prefetch_related("product__images")

        serializer = WishlistItemSerializer(
            queryset,
            many=True,
        )

        return Response(serializer.data)

class AddToWishlistAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        serializer = AddToWishlistSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        product = get_object_or_404(
            Product,
            id=serializer.validated_data["product_id"],
        )

        WishlistItem.objects.get_or_create(
            user=request.user,
            product=product,
        )

        queryset = WishlistItem.objects.filter(
            user=request.user
        )

        return Response(
            WishlistItemSerializer(
                queryset,
                many=True,
            ).data,
            status=status.HTTP_200_OK,
        )

class RemoveFromWishlistAPIView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        serializer = RemoveFromWishlistSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        WishlistItem.objects.filter(
            user=request.user,
            product_id=serializer.validated_data["product_id"],
        ).delete()

        queryset = WishlistItem.objects.filter(
            user=request.user
        )

        return Response(
            WishlistItemSerializer(
                queryset,
                many=True,
            ).data,
            status=status.HTTP_200_OK,
        )    
    