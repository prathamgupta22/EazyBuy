import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/user/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[83vh] flex-col bg-gradient-to-b from-[#ffdee9] to-[#b5fffc]">
        <form onSubmit={handleSubmit} className="shadow-lg p-5 bg-white">
          <h4 className="text-center mb-8 font-bold font-playfair">
            LOGIN FORM
          </h4>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control w-full border-0 border-b border-black rounded-none"
              id="exampleInputEmail1"
              placeholder="Enter Your Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control w-full border-0 border-b border-black rounded-none"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full border border-black rounded-none bg-black text-white py-2 mt-4 hover:bg-gradient-to-r from-[#434343] to-[#000000]"
          >
            LOGIN
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
