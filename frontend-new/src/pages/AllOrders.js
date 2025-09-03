import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { ApiUrls } from "../constants/api_urls";
import toast from "react-hot-toast";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(ApiUrls.ALL_ORDERS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 1 && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Layout>
      <main className="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68 bg-gradient-to-tl from-blue-500 to-violet-500 min-h-screen">
        <div className="relative w-full mx-auto py-10">
          <h2 className="text-3xl font-bold text-white mb-8 px-6">All Orders</h2>
          <div className="mx-6 bg-white rounded-2xl shadow-3xl p-6">
            {loading ? (
              <p>Loading...</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Product ID</th>
                    <th className="px-4 py-2 text-left">User ID</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Total Price</th>
                    <th className="px-4 py-2 text-left">Shipping Address</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-2">{order.order_id}</td>
                      <td className="px-4 py-2">{order.product_id}</td>
                      <td className="px-4 py-2">{order.user_id}</td>
                      <td className="px-4 py-2">{order.quantity}</td>
                      <td className="px-4 py-2">${order.total_price}</td>
                      <td className="px-4 py-2">{order.shipping_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default AllOrders;
