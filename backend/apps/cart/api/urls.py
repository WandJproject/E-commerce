from django.urls import path

from .views import (
    AddToCartAPIView,
    CartAPIView,
    ClearCartAPIView,
    RemoveFromCartAPIView,
)

urlpatterns = [

    path(
        "",
        CartAPIView.as_view(),
        name="cart",
    ),

    path(
        "add/",
        AddToCartAPIView.as_view(),
        name="add-to-cart",
    ),

    path(
        "remove/",
        RemoveFromCartAPIView.as_view(),
        name="remove-from-cart",
    ),

    path(
<<<<<<< HEAD
        "update/",
        UpdateCartAPIView.as_view(),
        name="update-cart",
    ),

    path(
=======
>>>>>>> origin/main
        "clear/",
        ClearCartAPIView.as_view(),
        name="clear-cart",
    ),
]
