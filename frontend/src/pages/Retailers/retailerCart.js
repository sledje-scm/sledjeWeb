import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Minus, 
  X, 
  ShoppingCart, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Info,
  Clock,
  DollarSign,
  Calculator,
  Store
} from "lucide-react";
import API from "../../api";

export default function RetailerCart({
  showCart,
  setShowCart,
  cartItems,
  groupCartByDistributor,
  updateCartItemQuantity,
  removeFromCart,
  distributorInfo,
  onOrderPlaced,
}) {
  const [selectedDistributors, setSelectedDistributors] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedDistributors, setExpandedDistributors] = useState({});
  const [editingUnit, setEditingUnit] = useState({});
  const [orderNotes, setOrderNotes] = useState({});
  const [deliveryDates, setDeliveryDates] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [animatingItems, setAnimatingItems] = useState({});

  const groupedByDistributor = cartItems.reduce((acc, item) => {
    if (!acc[item.distributorId]) acc[item.distributorId] = [];
    acc[item.distributorId].push(item);
    return acc;
  }, {});

  // Initialize all distributors as expanded and selected on mount
  useEffect(() => {
    const distributorIds = Object.keys(groupedByDistributor);

    let needUpdateExpanded = false;
    let needUpdateSelected = false;

    setExpandedDistributors(prev => {
      const next = { ...prev };
      distributorIds.forEach(id => {
        if (!(id in next)) {
          next[id] = true;
          needUpdateExpanded = true;
        }
      });
      return needUpdateExpanded ? next : prev;
    });

    setSelectedDistributors(prev => {
      const next = { ...prev };
      distributorIds.forEach(id => {
        if (!(id in next)) {
          next[id] = true;
          needUpdateSelected = true;
        }
      });
      return needUpdateSelected ? next : prev;
    });
    // eslint-disable-next-line
  }, [cartItems]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      for (const [distributorId, items] of Object.entries(groupedByDistributor)) {
        if (selectedDistributors[distributorId] === false) continue;
        await API.post("/orders/create", {
          distributorId,
          items: items.map(i => ({
            productId: i.productId,
            variantId: i.variantId,
            sku: i.sku,
            quantity: i.quantity,
            unit: i.unit || "box"
          })),
          notes: orderNotes[distributorId],
          expectedDelivery: deliveryDates[distributorId]
        });
      }
      setShowCart(false);
      if (onOrderPlaced) {
      const selectedDistributorIds = Object.entries(selectedDistributors)
     .filter(([_, selected]) => selected)
     .map(([id]) => id);
      onOrderPlaced(selectedDistributorIds); // pass selected distributor IDs
    }

      
      // Success animation
      const successNotification = document.createElement('div');
      successNotification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3';
      successNotification.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="font-semibold">Order(s) placed successfully!</span>';
      document.body.appendChild(successNotification);
      setTimeout(() => document.body.removeChild(successNotification), 3000);
    } catch {
      alert("Failed to place order. Try again.");
    }
    setLoading(false);
  };

  const handleRemoveItem = (itemId) => {
    setAnimatingItems({ ...animatingItems, [itemId]: true });
    setTimeout(() => {
      removeFromCart(itemId);
      setAnimatingItems(prev => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }, 300);
  };

  const updateItemUnit = (itemId, unit) => {
    // Update the cart item with new unit
    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { ...item, unit } : item
    );
    // You'll need to pass this update back to parent component
    // For now, we'll just update locally
    setEditingUnit({ ...editingUnit, [itemId]: unit });
  };

  const getSelectedTotal = () => {
    return Object.entries(groupedByDistributor).reduce((total, [distributorId, items]) => {
      if (selectedDistributors[distributorId] === false) return total;
      return total + items.reduce((sum, item) => sum + item.totalPrice, 0);
    }, 0);
  };

  const getSelectedItemsCount = () => {
    return Object.entries(groupedByDistributor).reduce((count, [distributorId, items]) => {
      if (selectedDistributors[distributorId] === false) return count;
      return count + items.length;
    }, 0);
  };

  const toggleDistributor = (distributorId) => {
    setExpandedDistributors(prev => ({
      ...prev,
      [distributorId]: !prev[distributorId]
    }));
  };

  const toggleSelectAll = () => {
    const allSelected = Object.keys(groupedByDistributor).every(
      id => selectedDistributors[id] !== false
    );
    const newSelection = {};
    Object.keys(groupedByDistributor).forEach(id => {
      newSelection[id] = !allSelected;
    });
    setSelectedDistributors(newSelection);
  };

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <ShoppingCart className="w-8 h-8" />
                Your Shopping Cart
              </h2>
              <p className="text-blue-100">
                {cartItems.length} items from {Object.keys(groupedByDistributor).length} distributors
              </p>
            </div>
            <button 
              onClick={() => setShowCart(false)} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Package className="w-4 h-4" />
                Total Items
              </div>
              <p className="text-2xl font-bold mt-1">{cartItems.length}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Store className="w-4 h-4" />
                Distributors
              </div>
              <p className="text-2xl font-bold mt-1">{Object.keys(groupedByDistributor).length}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Calculator className="w-4 h-4" />
                Total Value
              </div>
              <p className="text-2xl font-bold mt-1">₹{getSelectedTotal().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 px-6 py-3 border-b flex items-center justify-between">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            {Object.keys(groupedByDistributor).every(id => selectedDistributors[id] !== false)
              ? "Deselect All"
              : "Select All"}
          </button>
          
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Info className="w-4 h-4" />
            {showSummary ? "Hide Summary" : "Show Summary"}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
              <p className="text-xl font-semibold text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-gray-400">Add items from your inventory to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Order Summary (collapsible) */}
              {showSummary && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Order Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Selected Items</p>
                      <p className="text-xl font-bold text-gray-900">{getSelectedItemsCount()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">₹{getSelectedTotal().toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. per Item</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{getSelectedItemsCount() > 0 ? Math.round(getSelectedTotal() / getSelectedItemsCount()).toLocaleString() : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Orders to Place</p>
                      <p className="text-xl font-bold text-gray-900">
                        {Object.entries(selectedDistributors).filter(([_, selected]) => selected).length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Distributor Groups */}
              {Object.entries(groupedByDistributor).map(([distributorId, items]) => {
                const isExpanded = expandedDistributors[distributorId];
                const isSelected = selectedDistributors[distributorId] !== false;
                const distributorTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
                
                return (
                  <div 
                    key={distributorId} 
                    className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 ${
                      isSelected ? 'border-blue-200' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    {/* Distributor Header */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) =>
                              setSelectedDistributors(prev => ({
                                ...prev,
                                [distributorId]: e.target.checked
                              }))
                            }
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <button
                            onClick={() => toggleDistributor(distributorId)}
                            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                          >
                            {isExpanded ? 
                              <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                              <ChevronRight className="w-5 h-5 text-gray-500" />
                            }
                            <div className="flex items-center gap-2">
                              <Store className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold text-lg text-gray-800">
                                {distributorInfo?.[distributorId]?.ownerName || "Distributor"}
                              </span>
                            </div>
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-xl font-bold text-gray-900">₹{distributorTotal.toLocaleString()}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {items.length} items
                          </span>
                        </div>
                      </div>
                      
                      {/* Distributor Meta Info */}
                      {distributorInfo?.[distributorId] && (
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                          {distributorInfo[distributorId].ownerName && (
                            <span className="flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              Owner: {distributorInfo[distributorId].ownerName}
                            </span>
                          )}
                          {distributorInfo[distributorId].phone && (
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              Contact: {distributorInfo[distributorId].phone}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Items List */}
                    {isExpanded && (
                      <div className="p-4 space-y-3">
                        {items.map(item => (
                          <div 
                            key={item.id} 
                            className={`bg-gray-50 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 ${
                              animatingItems[item.id] ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                            }`}
                          >
                            {/* Product Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                              {item.productIcon}
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg">{item.productName}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.variantName} • SKU: {item.sku || 'N/A'}
                              </p>
                              
                              {/* Quantity and Unit Controls */}
                              <div className="mt-3 flex items-center gap-4">
                                <div className="flex items-center bg-white rounded-lg border">
                                  <button 
                                    onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))} 
                                    className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                                    disabled={!isSelected}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => updateCartItemQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-16 text-center font-medium border-x"
                                    disabled={!isSelected}
                                  />
                                  <button 
                                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} 
                                    className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                                    disabled={!isSelected}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                {/* Unit Selector */}
                                <select
                                  value={editingUnit[item.id] || item.unit || "box"}
                                  onChange={(e) => updateItemUnit(item.id, e.target.value)}
                                  className="px-3 py-2 bg-white border rounded-lg text-sm font-medium"
                                  disabled={!isSelected}
                                >
                                  <option value="box">Box</option>
                                  <option value="piece">Piece</option>
                                  <option value="pack">Pack</option>
                                  <option value="carton">Carton</option>
                                  <option value="dozen">Dozen</option>
                                </select>
                              </div>
                            </div>
                            
                            {/* Price and Actions */}
                            <div className="text-right">
                              <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                              <p className="text-xl font-bold text-gray-900 mt-1">
                                ₹{item.totalPrice.toLocaleString()}
                              </p>
                              <button 
                                onClick={() => handleRemoveItem(item.id)} 
                                className="mt-2 text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Additional Options */}
                        <div className="mt-4 space-y-3">
                          {/* Delivery Date */}
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <label className="text-sm font-medium text-gray-700">Expected Delivery:</label>
                            <input
                              type="date"
                              value={deliveryDates[distributorId] || ''}
                              onChange={(e) => setDeliveryDates(prev => ({
                                ...prev,
                                [distributorId]: e.target.value
                              }))}
                              className="px-3 py-1.5 border rounded-lg text-sm"
                              disabled={!isSelected}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          
                          {/* Order Notes */}
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-gray-400 mt-1" />
                            <div className="flex-1">
                              <label className="text-sm font-medium text-gray-700">Order Notes:</label>
                              <textarea
                                value={orderNotes[distributorId] || ''}
                                onChange={(e) => setOrderNotes(prev => ({
                                  ...prev,
                                  [distributorId]: e.target.value
                                }))}
                                placeholder="Add special instructions or notes..."
                                className="mt-1 w-full px-3 py-2 border rounded-lg text-sm resize-none"
                                rows={2}
                                disabled={!isSelected}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        {cartItems.length > 0 && (
          <div className="bg-white border-t-2 border-gray-100 p-6 rounded-b-3xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Total Summary */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Selected Items</p>
                  <p className="text-xl font-bold text-gray-900">{getSelectedItemsCount()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">₹{getSelectedTotal().toLocaleString()}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm text-gray-500">Orders to Place</p>
                  <p className="text-xl font-bold text-gray-900">
                    {Object.entries(selectedDistributors).filter(([_, selected]) => selected).length}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCart(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading || getSelectedItemsCount() === 0}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Placing Orders...
                    </>
                  ) : (
                    <>
                      <Truck className="w-5 h-5" />
                      Place Order{Object.entries(selectedDistributors).filter(([_, selected]) => selected).length > 1 ? 's' : ''}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
