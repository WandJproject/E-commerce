from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.products.models import Category, Brand, Product


class Command(BaseCommand):
    help = "Seed the database with sample products."

    def handle(self, *args, **kwargs):

        data = {
            "Electronics": {
                "Apple": [
                    ("iPhone 15 Pro", 1299.99, 30),
                    ("MacBook Air M3", 1499.99, 15),
                    ("AirPods Pro", 249.99, 40),
                    ("Apple Watch Series 10", 499.99, 25),
                ],
                "Samsung": [
                    ("Galaxy S25", 1199.99, 25),
                    ("Galaxy Buds 3", 199.99, 50),
                ],
                "Sony": [
                    ("WH-1000XM5 Headphones", 399.99, 20),
                ],
                "JBL": [
                    ("Flip 6 Bluetooth Speaker", 149.99, 30),
                ],
            },

            "Fashion": {
                "Zara": [
                    ("Denim Jacket", 79.99, 35),
                    ("Summer Dress", 59.99, 25),
                ],
                "H&M": [
                    ("Cotton Hoodie", 39.99, 40),
                    ("Graphic T-Shirt", 24.99, 50),
                ],
                "Levi's": [
                    ("501 Original Jeans", 69.99, 30),
                ],
            },

            "Shoes": {
                "Nike": [
                    ("Air Force 1", 150.00, 40),
                    ("Air Max 270", 180.00, 30),
                ],
                "Adidas": [
                    ("Ultraboost", 190.00, 25),
                    ("Superstar", 120.00, 35),
                ],
                "Puma": [
                    ("RS-X Sneakers", 135.00, 20),
                ],
                "Converse": [
                    ("Chuck Taylor All Star", 85.00, 30),
                ],
            },

            "Home": {
                "Philips": [
                    ("Air Fryer XL", 220.00, 15),
                    ("Coffee Maker", 95.00, 20),
                ],
                "LG": [
                    ("Microwave Oven", 175.00, 12),
                ],
                "IKEA": [
                    ("Table Lamp", 45.00, 35),
                    ("Office Chair", 199.99, 10),
                ],
            },

            "Beauty": {
                "CeraVe": [
                    ("Foaming Facial Cleanser", 18.99, 60),
                    ("Moisturizing Cream", 21.99, 40),
                ],
                "The Ordinary": [
                    ("Niacinamide 10% + Zinc 1%", 14.99, 55),
                    ("Vitamin C Suspension", 16.99, 40),
                ],
                "Maybelline": [
                    ("Fit Me Foundation", 12.99, 50),
                ],
            },

            "Sports": {
                "Wilson": [
                    ("Basketball", 39.99, 30),
                ],
                "Adidas": [
                    ("Yoga Mat", 29.99, 35),
                    ("Gym Bag", 49.99, 25),
                ],
                "Under Armour": [
                    ("Training Gloves", 24.99, 40),
                ],
            },

            "Accessories": {
                "Fossil": [
                    ("Leather Wallet", 59.99, 25),
                    ("Classic Wrist Watch", 149.99, 15),
                ],
                "Ray-Ban": [
                    ("Aviator Sunglasses", 179.99, 20),
                ],
                "Anker": [
                    ("Power Bank 20000mAh", 49.99, 35),
                ],
            },
        }

        created = 0

        for category_name, brands in data.items():

            category, _ = Category.objects.get_or_create(
                name=category_name,
                defaults={
                    "slug": slugify(category_name)
                }
            )

            for brand_name, products in brands.items():

                brand, _ = Brand.objects.get_or_create(
                    name=brand_name,
                    defaults={
                        "slug": slugify(brand_name)
                    }
                )

                for name, price, stock in products:

                    slug = slugify(name)

                    _, was_created = Product.objects.get_or_create(
                        slug=slug,
                        defaults={
                            "category": category,
                            "brand": brand,
                            "name": name,
                            "description": (
                                f"{name} is a high-quality product from {brand_name}. "
                                "Built with premium materials, excellent durability, "
                                "and designed to deliver outstanding performance and value."
                            ),                            "price": Decimal(str(price)),
                            "discount_price": (
                                Decimal(str(round(price * 0.9, 2)))
                                if price > 100
                                else None
                            ),
                            "stock_quantity": stock,
                            "is_featured": stock >= 30,
                            "is_available": True,
                        }
                    )

                    if was_created:
                        created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {created} sample products."
            )
        )