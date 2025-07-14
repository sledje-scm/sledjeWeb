import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye,
  Filter,
  Search,
  Bell,
  Package,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Edit3,
  Truck,
  ArrowRight,
  Check,
  X,
  FileText,
  Building
} from 'lucide-react';
import API from "../../api"; // Adjust path as needed

const DistributorOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'accept', 'reject', 'modify'
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [modifications, setModifications] = useState([]);

  // Mock data for demonstration
 
    useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await API.get('/orders/distributor/order');
        setOrders(res.data.data || []);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

useEffect(() => {
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Add a minimum 5-second delay
      const [res] = await Promise.all([
        API.get('/orders/distributor/order'),
        new Promise(resolve => setTimeout(resolve, 5000))
      ]);
      setOrders(res.data.data || []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };
  fetchOrders();
}, []);

  const getStatusIcon = (status) => {
    const iconProps = { size: 20 };
    switch (status) {
      case 'pending':
        return <Clock {...iconProps} className="text-yellow-500" />;
      case 'processing':
        return <Truck {...iconProps} className="text-blue-500" />;
      case 'completed':
        return <CheckCircle {...iconProps} className="text-green-500" />;
      case 'cancelled':
        return <XCircle {...iconProps} className="text-red-500" />;
      default:
        return <Clock {...iconProps} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyLevel = (createdAt) => {
    const hoursSinceCreated = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
    if (hoursSinceCreated > 24) return 'high';
    if (hoursSinceCreated > 12) return 'medium';
    return 'low';
  };
  
  
  const filteredOrders = orders.filter(order => {
    const orderNumber = order.orderNumber || "";
    const retailerName = (order.retailer && order.retailer.name) ? order.retailer.name : "";
    const matchesSearch =
      orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

 const handleOrderAction = async (order, action) => {
  setLoading(true);
  try {
    const res = await API.get(`/orders/distributor/orders/${order.id}`);
    setSelectedOrder(res.data.data);

    setActionType(action);
    setShowOrderModal(true);
  } catch (error) {
    alert("Failed to fetch order details");
  }
  setLoading(false);
};

  const processOrder = async () => {
  setLoading(true);
  try {
    let successMessage = '';
    
    if (actionType === 'accept') {
      await API.put(`orders/distributor/orders/${selectedOrder._id}/process`, { action: 'accept' });
      successMessage = `Order from ${selectedOrder.retailer.businessName} has been accepted successfully!`;
    } else if (actionType === 'reject') {
      await API.put(`orders/distributor/orders/${selectedOrder._id}/process`, { action: 'reject', rejectionReason });
      successMessage = `Order from ${selectedOrder.retailer.businessName} has been rejected.`;
    } else if (actionType === 'modify') {
      await API.put(`orders/distributor/orders/${selectedOrder._id}/process`, { action: 'modify', modifications });
      successMessage = `Modification request sent for order from ${selectedOrder.retailer.businessName}.`;
    } else if (actionType === 'complete') {
      await API.put(`orders/distributor/orders/${selectedOrder._id}/status`, { status: 'completed' });
      successMessage = `Order from ${selectedOrder.retailer.businessName} marked as completed!`;
    }
    
    // Refresh orders after action
    const res = await API.get('orders/distributor/order');
    setOrders(res.data.data || []);
    setShowOrderModal(false);
    setRejectionReason('');
    
    // Show success toast
    setToast({ message: successMessage, type: 'success' });
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Action failed. Please try again.";
    setToast({ message: errorMessage, type: 'error' });
  }
  setLoading(false);
};
  
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
    }`}>
      <div className={`relative flex items-center space-x-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border-l-4 min-w-[320px] ${
        type === 'success' 
          ? 'bg-white/95 border-l-green-500 shadow-green-500/20' 
          : type === 'error' 
          ? 'bg-white/95 border-l-red-500 shadow-red-500/20' 
          : 'bg-white/95 border-l-blue-500 shadow-blue-500/20'
      }`}>
        {/* Icon with background glow */}
        <div className={`flex-shrink-0 p-2 rounded-full ${
          type === 'success' 
            ? 'bg-green-100 shadow-green-200/50' 
            : type === 'error' 
            ? 'bg-red-100 shadow-red-200/50' 
            : 'bg-blue-100 shadow-blue-200/50'
        }`}>
          {type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
          {type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
          {type === 'info' && <AlertTriangle className="w-5 h-5 text-blue-600" />}
        </div>
        
        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-relaxed">
            {message}
          </p>
        </div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </button>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
          <div className={`h-full rounded-b-xl transition-all duration-[4000ms] ease-linear ${
            type === 'success' 
              ? 'bg-green-500' 
              : type === 'error' 
              ? 'bg-red-500' 
              : 'bg-blue-500'
          } ${isVisible ? 'w-0' : 'w-full'}`}></div>
        </div>
      </div>
    </div>
  );
};

  const OrderCard = ({ order }) => {
    const urgency = getUrgencyLevel(order.createdAt);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{order.retailer.businessName}</h3>
              <p className="text-sm text-gray-500">{order.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {urgency === 'high' && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Urgent" />
            )}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{order.itemCount} items</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">₹{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Building className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Retailer Info</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">{order.retailer.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600">{order.retailer.phone}</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-blue-800">Order Notes:</span>
                <p className="text-sm text-blue-700 mt-1">{order.notes}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleOrderAction(order, 'view')}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </button>
            {order.status === 'pending' && (
              <>
                <button
                  onClick={() => handleOrderAction(order, 'accept')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => handleOrderAction(order, 'reject')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleOrderAction(order, 'modify')}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Modify</span>
                </button>
              </>
            )}
            {order.status === 'processing' && (
              <button
                onClick={() => handleOrderAction(order, 'complete')}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span>Mark Complete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const OrderModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {actionType === 'view' ? 'Order Details' : 
                 actionType === 'accept' ? 'Accept Order' :
                 actionType === 'reject' ? 'Reject Order' :
                 actionType === 'modify' ? 'Modify Order' : 'Complete Order'}
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Order Header */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Order Number:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Amount:</span>
                      <span className="text-sm font-medium text-gray-900">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Retailer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{selectedOrder.retailer.businessName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedOrder.retailer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedOrder.retailer.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">{selectedOrder.retailer.pincode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">SKU</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Quantity</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Price</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Stock</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{item.productName}-{item.variantName}</div>
                            <div className="text-sm text-gray-500">per {item.unit}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{item.variantSku}</td>
                        <td className="py-3 px-4 text-right">
                          {actionType === 'modify' ? (
                            <input
                              type="number"
                              defaultValue={item.quantity}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="font-medium">{item.quantity}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">₹{item.variantSellingPrice}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.stock < item.quantity ? 'bg-red-100 text-red-800' : 
                            item.stock < item.quantity * 2 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.variantStock} available
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">₹{(item.quantity * item.variantSellingPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Order Notes</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">{selectedOrder.notes}</p>
                </div>
              </div>
            )}

            {/* Action-specific content */}
            {actionType === 'reject' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="3"
                  placeholder="Please provide a reason for rejecting this order..."
                />
              </div>
            )}

            {actionType === 'modify' && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Modification Notes</h3>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Explain the modifications made to this order..."
                />
              </div>
            )}

            {/* Action Buttons */}
            {actionType !== 'view' && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processOrder}
                  disabled={loading || (actionType === 'reject' && !rejectionReason.trim())}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' :
                    actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                    actionType === 'modify' ? 'bg-orange-600 hover:bg-orange-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {actionType === 'accept' && <Check className="w-4 h-4" />}
                      {actionType === 'reject' && <X className="w-4 h-4" />}
                      {actionType === 'modify' && <Edit3 className="w-4 h-4" />}
                      {actionType === 'complete' && <CheckCircle className="w-4 h-4" />}
                      <span>
                        {actionType === 'accept' ? 'Accept Order' :
                         actionType === 'reject' ? 'Reject Order' :
                         actionType === 'modify' ? 'Save Modifications' :
                         'Mark as Complete'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {['pending', 'processing', 'completed', 'cancelled'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-indigo-600 shadow-sm'
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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Order Stats */}
       

        {loading && (
          <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
       )}

        {/* Orders List */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
  

        {/* No orders message */}
        {!loading && filteredOrders.length === 0 && (
         <div className="text-center py-12">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-500">
        {searchTerm ? 'Try adjusting your search terms' : `No ${activeTab} orders at the moment`}
        </p>
        </div>
        )}
       
      </div>

      {/* Modal */}
      {showOrderModal && <OrderModal />}
      {toast && (
     <Toast
       message={toast.message}
       type={toast.type}
       onClose={() => setToast(null)}
     />
)}
    </div>
  );
};

export default DistributorOrderManagement;