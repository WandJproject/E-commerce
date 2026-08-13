from django.urls import path

from .views import (
    PaymentListAPIView,
    InitializePaymentAPIView,
    VerifyPaymentAPIView,
    PaystackWebhookAPIView,
)

urlpatterns = [
    path(
        "",
        PaymentListAPIView.as_view(),
        name="payment-list",
    ),

    path(
        "initialize/",
        InitializePaymentAPIView.as_view(),
        name="payment-initialize",
    ),

    path(
        "verify/<str:reference>/",
        VerifyPaymentAPIView.as_view(),
        name="payment-verify",
    ),

    path(
        "webhook/",
        PaystackWebhookAPIView.as_view(),
        name="paystack-webhook",
    ),
]