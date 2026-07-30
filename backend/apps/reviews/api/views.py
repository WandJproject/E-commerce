from django.db.models import Avg

from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from apps.reviews.models import Review

from .serializers import ReviewSerializer

class ReviewCreateAPIView(generics.CreateAPIView):

    serializer_class = ReviewSerializer

    permission_classes = [
        IsAuthenticatedOrReadOnly
    ]

class ProductReviewListAPIView(
    generics.ListAPIView
):

    serializer_class = ReviewSerializer

    def get_queryset(self):

        product_id = self.kwargs["product_id"]

        return Review.objects.filter(
            product_id=product_id
        )

class ReviewUpdateAPIView(
    generics.UpdateAPIView
):

    serializer_class = ReviewSerializer

    permission_classes = [
        IsAuthenticatedOrReadOnly
    ]

    def get_queryset(self):

        return Review.objects.filter(
            user=self.request.user
        )

class ReviewDeleteAPIView(
    generics.DestroyAPIView
):

    permission_classes = [
        IsAuthenticatedOrReadOnly
    ]

    def get_queryset(self):

        return Review.objects.filter(
            user=self.request.user
        )

    