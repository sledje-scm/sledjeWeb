import React, { useState, useEffect } from 'react';
import API from "../../api";
import {
  ShoppingCart, Clock, CheckCircle, XCircle, AlertTriangle, Eye, Plus, Filter, Search, Bell,
  Package, Calendar, DollarSign, ArrowRight, RefreshCw, FileText, X, Check, Edit, Truck,
  User, Phone, Mail, MapPin, ArrowLeft, Trash2, Save, Download, Upload, MessageSquare,
  History, Settings, AlertCircle
} from 'lucide-react';

const RetailerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, tSelectedOrderse] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [distributors, setDistributors] = useState([]);
  const [products, setProducts] = useState([]);
  const [createOrderData, setCreateOrderData] = useState({
    distributorId: '',
    items: [],
    notes: ''
  });
  const [sixDigitCode, setSixDigitCode] = useState('');
  const [showCodePrompt, setShowCodePrompt] = useState(false);

  // Fetch orders and notifications from backend
  useEffect(() => {
    fetchOrders();
    fetchNotifications();
    fetchDistributors();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('orders/retailer/orders');
      setOrders(res.data.data || []);
      console.log("Fetched orders:", res.data.data);
    } catch (e) {
      setOrders([]);
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.data.notifications || []);
    } catch (e) {
      setNotifications([]);
    }
  };

  const fetchDistributors = async () => {
    // Replace with your actual API endpoint for distributors
    try {
      const res = await API.get('orders/distributors');
      setDistributors(res.data.data || []);
    } catch {
      setDistributors([]);
    }
  };

  const fetchProducts = async () => {
    // Replace with your actual API endpoint for products
    try {
      const res = await API.get('orders/products');
      setProducts(res.data.data || []);
    } catch {
      setProducts([]);
    }
  };

  // Create order
  const handleCreateOrder = async () => {
    if (!createOrderData.distributorId || createOrderData.items.length === 0) {
      alert("Please select distributor and add at least one product.");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('orders/create', createOrderData);
      setShowCreateOrder(false);
      setCreateOrderData({ distributorId: '', items: [], notes: '' });
      fetchOrders();
      // Show 6-digit code to retailer
      if (res.data.data && res.data.data.sixDigitCode) {
        setSixDigitCode(res.data.data.sixDigitCode);
        setShowCodePrompt(true);
      }
    } catch (e) {
      alert(e.response?.data?.message || "Failed to create order");
    }
    setLoading(false);
  };

  

  // Complete order (distributor enters code, retailer confirms)
  const handleCompleteOrder = async (orderId) => {
    const code = prompt("Enter the 6-digit code provided by the distributor to complete the order:");
    if (!code || code.length !== 6) {
      alert("Invalid code.");
      return;
    }
    setLoading(true);
    try {orderId
      // Backend should verify code and mark order as completed
      await API.put(`/orders/retailer/orders/${orderId}/complete`, { code });
      // Update inventory after order is fulfilled
      await API.post('/inventory/checkout', { orderId });
      fetchOrders();
      alert("Order completed and inventory updated!");
    } catch (e) {
      alert(e.response?.data?.message || "Failed to complete order");
    }
    setLoading(false);
  };

  // Cancel order
  const handleCancelOrder = async (orderId, reason) => {
    if (!reason) return;
    setLoading(true);
    try {
      await API.put(`/orders/retailer/orders/${orderId}/cancel`, { reason });
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to cancel order");
    }
    setLoading(false);
  };

  // Approve modified order
  const handleApproveModifiedOrder = async (orderId, approved) => {
    setLoading(true);
    try {
      await API.put(`/orders/retailer/orders/${orderId}/approve`, { approved });
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update order");
    }
    setLoading(false);
  };
    // ...inside RetailerOrders component
  
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    // Handler to close modal when clicking outside the modal content
    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        setShowOrderDetails(false);
      }
    };

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleOverlayClick}
      >
        <div
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          // Prevent click inside modal from closing
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedOrder.orderNumber}</h2>
                  <p className="text-sm text-gray-500">{selectedOrder.distributor?.businessName || selectedOrder.distributorId}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                {getStatusIcon(selectedOrder.status)}
                <span className="capitalize">{selectedOrder.status}</span>
              </div>
            </div>
          </div>
  
          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Items</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{selectedOrder.itemCount || (selectedOrder.items || []).length}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Total Amount</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{selectedOrder.totalAmount?.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Order Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
            </div>
  
            {/* Modifications Alert */}
            {selectedOrder.status === 'modified' && (selectedOrder.modifications || []).length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Order Modifications</h3>
                </div>
                <div className="space-y-2">
                  {(selectedOrder.modifications || []).map((mod, index) => (
                    <div key={index} className="bg-white rounded p-3">
                      <p className="text-sm text-gray-900"><strong>{mod.item}:</strong> {mod.reason}</p>
                      {mod.originalQty && mod.newQty && (
                        <p className="text-xs text-gray-600 mt-1">
                          Quantity: {mod.originalQty} → {mod.newQty}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-3 mt-4">
                  <button 
                    onClick={() => handleApproveModifiedOrder(selectedOrder.id, true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept Modifications</span>
                  </button>
                  <button 
                    onClick={() => handleApproveModifiedOrder(selectedOrder.id, false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Order</span>
                  </button>
                </div>
              </div>
            )}
  
            {/* Pending Actions */}
            {selectedOrder.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Pending Approval</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-4">
                  This order is waiting for your approval. Review the details and accept or reject.
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleApproveModifiedOrder(selectedOrder.id, true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept Order</span>
                  </button>
                  <button 
                    onClick={() => handleApproveModifiedOrder(selectedOrder.id, false)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Order</span>
                  </button>
                </div>
              </div>
            )}
  
            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(selectedOrder.items || []).map(item => (
                      <tr key={item.id || item.sku} className="bg-white">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.name || item.productName}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.category || item.variantName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">₹{item.price?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ₹{(item.quantity * item.price)?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
  
            {/* Contact & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distributor Contact</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">{selectedOrder.distributor?.ownerName || '-'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">{selectedOrder.distributor?.phone || '-'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">{selectedOrder.distributor?.email || '-'}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div className="text-sm text-gray-900">
                      <p>{selectedOrder.shippingAddress?.street || '-'}</p>
                      <p>{selectedOrder.shippingAddress?.city || ''} {selectedOrder.shippingAddress?.state || ''}</p>
                      <p>{selectedOrder.shippingAddress?.pincode || ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Order History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
              <div className="space-y-3">
                {(selectedOrder.orderHistory || []).map((entry, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{entry.action}</p>
                      <p className="text-xs text-gray-500">
                        {entry.date ? new Date(entry.date).toLocaleString() : ""} • {entry.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Notes */}
            {selectedOrder.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{selectedOrder.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getStatusIcon = (status) => {
    const iconProps = { size: 20 };
    switch (status) {
      case 'pending':
        return <Clock {...iconProps} className="text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle {...iconProps} className="text-blue-500" />;
      case 'shipped':
        return <Truck {...iconProps} className="text-purple-500" />;
      case 'delivered':
        return <Package {...iconProps} className="text-green-500" />;
      case 'cancelled':
        return <XCircle {...iconProps} className="text-red-500" />;
      case 'modified':
        return <Edit {...iconProps} className="text-orange-500" />;
      default:
        return <Clock {...iconProps} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'modified':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const OrderCard = ({ order }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">{order.distributor?.businessName || order.distributorId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border`}>
            <span className="capitalize">{order.status}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gtSelectedOrderray-600">{order.itemCount || (order.items ? order.items.length : 0)} items</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">₹{order.totalAmount?.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={async () => {
            const res = await API.get('orders/retailer/orders');
      setOrders(res.data.data || []);
            setSelectedOrder(res.data.data || []);
            setShowOrderDetails(true);
          }}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
        {order.status === 'processing' && (
          <button
            onClick={() => handleCompleteOrder(order.id)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete</span>
          </button>
        )}
        {order.status === 'pending' && (
          <button
            onClick={() => handleCancelOrder(order.id, prompt("Reason for cancellation?"))}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        )}
        {order.status === 'modified' && (
          <>
            <button
              onClick={() => handleApproveModifiedOrder(order.id, true)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => handleApproveModifiedOrder(order.id, false)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Reject</span>
            </button>
          </>
        )}
      </div>
    </div>
  );

  const CreateOrderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create New Order</h2>
            <button
              onClick={() => setShowCreateOrder(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Distributor
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={createOrderData.distributorId}
                onChange={e => setCreateOrderData(d => ({ ...d, distributorId: e.target.value }))}
              >
                <option value="">Select distributor</option>
                {distributors.map(d => (
                  <option key={d.id} value={d.id}>{d.businessName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Products
              </label>
              {/* You can implement a product selection UI here */}
              <div className="border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-500 text-center py-8">
                  Product selection interface would go here
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Add any special instructions..."
                value={createOrderData.notes}
                onChange={e => setCreateOrderData(d => ({ ...d, notes: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowCreateOrder(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateOrder}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Creating..." : "Send Order Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 6-digit code prompt modal
  const CodePromptModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Confirmation Code</h2>
        <p className="mb-4">Share this 6-digit code with your distributor. They will need it to complete the order:</p>
        <div className="text-3xl font-bold tracking-widest text-blue-700 mb-6">{sixDigitCode}</div>
        <button
          onClick={() => setShowCodePrompt(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.distributor?.businessName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowCreateOrder(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {['all', 'pending', 'processing', 'modified', 'completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first order to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateOrder && <CreateOrderModal />}
      {showOrderDetails && selectedOrder && <OrderDetailsModal />}
      {showCodePrompt && <CodePromptModal />}
    </div>
  );
};

export default RetailerOrders;