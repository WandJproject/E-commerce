from rest_framework import serializers

from apps.reviews.models import Review


class ReviewSerializer(serializers.ModelSerializer):

    user_email = serializers.CharField(
        source="user.email",
        read_only=True,
    )

    class Meta:

        model = Review

        fields = (
            "id",
            "user",
            "user_email",
            "product",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "user",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):

        validated_data["user"] = self.context["request"].user

        return super().create(validated_data)

    def validate(self, attrs):

        user = self.context["request"].user

        product = attrs["product"]

        if Review.objects.filter(
            user=user,
            product=product,
        ).exists():

            raise serializers.ValidationError(
                "You have already reviewed this product."
            )

        return attrs
    