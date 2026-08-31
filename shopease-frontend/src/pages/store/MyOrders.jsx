import React, { useEffect, useState } from "react";
import { apiGetOrders } from "../../api/storeApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function MyOrders() {
  const { user, accessToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!accessToken) {
      setOrders([]);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    apiGetOrders(accessToken)
      .then((response) => {
        const list = Array.isArray(response)
          ? response
          : Array.isArray(response?.results)
            ? response.results
            : [];
        if (isMounted) {
          setOrders(list);
          setError("");
        }
      })
      .catch(() => {
        if (isMounted) setError("Unable to load your orders right now.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold mb-1">My Orders</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Order history for{" "}
        {user?.first_name || user?.username || user?.name || "Customer"}
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-100 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="p-6 text-sm text-neutral-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-neutral-500">No orders yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-medium">#{o.id}</td>
                  <td className="px-4 py-3">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {Array.isArray(o.items)
                      ? o.items.reduce(
                          (sum, item) => sum + Number(item.quantity || 0),
                          0,
                        )
                      : 0}
                  </td>
                  <td className="px-4 py-3">
                    ${Number(o.total_amount || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[o.status] || "bg-neutral-100 text-neutral-700"}`}
                    >
                      {o.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
