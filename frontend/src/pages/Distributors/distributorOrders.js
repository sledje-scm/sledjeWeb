import React, { useState } from "react";
import { Check, X, SendHorizonal, CircleCheck, History, Truck } from "lucide-react";

const DistributorOrders = () => {
  const [activeMode, setActiveMode] = useState("retailer"); // retailer | supplier
  const [activeTab, setActiveTab] = useState("requests"); // for retailer
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
    {
      id: 3,
      retailer: "Apna Bazaar",
      items: [{ name: "Fortune Oil", quantity: 4, rate: 160 }],
    },
    {
      id: 4,
      retailer: "Hind Pharma",
      items: [{ name: "Fortune Oil", quantity: 4, rate: 160 }],
    },
    {
      id: 5,
      retailer: "Hi-Tech Grocers",
      items: [{ name: "Fortune Oil", quantity: 4, rate: 160 }],
    },
    {
      id: 6,
      retailer: "Kirana New",
      items: [{ name: "Fortune Oil", quantity: 4, rate: 160 }],
    },
    {
      id: 7,
      retailer: "Shanti Associates",
      items: [{ name: "Fortune Oil", quantity: 4, rate: 160 }],
    },
  ]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [onWayOrders, setOnWayOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [supplierHistory, setSupplierHistory] = useState([]);
  const [supplierTab, setSupplierTab] = useState("onWay");
  const [supplierOnWay, setSupplierOnWay] = useState([
    {
      id: 101,
      supplier: "Small Basket Wholesale",
      items: [
        { name: "Aashirvaad Atta", quantity: 20, rate: 280 },
        { name: "Tata Salt", quantity: 10, rate: 18 },
      ],
      expected: "Tomorrow",
    },
     {
      id: 101,
      supplier: "Modern Basket Wholesale",
      items: [
        { name: "Aashirvaad Atta", quantity: 20, rate: 280 },
        { name: "Tata Salt", quantity: 10, rate: 18 },
      ],
      expected: "Tomorrow",
    },
     {
      id: 101,
      supplier: "BigBasket Wholesale",
      items: [
        { name: "Aashirvaad Atta", quantity: 20, rate: 280 },
        { name: "Tata Salt", quantity: 10, rate: 18 },
      ],
      expected: "Tomorrow",
    },
  ]);

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

  const groupedByRetailer = (orders) => {
    return orders.reduce((acc, order) => {
      acc[order.retailer] = acc[order.retailer] || [];
      acc[order.retailer].push(order);
      return acc;
    }, {});
  };

  return (
    <div className="flex-col justify-between items-center mb-8 px-2">
      {/* Heading + Toggle Row */}
<div
  className="flex items-center justify-between rounded-3xl px-6 py-4 mb-6 mt-6 bg-white md:pr-16"
  // style={{
  //   backgroundColor: activeMode === "retailer" ? "#e0f2fe" : "#ccfbf1", // full row color
  // }}
>
  <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-eudoxus text-gray-900 md:pl-16 md:pt-8 md:mb-4">
    <span className="bg-black bg-clip-text text-transparent">All your</span>
    <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent pl-2">
      Orders
    </span>
  </h2>

  {/* Toggle */}
  <div className="flex items-center gap-4  border-2 border-blue-700 rounded-full p-1 transition duration-300 md:mt-8 md:mb-4">
    <button
      onClick={() => setActiveMode("retailer")}
      className={`px-6 py-2 rounded-full text-sm font-semibold transition duration-300 ${
        activeMode === "retailer"
          ? "bg-blue-700 text-white shadow"
          : "text-blue-700"
      }`}
    >
      Retailer
    </button>
    <button
      onClick={() => setActiveMode("supplier")}
      className={`px-6 py-2 rounded-full text-sm font-semibold transition duration-300 ${
        activeMode === "supplier"
          ? "bg-teal-700 text-white shadow"
          : "text-teal-700"
      }`}
    >
      Supplier
    </button>
  </div>
</div>


      {/* Retailer Section */}
      {activeMode === "retailer" && (
        <>
          {/* Tabs */}
          <div className="flex justify-center mb-6">
          <div className="bg-white px-4 py-3 rounded-xl flex gap-16 pl-8">
            {["requests", "accepted", "onWay"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300
                    ${isActive
                      ? "bg-black text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-inner"}`}
                >
                  {tab === "requests"
                    ? "Requests"
                    : tab === "accepted"
                    ? "Accepted"
                    : "On Way"}
                </button>
              );
            })}
          </div>
          </div>
          {/* Requests */}
          {activeTab === "requests" &&
          (orderRequests.length === 0 ? (
            <p className="text-center text-gray-400">No new order requests.</p>
          ) : (

           
            <div  style={{background: "linear-gradient(to bottom, #0D47A1 0px, #1565c0 99px,  transparent 100px)"}}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 bg-blue-400 rounded-tl-3xl rounded-tr-3xl">
              {orderRequests.map((order) => (
                <div
                  key={order.id}
                  className=" mt-8 bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6 transition hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100"
                >
                  {/* Retailer Name */}
                  <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
                    {order.retailer}
                  </h3>

                  {/* Items List */}
                  <ul className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between text-sm border-b border-gray-200 pb-2"
                      >
                        <span className="text-gray-800 font-medium">{item.name}</span>
                        <span className="text-gray-500">
                          Qty: {item.quantity}, ₹{item.rate}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => acceptOrder(order.id)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 shadow-sm"
                    >
                      <Check size={16} /> Accept
                    </button>
                    <button
                      onClick={() => rejectOrder(order.id)}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 shadow-sm"
                    >
                      <X size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}



          {/* Accepted */}
          {activeTab === "accepted" &&
          (acceptedOrders.length === 0 ? (
            <p className="text-center text-gray-400">No accepted orders.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {Object.entries(groupedByRetailer(acceptedOrders)).map(([retailer, orders], i) => {
                const total = orders
                  .flatMap((o) => o.items)
                  .reduce((sum, item) => sum + item.quantity * item.rate, 0);
                return (
                  <div
                    key={i}
                    className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6 transition hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100"
                  >
                    {/* Retailer Header */}
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-bold text-gray-900">{retailer}</h3>
                      <button
                        onClick={() => sendOrder(retailer)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs hover:bg-blue-800 shadow-sm"
                      >
                        <SendHorizonal size={14} /> Ship
                      </button>
                    </div>

                    {/* Item List */}
                    <ul className="space-y-2 text-sm">
                      {orders.map((order) =>
                        order.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between border-b pb-1 border-gray-200 text-gray-700"
                          >
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs text-gray-500">
                              Qty: {item.quantity}, ₹{item.rate}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>

                    {/* Total */}
                    <p className="mt-3 text-right text-sm font-semibold text-blue-700">
                      Total: ₹{total}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}


          {/* On Way */}
          {activeTab === "onWay" &&
          (onWayOrders.length === 0 ? (
            <p className="text-center text-gray-400">No orders on the way.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {onWayOrders.map((order, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6 transition hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100"
                >
                  {/* Retailer Name */}
                  <h4 className="text-base font-bold text-gray-900 mb-3">{order.retailer}</h4>

                  {/* Item List */}
                  <ul className="space-y-2 text-sm">
                    {order.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex justify-between border-b pb-1 border-gray-200 text-gray-700"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-gray-500">
                          Qty: {item.quantity}, ₹{item.rate}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

        </>
      )}

      {/* Supplier Section */}
      
        {activeMode === "supplier" && (
          <div className="space-y-6">
            {/* Toggle Tabs */}
            <div className="flex justify-center gap-16 mb-6 md:pt-4">
              {["onWay", "history"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSupplierTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    supplierTab === tab
                      ? "bg-black text-white shadow-md"
                      : "bg-white text-gray-500 hover:text-blue-700 hover:bg-blue-50 border border-gray-200"
                  }`}
                >
                  {tab === "onWay" ? "Orders On Way" : "History"}
                </button>
              ))}
            </div>

            {/* On Way Cards */}
            {supplierTab === "onWay" && (
              <>
                {supplierOnWay.length === 0 ? (
                  <p className="text-center text-gray-400">No orders on the way.</p>
                ) : (
                  <div style={{background: "linear-gradient(to bottom, #0D47A1 0px, #1565c0 99px,  transparent 100px)"}}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 bg-blue-400 rounded-tl-3xl rounded-tr-3xl">
                    {supplierOnWay.map((order, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6 transition hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100"
                      >
                        <h3 className="text-base font-bold text-gray-900 mb-1">{order.supplier}</h3>
                        <p className="text-xs text-blue-500 mb-3">Expected: {order.expected}</p>
                        <ul className="space-y-2 text-sm">
                          {order.items.map((item, j) => (
                            <li
                              key={j}
                              className="flex justify-between border-b pb-1 border-gray-200 text-gray-700"
                            >
                              <span>{item.name}</span>
                              <span className="text-xs text-gray-500">
                                Qty: {item.quantity}, ₹{item.rate}
                              </span>
                              
                            </li>
                          ))}
                          <li>
                            <div className="flex md:gap-6 md:ml-16">
                              <button className="flex items-center bg-black text-white px-4 py-2 hover:bg-gray-800 rounded-full md:mt-2">UPI</button>
                               <button className="flex items-center bg-black text-white px-4 py-2 hover:bg-gray-800 rounded-full md:mt-2">Credit</button>
                                <button className="flex items-center bg-black text-white px-4 py-2 hover:bg-gray-800 rounded-full md:mt-2">Cash</button>
                            </div>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* History Cards */}
            {supplierTab === "history" && (
              <>
                {supplierHistory.length === 0 ? (
                  <p className="text-center text-gray-400">No history available.</p>
                ) : (
                  <div style={{background: "linear-gradient(to bottom, #0D47A1 0px, #1565c0 99px,  transparent 100px)"}}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 bg-blue-400 rounded-tl-3xl rounded-tr-3xl">
                    {supplierHistory.map((hist, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6 transition hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100"
                      >
                        <p className="text-gray-700 text-sm">{hist.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <CircleCheck size={48} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Order Dispatched!</h2>
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
