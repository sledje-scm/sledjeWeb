import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = ({ retailerId }) => {
  const [orders, setOrders] = useState({
    pending: [],
    onWay: [],
    completed: [],
  });
  const [activeTab, setActiveTab] = useState("pending");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/api/orders/retailer/${retailerId}`);
      setOrders({
        pending: res.data.pending,
        onWay: res.data.onWay,
        completed: res.data.completed,
      });
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleQuantityChange = async (orderId, newQuantity) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { quantity: newQuantity });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const confirmDelivery = async (orderId) => {
    try {
      await axios.patch(`/api/orders/${orderId}/confirm`);
      fetchOrders();
    } catch (error) {
      console.error("Failed to confirm delivery", error);
    }
  };

  const renderOrder = (order, isEditable) => (
    <div key={order._id} className="p-4 border mb-2 rounded shadow">
      <div className="flex justify-between">
        <div>
          <div><strong>Product:</strong> {order.productName}</div>
          <div><strong>Distributor:</strong> {order.distributorName}</div>
          <div><strong>Status:</strong> {order.status}</div>
        </div>
        <div>
          <input
            type="number"
            value={order.quantity}
            disabled={!isEditable}
            onChange={(e) => handleQuantityChange(order._id, parseInt(e.target.value))}
            className="border rounded px-2 py-1 w-20"
          />
        </div>
      </div>
      {order.status === "on way" && order.canConfirmDelivery && (
        <button
          onClick={() => confirmDelivery(order._id)}
          className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
        >
          Confirm Delivery
        </button>
      )}
    </div>
  );

  const TabButton = ({ tabId, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className="flex-1 text-center px-4 py-2 font-medium transition relative"
    >
      <span
        className={`$
          {activeTab === tabId
            ? "text-blue-800 font-semibold"
            : "text-gray-600 hover:text-gray-800"}
        `}
      >
        {label}
      </span>
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 rounded-full transition-all duration-700 $
          {activeTab === tabId ? "bg-blue-600" : "bg-transparent"}`}
      />
    </button>
  );

  return (
    <div className="p-6">
      <div className="flex border-b mb-4">
        <TabButton tabId="pending" label="Pending Orders" />
        <TabButton tabId="onWay" label="On Way" />
        <TabButton tabId="completed" label="Completed Orders" />
      </div>

      {activeTab === "pending" && (
        <div>
          {orders.pending.map((order) => renderOrder(order, true))}
        </div>
      )}

      {activeTab === "onWay" && (
        <div>
          {orders.onWay.map((order) => renderOrder(order, false))}
        </div>
      )}

      {activeTab === "completed" && (
        <div>
          {orders.completed.map((order) => renderOrder(order, false))}
        </div>
      )}
    </div>
  );
};

export default Orders;
