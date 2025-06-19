import React, { useState } from "react";
import { Trash, Check, FileText, ArrowDown, ArrowUp, PlusCircle } from "lucide-react";
import CreateOrder from "./CreateOrder";

const dummyOrders = [
  {
    customerName: "Ramesh Kumar",
    orderId: "ORD001",
    items: [
      { id: 1, item: "Basmati Rice", brand: "India Gate", quantity: 2, rate: 120 },
      { id: 2, item: "Tur Dal", brand: "Tata Sampann", quantity: 1, rate: 150 },
    ],
  },
  {
    customerName: "Sita Sharma",
    orderId: "ORD002",
    items: [
      { id: 3, item: "Mustard Oil", brand: "Fortune", quantity: 1, rate: 180 },
      { id: 4, item: "Sugar", brand: "Madhur", quantity: 2, rate: 45 },
    ],
  },
  {
    customerName: "Amit Verma",
    orderId: "ORD003",
    items: [
      { id: 5, item: "Salt", brand: "Tata Salt", quantity: 3, rate: 20 },
      { id: 6, item: "Ghee", brand: "Amul", quantity: 1, rate: 550 },
    ],
  },
  {
    customerName: "Priya Singh",
    orderId: "ORD004",
    items: [
      { id: 7, item: "Besan", brand: "Rajdhani", quantity: 2, rate: 60 },
      { id: 8, item: "Chilli Powder", brand: "Everest", quantity: 1, rate: 90 },
    ],
  },
  {
    customerName: "Rahul Gupta",
    orderId: "ORD005",
    items: [
      { id: 9, item: "Paneer", brand: "Amul", quantity: 1, rate: 300 },
      { id: 10, item: "Curd", brand: "Mother Dairy", quantity: 2, rate: 50 },
    ],
  },
  {
    customerName: "Anjali Mehta",
    orderId: "ORD006",
    items: [
      { id: 11, item: "Coconut Oil", brand: "Parachute", quantity: 1, rate: 200 },
      { id: 12, item: "Soap", brand: "Lux", quantity: 3, rate: 40 },
    ],
  },
];

const dummyPaymentOrders = [
  {
    customerName: "Vikram Chawla",
    orderId: "ORD007",
    items: [
      { id: 13, item: "Shampoo", brand: "Dove", quantity: 1, rate: 250 },
      { id: 14, item: "Toothpaste", brand: "Colgate", quantity: 2, rate: 90 },
    ],
  },
  {
    customerName: "Neha Kapoor",
    orderId: "ORD008",
    items: [
      { id: 15, item: "Soap", brand: "Lux", quantity: 4, rate: 40 },
      { id: 16, item: "Paneer", brand: "Amul", quantity: 1, rate: 300 },
    ],
  },
  {
    customerName: "Ravi Sharma",
    orderId: "ORD009",
    items: [
      { id: 17, item: "Milk", brand: "Amul", quantity: 2, rate: 50 },
      { id: 18, item: "Bread", brand: "Britannia", quantity: 1, rate: 40 },
    ],
  },
  {
    customerName: "Meera Nair",
    orderId: "ORD010",
    items: [
      { id: 19, item: "Butter", brand: "Amul", quantity: 1, rate: 200 },
      { id: 20, item: "Cheese", brand: "Amul", quantity: 1, rate: 250 },
    ],
  },
  {
    customerName: "Arjun Singh",
    orderId: "ORD011",
    items: [
      { id: 21, item: "Eggs", brand: "Local", quantity: 12, rate: 6 },
      { id: 22, item: "Chicken", brand: "Fresh", quantity: 1, rate: 300 },
    ],
  },
  {
    customerName: "Kavita Das",
    orderId: "ORD012",
    items: [
      { id: 23, item: "Tea", brand: "Tata Tea", quantity: 1, rate: 200 },
      { id: 24, item: "Coffee", brand: "Nescafe", quantity: 1, rate: 300 },
    ],
  },
];

const RetailerShop = () => {
  const [upcomingOrders, setUpcomingOrders] = useState(dummyOrders);
  const [paymentOrders, setPaymentOrders] = useState(dummyPaymentOrders);
  const [expandedCards, setExpandedCards] = useState({});
  const [showReports, setShowReports] = useState(false);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [sortMode, setSortMode] = useState("none");

  const toggleExpand = (orderId) => {
    setExpandedCards((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const moveToPayment = (orderId) => {
    const order = upcomingOrders.find((o) => o.orderId === orderId);
    setPaymentOrders((prev) => [...prev, order]);
    setUpcomingOrders((prev) => prev.filter((o) => o.orderId !== orderId));
  };

  const deleteOrderCard = (orderId) => {
    if (window.confirm("Are you sure to delete this order?")) {
      setUpcomingOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    }
  };

  const deleteItem = (orderId, itemId) => {
    setUpcomingOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? { ...o, items: o.items.filter((item) => item.id !== itemId) }
          : o
      )
    );
  };

  const handlePayment = (orderId, mode) => {
    const now = new Date();
    const order = paymentOrders.find((o) => o.orderId === orderId);
    const bill = {
      ...order,
      mode,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };
    console.log("Generated Bill:", bill);
    if (mode === "credit") {
      alert("Credit bill generated. Redirect to borrower's page...");
    } else {
      alert("Paid bill generated.");
    }
    setPaymentOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    setCompletedOrders((prev) => [...prev, bill]);
  };

  const calculateTotal = (items) =>
    items.reduce((acc, item) => acc + item.quantity * item.rate, 0);

  const calculateRevenue = () => {
    return completedOrders.reduce((total, order) => {
      return total + calculateTotal(order.items);
    }, 0);
  };

  const calculateProfit = () => {
    return calculateRevenue() * 0.2;
  };

  const sortedUpcomingOrders = [...upcomingOrders].sort((a, b) => {
    const totalA = calculateTotal(a.items);
    const totalB = calculateTotal(b.items);
    if (sortMode === "asc") return totalA - totalB;
    if (sortMode === "desc") return totalB - totalA;
    return 0;
  });

  // Handler for when a new order is created
  const handleOrderCreated = (newOrder) => {
    setUpcomingOrders((prev) => [...prev, newOrder]);
    setShowOrderModal(false);
  };

  const renderOrderCard = (order, isPayment = false) => (
    <div key={order.orderId} className="min-w-[260px] max-w-xs bg-white rounded-lg shadow-md p-4 mx-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-bold">{order.customerName || "Custom"}</h2>
        <Trash
          className="w-4 h-4 text-red-500 cursor-pointer"
          onClick={() => deleteOrderCard(order.orderId)}
        />
      </div>
      <div>
        {(expandedCards[order.orderId] ? order.items : order.items.slice(0, 3)).map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm border-b py-1">
            <div>
              <p>{item.item} ({item.brand})</p>
              {!isPayment && (
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value);
                      setUpcomingOrders((prev) =>
                        prev.map((o) =>
                          o.orderId === order.orderId
                            ? {
                                ...o,
                                items: o.items.map((i) =>
                                  i.id === item.id ? { ...i, quantity} : i
                                ),
                              }
                            : o
                        )
                      );
                    }}
                    className="w-12 border rounded px-1 text-xs"
                  />
                  {item.unit && <span className="ml-1 text-xs text-gray-600">{item.unit}</span>}
                </div>
              )}
            </div>
            {!isPayment && (
              <Trash
                className="w-3 h-3 text-red-400 cursor-pointer"
                onClick={() => deleteItem(order.orderId, item.id)}
              />
            )}
          </div>
        ))}
        {order.items.length > 3 && (
          <button
            className="text-xs text-blue-500 mt-1"
            onClick={() => toggleExpand(order.orderId)}
          >
            {expandedCards[order.orderId] ? "View Less" : "View More"}
          </button>
        )}
        <p className="mt-2 text-sm font-semibold">Total: ₹{calculateTotal(order.items)}</p>
        <p className="text-xs text-gray-500">Order ID: {order.orderId}</p>
        {!isPayment ? (
          <Check
            className="w-5 h-5 text-green-600 cursor-pointer mt-2"
            onClick={() => moveToPayment(order.orderId)}
          />
        ) : (
          <div className="flex gap-2 mt-2">
            {["cash", "upi", "credit"].map((mode) => (
              <button
                key={mode}
                onClick={() => handlePayment(order.orderId, mode)}
                className="text-xs px-2 py-1 bg-black text-white rounded-full"
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shop Dashboard</h1>
        <div className="flex gap-4">
          {/* Create Order Button */}
          <button
          onClick={() => setShowOrderModal(true)}
          className="flex items-center bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
        >
          <PlusCircle className="mr-2 w-4 h-4" /> Create Order
        </button>
          <CreateOrder
           isOpen={showOrderModal}
           onClose={() => setShowOrderModal(false)}
           onAddOrder={handleOrderCreated}
          />

          {/* Reports Button */}
          <button
            onClick={() => setShowReports((prev) => !prev)}
            className="flex items-center bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300"
          >
            <FileText className="mr-2 w-4 h-4" /> {showReports ? "Hide Reports" : "Show Reports"}
          </button>
        </div>
      </div>

      {/* Flex container for Upcoming Orders and Payment Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Upcoming Orders Section */}
        <section style={{background: "linear-gradient(to bottom, #1565c0 0px, #1565c0 99px,  transparent 100px)"}}
          className="p-5 rounded-lg shadow-md flex-1"
        >
          <h2 className="text-xl font-semibold text-white mb-2">Upcoming Orders</h2>
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: "600px",
            }}
          >
            <div className="grid gap-4"
            style={{gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",justifyItems: "stretch" }}>
              {upcomingOrders.length === 0 ? (
                <p className="text-gray-300">No upcoming orders.</p>
              ) : (
                sortedUpcomingOrders.map((order) => renderOrderCard(order))
              )}
            </div>
          </div>
        </section>

        {/* Payment Section */}
        <section style={{background: "linear-gradient(to bottom, #1565c0 0px, #1565c0 99px,  transparent 100px)"}}
          className=" p-4 rounded-lg shadow-md flex-1 "
        >
          <h2 className="text-xl font-semibold text-white mb-2">Payment Section</h2>
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: "600px",
            }}
          >
            <div className="grid gap-4 "
            style={{gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",justifyItems: "stretch" }}>
              {paymentOrders.length === 0 ? (
                <p className="text-gray-300">No orders in payment section.</p> 
              ) : (
                paymentOrders.map((order) => renderOrderCard(order, true))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Transaction History Section */}
      <section className="p-4 rounded-lg shadow-md mt-6" style={{background: "linear-gradient(to bottom, #1565c0 0px, #1565c0 99px,  transparent 100px)"}}>
        <h2 className="text-xl font-semibold text-white mb-2">Transaction History</h2>
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: "400px",
          }}
        >
          {completedOrders.length === 0 ? (
            <p className="text-gray-300">No transactions available.</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {completedOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-md font-bold">{order.customerName || "Custom"}</h2>
                    <p className="text-xs text-gray-500">{order.date} at {order.time}</p>
                  </div>
                  <div>
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-sm border-b py-1 last:border-0"
                      >
                        <div>
                          <p>
                            {item.item} ({item.brand})
                          </p>
                        </div>
                        <p>₹{item.quantity * item.rate}</p>
                      </div>
                    ))}
                    <p className="mt-2 text-sm font-semibold">
                      Total: ₹{calculateTotal(order.items)}
                    </p>
                    <p className="text-xs text-gray-500">Payment Mode: {order.mode.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reports Section */}
      {showReports && (
        <div className="mt-4 border p-4 rounded-xl bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">Business Summary</h3>
          <p>Total Revenue Today: ₹{calculateRevenue()}</p>
          <p>Profit Today: ₹{calculateProfit()}</p>
          <p>Monthly Revenue: ₹{calculateRevenue()}</p>
          <p>Monthly Profit: ₹{calculateProfit()}</p>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Completed Orders</h4>
            {completedOrders.length === 0 ? (
              <p className="text-gray-500">No completed orders.</p>
            ) : (
              <ul className="text-sm text-gray-700 space-y-2">
                {completedOrders.map((order) => (
                  <li key={order.orderId}>
                    <strong>{order.customerName || "Custom"}</strong> - #{order.orderId} - ₹
                    {calculateTotal(order.items)} - {order.mode.toUpperCase()} on {order.date} at {order.time}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerShop;