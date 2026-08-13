import uuid

import requests
from decouple import config

PAYSTACK_CALLBACK_URL = config("PAYSTACK_CALLBACK_URL")
PAYSTACK_SECRET_KEY = config("PAYSTACK_SECRET_KEY")


def initialize_payment(email, amount):
    """
    Initialize a Paystack transaction.
    Amount must be in kobo.
    """

    url = "https://api.paystack.co/transaction/initialize"

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
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
    )

    return response.json()