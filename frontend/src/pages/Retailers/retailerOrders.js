import React, { useState, useEffect } from "react";
import { Trash, Trash2, Check, CircleCheck } from "lucide-react";

const RetailerOrders = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingOrders, setPendingOrders] = useState([
    { id: 1, item: "Aashirvaad Atta", quantity: 10, rate: 300, checked: false, distributor: "Hindustan Distributors" },
    { id: 2, item: "Tata Salt", quantity: 5, rate: 20, checked: false, distributor: "Bharat Traders" },
    { id: 3, item: "Fortune Sunflower Oil", quantity: 2, rate: 150, checked: false, distributor: "Agro India Supplies" },
    { id: 4, item: "Amul Butter", quantity: 4, rate: 50, checked: false, distributor: "Dairy Fresh Distributors" },
  ]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [onWayOrders, setOnWayOrders] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([
    { id: 1, item: "Basmati Rice", quantity: 3, rate: 120 },
    { id: 2, item: "Madhur Sugar", quantity: 2, rate: 45 },
    { id: 3, item: "Everest Chilli Powder", quantity: 1, rate: 90 },
    { id: 4, item: "Rajdhani Besan", quantity: 5, rate: 60 },
  ]);
  const [expandedDistributors, setExpandedDistributors] = useState({});
  const [showOrderPlacedModal, setShowOrderPlacedModal] = useState(false);

  const toggleExpand = (dist) => {
    setExpandedDistributors((prev) => ({
      ...prev,
      [dist]: !prev[dist],
    }));
  };

  const handleCheckboxChange = (id) => {
    setPendingOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, checked: !order.checked } : order
      )
    );
  };
  const [selectAll, setSelectAll] = useState(true);

// Whenever selectAll changes, update all checkboxes
useEffect(() => {
  setPendingOrders((prevOrders) =>
    prevOrders.map((order) => ({
      ...order,
      checked: selectAll,
    }))
  );
}, [selectAll]);

const handleSelectAllChange = () => {
  setSelectAll((prev) => !prev);
};


  const handleSelectAll = (checked) => {
    setPendingOrders((prev) =>
      prev.map((order) => ({ ...order, checked }))
    );
  };

  const handleQuantityChange = (id, quantity) => {
    setPendingOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, quantity: parseInt(quantity) || 0 } : order
      )
    );
  };

  const calculatePrice = (quantity, rate) => quantity * rate;

  const selectedOrders = pendingOrders.filter((order) => order.checked);
  const finalPrice = selectedOrders.reduce(
    (sum, order) => sum + calculatePrice(order.quantity, order.rate),
    0
  );

  const proceedOrders = () => {
    const toMove = pendingOrders.filter((order) => order.checked);
    setReadyOrders((prev) => [...prev, ...toMove.map(o => ({ ...o, checked: false }))]);
    setPendingOrders((prev) => prev.filter((order) => !order.checked));
    setActiveTab("ready");
  };

  const groupByDistributor = (orders) => {
    return orders.reduce((acc, order) => {
      acc[order.distributor] = acc[order.distributor] || [];
      acc[order.distributor].push(order);
      return acc;
    }, {});
  };

  const deleteItemFromDistributor = (distributor, itemId) => {
    setReadyOrders((prev) =>
      prev.filter(order => !(order.distributor === distributor && order.id === itemId))
    );
  };

  const deleteDistributor = (distributor) => {
    setReadyOrders((prev) =>
      prev.filter(order => order.distributor !== distributor)
    );
  };

  const placeDistributorOrder = (distributor) => {
    const distributorOrders = readyOrders.filter(o => o.distributor === distributor);
    setOnWayOrders(prev => [...prev, ...distributorOrders]);
    deleteDistributor(distributor);
  };

  const placeAllOrders = () => {
    if (readyOrders.length === 0) {
      alert("No orders are ready to be placed.");
      return;
    }
    console.log("Placing all orders:", readyOrders);
    setOnWayOrders((prev) => [...prev, ...readyOrders]);
    setReadyOrders([]);
    setShowOrderPlacedModal(true); // Show the modal after placing orders
  };

  const closeOrderPlacedModal = () => {
    setShowOrderPlacedModal(false);
    setActiveTab("pending"); // Redirect back to the "Pending" tab
  };

  const TabButton = ({ tabId, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className="flex-1 text-center px-4 py-2 font-medium transition relative"
    >
      <span
        className={`${
          activeTab === tabId
            ? "text-blue-800 font-semibold"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        {label}
      </span>
      {/* Underline */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 rounded-full transition-all duration-700 ${
          activeTab === tabId ? "bg-blue-600" : "bg-transparent"
        }`}
      />
    </button>
  );
  

  return (
  
  <div className="bg-white-800 min-h-screen p-6 flex flex-wrap gap-6 overflow-hidden">
    {/* Main Section */}
    <div className="flex-1">
      {/* Tabs */}
      <div className="flex w-full gap-4 mb-6 border-b border-blue-600">
        <TabButton tabId="pending" label="Pending" />
        {readyOrders.length > 0 && <TabButton tabId="ready" label="Ready" />}
      </div>

      {/* Active Tab Content */}
      {activeTab === "pending" && (
        <>
          {/* Orders Table */}
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <table className="min-w-full border border-gray-300 text-left">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-5">
                    <input
                      className="w-4 h-4"
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </th>
                  <th className="p-5 text-blue-800 font-semibold">Product</th>
                  <th className="p-5 text-blue-800 font-semibold">Details</th>
                  <th className="p-5 text-blue-800 font-semibold">Rate</th>
                  <th className="p-5 text-blue-800 font-semibold">Quantity</th>
                  <th className="p-5 text-blue-800 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No pending orders in the list
                    </td>
                  </tr>
                ) : (
                  pendingOrders.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={order.checked}
                          onChange={() => handleCheckboxChange(order.id)}
                        />
                      </td>
                      <td className="p-3">
                        <p className="font-semibold">{order.item}</p>
                        <p className="text-sm text-gray-500">
                          Distributor: {order.distributor}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="text-sm text-gray-600">High-quality product</p>
                      </td>
                      <td className="p-3">₹{order.rate}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          className="w-16 px-2 py-1 border rounded"
                          value={order.quantity}
                          onChange={(e) =>
                            handleQuantityChange(order.id, e.target.value)
                          }
                        />
                      </td>
                      <td className="p-3">₹{order.quantity * order.rate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Proceed to Checkout Section */}
          <div className="text-center mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Checkout ({selectedOrders.length} items): ₹{finalPrice}
            </h2>
            <button
              onClick={proceedOrders} // Switches to Ready Tab
              className="bg-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-xl hover:bg-blue-700"
            >
              Proceed
            </button>
          </div>
        </>
      )}

      {activeTab === "ready" && (
        <>
          {/* Ready Orders Section */}
          {readyOrders.length === 0 ? (
            <p className="text-gray-300 text-center py-6">No ready orders</p>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Only one step to bring in
              </h2>
              {Object.entries(groupByDistributor(readyOrders)).map(
                ([distributor, items]) => {
                  const showAll = expandedDistributors[distributor];
                  const displayItems = showAll ? items : items.slice(0, 3);
                  const total = items.reduce(
                    (acc, o) => acc + o.quantity * o.rate,
                    0
                  );

                  return (
                    <div
                      key={distributor}
                      className="border rounded-xl shadow p-4 mb-6 bg-white"
                    >
                      {/* Distributor Header */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-blue-800">
                          {distributor}
                        </h3>
                        <button
                          onClick={() => deleteDistributor(distributor)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={20} color="black" />
                        </button>
                      </div>

                      {/* Product List */}
                      <ul className="space-y-3">
                        {displayItems.map((item) => (
                          <li
                            key={item.id}
                            className="flex justify-between items-start border-b pb-2 last:border-none"
                          >
                            <div>
                              <p className="font-medium text-blue-800">
                                {item.item}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}, Rate: ₹{item.rate}, Price:
                                ₹{item.quantity * item.rate}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                deleteItemFromDistributor(distributor, item.id)
                              }
                              className="text-red-500 hover:text-red-700 mt-1"
                            >
                              <Trash size={16} color="gray"/>
                            </button>
                          </li>
                        ))}
                      </ul>

                      {/* View More / Less */}
                      {items.length > 3 && (
                        <button
                          onClick={() => toggleExpand(distributor)}
                          className="text-blue-600 text-sm mt-2"
                        >
                          {showAll ? "View Less" : "View More"}
                        </button>
                      )}

                      {/* Bottom section */}
                      <div className="flex justify-between items-center mt-4">
                        <p className="font-semibold text-blue-800">
                          Final Value: ₹{total}
                        </p>
                        <button
                          onClick={() => placeDistributorOrder(distributor)}
                          className="bg-blue-700 text-white px-4 py-2 hover:bg-blue-900"
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  );
                }
              )}

              <div className="flex justify-end">
                <button
                  onClick={placeAllOrders}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Place All Orders
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>

    {/* Right Sidebar */}
    <div className="w-full md:w-1/4 flex flex-col gap-6">
      {/* Conditionally Render Checkout Area */}
      {readyOrders.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          {/* Free Delivery Message */}
          <div className="flex items-center gap-2 mb-4">
            <Check className="w-6 h-6 text-green-600" />
            <p className="text-green-600 font-medium">
              Your order is eligible for free delivery under{" "}
              <span className="font-semibold">Sledge Delivery Solutions</span>
            </p>
          </div>

          {/* Proceed to Checkout Section */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-blue-800 mb-4">
              Proceed to Checkout ({readyOrders.length} items): ₹
              {readyOrders.reduce(
                (sum, order) => sum + order.quantity * order.rate,
                0
              )}
            </h2>
            <button
              onClick={placeAllOrders}
              className="bg-blue-600 text-white px-6 py-2 text-lg font-semibold rounded-lg hover:bg-blue-700"
            >
              Place All Orders
            </button>
          </div>
        </div>
      )}

    {/* Orders on Way Section */}
    <div
      className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
        onWayOrders.length === 0
          ? "bg-blue-600"
          : onWayOrders.length <= 3
          ? "bg-blue-600"
          : onWayOrders.length <= 6
          ? "bg-blue-600"
          : "bg-blue-600"
      }`}
      style={{
        height: "300px", // Fixed height for the section
        overflowY: "auto", // Enable vertical scrolling
      }}
    >
      <h3 className="text-lg font-semibold text-white mb-2 text-center">
        Orders on Way
      </h3>
      {onWayOrders.length === 0 ? (
        <p className="text-gray-300 text-center">No orders on the way.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {onWayOrders.map((order, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h4 className="font-semibold text-blue-800">
                {order.item}
              </h4>
              <p className="text-sm text-gray-600">
                Quantity: {order.quantity} | Rate: ₹{order.rate}
              </p>
              <p className="text-sm text-gray-600">
                Total: ₹{order.quantity * order.rate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Suggested Items Section */}
    <div
      className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
        suggestedItems.length === 0
          ? "bg-gray-200"
          : suggestedItems.length <= 3
          ? "bg-blue-200"
          : suggestedItems.length <= 6
          ? "bg-blue-400"
          : "bg-blue-600"
      }`}
      style={{
        height: "300px", // Fixed height for the section
        overflowY: "auto", // Enable vertical scrolling
      }}
    >
      <h3 className="text-lg font-semibold text-white mb-2 text-center">
        Suggested Items (Low on Stock)
      </h3>
      {suggestedItems.length === 0 ? (
        <p className="text-gray-300 text-center">No low-stock items.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {suggestedItems.map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h4 className="font-semibold text-blue-800">
                {item.item}
              </h4>
              <p className="text-sm text-gray-600">
                Quantity: {item.quantity} | Rate: ₹{item.rate}
              </p>
              <p className="text-sm text-gray-600">
                Total: ₹{item.quantity * item.rate}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Order Placed Modal */}
  {showOrderPlacedModal && (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <CircleCheck className="w-16 h-16 mx-auto mb-4 text-green-400" />
        <h2 className="text-3xl font-bold mb-4">Order Placed!</h2>
        <p className="text-lg mb-6">Your order has been successfully placed.</p>
        <button
          onClick={closeOrderPlacedModal}
          className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100"
        >
          OK
        </button>
      </div>
    </div>
  )}
</div>
  );
};

export default RetailerOrders;
