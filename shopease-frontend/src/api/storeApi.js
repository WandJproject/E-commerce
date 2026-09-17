const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://e-commerce-6kpd.onrender.com/api/v1";

const API_ORIGIN = new URL(API_BASE_URL).origin;
export const PRODUCT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function fetchJsonWithOptions(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text().catch(() => null);
    const message = text || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json().catch(() => null);
}

function authHeaders(token) {
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

// Authentication
export async function apiRegister({
  username,
  email,
  password,
  confirm_password,
}) {
  return fetchJsonWithOptions(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ username, email, password, confirm_password }),
  });
}

export async function apiLogin({ emailOrUsername, password }) {
  return fetchJsonWithOptions(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ username: emailOrUsername, password }),
  });
}

export async function apiRefreshToken({ refresh }) {
  return fetchJsonWithOptions(`${API_BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ refresh }),
  });
}

// Cart
export async function apiGetCart(token) {
  return fetchJsonWithOptions(`${API_BASE_URL}/cart/`, {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function apiAddToCart(token, { product_id, quantity = 1 }) {
  return fetchJsonWithOptions(`${API_BASE_URL}/cart/add/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ product_id, quantity }),
  });
}

export async function apiRemoveFromCart(token, { product_id }) {
  return fetchJsonWithOptions(`${API_BASE_URL}/cart/remove/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ product_id }),
  });
}

// Wishlist
export async function apiGetWishlist(token) {
  return fetchJsonWithOptions(`${API_BASE_URL}/wishlist/`, {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function apiAddToWishlist(token, { product_id }) {
  return fetchJsonWithOptions(`${API_BASE_URL}/wishlist/add/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ product_id }),
  });
}

export async function apiRemoveFromWishlist(token, { product_id }) {
  return fetchJsonWithOptions(`${API_BASE_URL}/wishlist/remove/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ product_id }),
  });
}

// Orders
export async function apiGetOrders(token) {
  return fetchJsonWithOptions(`${API_BASE_URL}/orders/`, {
    method: "GET",
    headers: authHeaders(token),
  });
}

export async function apiCheckout(token, payload = {}) {
  const hasBody =
    payload !== undefined &&
    payload !== null &&
    Object.keys(payload).length > 0;
  return fetchJsonWithOptions(`${API_BASE_URL}/orders/checkout/`, {
    method: "POST",
    headers: authHeaders(token),
    ...(hasBody ? { body: JSON.stringify(payload) } : {}),
  });
}

// Reviews
export async function apiGetProductReviews(productId) {
  const url = `${API_BASE_URL}/reviews/product/${productId}/`;
  const payload = await fetchJson(url);
  return Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : [];
}

export async function apiPostReview(token, reviewPayload) {
  return fetchJsonWithOptions(`${API_BASE_URL}/reviews/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(reviewPayload),
  });
}

// Legacy function for backward compatibility (deprecated)
export async function apiGetReviews() {
  try {
    return await fetchJson(`${API_BASE_URL}/reviews/`);
  } catch {
    return [];
  }
}

export function getPrimaryProductImage(product) {
  const images = normalizeProductImages(product?.images);
  return toAbsoluteImageUrl(
    images.find((image) => image.is_primary)?.url || images[0]?.url || "",
  );
}

export function getPrimaryProductAlt(product) {
  const images = normalizeProductImages(product?.images);
  return (
    images.find((image) => image.is_primary)?.alt || product?.name || "Product"
  );
}

function toAbsoluteImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("/")) return `${API_ORIGIN}${url}`;
  return url;
}

export function normalizeProductImages(images) {
  if (typeof images === "string") {
    return [
      { url: toAbsoluteImageUrl(images), alt: "Product", is_primary: true },
    ];
  }
  if (!Array.isArray(images)) return [];
  return images
    .map((image) => {
      if (typeof image === "string") {
        return {
          url: toAbsoluteImageUrl(image),
          alt: "Product",
          is_primary: false,
        };
      }
      return {
        url: toAbsoluteImageUrl(image?.image || image?.url),
        alt: image?.alt_text || image?.alt || "Product",
        is_primary: Boolean(image?.is_primary),
      };
    })
    .filter((image) => image.url);
}
function normalizeProduct(apiProduct) {
  const price = Number(apiProduct.price ?? 0);
  const discountPrice = Number(
    apiProduct.discount_price ?? apiProduct.price ?? price,
  );
  const discount =
    discountPrice < price
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;
  const images = normalizeProductImages(apiProduct.images);
  const categoryId =
    apiProduct.category?.slug ||
    apiProduct.category?.name?.toLowerCase() ||
    "general";
  const brandName = apiProduct.brand?.name || "ShopEase";
  const productName = apiProduct.name || "Unnamed Product";

  return {
    id: apiProduct.id,
    name: productName,
    slug: apiProduct.slug,
    description: apiProduct.description || "",
    price,
    oldPrice: Math.max(price, discountPrice),
    discount,
    rating: 4.5,
    reviewsCount: 0,
    stock: Number(apiProduct.stock_quantity ?? 0),
    category: categoryId,
    brand: brandName,
    images,
    highlights: [],
    isFeatured: Boolean(apiProduct.is_featured),
    isAvailable: Boolean(apiProduct.is_available),
  };
}

export async function getProducts() {
  const products = [];
  let nextUrl = `${API_BASE_URL}/products/`;

  while (nextUrl) {
    const payload = await fetchJson(nextUrl);
    const results = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.results)
        ? payload.results
        : [];
    products.push(...results.map(normalizeProduct));
    nextUrl = Array.isArray(payload) ? null : payload?.next || null;
  }

  return products;
}

export async function getProductById(id) {
  const product = await fetchJson(`${API_BASE_URL}/products/${id}/`);
  return normalizeProduct(product);
}

export async function getProductBySlug(slug) {
  try {
    const products = await getProducts();

    return (
      products.find(
        (product) =>
          product.slug === slug || String(product.id) === String(slug),
      ) || null
    );
  } catch {
    return null;
  }
}

export async function getCategories() {
  const payload = await fetchJson(`${API_BASE_URL}/categories/`);
  const results = Array.isArray(payload?.results) ? payload.results : [];
  return results.map((category) => ({
    id: category.slug || category.name?.toLowerCase(),
    name: category.name,
    icon: "Tag",
  }));
}
