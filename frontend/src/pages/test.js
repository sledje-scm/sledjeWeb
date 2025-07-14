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
import { useAuth } from '../../components/AuthContext'; // Adjust path as needed

const DistributorOrderManagement = () => {
  const { user } = useAuth();
  const [modalLoading, setModalLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [orders, setOrders] = useState([]);
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
  const fetchProductsAndRetailers = async () => {
    try {
       const params = {
      distributorId: user._id, // ✅ include this
      //distributorships: selectedDistributorship,
    };
      // Fetch products
    const productsRes = await API.get("/products/get", { params });
      // Fetch products
      
      setProducts(productsRes.data || []);

      // Fetch connected retailers
      const retailersRes = await API.get('/connections/distributor/retailers');
      setRetailers(retailersRes.data.retailers || []);
    } catch (error) {
      console.error('Error fetching products/retailers:', error);
    }
  };
  fetchProductsAndRetailers();
}, []);
 
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

  const getProductInfo = (productId) => {
  console.log("Fetching product info for ID:", products);
  return products.find(p => p._id === productId) || {};
  
};

const getRetailerInfo = (retailerId) => {
  return retailers.find(r => r._id === retailerId) || {};
};

const enrichOrderData = (order) => {
  if (!order) return null;
  console.log("Enriching order data for:", order);
  
  const retailerInfo = getRetailerInfo(order.retailer.id);
  console.log("Retailer Info:", retailerInfo);

  console.log("Order before enrichment:", order);
  // Ensure items is an array
  const orderItems = Array.isArray(order.items) ? order.items : [];
  console.log("Order Items:", orderItems);

  
  const enrichedItems = orderItems.map(item => {
    console.log("Enriching item:", item);
    const productInfo = getProductInfo(item.productId);
    console.log("Product Info for item:", item.productId, productInfo);
    return {
      ...item,
      price: productInfo.costPrice || 0,
      stock: productInfo.stock || 0,
      productName: productInfo.name || item.productName || 'Unknown Product',
      sku: productInfo.sku || item.sku || 'N/A',
      unit: productInfo.unit || 'unit'
    };
  });

  return {
    ...order,
    retailer: {
      name: retailerInfo.ownerName || 'Unknown Retailer',
      businessName: retailerInfo.businessName || 'Unknown Business',
      email: retailerInfo.email || 'No email',
      phone: retailerInfo.phone || 'No phone',
      pincode: retailerInfo.location?.pincode || 'No pincode'
    },
    items: enrichedItems,
    totalAmount: order.totalAmount || 0,
    orderNumber: order.orderNumber || 'N/A',
    status: order.status || 'pending',
    createdAt: order.createdAt || new Date().toISOString(),
    notes: order.notes || ''
  };
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
  const enrichedOrder = enrichOrderData(order);
  const orderNumber = enrichedOrder.orderNumber || "";
  const retailerName = enrichedOrder.retailer.name || "";
  const matchesSearch =
    orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    retailerName.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesTab = activeTab === 'all' || enrichedOrder.status === activeTab;
  return matchesSearch && matchesTab;
});


// 2. Update handleOrderAction function
const handleOrderAction = async (order, action) => {
  setLoading(true);
  setModalLoading(true);
  try {
    const res = await API.get(`/orders/distributor/orders/${order.id}`);
    const orderData = res.data.data;
    console.log("Fetched order data:", orderData);
    
    // Ensure items array exists
    if (!orderData.items || !Array.isArray(orderData.items)) {
      orderData.items = [];
    }
    setSelectedOrder(orderData);
    console.log("Selected Order:", orderData);
    setRejectionReason('');
    setActionType(action);
    setShowOrderModal(true);
  } catch (error) {
    alert("Failed to fetch order details");
  }
  setLoading(false);
  setModalLoading(false);
};

    const processOrder = async () => {
    setLoading(true);
    console.log("Processing order:", selectedOrder, actionType, rejectionReason, modifications);
    try {
      if (actionType === 'accept') {
        await API.put(`orders/distributor/orders/${selectedOrder._id}/process`, { action: 'accept' });
      } else if (actionType === 'reject') {
        await API.put(`orders/distributor/orders/${selectedOrder._id}/process`, { action: 'reject', rejectionReason });
      } else if (actionType === 'modify') {
        await API.put(`orders/distributor/orders/${selectedOrder._id}/process`, { action: 'modify', modifications });
      } else if (actionType === 'complete') {
        await API.put(`orders/distributor/orders/${selectedOrder._id}/status`, { status: 'completed' });
      }
      // Refresh orders after action
      const res = await API.get('orders/distributor/orders');
      setOrders(res.data.data || []);
      setShowOrderModal(false);
      setRejectionReason('');
    } catch (error) {
      alert(error.response?.data?.message || "Action failed");
    }
    setLoading(false);
  };
  

 const OrderCard = ({ order }) => {
  const enrichedOrder = enrichOrderData(order);
  
  if (!enrichedOrder) return null;
  
  const urgency = getUrgencyLevel(enrichedOrder.createdAt);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{enrichedOrder.retailer.businessName}</h3>
              <p className="text-sm text-gray-500">{enrichedOrder.orderNumber}</p>
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
            <span className="text-sm text-gray-600">₹{(enrichedOrder.totalAmount || 0).toLocaleString()}</span>
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

      if (modalLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading order details...</span>
          </div>
        </div>
      </div>
    );
  }

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
                    {selectedOrder.items.map((enrichedItem, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{enrichedItem.productName}</div>
                            <div className="text-sm text-gray-500">per {enrichedItem.unit}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{enrichedItem.sku}</td>
                        <td className="py-3 px-4 text-right">
                          {actionType === 'modify' ? (
                            <input
                              type="number"
                              defaultValue={enrichedItem.quantity}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className="font-medium">{enrichedItem.quantity}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">₹{enrichedItem.price}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            enrichedItem.stock < enrichedItem.quantity ? 'bg-red-100 text-red-800' : 
                            enrichedItem.stock < enrichedItem.quantity * 2 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {enrichedItem.stock} available
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">₹{(enrichedItem.quantity * enrichedItem.price).toLocaleString()}</td>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'processing').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              
              <div className="ml-4">
                <p className="text-sm text-gray-600">Revenue Today</p>
                <p className="text-2xl font-bold text-gray-900">₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrders.map(order => (
          <OrderCard key={order.id} order={order} />
         ))}

        </div>

        {filteredOrders.length === 0 && (
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
    </div>
  );
};

export default DistributorOrderManagement;