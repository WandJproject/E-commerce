from rest_framework import permissions, viewsets
from apps.products.permissions import IsAdminOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from apps.products.models import (
    Brand,
    Category,
    Product,
)

from .serializers import (
    BrandSerializer,
    CategorySerializer,
    ProductSerializer,
)

class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing categories.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    
class BrandViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing brands.
    """

    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAdminOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):

    serializer_class = ProductSerializer

    permission_classes = [IsAdminOrReadOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = [
        "category",
        "brand",
        "is_available",
        "is_featured",
    ]

    search_fields = [
        "name",
        "description",
    ]

    ordering_fields = [
        "price",
        "created_at",
        "stock_quantity",
    ]

    ordering = [
        "-created_at",
    ]

    def get_queryset(self):
        return (
            Product.objects
            .select_related(
                "category",
                "brand",
            )
            .prefetch_related(
                "images",
            )
        )

    

    
            
