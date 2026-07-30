import React from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  Headset,
  Laptop,
  Shirt,
  Footprints,
  Home as HomeIcon,
  Sparkles,
  Dumbbell,
  Watch,
  MoreHorizontal,
} from "lucide-react";
import { products } from "../../data/products.js";
import ProductCard from "../../components/common/ProductCard.jsx";

const categoryIcons = {
  electronics: Laptop,
  fashion: Shirt,
  shoes: Footprints,
  home: HomeIcon,
  beauty: Sparkles,
  sports: Dumbbell,
  accessories: Watch,
};

const categoryList = [
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "shoes", name: "Shoes" },
  { id: "home", name: "Home" },
  { id: "beauty", name: "Beauty" },
  { id: "sports", name: "Sports" },
  { id: "accessories", name: "Accessories" },
];

export default function Home() {
  const topSelling = products.slice(0, 8);

  return (
    <div>
      <section className="container-page pt-6">
        <div className="grid lg:grid-cols-[1fr_260px] gap-4">
          <div className="relative bg-neutral-100 rounded-2xl overflow-hidden grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12 z-10">
              <span className="inline-block bg-accent-soft text-accent text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Summer Sale
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                Discover The Best Products For You
              </h1>
              <p className="text-neutral-600 mb-6 max-w-sm">
                Shop the latest trends in fashion, electronics, home, and more.
              </p>
              <div className="flex gap-3">
                <Link to="/shop" className="btn-primary">
                  Shop Now
                </Link>
                <Link to="/shop?filter=deals" className="btn-outline bg-white">
                  Explore Deals
                </Link>
              </div>
            </div>
            <div className="hidden md:block h-full">
              <img
                src={
                  products[0]?.image ||
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80"
                }
                alt="Featured product"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4">
            <div className="card p-4 flex items-center gap-3">
              <span className="bg-accent-soft text-accent p-2 rounded-lg">
                <Truck size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="text-xs text-neutral-500">On orders over $100</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <span className="bg-green-50 text-green-600 p-2 rounded-lg">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold">Secure Payment</p>
                <p className="text-xs text-neutral-500">100% secure payment</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <span className="bg-purple-50 text-purple-600 p-2 rounded-lg">
                <Headset size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold">24/7 Support</p>
                <p className="text-xs text-neutral-500">
                  We support online 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex flex-wrap justify-between gap-6">
          {categoryList.map((cat) => {
            const Icon = categoryIcons[cat.id];
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="flex flex-col items-center gap-2 w-20 text-center group"
              >
                <span className="w-14 h-14 rounded-full bg-neutral-100 grid place-items-center group-hover:bg-accent-soft group-hover:text-accent transition-colors">
                  <Icon size={22} />
                </span>
                <span className="text-xs font-medium text-neutral-700">
                  {cat.name}
                </span>
              </Link>
            );
          })}
          <Link
            to="/shop"
            className="flex flex-col items-center gap-2 w-20 text-center group"
          >
            <span className="w-14 h-14 rounded-full bg-neutral-100 grid place-items-center group-hover:bg-accent-soft group-hover:text-accent transition-colors">
              <MoreHorizontal size={22} />
            </span>
            <span className="text-xs font-medium text-neutral-700">More</span>
          </Link>
        </div>
      </section>

      <section className="container-page pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Top Selling Products</h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-accent hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {topSelling.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="container-page py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-semibold text-sm">100% Original</p>
            <p className="text-xs text-neutral-400">
              We sell original products
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm">14-Day Return</p>
            <p className="text-xs text-neutral-400">
              14 day money back guarantee
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm">Pay On Delivery</p>
            <p className="text-xs text-neutral-400">
              Cash on delivery available
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm">Best Prices</p>
            <p className="text-xs text-neutral-400">We offer best prices</p>
          </div>
        </div>
      </section>
    </div>
  );
}
