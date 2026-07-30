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


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Order
        fields = (
            "id",
            "status",
            "total_amount",
            "items",
            "created_at",
        )


class UpdateOrderStatusSerializer(serializers.Serializer):

    status = serializers.ChoiceField(
        choices=Order.Status.choices
    )