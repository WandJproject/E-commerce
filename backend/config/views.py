from django.http import JsonResponse


def home(request):
    return JsonResponse(
        {
            "name": "E-commerce API",
            "version": "1.0",
            "status": "running",
        }
    )