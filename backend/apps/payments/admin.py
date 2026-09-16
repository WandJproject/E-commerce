from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        "reference",
        "user",
        "order",
        "amount",
        "status",
        "gateway",
        "created_at",
    )

    list_filter = (
        "status",
        "gateway",
    )

    search_fields = (
        "reference",
        "user__email",
    )