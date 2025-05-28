import React, { useState, useEffect, Suspense, useRef } from "react";
import { Trash, Check, FileText, ArrowDown, ArrowUp, PlusCircle, X, Mic, MicOff } from "lucide-react";
import { wordsToNumbers } from 'words-to-numbers';
// We don't need lazy loading since we'll use our own parsing
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

// Sample product database for order parsing
const productDatabase = [
  { item: "Product A", brand: "Brand X", rate: 100 },
  { item: "Product B", brand: "Brand Y", rate: 150 },
  { item: "Product C", brand: "Brand Z", rate: 80 },
  { item: "Product D", brand: "Brand X", rate: 90 },
  { item: "Product E", brand: "Brand X", rate: 120 },
  { item: "Product F", brand: "Brand Y", rate: 70 },
  { item: "Product G", brand: "Brand Z", rate: 60 },
  { item: "Product H", brand: "Brand X", rate: 200 },
];

const Shop = () => {
  const [upcomingOrders, setUpcomingOrders] = useState(dummyOrders);
  const [paymentOrders, setPaymentOrders] = useState(dummyPaymentOrders);
  const [expandedCards, setExpandedCards] = useState({});
  const [showReports, setShowReports] = useState(false);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ customerName: '', orderId: '', items: [] });
  const [sortMode, setSortMode] = useState("none");
  
  // States for voice input
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [parsedItems, setParsedItems] = useState([]);
  const recognitionRef = useRef(null);

  // Generate a unique order ID
  const generateOrderId = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `ORD${timestamp.toString().slice(-4)}${randomNum}`;
  };

  // Initialize recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + ' ' + transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
    
    // Set default order ID when modal opens
    if (showOrderModal) {
      setNewOrder(prev => ({...prev, orderId: generateOrderId()}));
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [showOrderModal]);

  const startListening = () => {
    setTranscript('');
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Use a simple parsing function instead of compromise


const knownUnits = ['kg', 'kilogram', 'g', 'gram', 'liters', 'liter', 'bottles', 'packets', 'pieces', 'dozen', 'box', 'boxes', 'l', 'ml', 'milliliter', 'cups', 'pints', 'quarts', 'ounces'];

function detectUnit(itemStr) {
  if (typeof itemStr !== 'string') {
    console.warn('Expected string but got:', typeof itemStr);
    return { unit: 'unit', item: 'unknown' };
  }
  const words = itemStr.trim().toLowerCase().split(/\s+/);

  // Check if first word is a unit
  if (knownUnits.includes(words[0])) {
    return {
      unit: words[0],
      item: words.slice(1).join(' ') || 'unknown'
    };
  }

  // Check unit at the end (e.g., "water bottles")
  const last = words[words.length - 1];
  if (knownUnits.includes(last)) {
    return {
      unit: last,
      item: words.slice(0, -1).join(' ') || 'unknown'
    };
  }

  return {
    unit: 'unit',
    item: itemStr.trim()
  };
}

function parseMultipleOrders(transcript) {
  if (typeof transcript !== 'string') {
    console.error('Invalid input: transcript must be a string');
    return [];
  }

  let normalized;
  try {

	transcript = transcript.replace(/[^a-zA-Z0-9\s.,]/g, ''); // Remove unwanted characters
	transcript = transcript.replace(/\s+/g, ' ').trim(); // Normalize spaces
	transcript= transcript.replace(/\bto\b/g, "two"); // Replace "to" with "two"
    normalized = wordsToNumbers(transcript); // Convert word numbers to digits
  } catch (error) {
    console.error('Error converting words to numbers:', error);
    normalized = transcript; // Fall back to original transcript if conversion fails
  }
  
  console.log("Normalized transcript:", normalized);
  
  const orders = [];
  // Number followed by a word or words that don't contain numbers
  const regex = /(\d+(?:\.\d+)?)\s+([a-zA-Z][a-zA-Z\s]*?)(?=\s+\d+|$)/g;
  
  let match;
  while ((match = regex.exec(normalized)) !== null) {
    const [, quantity, itemText] = match;
    const { unit, item } = detectUnit(itemText.trim());
    
    orders.push({
      item,
      quantity: parseFloat(quantity),
      unit
    });
    
    console.log(`Parsed: ${quantity} × ${itemText.trim()} (${unit})`);
  }
  
  return orders;
}

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

  const renderOrderCard = (order, isPayment = false) => (
    <div
      key={order.orderId}
      className="bg-white rounded-lg shadow-md p-4" // Fixed width for 3 cards in a row
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-bold">{order.customerName || "Custom"}</h2>
        <Trash
          className="w-4 h-4 text-red-500 cursor-pointer"
          onClick={() => deleteOrderCard(order.orderId)}
        />
      </div>
      <div>
        {(expandedCards[order.orderId]
          ? order.items
          : order.items.slice(0, 3)
        ).map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-sm border-b py-1 last:border-0"
          >
            <div>
              <p>
                {item.item} ({item.brand})
              </p>
            </div>
          </div>
        ))}
        <p className="mt-2 text-sm font-semibold">
          Total: ₹{calculateTotal(order.items)}
        </p>
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

  const handleOrderInput = (field, value) => {
    setNewOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewOrder = () => {
    if (!newOrder.customerName) {
      newOrder.customerName = "Custom";
      
      return;
    }
    
    const items = parsedItems.length > 0 ? parsedItems : [
      { id: Date.now(), item: "Sample Product", brand: "Brand X", quantity: 1, rate: 100 }
    ];
    
    const orderWithItems = {
      ...newOrder,
      items: items
    };
    
    setUpcomingOrders((prev) => [...prev, orderWithItems]);
    setShowOrderModal(false);
    setNewOrder({ customerName: '', orderId: '', items: [] });
    setParsedItems([]);
    setTranscript('');
  };

  const getDynamicBackgroundColor = (orderCount) => {
    if (orderCount === 0) return "bg-gray-200"; // No orders
    if (orderCount <= 3) return "bg-blue-200"; // Few orders
    if (orderCount <= 6) return "bg-blue-400"; // Moderate orders
    return "bg-blue-600"; // Many orders
  };

  const getDynamicHeight = (orderCount) => {
    if (orderCount === 0) return "h-32"; // Small height for no orders
    if (orderCount <= 3) return "h-48"; // Medium height for a few orders
    if (orderCount <= 6) return "h-64"; // Larger height for moderate orders
    return "h-64"; // Auto height for many orders
  };

  const getDynamicWidth = (orderCount) => {
    if (orderCount === 0) return "w-1/3"; // Small width for no orders
    if (orderCount <= 3) return "w-1/2"; // Medium width for a few orders
    if (orderCount <= 6) return "w-2/3"; // Larger width for moderate orders
    return "w-2/3"; // Full width for many orders
  };

  const handleCloseModal = () => {
    setShowOrderModal(false); // Close the modal
    setNewOrder({ customerName: '', orderId: '', items: [] }); // Reset the new order state
    setParsedItems([]); // Clear parsed items
    setTranscript(''); // Clear the transcript
};

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

          {/* Reports Button */}
          <button
            onClick={() => setShowReports((prev) => !prev)}
            className="flex items-center bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300"
          >
            <FileText className="mr-2 w-4 h-4" /> {showReports ? "Hide Reports" : "Show Reports"}
          </button>
        </div>
      </div>

      {/* Modal for Creating Orders */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={handleCloseModal}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Take Order</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name"
                className="w-full px-3 py-2 border rounded"
                value={newOrder.customerName}
                onChange={(e) => handleOrderInput("customerName", e.target.value)}
              />
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Order ID (Auto-generated)"
                  className="w-full px-3 py-2 border rounded bg-gray-100"
                  value={newOrder.orderId}
                  readOnly
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder="Enter order details or use voice input..."
                  className="w-full px-3 py-2 border rounded h-32"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                ></textarea>
                <div className="flex justify-between mt-2">
                  {isListening ? (
                    <button
                      onClick={stopListening}
                      className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      <MicOff className="mr-1 w-4 h-4" /> Stop Listening
                    </button>
                  ) : (
                    <button
                      onClick={startListening}
                      className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      <Mic className="mr-1 w-4 h-4" /> Start Listening
                    </button>
                  )}
                  <button
                    onClick={() => {
                      try {
                        const parsed = parseMultipleOrders(transcript);
                        const mappedItems = parsed.map((parsedItem) => {
                          const matchingProduct = productDatabase.find(
                            (product) =>
                              product.item
                                .toLowerCase()
                                .includes(parsedItem.item.toLowerCase()) ||
                              parsedItem.item
                                .toLowerCase()
                                .includes(product.item.toLowerCase())
                          );
                          return {
                            id: Date.now() + Math.floor(Math.random() * 1000),
                            item: matchingProduct ? matchingProduct.item : parsedItem.item,
                            brand: matchingProduct ? matchingProduct.brand : "Unknown",
                            quantity: parsedItem.quantity || 1,
                            rate: matchingProduct ? matchingProduct.rate : 100,
                            unit: parsedItem.unit || "piece",
                          };
                        });
                        setParsedItems(mappedItems);
                      } catch (error) {
                        console.error("Error parsing order:", error);
                        alert("Could not parse the order. Please try again or enter manually.");
                      }
                    }}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
                  >
                    Parse Order
                  </button>
                </div>
              </div>
              {parsedItems.length > 0 && (
                <div className="border p-3 rounded bg-gray-50">
                  <h3 className="text-sm font-semibold mb-2">Parsed Items:</h3>
                  <ul className="text-sm">
                    {parsedItems.map((item, index) => (
                      <li key={index} className="flex justify-between mb-1">
                        <span>
                          {item.quantity} {item.unit}x {item.item} ({item.brand})
                        </span>
                        <span>₹{item.rate * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-right text-sm font-semibold">
                    Total: ₹{calculateTotal(parsedItems)}
                  </div>
                </div>
              )}
              <button
                onClick={handleAddNewOrder}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flex container for Upcoming Orders and Payment Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Upcoming Orders Section */}
        <section
          className="bg-blue-800 p-4 rounded-lg shadow-md flex-1"
        >
          <h2 className="text-xl font-semibold text-white mb-2">Upcoming Orders</h2>
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: "400px", // Set a fixed height for the section
            }}
          >
            <div className="grid grid-cols-3 gap-4">
              {upcomingOrders.length === 0 ? (
                <p className="text-gray-300">No upcoming orders.</p>
              ) : (
                sortedUpcomingOrders.map((order) => renderOrderCard(order))
              )}
            </div>
          </div>
        </section>

        {/* Payment Section */}
        <section
          className="bg-blue-800 p-4 rounded-lg shadow-md flex-1"
        >
          <h2 className="text-xl font-semibold text-white mb-2">Payment Section</h2>
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: "400px", // Set a fixed height for the section
            }}
          >
            <div className="grid grid-cols-3 gap-4">
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
      <section className="bg-blue-800 p-4 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-white mb-2">Transaction History</h2>
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: "400px", // Set a fixed height for the section
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