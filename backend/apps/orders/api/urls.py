from django.urls import path

from .views import (
    CheckoutAPIView,
    OrderDetailAPIView,
    OrderListAPIView,
)

urlpatterns = [

    path(
        "checkout/",
        CheckoutAPIView.as_view(),
        name="checkout",
    ),

    path(
        "",
        OrderListAPIView.as_view(),
        name="orders",
    ),

    path(
        "<int:pk>/",
        OrderDetailAPIView.as_view(),
        name="order-detail",
    ),
]