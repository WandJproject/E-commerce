import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiCheckout } from "../../api/storeApi.js";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Valid email is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.zip.trim()) errs.zip = "ZIP code is required";
    if (!/^\d{13,19}$/.test(form.cardNumber.replace(/\s/g, "")))
      errs.cardNumber = "Enter a valid card number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errs.expiry = "Format MM/YY";
    if (!/^\d{3,4}$/.test(form.cvv)) errs.cvv = "Invalid CVV";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    (async () => {
      try {
        const payload = {
          billing: {
            full_name: form.fullName,
            email: form.email,
            address: form.address,
            city: form.city,
            zip: form.zip,
          },
          items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
          payment: {
            card_number: form.cardNumber,
            expiry: form.expiry,
            cvv: form.cvv,
          },
        };
        await apiCheckout(accessToken, payload);
        clearCart();
        navigate("/order-success");
      } catch (err) {
        // keep user on checkout and show a generic error
        setErrors({ submit: "Checkout failed. Please try again." });
      }
    })();
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-xl font-bold mb-2">Nothing to checkout</h1>
        <p className="text-neutral-500">
          Your cart is empty. Add products before checking out.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-[1fr_320px] gap-8"
      >
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-bold mb-4">Shipping Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium block mb-1">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="input-field"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium block mb-1">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium block mb-1">
                  Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="input-field"
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="input-field"
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  ZIP Code
                </label>
                <input
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  className="input-field"
                />
                {errors.zip && (
                  <p className="text-xs text-red-500 mt-1">{errors.zip}</p>
                )}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-bold mb-4">Payment Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium block mb-1">
                  Card Number
                </label>
                <input
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="input-field"
                />
                {errors.cardNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.cardNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  placeholder="08/28"
                  className="input-field"
                />
                {errors.expiry && (
                  <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">CVV</label>
                <input
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  className="input-field"
                />
                {errors.cvv && (
                  <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-3">
              This is a demo checkout. No real payment is processed.
            </p>
          </div>
        </div>

        <div className="card p-5 h-fit sticky top-24">
          <h2 className="font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 max-h-52 overflow-y-auto mb-3">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="truncate pr-2">
                  {i.name} × {i.quantity}
                </span>
                <span className="shrink-0">
                  ${(i.price * i.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-neutral-200 pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full mt-5">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}
