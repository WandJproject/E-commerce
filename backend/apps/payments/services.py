import hashlib
import hmac
import uuid
from decimal import Decimal

import requests
from decouple import config

from django.db import transaction
from django.utils import timezone

from apps.cart.models import Cart
from apps.orders.models import Order

from .models import Payment


PAYSTACK_CALLBACK_URL = config("PAYSTACK_CALLBACK_URL")
PAYSTACK_SECRET_KEY = config("PAYSTACK_SECRET_KEY")


def initialize_payment(email, amount):
    """
    Initialize a Paystack transaction.

    amount is expressed in the smallest currency unit
    (kobo for NGN).
    """

    url = "https://api.paystack.co/transaction/initialize"

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json",
    }

    reference = str(uuid.uuid4())

    payload = {
        "email": email,
        "amount": amount,
        "reference": reference,
        "callback_url": PAYSTACK_CALLBACK_URL,
    }

    response = requests.post(
        url,
        json=payload,
        headers=headers,
        timeout=30,
    )

    return response.json()


def verify_payment(reference):
    """
    Verify a Paystack transaction.
    """

    url = (
        f"https://api.paystack.co/transaction/verify/{reference}"
    )

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
    }

    response = requests.get(
        url,
        headers=headers,
        timeout=30,
    )

    return response.json()


def verify_webhook_signature(payload, signature):
    """
    Verify that a webhook request came from Paystack.

    Paystack signs webhook payloads using HMAC SHA512
    and the secret key.
    """

    if not signature:
        return False

    expected_signature = hmac.new(
        PAYSTACK_SECRET_KEY.encode("utf-8"),
        payload,
        hashlib.sha512,
    ).hexdigest()

    return hmac.compare_digest(
        expected_signature,
        signature,
    )


@transaction.atomic
def fulfill_payment(payment, gateway_data):
  

    payment = (
        Payment.objects
        .select_for_update()
        .get(pk=payment.pk)
    )
    
    gateway_amount = gateway_data.get("amount")
    gateway_currency = gateway_data.get("currency")
    gateway_reference = gateway_data.get("reference")

    expected_amount = int(
        Decimal(payment.amount) * 100
    )

    if gateway_reference != payment.reference:
        raise ValueError(
            "Payment reference does not match."
        )

    if gateway_amount != expected_amount:
        raise ValueError(
            "Payment amount does not match the order amount."
        )

    if gateway_currency != payment.currency:
        raise ValueError(
            "Payment currency does not match."
        )

    order = (
        Order.objects
        .select_for_update()
        .get(pk=payment.order_id)
    )

    if order.status == Order.Status.CANCELLED:
        raise ValueError(
            "Cannot fulfill a cancelled order."
        )

    for item in order.items.select_related("product"):

        product = item.product

        if item.quantity > product.stock_quantity:
            raise ValueError(
                f"Not enough stock for {product.name}."
            )

    for item in order.items.select_related("product"):

        product = item.product

        product.stock_quantity -= item.quantity

        if product.stock_quantity <= 0:
            product.stock_quantity = 0
            product.is_available = False

        product.save(
            update_fields=[
                "stock_quantity",
                "is_available",
            ]
        )

    payment.status = Payment.Status.SUCCESS
    payment.paid_at = timezone.now()
    payment.save(
        update_fields=[
            "status",
            "paid_at",
            "updated_at",
        ]
    )

    order.status = Order.Status.PAID
    order.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    cart = Cart.objects.filter(
        user=payment.user
    ).first()

    if cart:
        cart.items.all().delete()

    return payment