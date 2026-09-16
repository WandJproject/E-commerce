import React, { createContext, useContext, useEffect, useState } from "react";
import {
  apiGetCart,
  apiAddToCart,
  apiRemoveFromCart,
  getProducts,
} from "../api/storeApi.js";

const CartContext = createContext(null);
const STORAGE_KEY = "shopease_cart";
const TOKENS_KEY = "shopease_auth_tokens";
let productCatalogCache = null;

async function getProductCatalogMap() {
  if (productCatalogCache) return productCatalogCache;

  const products = await getProducts();
  productCatalogCache = new Map(
    products.map((product) => [Number(product.id), product]),
  );
  return productCatalogCache;
}

function normalizeCartItem(item, productMap) {
  const productId = Number(item.product ?? item.product_id ?? item.id ?? 0);
  const matchedProduct =
    productMap.get(productId) ||
    (item.id != null ? productMap.get(Number(item.id)) : undefined);

  const resolvedName =
    item.product_name || item.name || matchedProduct?.name || "Product";
  const resolvedPrice = Number(
    item.product_price ?? item.price ?? matchedProduct?.price ?? 0,
  );
  const resolvedImage =
    (matchedProduct?.image && String(matchedProduct.image).trim()) ||
    (typeof item.image === "string" && item.image.trim()) ||
    "";

  return {
    id: productId || item.id,
    slug: item.product_slug || item.slug || matchedProduct?.slug || productId,
    name: resolvedName,
    price: resolvedPrice,
    image: resolvedImage,
    quantity: Number(item.quantity ?? item.qty ?? 1),
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenRaw = localStorage.getItem(TOKENS_KEY);
      const tokens = tokenRaw ? JSON.parse(tokenRaw) : null;
      const productMap = await getProductCatalogMap();

      if (tokens?.access) {
        const res = await apiGetCart(tokens.access);
        const payload = Array.isArray(res?.items)
          ? res.items
          : res?.results || [];
        setItems(payload.map((item) => normalizeCartItem(item, productMap)));
      } else {
        const raw = localStorage.getItem(STORAGE_KEY);
        const fallback = raw ? JSON.parse(raw) : [];
        setItems(fallback.map((item) => normalizeCartItem(item, productMap)));
      }
    } catch (err) {
      setError(err.message || "Failed to load cart.");
      const raw = localStorage.getItem(STORAGE_KEY);
      const fallback = raw ? JSON.parse(raw) : [];
      setItems(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = async (product, quantity = 1) => {
    setError(null);
    const tokenRaw = localStorage.getItem(TOKENS_KEY);
    const tokens = tokenRaw ? JSON.parse(tokenRaw) : null;
    if (tokens?.access) {
      setLoading(true);
      try {
        await apiAddToCart(tokens.access, { product_id: product.id, quantity });
        const res = await apiGetCart(tokens.access);
        const payload = Array.isArray(res?.items)
          ? res.items
          : res?.results || [];
        const productMap = await getProductCatalogMap();
        setItems(payload.map((item) => normalizeCartItem(item, productMap)));
        return { success: true };
      } catch (err) {
        setError(err.message || "Failed to add item to cart.");
        return {
          success: false,
          message: err.message || "Failed to add item to cart.",
        };
      } finally {
        setLoading(false);
      }
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    });
    return { success: true };
  };

  const removeFromCart = async (productId) => {
    setError(null);
    const tokenRaw = localStorage.getItem(TOKENS_KEY);
    const tokens = tokenRaw ? JSON.parse(tokenRaw) : null;
    if (tokens?.access) {
      setLoading(true);
      try {
        await apiRemoveFromCart(tokens.access, { product_id: productId });
        const res = await apiGetCart(tokens.access);
        const payload = Array.isArray(res?.items)
          ? res.items
          : res?.results || [];
        const productMap = await getProductCatalogMap();
        setItems(payload.map((item) => normalizeCartItem(item, productMap)));
        return { success: true };
      } catch (err) {
        setError(err.message || "Failed to remove item from cart.");
        return {
          success: false,
          message: err.message || "Failed to remove item from cart.",
        };
      } finally {
        setLoading(false);
      }
    }

    setItems((prev) => prev.filter((i) => i.id !== productId));
    return { success: true };
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    const tokenRaw = localStorage.getItem(TOKENS_KEY);
    const tokens = tokenRaw ? JSON.parse(tokenRaw) : null;
    // Authenticated: use existing /cart/add/ and /cart/remove/ to emulate update
    if (tokens?.access) {
      setError(null);
      setLoading(true);
      try {
        // find current quantity in local state
        const current = items.find((i) => i.id === productId)?.quantity || 0;
        const delta = quantity - current;

        if (delta > 0) {
          // add the difference
          await apiAddToCart(tokens.access, {
            product_id: productId,
            quantity: delta,
          });
        } else if (delta < 0) {
          // backend does not support decrement; remove and re-add desired quantity
          await apiRemoveFromCart(tokens.access, { product_id: productId });
          if (quantity > 0) {
            await apiAddToCart(tokens.access, {
              product_id: productId,
              quantity,
            });
          }
        }

        // reload cart from server to ensure authoritative state
        await loadCart();
        return { success: true };
      } catch (err) {
        setError(err.message || "Failed to update cart quantity.");
        return {
          success: false,
          message: err.message || "Failed to update cart quantity.",
        };
      } finally {
        setLoading(false);
      }
    }

    // Fallback: local state update for unauthenticated users
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, quantity } : i)),
    );
    return { success: true };
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = {
    items,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
