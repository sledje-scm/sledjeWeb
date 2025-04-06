// Assuming you're using React with Tailwind CSS and Lucide Icons
import { Trash, Trash2 } from "lucide-react";
import { useState } from "react";

const ReadyToOrder = ({ readyOrders, setReadyOrders, placeOrder, placeAllOrders }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (distributor) => {
    setExpanded((prev) => ({ ...prev, [distributor]: !prev[distributor] }));
  };

  const removeItem = (distributor, itemId) => {
    setReadyOrders((prev) => {
      const updated = { ...prev };
      updated[distributor] = updated[distributor].filter((item) => item.id !== itemId);
      if (updated[distributor].length === 0) delete updated[distributor];
      return updated;
    });
  };

  const deleteDistributorCard = (distributor) => {
    if (window.confirm("Delete all items from this distributor?")) {
      setReadyOrders((prev) => {
        const updated = { ...prev };
        delete updated[distributor];
        return updated;
      });
    }
  };

  const confirmOrderAll = () => {
    if (window.confirm("Are you sure you want to place all orders?")) {
      placeAllOrders();
    }
  };

  const updateQuantity = (distributor, itemId, qty) => {
    setReadyOrders((prev) => {
      const updated = { ...prev };
      updated[distributor] = updated[distributor].map((item) =>
        item.id === itemId ? { ...item, quantity: qty, price: qty * item.rate } : item
      );
      return updated;
    });
  };

  if (Object.keys(readyOrders).length === 0) {
    return <div className="text-center text-gray-500 text-lg p-4">No current order</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {Object.entries(readyOrders).map(([distributor, items]) => {
        const total = items.reduce((sum, item) => sum + item.price, 0);
        const visibleItems = expanded[distributor] ? items : items.slice(0, 3);

        return (
          <div key={distributor} className="border rounded-2xl p-4 shadow bg-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{distributor}</h2>
              <Trash
                className="w-6 h-6 text-red-600 cursor-pointer"
                onClick={() => deleteDistributorCard(distributor)}
              />
            </div>
            <div className="mt-2 space-y-2">
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="w-1/4">{item.name}</div>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(distributor, item.id, parseInt(e.target.value))}
                    className="w-16 border px-2 py-1 rounded"
                  />
                  <div>₹{item.rate}</div>
                  <div>₹{item.price}</div>
                  <Trash2
                    className="w-4 h-4 text-red-500 cursor-pointer"
                    onClick={() => removeItem(distributor, item.id)}
                  />
                </div>
              ))}
              {items.length > 3 && (
                <button
                  className="text-blue-500 text-sm mt-2"
                  onClick={() => toggleExpand(distributor)}
                >
                  {expanded[distributor] ? "View Less" : "View More"}
                </button>
              )}
              <div className="text-right font-semibold mt-2">Total: ₹{total}</div>
              <div className="flex justify-between mt-3">
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded"
                  onClick={() => placeOrder(distributor)}
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="text-center">
        <button
          onClick={confirmOrderAll}
          className="bg-blue-600 text-white px-6 py-2 mt-4 rounded shadow"
        >
          Order All
        </button>
      </div>
    </div>
  );
};

export default ReadyToOrder;
