import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';

const Payment = () => {
  const [selectedDistributors, setSelectedDistributors] = useState(new Set());
  const [expandedDistributors, setExpandedDistributors] = useState(new Set());
  const [expandedBills, setExpandedBills] = useState(new Set());
  const [distributorPaymentTypes, setDistributorPaymentTypes] = useState({}); // Track payment type per distributor
  const [paymentSummary, setPaymentSummary] = useState({
    totalOutstanding: 0,
    totalSales: 0,
    totalProfit: 0,
    netPayable: 0
  });

  // Mock data - in real app this would come from API
  const [distributors, setDistributors] = useState([
    {
      id: 1,
      name: "Apex Consumer Goods",
      code: "AC",
      category: "Electronics & Appliances",
      paymentStatus: "pending",
      totalOutstanding: 52850,
      todaysSales: 89400,
      todaysProfit: 12340,
      weeklySales: 447000,
      weeklyProfit: 61700,
      todaysPayable: 77060,
      weeklyPayable: 385300,
      lastPayment: "2025-05-15",
      bills: [
        {
          id: "B001",
          date: "2025-05-20",
          amount: 28450,
          status: "active",
          dueDate: "2025-06-19",
          products: [
            { name: "Samsung TV 55\"", qty: 5, costPrice: 42000, sellingPrice: 45000, soldToday: 2 },
            { name: "iPhone 15", qty: 3, costPrice: 75000, sellingPrice: 79900, soldToday: 1 },
            { name: "AirPods Pro", qty: 8, costPrice: 22000, sellingPrice: 24900, soldToday: 3 }
          ]
        },
        {
          id: "B002", 
          date: "2025-05-25",
          amount: 24400,
          status: "active",
          dueDate: "2025-06-24",
          products: [
            { name: "MacBook Air", qty: 2, costPrice: 95000, sellingPrice: 99900, soldToday: 0 },
            { name: "iPad Pro", qty: 4, costPrice: 85000, sellingPrice: 89900, soldToday: 1 }
          ]
        },
        {
          id: "B003",
          date: "2025-04-15",
          amount: 18600,
          status: "closed",
          paidDate: "2025-05-10",
          products: [
            { name: "Apple Watch", qty: 6, costPrice: 35000, sellingPrice: 37900, soldToday: 0 }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Metro Supplies",
      code: "MS",
      category: "Fashion & Lifestyle",
      paymentStatus: "pending",
      totalOutstanding: 34680,
      todaysSales: 67600,
      todaysProfit: 14200,
      weeklySales: 338000,
      weeklyProfit: 71000,
      todaysPayable: 53400,
      weeklyPayable: 267000,
      lastPayment: "2025-05-12",
      bills: [
        {
          id: "B101",
          date: "2025-05-22",
          amount: 19680,
          status: "active", 
          dueDate: "2025-07-06",
          products: [
            { name: "Nike Shoes", qty: 8, costPrice: 7500, sellingPrice: 8500, soldToday: 4 },
            { name: "Levi's Jeans", qty: 12, costPrice: 2800, sellingPrice: 3200, soldToday: 6 }
          ]
        },
        {
          id: "B102",
          date: "2025-05-18",
          amount: 15000,
          status: "active",
          dueDate: "2025-07-02", 
          products: [
            { name: "Adidas T-Shirt", qty: 20, costPrice: 1600, sellingPrice: 1800, soldToday: 8 }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Bharat Wholesale",
      code: "BW", 
      category: "FMCG & Daily Essentials",
      paymentStatus: "paid",
      totalOutstanding: 0,
      todaysSales: 23400,
      todaysProfit: 3580,
      weeklySales: 117000,
      weeklyProfit: 17900,
      todaysPayable: 19820,
      weeklyPayable: 99100,
      lastPayment: "2025-05-30",
      bills: [
        {
          id: "B201",
          date: "2025-05-28",
          amount: 12400,
          status: "closed",
          paidDate: "2025-05-30",
          products: [
            { name: "Pantene Shampoo", qty: 30, costPrice: 280, sellingPrice: 320, soldToday: 24 },
            { name: "Maggi Noodles", qty: 60, costPrice: 12, sellingPrice: 14, soldToday: 48 }
          ]
        }
      ]
    }
  ]);

  // Sort distributors - pending payments first
  const sortedDistributors = [...distributors].sort((a, b) => {
    if (a.paymentStatus === 'pending' && b.paymentStatus !== 'pending') return -1;
    if (a.paymentStatus !== 'pending' && b.paymentStatus === 'pending') return 1;
    return b.totalOutstanding - a.totalOutstanding;
  });

  const toggleDistributorPaymentType = (distributorId, paymentType) => {
    const current = distributorPaymentTypes[distributorId];
    
    // If clicking the same type, unselect it
    if (current === paymentType) {
      setDistributorPaymentTypes(prev => {
        const newTypes = { ...prev };
        delete newTypes[distributorId];
        return newTypes;
      });
      
      // Remove from selected distributors
      setSelectedDistributors(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(distributorId);
        return newSelected;
      });
    } else {
      // Select new type
      setDistributorPaymentTypes(prev => ({
        ...prev,
        [distributorId]: paymentType
      }));
      
      // Add to selected distributors
      setSelectedDistributors(prev => {
        const newSelected = new Set(prev);
        newSelected.add(distributorId);
        return newSelected;
      });
    }
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedDistributors);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedDistributors(newExpanded);
  };

  const toggleBillExpanded = (billId) => {
    const newExpanded = new Set(expandedBills);
    if (newExpanded.has(billId)) {
      newExpanded.delete(billId);
    } else {
      newExpanded.add(billId);
    }
    setExpandedBills(newExpanded);
  };

  // Calculate payment summary
  useEffect(() => {
    let totalOutstanding = 0;
    let totalSales = 0;
    let totalProfit = 0;
    let netPayable = 0;

    selectedDistributors.forEach(id => {
      const dist = distributors.find(d => d.id === id);
      const paymentType = distributorPaymentTypes[id];
      if (dist && paymentType) {
        totalOutstanding += dist.totalOutstanding;
        if (paymentType === 'today') {
          totalSales += dist.todaysSales;
          totalProfit += dist.todaysProfit;
          netPayable += dist.todaysPayable;
        } else {
          totalSales += dist.weeklySales;
          totalProfit += dist.weeklyProfit;
          netPayable += dist.weeklyPayable;
        }
      }
    });

    setPaymentSummary({
      totalOutstanding,
      totalSales,
      totalProfit,
      netPayable
    });
  }, [selectedDistributors, distributors, distributorPaymentTypes]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getBillStatusColor = (status) => {
    return status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600';
  };

  // Calculate totals for header
  const totalTodaysSales = distributors.reduce((sum, d) => sum + d.todaysSales, 0);
  const totalWeeklySales = distributors.reduce((sum, d) => sum + d.weeklySales, 0);
  const totalTodaysProfit = distributors.reduce((sum, d) => sum + d.todaysProfit, 0);
  const totalWeeklyProfit = distributors.reduce((sum, d) => sum + d.weeklyProfit, 0);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Payment Settlement Hub</h1>
              <p className="text-blue-300 text-lg">Manage distributor payments and track performance</p>
            </div>
            <div className="bg-blue-800 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(totalTodaysSales)}</div>
                  <div className="text-blue-300 text-sm">Today's Sales</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(totalWeeklySales)}</div>
                  <div className="text-blue-300 text-sm">Weekly Sales</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{formatCurrency(totalTodaysProfit)}</div>
                  <div className="text-blue-300 text-xs">Today's Profit</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{formatCurrency(totalWeeklyProfit)}</div>
                  <div className="text-blue-300 text-xs">Weekly Profit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Distributors List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-900">Distributors</h2>
            </div>

            {sortedDistributors.map((distributor) => (
              <div
                key={distributor.id}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 cursor-pointer ${
                  selectedDistributors.has(distributor.id)
                    ? 'border-blue-600 shadow-lg'
                    : 'border-blue-200 hover:border-blue-300'
                }`}
                onClick={(e) => {
                  // Don't trigger if clicking on interactive elements
                  if (e.target.type === 'radio' || e.target.closest('button') || e.target.closest('[role="button"]')) {
                    return;
                  }
                  // Auto-select today's payable if not already selected
                  if (!distributorPaymentTypes[distributor.id]) {
                    toggleDistributorPaymentType(distributor.id, 'today');
                  }
                }}
              >
                {/* Distributor Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-lg bg-blue-900 text-white flex items-center justify-center text-lg font-bold">
                        {distributor.code}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-900">{distributor.name}</h3>
                        <p className="text-blue-600">{distributor.category}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-blue-600">
                          <span>Today: {formatCurrency(distributor.todaysSales)} / {formatCurrency(distributor.todaysProfit)}</span>
                          <span>Weekly: {formatCurrency(distributor.weeklySales)} / {formatCurrency(distributor.weeklyProfit)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {distributor.paymentStatus === 'pending' && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Payment Pending</span>
                      )}
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => toggleDistributorPaymentType(distributor.id, 'today')}
                      >
                        <input
                          type="radio"
                          name={`payment-type-${distributor.id}`}
                          value="today"
                          checked={distributorPaymentTypes[distributor.id] === 'today'}
                          onChange={() => {}} // Empty onChange to prevent default behavior
                          className="text-blue-900 pointer-events-none"
                        />
                        <div>
                          <div className="font-medium text-blue-900">Today's Payable</div>
                          <div className="text-lg font-bold text-blue-900">{formatCurrency(distributor.todaysPayable)}</div>
                        </div>
                      </div>
                      
                      <div 
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => toggleDistributorPaymentType(distributor.id, 'weekly')}
                      >
                        <input
                          type="radio"
                          name={`payment-type-${distributor.id}`}
                          value="weekly"
                          checked={distributorPaymentTypes[distributor.id] === 'weekly'}
                          onChange={() => {}} // Empty onChange to prevent default behavior
                          className="text-blue-900 pointer-events-none"
                        />
                        <div>
                          <div className="font-medium text-blue-900">Weekly Payable</div>
                          <div className="text-lg font-bold text-blue-900">{formatCurrency(distributor.weeklyPayable)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bills Section Toggle */}
                  <button
                    onClick={() => toggleExpanded(distributor.id)}
                    className="w-full flex items-center justify-between bg-blue-100 hover:bg-blue-200 rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-700">
                        View Bills ({distributor.bills.filter(b => b.status === 'active').length} active, {distributor.bills.filter(b => b.status === 'closed').length} closed)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm text-blue-600">Outstanding Amount</div>
                        <div className="font-bold text-blue-900">{formatCurrency(distributor.totalOutstanding)}</div>
                      </div>
                      {expandedDistributors.has(distributor.id) ? 
                        <ChevronUp className="w-5 h-5 text-blue-600" /> : 
                        <ChevronDown className="w-5 h-5 text-blue-600" />
                      }
                    </div>
                  </button>
                </div>

                {/* Bills Details */}
                {expandedDistributors.has(distributor.id) && (
                  <div className="border-t border-blue-200 p-6 bg-blue-50">
                    <div className="space-y-3">
                      {/* Active Bills First */}
                      {distributor.bills
                        .filter(bill => bill.status === 'active')
                        .map((bill) => (
                          <div key={bill.id} className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-blue-900">Bill #{bill.id}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBillStatusColor(bill.status)}`}>
                                  {bill.status.toUpperCase()}
                                </span>
                                <span className="text-sm text-blue-600">Due: {bill.dueDate}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-900">{formatCurrency(bill.amount)}</div>
                                <button
                                  onClick={() => toggleBillExpanded(bill.id)}
                                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                >
                                  {expandedBills.has(bill.id) ? 'Hide Details' : 'View Products'}
                                </button>
                              </div>
                            </div>
                            
                            {expandedBills.has(bill.id) && (
                              <div className="border-t pt-3">
                                <div className="grid grid-cols-6 gap-2 text-xs font-medium text-blue-600 mb-2">
                                  <div>Product</div>
                                  <div>Qty</div>
                                  <div>Cost Price</div>
                                  <div>Selling Price</div>
                                  <div>Sold Today</div>
                                  <div>Revenue</div>
                                </div>
                                {bill.products.map((product, idx) => (
                                  <div key={idx} className="grid grid-cols-6 gap-2 text-sm py-2 border-b border-blue-100">
                                    <div className="font-medium">{product.name}</div>
                                    <div>{product.qty}</div>
                                    <div>{formatCurrency(product.costPrice)}</div>
                                    <div>{formatCurrency(product.sellingPrice)}</div>
                                    <div className="font-bold text-blue-900">{product.soldToday}</div>
                                    <div className="font-bold">{formatCurrency(product.sellingPrice * product.soldToday)}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      
                      {/* Closed Bills */}
                      {distributor.bills
                        .filter(bill => bill.status === 'closed')
                        .map((bill) => (
                          <div key={bill.id} className="bg-white rounded-lg p-4 border border-blue-200 opacity-60">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-blue-700">Bill #{bill.id}</span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                                  PAID
                                </span>
                                <span className="text-sm text-blue-600">Paid: {bill.paidDate}</span>
                              </div>
                              <div className="text-lg font-bold text-blue-700">{formatCurrency(bill.amount)}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Payment Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Payment Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-blue-600">Selected Distributors</span>
                  <span className="font-bold text-blue-900">{selectedDistributors.size}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-blue-200">
                  <span className="text-blue-600">Outstanding Bills</span>
                  <span className="font-bold text-blue-900">{formatCurrency(paymentSummary.totalOutstanding)}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 bg-blue-900 text-white rounded-lg px-4">
                  <span className="font-medium">Amount to Pay</span>
                  <span className="text-2xl font-bold">{formatCurrency(paymentSummary.netPayable)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h4 className="font-medium text-blue-900 mb-3">Payment Method</h4>
                <div className="space-y-2">
                  {['Bank Transfer (NEFT/RTGS)', 'UPI Payment', 'Cheque Payment'].map((method, idx) => (
                    <label key={idx} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer">
                      <input type="radio" name="payment-method" defaultChecked={idx === 0} className="text-blue-900" />
                      <span className="text-blue-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  disabled={selectedDistributors.size === 0}
                  className="w-full bg-blue-900 text-white py-4 rounded-lg font-medium text-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Process Payment
                </button>
                <button className="w-full bg-blue-100 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                  Schedule Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;