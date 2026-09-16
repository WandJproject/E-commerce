from rest_framework import serializers
from django.db.models import Avg
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
    average_rating = serializers.SerializerMethodField()

    review_count = serializers.SerializerMethodField()
    
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
            "average_rating",
            "review_count",
        ) 
  
    def get_average_rating(self, obj):

        value = obj.reviews.aggregate(
            Avg("rating")
        )["rating__avg"]

        return round(value, 2) if value else 0

    def get_review_count(self, obj):

        return obj.reviews.count()
                        