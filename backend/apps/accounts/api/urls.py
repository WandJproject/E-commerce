from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    ProfileAPIView,
    RegisterAPIView,
    UsersListAPIView,
    WelcomeAPIView,
)

urlpatterns = [
    path("", WelcomeAPIView.as_view(), name="api-home"),

    path(
        "users/",
        UsersListAPIView.as_view(),
        name="users-list",
    ),

    path(
        "auth/register/",
        RegisterAPIView.as_view(),
        name="register",
    ),

    path(
        "auth/login/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),

    path(
        "auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "auth/profile/",
        ProfileAPIView.as_view(),
        name="profile",
    ),
]
