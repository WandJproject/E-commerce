import React, { createContext, useContext, useEffect, useState } from "react";
import {
  apiGetWishlist,
  apiAddToWishlist,
  apiRemoveFromWishlist,
} from "../api/storeApi.js";

const WishlistContext = createContext(null);
const STORAGE_KEY = "shopease_wishlist";
const TOKENS_KEY = "shopease_auth_tokens";

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenRaw = localStorage.getItem(TOKENS_KEY);
      const tokens = tokenRaw ? JSON.parse(tokenRaw) : null;
      if (tokens?.access) {
        const res = await apiGetWishlist(tokens.access);
        const payload = Array.isArray(res?.results)
          ? res.results
          : res?.items || [];
        setItems(
          payload.map((p) => ({
            id: p.product || p.product_id || p.id,
            name: p.name || "",
            price: Number(p.price ?? 0),
            image: p.image || "",
          })),
        );
      } else {
        const raw = localStorage.getItem(STORAGE_KEY);
        setItems(raw ? JSON.parse(raw) : []);
      }
    } catch (err) {
      setError(err.message || "Failed to load wishlist.");
      const raw = localStorage.getItem(STORAGE_KEY);
      setItems(raw ? JSON.parse(raw) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isWishlisted = (productId) => items.some((i) => i.id === productId);

  const addToWishlist = async (product) => {
    setError(null);
    const tokenRaw = localStorage.getItem(TOKENS_KEY);
    const tokens = tokenRaw ? JSON.parse(tokenRaw) : null;
    if (tokens?.access) {
      setLoading(true);
      try {
        await apiAddToWishlist(tokens.access, { product_id: product.id });
        await loadWishlist();
        return { success: true };
      } catch (err) {
        setError(err.message || "Failed to add to wishlist.");
        return {
          success: false,
          message: err.message || "Failed to add to wishlist.",
        };
      } finally {
        setLoading(false);
      }
    }

    setItems((prev) => [
      ...prev,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
    ]);
    return { success: true };
  };

  const toggleWishlist = async (product) => {
    setError(null);
    const exists = items.some((i) => i.id === product.id);
    if (exists) {
      return removeFromWishlist(product.id);
    }
    return addToWishlist(product);
  };

  const removeFromWishlist = async (productId) => {
    setError(null);
    const tokenRaw = localStorage.getItem(TOKENS_KEY);
    const tokens = tokenRaw ? JSON.parse(tokenRaw) : null;
    if (tokens?.access) {
      setLoading(true);
      try {
        await apiRemoveFromWishlist(tokens.access, { product_id: productId });
        await loadWishlist();
        return { success: true };
      } catch (err) {
        setError(err.message || "Failed to remove from wishlist.");
        return {
          success: false,
          message: err.message || "Failed to remove from wishlist.",
        };
      } finally {
        setLoading(false);
      }
    }

    setItems((prev) => prev.filter((i) => i.id !== productId));
    return { success: true };
  };

  const value = {
    items,
    loading,
    error,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
