import React, { useEffect, useState } from "react";
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
import ProductCard from "../../components/common/ProductCard.jsx";
import {
  getPrimaryProductAlt,
  getPrimaryProductImage,
} from "../../api/storeApi.js";
import { useProductsQuery } from "../../api/queries.js";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroImageErrors, setHeroImageErrors] = useState(new Set());
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    error: productsQueryError,
    isSuccess: productsLoaded,
  } = useProductsQuery();
  const topSelling = products;
  const heroProducts = products.filter((product) => {
    const image = getPrimaryProductImage(product);
    return image && !heroImageErrors.has(image);
  });

  const heroSlides = heroProducts.slice(0, 3).map((product, index) => ({
    badge: ["Featured", "New Arrivals", "Top Deals"][index],
    title: product.name,
    description: product.description,
    image: getPrimaryProductImage(product),
    alt: getPrimaryProductAlt(product),
  }));

  useEffect(() => {
    if (heroSlides.length === 0) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((prev) => Math.min(prev, heroSlides.length - 1));
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div>
      {productsLoading ? (
        <section className="container-page py-16 text-center">
          <p className="text-lg font-medium text-neutral-600">
            Loading featured products...
          </p>
        </section>
      ) : productsError ? (
        <section className="container-page py-16">
          <div className="rounded-md bg-red-50 border border-red-100 p-4 text-red-700 text-sm">
            {productsQueryError?.message ||
              "Failed to load products. Please try again."}
          </div>
        </section>
      ) : heroSlides.length > 0 ? (
        <section className="hidden md:block container-page pt-4">
          <div className="grid lg:grid-cols-[1fr_260px] gap-4">
            <div className="relative bg-neutral-100 rounded-2xl overflow-hidden">
              <div className="relative min-h-[360px] md:min-h-[390px] overflow-hidden">
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 min-h-[360px] md:min-h-[390px] grid md:grid-cols-[1fr_420px] items-center transition-opacity duration-700 ease-in-out ${
                      index === activeIndex
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0"
                    }`}
                  >
                    <div className="p-6 md:p-10 z-10 flex flex-col justify-center h-full">
                      <span className="inline-block bg-accent-soft text-accent text-xs font-semibold px-3 py-1 rounded-full mb-4">
                        {slide.badge}
                      </span>
                      <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-3 max-w-lg">
                        {slide.title}
                      </h1>
                      <p className="text-neutral-600 mb-6 max-w-sm">
                        {slide.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Link to="/shop" className="btn-primary">
                          Shop Now
                        </Link>
                        <Link
                          to="/shop?filter=deals"
                          className="btn-outline bg-white"
                        >
                          Explore Deals
                        </Link>
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 block h-[55%] w-2/5 overflow-hidden rounded-r-2xl md:static md:h-full md:min-h-[390px] md:w-auto md:self-end">
                      <div className="absolute inset-0 bg-gradient-to-r from-neutral-100/25 via-transparent to-neutral-100/10" />
                      <img
                        src={slide.image}
                        alt={slide.alt || slide.title}
                        onError={() =>
                          setHeroImageErrors(
                            (prev) => new Set([...prev, slide.image]),
                          )
                        }
                        className="w-full h-full object-cover object-[center_35%]"
                      />
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm z-20">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => setActiveIndex(index)}
                      className={`rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? "w-8 h-2 bg-brand"
                          : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-col gap-4">
              <div className="card p-4 flex items-center gap-3">
                <span className="bg-accent-soft text-accent p-2 rounded-lg">
                  <Truck size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold">Free Shipping</p>
                  <p className="text-xs text-neutral-500">
                    On orders over $100
                  </p>
                </div>
              </div>
              <div className="card p-4 flex items-center gap-3">
                <span className="bg-green-50 text-green-600 p-2 rounded-lg">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold">Secure Payment</p>
                  <p className="text-xs text-neutral-500">
                    100% secure payment
                  </p>
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
      ) : null}

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
        {productsLoaded && topSelling.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">
              No products available at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {topSelling.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
