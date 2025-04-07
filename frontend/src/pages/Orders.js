import React, { useState, useEffect } from "react";
import { Trash, Trash2 } from "lucide-react";
const Orders = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingOrders, setPendingOrders] = useState([
    { id: 1, item: "Product A", quantity: 2, rate: 100, checked: false, distributor: "Distributor A" },
    { id: 2, item: "Product B", quantity: 1, rate: 150, checked: false, distributor: "Distributor B" },
    { id: 3, item: "Product C", quantity: 3, rate: 80, checked: false, distributor: "Distributor A" },
    { id: 4, item: "Product D", quantity: 2, rate: 90, checked: false, distributor: "Distributor A" },
  ]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [onWayOrders, setOnWayOrders] = useState([]);
  const [completedOrders] = useState([]);
  const [expandedDistributors, setExpandedDistributors] = useState({});

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
    setOnWayOrders(prev => [...prev, ...readyOrders]);
    setReadyOrders([]);
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
    <div className="bg-white min-h-screen p-6">
      {/* <h1 className="text-3xl font-bold mb-6">Orders Dashboard</h1> */}

      {/* Tabs */}
      <div className="flex w-full gap-4 mb-6 border-b">
        <TabButton tabId="pending" label="Pending" />
        <TabButton tabId="ready" label="Ready " />
        <TabButton tabId="onWay" label="Orders on Way" />
      </div>

      {activeTab === "pending" && (
        <>
          {/* <h2 className="text-2xl font-semibold mb-4">Pending Orders</h2> */}
          <div className="overflow-auto">
          <table className="min-w-full border border-gray-300 text-left">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-5">
        <input
          className="w-4 h-4"
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAllChange}
        />
      </th>
      <th className="p-5">Item</th>
      <th className="p-5">Rate</th>
      <th className="p-5">Quantity</th>
      <th className="p-5">Total:</th>
    </tr>
  </thead>
  <tbody>
  {pendingOrders.length === 0 ? (
    <tr>
      <td colSpan="5" className="text-center py-6 text-gray-500">
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
        <td className="p-3">{order.item}</td>
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

          <div className="flex flex-col md:flex-row justify-between items-center mt-10 md:px-8">
  <p className="text-3xl font-semibold md:mx-auto md:ml-[60%]">
    Final Value: <span className="ml-2"> </span>₹{finalPrice}
  </p>
  <button
    onClick={proceedOrders}
    className="bg-blue-800 text-white px-8 py-3 text-lg font-semibold rounded-xl hover:bg-blue-900 mt-4 md:mt-0 md:ml-auto md:mr-10"
  >
    Proceed
  </button>
</div>
        </>
      )}

{activeTab === "ready" && (
  <>
    

    {readyOrders.length === 0 ? (
      <p className="text-gray-500 text-center py-6">No ready orders</p>
    ) : (
      <>
        <h2 className="text-2xl font-semibold mb-4">Only one step to bring in</h2>
        {Object.entries(groupByDistributor(readyOrders)).map(
          ([distributor, items]) => {
            const showAll = expandedDistributors[distributor];
            const displayItems = showAll ? items : items.slice(0, 3);
            const total = items.reduce((acc, o) => acc + o.quantity * o.rate, 0);

            return (
              <div
                key={distributor}
                className="border rounded-xl shadow p-4 mb-6 bg-white"
              >
                {/* Distributor Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{distributor}</h3>
                  <button
                    onClick={() => deleteDistributor(distributor)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
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
                        <p className="font-medium">{item.item}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}, Rate: ₹{item.rate}, Price: ₹
                          {item.quantity * item.rate}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          deleteItemFromDistributor(distributor, item.id)
                        }
                        className="text-red-500 hover:text-red-700 mt-1"
                      >
                        <Trash size={16} />
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
                  <p className="font-semibold text-gray-800">
                    Final Value: ₹{total}
                  </p>
                  <button
                    onClick={() => placeDistributorOrder(distributor)}
                    className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
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
            className="bg-blue-700 text-white px-6 py-2 rounded-full hover:bg-blue-800"
          >
            Order All
          </button>
        </div>
      </>
    )}
  </>
)}
      {activeTab === "onWay" && (
        <>
          
          {onWayOrders.length === 0 ? (
  <p className="text-gray-500 text-center py-6">No orders on the way</p>
) : (<div>
  <h2 className="text-2xl font-semibold mb-4">Coming to you, soon</h2>
          <ul className="space-y-2 mt-4">
            {onWayOrders.map((order, i) => (
              <li key={i} className="p-4 bg-white rounded-xl shadow border">
                <p className="font-semibold">{order.item}</p>
                <p className="text-sm text-gray-600">
                  Qty: {order.quantity} | Rate: ₹{order.rate} | Price: ₹
                  {order.quantity * order.rate} | From: {order.distributor}
                </p>
              </li>
            ))}
          </ul></div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
