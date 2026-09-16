from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler.

    Keeps API error responses consistent.
    """

    response = exception_handler(exc, context)

    if response is None:
        return response

    if isinstance(response.data, dict):

        if "detail" in response.data:
            return response

        response.data = {
            "error": "Validation failed.",
            "details": response.data,
        }

    else:
        response.data = {
            "error": response.data,
        }

    return response