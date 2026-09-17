import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  PackageCheck,
  ChevronRight,
} from "lucide-react";
import StarRating from "../../components/common/StarRating.jsx";
import ProductCard from "../../components/common/ProductCard.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useReviewMutation } from "../../api/queries.js";
import {
  getProductBySlug,
  getProducts,
  apiGetProductReviews,
  getPrimaryProductImage,
  normalizeProductImages,
} from "../../api/storeApi.js";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { accessToken, isAuthenticated } = useAuth();
  const reviewMutation = useReviewMutation(accessToken);

  const [product, setProduct] = useState(null);
  const [productError, setProductError] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(null);
  const [reviewSubmitError, setReviewSubmitError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        const nextProduct = await getProductBySlug(slug);
        if (!isMounted) return;
        if (!nextProduct) {
          setProduct(null);
          setProductError("Product not found.");
          return;
        }
        setProduct(nextProduct);
        setProductError(null);
      } catch (err) {
        if (isMounted) {
          setProduct(null);
          setProductError("Failed to load product. Please try again.");
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    let isMounted = true;

    if (!product) return;

    getProducts()
      .then((nextProducts) => {
        if (!isMounted) return;
        const nextRelated = nextProducts
          .filter(
            (p) => p.slug !== slug && p.category === (product?.category || ""),
          )
          .slice(0, 4);
        setRelated(nextRelated);
      })
      .catch(() => {
        if (isMounted) setRelated([]);
      });

    return () => {
      isMounted = false;
    };
  }, [product, slug]);

  useEffect(() => {
    let mounted = true;
    setReviewsLoading(true);
    setReviewsError(null);

    if (!product?.id) {
      setReviewsLoading(false);
      setReviews([]);
      return () => {
        mounted = false;
      };
    }

    apiGetProductReviews(product.id)
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.results)
            ? res.results
            : [];
        if (!mounted) return;
        setReviews(list);
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
  }, [product?.id]);

  if (productError) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-lg font-medium mb-4 text-red-600">{productError}</p>
        <Link to="/shop" className="text-accent font-medium hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-lg font-medium mb-4">Loading product...</p>
      </div>
    );
  }

  const categoryName = product?.category || "Product";

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewSuccess(null);
    setReviewSubmitError(null);

    if (!isAuthenticated || !accessToken) {
      setReviewSubmitError("Please log in to submit a review.");
      return;
    }
    if (!selectedRating) {
      setReviewSubmitError("Please select a rating.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewSubmitError("Please enter a comment.");
      return;
    }

    try {
      await reviewMutation.mutateAsync({
        product: product.id,
        rating: selectedRating,
        comment: reviewComment.trim(),
      });
      const refreshedReviews = await apiGetProductReviews(product.id);
      setReviews(refreshedReviews);
      setSelectedRating(0);
      setReviewComment("");
      setReviewSuccess("Your review was submitted successfully.");
    } catch (error) {
      setReviewSubmitError(
        error?.message || "Unable to submit your review. Please try again.",
      );
    }
  };

  const handleImageError = (imageUrl) => {
    setImageErrors((prev) => new Set([...prev, imageUrl]));
  };

  const hasValidImage = (imageUrl) => {
    return imageUrl && !imageErrors.has(imageUrl);
  };

  const normalizedImages = normalizeProductImages(product.images);
  const primaryImage = getPrimaryProductImage(product);
  const displayGallery = primaryImage
    ? [
        primaryImage,
        ...normalizedImages
          .map((image) => image.url)
          .filter((imageUrl) => imageUrl !== primaryImage),
      ]
    : normalizedImages.map((image) => image.url);
  const mainImageUrl = displayGallery[activeImage];
  const mainImageValid = hasValidImage(mainImageUrl);

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
            {displayGallery.length > 0 ? (
              displayGallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                    activeImage === idx ? "border-accent" : "border-neutral-200"
                  }`}
                >
                  {hasValidImage(img) ? (
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      onError={() => handleImageError(img)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200" />
                  )}
                </button>
              ))
            ) : (
              <div className="text-xs text-neutral-500 text-center col-span-2">
                No images
              </div>
            )}
          </div>
          <div className="order-1 lg:order-2 bg-neutral-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            {mainImageValid ? (
              <img
                src={mainImageUrl}
                alt={product.name}
                onError={() => handleImageError(mainImageUrl)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-neutral-400 text-center px-4">
                <p className="text-sm">Product image unavailable</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={product.rating} />
            <span className="text-sm text-neutral-500">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
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

          <form
            onSubmit={handleReviewSubmit}
            className="mt-6 border-t border-neutral-200 pt-6"
          >
            <h2 className="text-lg font-bold mb-3">Write a Review</h2>
            {!isAuthenticated && (
              <p className="text-sm text-neutral-600 mb-4">
                Please log in to submit a review.
              </p>
            )}
            <div className="mb-4">
              <span className="block text-sm font-medium mb-2">Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSelectedRating(rating)}
                    className="p-1"
                    aria-label={`Rate ${rating} out of 5`}
                    aria-pressed={selectedRating === rating}
                  >
                    <Star
                      size={20}
                      className={
                        rating <= selectedRating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-neutral-200 text-neutral-200"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <label
              htmlFor="review-comment"
              className="block text-sm font-medium mb-2"
            >
              Comment
            </label>
            <textarea
              id="review-comment"
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              className="w-full min-h-24 rounded-md border border-neutral-300 p-3 text-sm resize-y"
              placeholder="Share your experience with this product"
              disabled={reviewMutation.isPending}
            />
            {reviewSubmitError && (
              <p className="mt-2 text-sm text-red-600">{reviewSubmitError}</p>
            )}
            {reviewSuccess && (
              <p className="mt-2 text-sm text-green-600">{reviewSuccess}</p>
            )}
            <button
              type="submit"
              className="btn-primary mt-4"
              disabled={reviewMutation.isPending}
            >
              {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </form>

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
                        {r.user_email || r.author || r.name || "Anonymous"}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <StarRating rating={r.rating} />
                    <div className="text-sm text-neutral-700">{r.comment}</div>
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
