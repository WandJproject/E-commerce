from django.urls import path

from .views import (
    CheckoutAPIView,
    OrderDetailAPIView,
    OrderListAPIView,
    UpdateOrderStatusAPIView,
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

    path(
        "<int:pk>/status/",
        UpdateOrderStatusAPIView.as_view(),
        name="order-status",
    ),
    
]