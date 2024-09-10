import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const createOrder = async () => {
      try {
        await axios.post("/api/v1/order/create", {});
        navigate("/orders");
      } catch (error) {
        console.error("Order creation error:", error.message);
        navigate("/");
      }
    };

    createOrder();
  }, [navigate]);
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p>
          Your order has been created successfully. You will be redirected
          shortly.
        </p>
      </div>
    </Layout>
  );
};

export default Success;
