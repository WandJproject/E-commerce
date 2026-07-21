from rest_framework import serializers

from apps.products.models import (
    Brand,
    Category,
    Product,
    ProductImage,
)

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for product categories.
    """

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "slug",
        )

class BrandSerializer(serializers.ModelSerializer):
    """
    Serializer for product brands.
    """

    class Meta:
        model = Brand
        fields = (
            "id",
            "name",
            "slug",
        )

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = (
            "id",
            "image",
            "alt_text",
            "is_primary",
        )

class ProductSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)

    images = ProductImageSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Product

        fields = (
            "id",
            "name",
            "slug",
            "description",
            "price",
            "discount_price",
            "stock_quantity",
            "is_featured",
            "is_available",
            "category",
            "brand",
            "images",
        )  

                      