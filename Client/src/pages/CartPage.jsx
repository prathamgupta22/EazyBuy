import React from "react";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import Layout from "../components/Layout/Layout";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth(); // No need to destructure setAuth if it's not used
  const navigate = useNavigate();

  const removeCartItem = (pid) => {
    try {
      let updatedCart = [...cart];
      const index = updatedCart.findIndex((item) => item._id === pid);
      if (index !== -1) {
        updatedCart.splice(index, 1);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div>
        <div>
          <div>
            <h2>Welcome, {auth?.user?.email || "Guest"}!</h2>

            <h4>
              {cart?.length >= 1
                ? `You have ${cart.length} items in your cart`
                : "Your cart is empty"}
              {auth?.token ? "" : " Please login to checkout"}
            </h4>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            {cart?.map((p) => (
              <div key={p._id}>
                <div>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="w-full h-48 object-contain"
                    alt={p.name}
                  />
                </div>
                <div>
                  <h4>{p.name}</h4>
                  <p>{p.description.substring(0, 30)}</p>
                  <p>{p.price}</p>
                  <button onClick={() => removeCartItem(p._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>Cart Summary</h2>
          <p>Total | checkout | payment</p>
          <hr />
          <h4>Total: {totalPrice()}</h4>
          {auth?.user?.address ? (
            <>
              <div>
                <h4>Current address</h4>
                <h5>{auth?.user?.address}</h5>
                <button onClick={() => navigate("/dashboard/user/profile")}>
                  Update Address
                </button>
              </div>
            </>
          ) : (
            <div>
              {auth?.token ? (
                <button onClick={() => navigate("/dashboard/user/profile")}>
                  Update Address
                </button>
              ) : (
                <button
                  onClick={() =>
                    navigate("/login", {
                      state: "/cart",
                    })
                  }
                >
                  Please Login to checkout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
