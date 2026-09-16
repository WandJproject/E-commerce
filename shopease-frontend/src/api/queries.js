import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiAddToCart,
  apiAddToWishlist,
  apiCheckout,
  apiGetCart,
  apiGetOrders,
  apiGetProductReviews,
  apiGetWishlist,
  apiRemoveFromCart,
  apiRemoveFromWishlist,
  apiPostReview,
  getProducts,
} from "./storeApi.js";

export function useProductsQuery() {
  return useQuery({ queryKey: ["products"], queryFn: getProducts });
}

export function useProductQuery(slug) {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    select: (products) =>
      products.find(
        (product) =>
          product.slug === slug || String(product.id) === String(slug),
      ) || null,
    enabled: Boolean(slug),
  });
}

export function useProductReviewsQuery(productId) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => apiGetProductReviews(productId),
    enabled: Boolean(productId),
  });
}

export function useCartQuery(token) {
  return useQuery({
    queryKey: ["cart", token],
    queryFn: () => apiGetCart(token),
    enabled: Boolean(token),
  });
}

export function useWishlistQuery(token) {
  return useQuery({
    queryKey: ["wishlist", token],
    queryFn: () => apiGetWishlist(token),
    enabled: Boolean(token),
  });
}

export function useOrdersQuery(token) {
  return useQuery({
    queryKey: ["orders", token],
    queryFn: () => apiGetOrders(token),
    enabled: Boolean(token),
  });
}

export function useCartMutations(token) {
  const queryClient = useQueryClient();
  return {
    add: useMutation({
      mutationFn: ({ product_id, quantity }) =>
        apiAddToCart(token, { product_id, quantity }),
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    }),
    remove: useMutation({
      mutationFn: (product_id) => apiRemoveFromCart(token, { product_id }),
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    }),
  };
}

export function useWishlistMutations(token) {
  const queryClient = useQueryClient();
  return {
    add: useMutation({
      mutationFn: (product_id) => apiAddToWishlist(token, { product_id }),
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
    }),
    remove: useMutation({
      mutationFn: (product_id) => apiRemoveFromWishlist(token, { product_id }),
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
    }),
  };
}

export function useCheckoutMutation(token) {
  return useMutation({
    mutationFn: (payload) => apiCheckout(token, payload),
  });
}

export function useReviewMutation(token) {
  return useMutation({
    mutationFn: (payload) => apiPostReview(token, payload),
  });
}
