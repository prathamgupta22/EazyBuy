import { Layout } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProduct(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto mt-8 p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-md"
              alt={product.name}
            />
          </div>
          <div className="md:w-2/3 text-center md:text-left md:ml-8">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg mb-2">{product.description}</p>
            <p className="text-lg font-semibold mb-2">
              Price: ${product.price}
            </p>
            <p className="text-lg mb-4">Category: {product?.category?.name}</p>
            <button className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              ADD TO CART
            </button>
          </div>
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
          {relatedProduct.length === 0 ? (
            <p className="text-lg text-center text-gray-600 bg-gray-100 p-4 rounded-lg shadow-md">
              No similar products found
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {relatedProduct.map((p) => (
                <div
                  key={p._id}
                  className="card w-full sm:w-80 bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="w-full h-48 object-cover rounded-t-lg"
                    alt={p.name}
                  />
                  <div className="p-4">
                    <h5 className="text-xl font-semibold mb-2">{p.name}</h5>
                    <p className="text-gray-700 mb-2">
                      {p.description.length > 30
                        ? `${p.description.substring(0, 30)}...`
                        : p.description}
                    </p>
                    <p className="text-gray-900 font-bold mb-4">$ {p.price}</p>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
