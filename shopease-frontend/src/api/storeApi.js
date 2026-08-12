import {
  products as fallbackProducts,
  getProductById as getFallbackProductById,
} from "../data/products.js";
import { categories as fallbackCategories } from "../data/categories.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://e-commerce-6kpd.onrender.com/api/v1";

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

export async function apiUpdateCart(token, { product_id, quantity = 1 }) {
  return fetchJsonWithOptions(`${API_BASE_URL}/cart/update/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ product_id, quantity }),
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

export async function apiCheckout(token, payload) {
  return fetchJsonWithOptions(`${API_BASE_URL}/orders/checkout/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

// Reviews
export async function apiGetReviews() {
  try {
    return await fetchJson(`${API_BASE_URL}/reviews/`);
  } catch {
    return [];
  }
}

export async function apiPostReview(token, reviewPayload) {
  return fetchJsonWithOptions(`${API_BASE_URL}/reviews/`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(reviewPayload),
  });
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
  const primaryImage = apiProduct.images?.find(
    (image) => image.is_primary,
  )?.image;
  const fallbackImage =
    apiProduct.images?.[0]?.image ||
    apiProduct.image ||
    fallbackProducts[0]?.image;
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
    image: primaryImage || fallbackImage,
    gallery: (apiProduct.images || [])
      .map((image) => image.image)
      .filter(Boolean),
    highlights: [],
    isFeatured: Boolean(apiProduct.is_featured),
    isAvailable: Boolean(apiProduct.is_available),
  };
}

export async function getProducts() {
  try {
    const payload = await fetchJson(`${API_BASE_URL}/products/`);
    const results = Array.isArray(payload?.results) ? payload.results : [];

    if (results.length === 0) {
      return fallbackProducts;
    }

    return results.map(normalizeProduct);
  } catch {
    return fallbackProducts;
  }
}

export async function getProductById(id) {
  try {
    const product = await fetchJson(`${API_BASE_URL}/products/${id}/`);
    return normalizeProduct(product);
  } catch {
    return getFallbackProductById(id);
  }
}

export async function getCategories() {
  try {
    const payload = await fetchJson(`${API_BASE_URL}/categories/`);
    const results = Array.isArray(payload?.results) ? payload.results : [];

    if (results.length === 0) {
      return fallbackCategories;
    }

    return results.map((category) => ({
      id: category.slug || category.name?.toLowerCase(),
      name: category.name,
      icon:
        fallbackCategories.find(
          (item) => item.id === (category.slug || category.name?.toLowerCase()),
        )?.icon || "Tag",
    }));
  } catch {
    return fallbackCategories;
  }
}
