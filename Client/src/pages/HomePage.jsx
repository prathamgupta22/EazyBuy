import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState(null); // Use null or initial value as needed
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  };

  // Fetch total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.error("Error fetching product count:", error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  // Load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts((prevProducts) => [...prevProducts, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.error("Error loading more products:", error);
    }
  };

  // Handle category filter change
  const handleFilter = (value, id) => {
    const all = value ? [...checked, id] : checked.filter((c) => c !== id);
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length && !radio) getAllProducts();
  }, [checked.length, radio]);

  useEffect(() => {
    if (checked.length || radio) filterProduct();
  }, [checked, radio]);

  // Filter products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio: radio || [], // Ensure radio is an array or empty array
      });
      setProducts(data?.products);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  return (
    <Layout title={"All Products - Best offers"}>
      <div className="container mx-auto mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <h4 className="text-center font-bold mb-4">Filter By Category</h4>
          <div className="flex flex-col space-y-2">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center font-bold mt-6 mb-4">Filter By Price</h4>
          <div className="flex flex-col space-y-2">
            <Radio.Group
              onChange={(e) => setRadio(e.target.value)}
              value={radio}
            >
              {Prices?.map((p, index) => (
                <Radio key={index} value={p.array}>
                  {p.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
          <div className="flex flex-col mt-4">
            <button
              className="btn bg-red-500 text-white py-2 rounded"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="md:col-span-3">
          <h1 className="text-center text-2xl font-bold mb-6">All Products</h1>
          <div className="flex flex-wrap justify-center">
            {products?.map((p) => (
              <div
                key={p._id}
                className="card m-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="w-full h-48 object-cover"
                  alt={p.name}
                />
                <div className="p-4">
                  <h5 className="font-bold text-lg mb-2">{p.name}</h5>
                  <p className="text-gray-700 mb-2">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="text-gray-900 font-bold mb-4">$ {p.price}</p>
                  <button className="btn bg-blue-500 text-white py-2 px-4 rounded mr-2">
                    More Details
                  </button>
                  <button className="btn bg-gray-500 text-white py-2 px-4 rounded">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3 flex justify-center">
            {products && products.length < total && (
              <button
                className="btn bg-yellow-500 text-white py-2 px-4 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
