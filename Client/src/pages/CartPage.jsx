import React, { useState, useMemo } from "react";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const removeCartItem = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = useMemo(() => {
    try {
      const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.error("Error calculating total price:", error);
      return "$0.00";
    }
  }, [cart]);

  const makePayment = async () => {
    setIsLoading(true);
    try {
      const stripe = await loadStripe(
        "pk_test_51Pl85d2M0LYmn6s95IRZBxjEKAjQ8LpP6WPNHU3YvQRv5GHmoo58NFA48ew2X1DRp63E371JpB4E5MgUUnEeFiUR00KZ8aGCIN"
      );

      // Initiating payment
      const response = await axios.post(
        `http://localhost:8000/api/v1/product/payments`,
        { products: cart }
      );

      const { id: sessionId } = response.data;
      if (!sessionId) throw new Error("Failed to create Stripe session");

      // Listen for the payment success response from Stripe (handle in a success route)
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error("Stripe checkout error:", result.error.message);
      } else {
        // Wait for the payment to succeed before creating the order
        await axios.post("/api/v1/user/create", {
          products: cart,
          payment: true,
        }); // Send order to backend
      }
    } catch (error) {
      console.error("Payment error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {auth?.user?.email || "Guest"}!
          </h2>
          <h4 className="text-gray-600 mt-2">
            {cart.length > 0
              ? `You have ${cart.length} items in your cart`
              : "Your cart is empty"}
            {!auth?.token && (
              <span className="text-red-500"> Please login to checkout</span>
            )}
          </h4>
        </div>

        {cart.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="cart-items bg-white p-6 rounded-lg shadow-md">
              {cart.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-lg p-4 mb-4"
                >
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="w-32 h-32 md:w-48 md:h-48 object-contain"
                    alt={p.name}
                  />
                  <div className="flex-1 md:ml-6 mt-4 md:mt-0">
                    <h4 className="text-lg font-bold text-gray-800">
                      {p.name}
                    </h4>
                    <p className="text-green-600 font-semibold text-lg">
                      ${p.price.toFixed(2)}
                    </p>
                    <button
                      className="mt-2 text-red-500 hover:text-red-700 font-semibold"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800">Cart Summary</h2>
              <hr className="my-4" />
              <h4 className="text-xl font-semibold text-gray-700">
                Total: {totalPrice}
              </h4>
              <button
                onClick={makePayment}
                disabled={isLoading}
                className={`mt-4 w-full py-2 px-4 font-semibold text-white rounded-lg ${
                  isLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isLoading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
