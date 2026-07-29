from django.urls import path

from .views import (
    AddToWishlistAPIView,
    RemoveFromWishlistAPIView,
    WishlistAPIView,
)

urlpatterns = [

    path(
        "",
        WishlistAPIView.as_view(),
        name="wishlist",
    ),

    path(
        "add/",
        AddToWishlistAPIView.as_view(),
        name="wishlist-add",
    ),

    path(
        "remove/",
        RemoveFromWishlistAPIView.as_view(),
        name="wishlist-remove",
    ),
]