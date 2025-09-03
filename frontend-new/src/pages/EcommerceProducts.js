import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { ApiUrls } from "../constants/api_urls";
import toast from "react-hot-toast";

const EcommerceProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Order modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState(null);
  const [orderForm, setOrderForm] = useState({
    product_id: "",
    quantity: 1,
    shipping_address: ""
  });
  const [orderErrors, setOrderErrors] = useState({});
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(ApiUrls.ALL_PRODUCTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 1 && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open order modal
  const handleBuyNow = (product) => {
    setOrderProduct(product);
    setOrderForm({
      product_id: product.id,
      quantity: 1,
      shipping_address: ""
    });
    setOrderErrors({});
    setOrderModalOpen(true);
  };

  // Handle order form change
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({ ...orderForm, [name]: value });
  };

  // Submit order
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);
    setOrderErrors({});

    // Validation
    let tempErrors = {};
    if (!orderForm.product_id) tempErrors.product_id = "Product is required";
    if (!orderForm.quantity || orderForm.quantity < 1) tempErrors.quantity = "Quantity must be at least 1";
    if (!orderForm.shipping_address.trim()) tempErrors.shipping_address = "Shipping address is required";
    if (orderProduct && orderForm.quantity > orderProduct.stock) tempErrors.quantity = `Only ${orderProduct.stock} in stock`;

    if (Object.keys(tempErrors).length) {
      setOrderErrors(tempErrors);
      setOrderSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.post(`${ApiUrls.PRODUCTS.replace("/products", "/orders")}`, orderForm, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 1) {
        toast.success(response.data.message || "Order placed successfully!");
        setOrderModalOpen(false);
        fetchProducts(); // update stock
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (err) {
      if (err.response?.data?.error && Array.isArray(err.response.data.error)) {
        const errorMap = {};
        err.response.data.error.forEach((e) => {
          if (e.field) errorMap[e.field] = e.message;
        });
        setOrderErrors(errorMap);
        toast.error("Please fix the validation errors");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68 bg-gradient-to-tl from-blue-500 to-violet-500 min-h-screen">
        <div className="relative w-full mx-auto py-10">
          <h2 className="text-3xl font-bold text-white mb-8 px-6">Shop Products</h2>
          <div className="mx-6 bg-white rounded-2xl shadow-3xl p-6">
            {loading ? (
              <p>Loading...</p>
            ) : products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col">
                    <div className="flex justify-center items-center mb-4">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.name} className="h-40 w-40 object-cover rounded" />
                      ) : (
                        <div className="h-40 w-40 flex items-center justify-center bg-gray-200 rounded text-gray-500">No Image</div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{prod.name}</h3>
                    <p className="text-sm text-gray-700 mb-2">{prod.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-blue-600">${prod.price}</span>
                      <span className="text-xs text-gray-500">Stock: {prod.stock}</span>
                    </div>
                    <span className="text-xs text-gray-500 mb-2">SKU: {prod.sku}</span>
                    <button
                      className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                      disabled={prod.stock <= 0}
                      onClick={() => handleBuyNow(prod)}
                    >
                      {prod.stock > 0 ? "Buy Now" : "Out of Stock"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Order Modal */}
            {orderModalOpen && orderProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setOrderModalOpen(false)}
                  >
                    &times;
                  </button>
                  <h3 className="text-xl font-bold mb-4">Order Product</h3>
                  <form onSubmit={handleOrderSubmit}>
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Product</label>
                      <input
                        type="text"
                        value={orderProduct.name}
                        disabled
                        className="text-sm block w-full rounded-lg border border-gray-300 bg-gray-100 py-2 px-3 text-gray-700"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={orderForm.quantity}
                        min={1}
                        max={orderProduct.stock}
                        onChange={handleOrderChange}
                        className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700"
                      />
                      {orderErrors.quantity && (
                        <p className="text-red-500 text-sm mt-1">{orderErrors.quantity}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Shipping Address</label>
                      <textarea
                        name="shipping_address"
                        value={orderForm.shipping_address}
                        onChange={handleOrderChange}
                        rows="2"
                        className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700"
                      />
                      {orderErrors.shipping_address && (
                        <p className="text-red-500 text-sm mt-1">{orderErrors.shipping_address}</p>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        className="mr-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        onClick={() => setOrderModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        disabled={orderSubmitting}
                      >
                        {orderSubmitting ? "Placing Order..." : "Place Order"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default EcommerceProducts;
