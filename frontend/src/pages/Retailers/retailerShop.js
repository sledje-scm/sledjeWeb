import React, { useState } from "react";
import { Trash, Check, FileText, ArrowDown, ArrowUp, PlusCircle, X, } from "lucide-react";
import CreateOrder from "../../components/CreateOrder";

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

const Shop = () => {
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
  <div
    key={order.orderId}
    className="w-full max-w-sm bg-white rounded-2xl shadow-md p-5 mx-2 font-[Eudoxus Sans] transition-all hover:shadow-lg border border-gray-100 relative"
  >
    {/* Card Delete (X) Icon - Top right */}
    <X
      className="absolute top-6 right-3 w-4 h-4 text-red-400 hover:text-red-600 cursor-pointer transition "
      onClick={() => deleteOrderCard(order.orderId)}
    />

    {/* Customer Name */}
    <div className="text-center font-bold text-gray-900 text-base mb-3">
      {order.customerName || "Custom"}
    </div>

    {/* Item List */}
    <div className="space-y-3">
      {(expandedCards[order.orderId] ? order.items : order.items.slice(0, 3)).map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-start text-sm border-b pb-2 border-gray-200"
        >
          {/* Product Info */}
          <div className="text-gray-800 text-xs font-medium w-2/3">
            <p>{item.item} <span className="text-gray-400 font-normal">({item.brand})</span></p>
          </div>

          {/* Quantity & Delete */}
          {!isPayment && (
            <div className="flex items-center gap-1 w-1/3 justify-end">
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
                              i.id === item.id ? { ...i, quantity } : i
                            ),
                          }
                        : o
                    )
                  );
                }}
                className="w-12 border border-gray-300 rounded-md px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              {item.unit && (
                <span className="ml-1 text-gray-500 text-xs">{item.unit}</span>
              )}
              <X
                className="w-3 h-3 text-red-400 hover:text-red-600 transition cursor-pointer"
                onClick={() => deleteItem(order.orderId, item.id)}
              />
            </div>
          )}
        </div>
      ))}

      {/* Expand / Collapse */}
      {order.items.length > 3 && (
        <button
          className="text-[11px] text-blue-500 hover:underline mt-1"
          onClick={() => toggleExpand(order.orderId)}
        >
          {expandedCards[order.orderId] ? "View Less" : "View More"}
        </button>
      )}
    </div>

    {/* Total Row */}
    <div className="mt-4 flex justify-between items-center text-sm text-gray-800 font-semibold">
      <p>Total: ₹{calculateTotal(order.items)}</p>
      {!isPayment && (
        <Check
          className="w-5 h-5 text-green-500 hover:text-green-600 cursor-pointer transition"
          onClick={() => moveToPayment(order.orderId)}
        />
      )}
    </div>

    {/* Order ID */}
    <p className="text-[11px] text-gray-400 mt-1">Order ID: {order.orderId}</p>

    {/* Payment Buttons */}
    {isPayment && (
      <div className="flex gap-2 mt-4">
        {["cash", "upi", "credit"].map((mode) => (
          <button
            key={mode}
            onClick={() => handlePayment(order.orderId, mode)}
            className="text-[11px] px-3 py-1 bg-black hover:bg-gray-900 text-white rounded-full transition"
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>
    )}
  </div>
);


  return (
    <div className="p-6 space-y-8 bg-white min-h-screen">
      <div className="flex justify-between items-center md:pl-16 md:pt-8">
        <h2 className="text-4xl md:text-5xl font-bold md:leading-tight mb-6 tracking-tight text-between">
              <span className="bg-black bg-clip-text text-transparent font-eudoxus">
                Your Shop
              </span>
              <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 bg-clip-text text-transparent font-eudoxus pl-2">
                 Dashboard
              </span>
            </h2>
        <div className="flex justified-between md:gap-3 md:pr-[3.5rem] md:pb-8 gap-2">
          {/* Create Order Button */}
          <button
          onClick={() => setShowOrderModal(true)}
          className="flex items-center bg-black text-white px-4 py-4 rounded-full hover:bg-gray-800 "
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
            <FileText className=" w-4 h-4" /> {showReports ? "Hide Reports" : "Show Reports"}
          </button>
        </div>
      </div>

      {/* Flex container for Upcoming Orders and Payment Section */}
      <div className=" flex lg:flex-row gap-6 md:pl-16 md:pr-16">
        {/* Upcoming Orders Section */}
        <section style={{background: "linear-gradient(to bottom, #0D47A1 0px, #1565c0 99px,  transparent 100px)"}}
          className="p-5 rounded-3xl shadow-md flex-1"
        >
          <h2 className="text-xl font-semibold text-white mb-2">Upcoming Orders</h2>
          <div
            className="overflow-y-auto"
            style={{ 
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
        <section style={{background: "linear-gradient(to bottom, #0D47A1 0px, #1565c0 99px,  transparent 100px)"}}
          className=" p-5 rounded-3xl shadow-md flex-1 "
        >
          <h2 className="text-xl font-semibold text-white mb-2">Payment Section</h2>
          <div
            className="overflow-y-auto"
            style={{
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
      <section className="p-4 rounded-3xl shadow-md mt-6 md:ml-16 md:mr-16" style={{background: " linear-gradient(to bottom, #0D47A1 0px, #1565c0 99px,  transparent 100px)"}}>
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

export default Shop;