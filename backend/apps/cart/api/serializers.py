from rest_framework import serializers

from apps.cart.models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    product_price = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            "id",
            "product",
            "product_name",
            "product_price",
            "quantity",
            "subtotal",
        )

    def get_product_price(self, obj):
        return (
            obj.product.discount_price
            if obj.product.discount_price
            else obj.product.price
        )

    def get_subtotal(self, obj):
        return obj.subtotal


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(
        many=True,
        read_only=True,
    )

    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = (
            "id",
            "items",
            "total_items",
            "total_price",
            "created_at",
            "updated_at",
        )


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()

    quantity = serializers.IntegerField(
        min_value=1,
    )


class RemoveFromCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()