from rest_framework import serializers
from apps.wishlist.models import WishlistItem


class WishlistItemSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    product_price = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = WishlistItem
        fields = (
            "id",
            "product",
            "product_name",
            "product_price",
            "product_image",
            "created_at",
        )

    def get_product_price(self, obj):
        return (
            obj.product.discount_price
            if obj.product.discount_price
            else obj.product.price
        )

    def get_product_image(self, obj):
        image = obj.product.images.first()

        if image:
            return image.image.url

        return None


class AddToWishlistSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()


class RemoveFromWishlistSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()