import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  Truck,
  PackageCheck,
  ChevronRight,
} from "lucide-react";
import {
  products as fallbackProducts,
  getProductById as getFallbackProductById,
} from "../../data/products.js";
import { categories as fallbackCategories } from "../../data/categories.js";
import StarRating from "../../components/common/StarRating.jsx";
import ProductCard from "../../components/common/ProductCard.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import {
  getProductById,
  getProducts,
  apiGetReviews,
} from "../../api/storeApi.js";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(() => getFallbackProductById(id));
  const [related, setRelated] = useState(
    fallbackProducts
      .filter(
        (p) =>
          p.category === getFallbackProductById(id)?.category &&
          p.id !== Number(id),
      )
      .slice(0, 4),
  );
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getProductById(id).then((nextProduct) => {
      if (isMounted) {
        setProduct(nextProduct);
      }
    });

    getProducts().then((nextProducts) => {
      if (isMounted) {
        const nextRelated = nextProducts
          .filter(
            (p) =>
              p.category ===
                (product?.category || getFallbackProductById(id)?.category) &&
              p.id !== Number(id),
          )
          .slice(0, 4);
        setRelated(nextRelated);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    setReviewsLoading(true);
    setReviewsError(null);
    apiGetReviews()
      .then((res) => {
        const list = Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res)
            ? res
            : [];
        if (!mounted) return;
        const filtered = list.filter(
          (r) =>
            r.product === product?.id ||
            r.product === product?.slug ||
            r.product_slug === product?.slug,
        );
        setReviews(filtered);
      })
      .catch(() => {
        if (!mounted) return;
        setReviewsError("Unable to load reviews.");
      })
      .finally(() => {
        if (mounted) setReviewsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [product]);

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-lg font-medium mb-4">Product not found.</p>
        <Link to="/shop" className="text-accent font-medium hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const categoryName = fallbackCategories.find(
    (c) => c.id === product?.category,
  )?.name;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <div className="container-page py-8">
      <div className="flex items-center gap-1 text-xs text-neutral-500 mb-6">
        <Link to="/" className="hover:text-brand">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link
          to={`/shop?category=${product.category}`}
          className="hover:text-brand"
        >
          {categoryName}
        </Link>
        <ChevronRight size={14} />
        <span className="text-neutral-700">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="grid grid-cols-[80px_1fr] gap-4">
          <div className="flex lg:flex-col gap-3 order-2 lg:order-1">
            {product.gallery.map((img, idx) => (
              <button
                key={img}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  activeImage === idx ? "border-accent" : "border-neutral-200"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 lg:order-2 bg-neutral-50 rounded-2xl overflow-hidden aspect-square">
            <img
              src={product.gallery[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={product.rating} />
            <span className="text-sm text-neutral-500">
              ({product.reviewsCount} Reviews)
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-extrabold">
              ${product.price.toFixed(2)}
            </span>
            {product.oldPrice > product.price && (
              <>
                <span className="text-neutral-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
                <span className="bg-red-50 text-red-500 text-xs font-semibold px-2 py-0.5 rounded">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-neutral-600 mb-5 leading-relaxed">
            {product.description}
          </p>

          {product.highlights?.length > 0 && (
            <ul className="text-sm text-neutral-700 space-y-1.5 mb-6">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <p
            className={`text-sm mb-5 font-medium ${product.stock > 10 ? "text-green-600" : "text-amber-600"}`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border border-neutral-300 rounded-md">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-neutral-100"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="p-2.5 hover:bg-neutral-100"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={handleAddToCart}
              className="btn-outline flex-1"
              disabled={product.stock === 0}
            >
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              className="btn-primary flex-1"
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>

          <button
            onClick={() => toggleWishlist(product)}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-red-500 mb-6"
          >
            <Heart
              size={18}
              className={
                isWishlisted(product.id) ? "fill-red-500 text-red-500" : ""
              }
            />
            {isWishlisted(product.id) ? "Added to Wishlist" : "Add to Wishlist"}
          </button>

          {reviewsLoading ? (
            <div className="mt-6 rounded-md bg-neutral-50 p-4 text-neutral-600">
              Loading reviews...
            </div>
          ) : reviewsError ? (
            <div className="mt-6 rounded-md bg-red-50 border border-red-100 p-4 text-red-700">
              {reviewsError}
            </div>
          ) : reviews.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-3">Customer Reviews</h2>
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id || r._id} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {r.user || r.author || r.name || "Anonymous"}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {new Date(
                          r.created_at || r.created || Date.now(),
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-neutral-700">
                      {r.comment || r.body || r.message || r.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm text-neutral-500">
            <p className="flex items-center gap-2">
              <Truck size={16} /> Free Shipping on orders over $100
            </p>
            <p className="flex items-center gap-2">
              <PackageCheck size={16} /> Estimated delivery: 3-5 business days
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-5">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
