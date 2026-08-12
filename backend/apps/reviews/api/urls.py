from django.urls import path

from .views import (
    ProductReviewListAPIView,
    ReviewCreateAPIView,
    ReviewDeleteAPIView,
    ReviewUpdateAPIView,
)

urlpatterns = [

    path(
        "",
        ReviewCreateAPIView.as_view(),
        name="review-create",
    ),

    path(
        "product/<int:product_id>/",
        ProductReviewListAPIView.as_view(),
        name="product-reviews",
    ),

    path(
        "<int:pk>/update/",
        ReviewUpdateAPIView.as_view(),
        name="review-update",
    ),

    path(
        "<int:pk>/delete/",
        ReviewDeleteAPIView.as_view(),
        name="review-delete",
    ),
]