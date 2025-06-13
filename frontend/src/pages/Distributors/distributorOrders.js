import React, { useState } from "react";
import { Check, X, SendHorizonal, CircleCheck, Trash2 } from "lucide-react";

const DistributorOrders = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [orderRequests, setOrderRequests] = useState([
    {
      id: 1,
      retailer: "FreshMart",
      items: [
        { name: "Aashirvaad Atta", quantity: 10, rate: 300 },
        { name: "Tata Salt", quantity: 5, rate: 20 },
      ],
    },
    {
      id: 2,
      retailer: "Kirana Plus",
      items: [{ name: "Fortune Oil", quantity: 4, rate: 160 }],
    },
  ]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [onWayOrders, setOnWayOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const acceptOrder = (orderId) => {
    const accepted = orderRequests.find((order) => order.id === orderId);
    setAcceptedOrders((prev) => [...prev, accepted]);
    setOrderRequests((prev) => prev.filter((order) => order.id !== orderId));
  };

  const rejectOrder = (orderId) => {
    setOrderRequests((prev) => prev.filter((order) => order.id !== orderId));
  };

  const sendOrder = (retailer) => {
    const sending = acceptedOrders.filter((order) => order.retailer === retailer);
    setOnWayOrders((prev) => [...prev, ...sending]);
    setAcceptedOrders((prev) => prev.filter((order) => order.retailer !== retailer));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveTab("requests");
  };

  const TabButton = ({ tabId, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`text-center px-4 py-2 font-medium transition relative ${
        activeTab === tabId ? "text-blue-800 font-semibold" : "text-gray-600"
      }`}
    >
      {label}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${
          activeTab === tabId ? "bg-blue-600" : "bg-transparent"
        }`}
      />
    </button>
  );

  const groupedByRetailer = (orders) => {
    return orders.reduce((acc, order) => {
      acc[order.retailer] = acc[order.retailer] || [];
      acc[order.retailer].push(order);
      return acc;
    }, {});
  };

  return (
    <div className="bg-white p-6 min-h-screen">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-blue-500 mb-6">
        <TabButton tabId="requests" label="Requests" />
        <TabButton tabId="accepted" label="Accepted" />
        <TabButton tabId="onWay" label="On Way" />
      </div>

      {/* Requests */}
      {activeTab === "requests" &&
        (orderRequests.length === 0 ? (
          <p className="text-center text-gray-400">No new order requests.</p>
        ) : (
          orderRequests.map((order) => (
            <div
              key={order.id}
              className="bg-blue-50 rounded-lg p-4 mb-4 shadow-md"
            >
              <h3 className="text-xl font-bold text-blue-700">
                {order.retailer}
              </h3>
              <ul className="mt-2">
                {order.items.map((item, i) => (
                  <li key={i} className="text-gray-700">
                    {item.name} - Qty: {item.quantity}, Rate: ₹{item.rate}
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => acceptOrder(order.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <Check size={16} /> Accept
                </button>
                <button
                  onClick={() => rejectOrder(order.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                >
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          ))
        ))}

      {/* Accepted Orders */}
      {activeTab === "accepted" &&
        (acceptedOrders.length === 0 ? (
          <p className="text-center text-gray-400">No accepted orders.</p>
        ) : (
          Object.entries(groupedByRetailer(acceptedOrders)).map(
            ([retailer, orders], i) => {
              const total = orders
                .flatMap((o) => o.items)
                .reduce((sum, item) => sum + item.quantity * item.rate, 0);

              return (
                <div
                  key={i}
                  className="bg-white shadow-md rounded-xl p-4 mb-6 border"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-blue-700">
                      {retailer}
                    </h3>
                    <button
                      onClick={() => sendOrder(retailer)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 flex items-center gap-2"
                    >
                      <SendHorizonal size={16} /> Ship
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {orders.map((order) =>
                      order.items.map((item, i) => (
                        <li key={i} className="text-gray-700">
                          {item.name} - Qty: {item.quantity}, Rate: ₹{item.rate}
                        </li>
                      ))
                    )}
                  </ul>
                  <p className="mt-2 font-semibold text-right text-blue-800">
                    Total: ₹{total}
                  </p>
                </div>
              );
            }
          )
        ))}

      {/* On Way Orders */}
      {activeTab === "onWay" &&
        (onWayOrders.length === 0 ? (
          <p className="text-center text-gray-400">No orders on the way.</p>
        ) : (
          onWayOrders.map((order, i) => (
            <div key={i} className="bg-blue-100 rounded p-4 mb-4 shadow">
              <h4 className="text-lg font-semibold text-blue-800">
                {order.retailer}
              </h4>
              <ul className="mt-2 text-gray-700">
                {order.items.map((item, j) => (
                  <li key={j}>
                    {item.name} - Qty: {item.quantity}, Rate: ₹{item.rate}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <CircleCheck
              size={48}
              className="text-green-500 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              Order Dispatched!
            </h2>
            <p className="mb-6 text-gray-700">
              The order has been sent to the retailer successfully.
            </p>
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorOrders;
