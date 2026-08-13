from rest_framework import serializers

from apps.payments.models import Payment
from apps.orders.models import Order


class InitializePaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()


class PaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = (
            "id",
            "reference",
            "amount",
            "currency",
            "gateway",
            "status",
            "paid_at",
            "created_at",
        )