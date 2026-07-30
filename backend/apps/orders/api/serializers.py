from rest_framework import serializers

from apps.orders.models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    class Meta:

        model = OrderItem

        fields = (
            "id",
            "product",
            "product_name",
            "price",
            "quantity",
            "subtotal",
        )

class OrderItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    class Meta:

        model = OrderItem

        fields = (
            "id",
            "product",
            "product_name",
            "price",
            "quantity",
            "subtotal",
        )