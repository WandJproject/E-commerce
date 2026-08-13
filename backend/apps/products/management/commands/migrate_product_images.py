from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand

from apps.products.models import ProductImage


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
    help = "Migrate existing product images to Cloudinary."

    def handle(self, *args, **kwargs):

        base_dir = Path(__file__).resolve().parents[4]
        sample_images_dir = base_dir / "sample_images"

        migrated = 0
        skipped = 0
        missing = 0

        product_images = (
            ProductImage.objects
            .select_related("product")
            .order_by("id")
        )

        for product_image in product_images:

            product_name = product_image.product.name

            relative_path = IMAGE_MAP.get(product_name)

            if not relative_path:
                self.stdout.write(
                    self.style.WARNING(
                        f"No image mapping found for: {product_name}"
                    )
                )
                skipped += 1
                continue

            image_path = sample_images_dir / relative_path

            if not image_path.exists():
                self.stdout.write(
                    self.style.WARNING(
                        f"Image file not found for "
                        f"{product_name}: {image_path}"
                    )
                )
                missing += 1
                continue

            with open(image_path, "rb") as image_file:

                product_image.image.save(
                    image_path.name,
                    File(image_file),
                    save=True,
                )

            migrated += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"Uploaded: {product_name}"
                )
            )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"Migration complete. "
                f"Migrated: {migrated}, "
                f"Skipped: {skipped}, "
                f"Missing: {missing}"
            )
        )