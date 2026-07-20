from rest_framework.response import Response
from rest_framework.views import APIView


class WelcomeAPIView(APIView):
    def get(self, request):
        return Response(
            {
                "message": "Welcome to the E-Commerce API!",
                "version": "v1",
                "status": "success",
            }
        )