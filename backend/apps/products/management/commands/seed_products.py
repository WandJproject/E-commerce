from decimal import Decimal
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.products.models import (
    Category,
    Brand,
    Product,
    ProductImage,
)

IMAGE_MAP = {
    # Electronics
    "iPhone 15 Pro": "electronics/iphone15pro.jpg",
    "MacBook Air M3": "electronics/macbookairm3.jpg",
    "AirPods Pro": "electronics/airpodspro.jpg",
    "Apple Watch Series 10": "electronics/applewatchseries10.jpg",
    "Galaxy S25": "electronics/galaxys25.jpg",
    "Galaxy Buds 3": "electronics/galaxybuds3.jpg",
    "WH-1000XM5 Headphones": "electronics/sonywh1000xm5.jpg",
    "Flip 6 Bluetooth Speaker": "electronics/jblflip6.jpg",

    # Fashion
    "Denim Jacket": "fashion/denimjacket.jpg",
    "Summer Dress": "fashion/summerdress.jpg",
    "Cotton Hoodie": "fashion/cottonhoodie.jpg",
    "Graphic T-Shirt": "fashion/graphictee.jpg",
    "501 Original Jeans": "fashion/cargojeans.jpg",

    # Shoes
    "Air Force 1": "shoes/airforce1.jpg",
    "Air Max 270": "shoes/airmax270.jpg",
    "Ultraboost": "shoes/ultraboost.jpg",
    "Superstar": "shoes/superstar.jpg",
    "RS-X Sneakers": "shoes/rsx.jpg",
    "Chuck Taylor All Star": "shoes/chucktaylor.jpg",

    # Home
    "Air Fryer XL": "home/airfryer.jpg",
    "Coffee Maker": "home/coffeemaker.jpg",
    "Microwave Oven": "home/microwave.jpg",
    "Table Lamp": "home/tablelamp.jpg",
    "Office Chair": "home/officechair.jpg",

    # Beauty
    "Foaming Facial Cleanser": "beauty/ceravecleanser.jpg",
    "Moisturizing Cream": "beauty/moisturizingcream.jpg",
    "Niacinamide 10% + Zinc 1%": "beauty/niacinamideserum.jpg",
    "Vitamin C Suspension": "beauty/vitamincserum.jpg",
    "Fit Me Foundation": "beauty/fitmefoundation.jpg",

    # Sports
    "Basketball": "sports/basketball.jpg",
    "Yoga Mat": "sports/yogamat.jpg",
    "Gym Bag": "sports/gymbag.jpg",
    "Training Gloves": "sports/traininggloves.jpg",

    # Accessories
    "Leather Wallet": "accessories/leatherwallet.jpg",
    "Classic Wrist Watch": "accessories/wristwatch.jpg",
    "Aviator Sunglasses": "accessories/aviatorsunglasses.jpg",
    "Power Bank 20000mAh": "accessories/powerbank.jpg",
}

class Command(BaseCommand):
    help = "Seed the database with sample products."

    def handle(self, *args, **kwargs):

        base_dir = Path(__file__).resolve().parents[4]
        
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

                    product, was_created = Product.objects.get_or_create(
                        slug=slug,
                        defaults={
                            "category": category,
                            "brand": brand,
                            "name": name,
                            "description": (
                                f"{name} is a high-quality product from {brand_name}. "
                                "Built with premium materials, excellent durability, "
                                "and designed to deliver outstanding performance and value."
                            ),
                            "price": Decimal(str(price)),
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

                    image_relative_path = IMAGE_MAP.get(name)

                    if image_relative_path:
                        image_path = (
                            base_dir / "sample_images" / image_relative_path
                        )

                        if image_path.exists():
                            if not ProductImage.objects.filter(
                                product=product
                            ).exists():

                                with open(image_path, "rb") as image_file:
                                    ProductImage.objects.create(
                                        product=product,
                                        image=File(
                                            image_file,
                                            name=image_path.name,
                                        ),
                                    )

                                self.stdout.write(
                                    self.style.SUCCESS(
                                        f"Image attached: {name}"
                                    )
                                )

                        else:
                            self.stdout.write(
                                self.style.WARNING(
                                    f"Image not found for {name}: {image_path}"
                                )
                            )