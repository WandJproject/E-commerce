from django.urls import path

from .views import WelcomeAPIView

urlpatterns = [
    path("", WelcomeAPIView.as_view(), name="api-home"),
]