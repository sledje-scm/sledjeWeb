import { useEffect, useRef, useState } from "react";
import API from "../../api";
import {
  Package, Settings, MapPin, CreditCard, Phone, Users, UserPlus, Check, X, Search, Mail, Building,
  Clock, ChevronDown, ChevronUp, Filter, Send, AlertCircle, UserCheck
} from "lucide-react";
import Card1 from "../../assets/carousel/Card1.png";
import Card2 from "../../assets/carousel/Card2.png";
import Card3 from "../../assets/carousel/Card3.png";
import Card4 from "../../assets/carousel/Card4.png";
import NishantImage from "../../assets/founders/N.png";

// --- Connection Management Modal Component ---
const ConnectionModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [connectedRetailers, setConnectedRetailers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    businessType: '',
    pincode: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [suggestedRetailers, setSuggestedRetailers] = useState([]);

  // Fetch connection requests and connected retailers from API
  useEffect(() => {
    if (isOpen) {
      fetchConnectionRequests();
      fetchConnectedRetailers();
      fetchSuggestedRetailers();
      setSearchResults([]); // Clear search results on open
    }
    // eslint-disable-next-line
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'search') {
      fetchSuggestedRetailers();
    }
    // eslint-disable-next-line
  }, [isOpen, activeTab]);

  const fetchConnectionRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get("/connections/distributor/requests");
      setConnectionRequests(res.data.requests || []);
    } catch (err) {
      setConnectionRequests([]);
    }
    setLoading(false);
  };

  const fetchConnectedRetailers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/connections/distributor/retailers");
      setConnectedRetailers(res.data.retailers || []);
    } catch (err) {
      setConnectedRetailers([]);
    }
    setLoading(false);
  };

  const fetchSuggestedRetailers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/connections/suggest/retailers");
      setSuggestedRetailers(res.data.retailers || []);
    } catch (err) {
      setSuggestedRetailers([]);
    }
    setLoading(false);
  };

  // Search retailers using API
  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.businessName = searchQuery;
      if (searchFilters.location) params.location = searchFilters.location;
      if (searchFilters.businessType) params.businessType = searchFilters.businessType;
      if (searchFilters.pincode) params.pincode = searchFilters.pincode;
      const res = await API.get("/connections/retailers/search", { params });
      setSearchResults(res.data.retailers || []);
    } catch (err) {
      setSearchResults([]);
    }
    setLoading(false);
  };

  // Accept or reject a connection request
  const handleRequestResponse = async (requestId, action, rejectionReason = '') => {
    setLoading(true);
    try {
      await API.put(`/connections/respond/${requestId}`, { action, rejectionReason });
      await fetchConnectionRequests();
      await fetchConnectedRetailers();
      setSelectedRequest(null);
    } catch (err) {
      // Optionally show error
    }
    setLoading(false);
  };

  // Send connection request to a retailer
  const sendConnectionRequest = async (retailerId, message) => {
    setLoading(true);
    try {
      await API.post("/connections/request", { retailerId, message });
      // Optionally show a toast/snackbar
    } catch (err) {
      // Optionally show error
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ConnectionRequestCard = ({ request }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 mb-3 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {request.retailer.businessName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-800 truncate">{request.retailer.businessName}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {request.retailer.businessType}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">Owner: {request.retailer.ownerName}</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{request.retailer.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {request.retailer.phone}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {request.retailer.location}
                </div>
              </div>
              {request.message && (
                <div className="bg-gray-50 p-2 rounded mb-2">
                  <p className="text-gray-700 text-sm italic">"{request.message}"</p>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {formatDate(request.createdAt)}
              </div>
            </div>
          </div>
        </div>
        
        {request.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => handleRequestResponse(request._id, 'approve')}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Check className="w-3 h-3" />
              Accept
            </button>
            <button
              onClick={() => setSelectedRequest(request)}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              <X className="w-3 h-3" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const RetailerCard = ({ retailer, isSearch = false }) => {
    const [showSendRequest, setShowSendRequest] = useState(false);
    const [message, setMessage] = useState('');

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 mb-3 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {retailer.businessName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-800 truncate">{retailer.businessName}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    {retailer.businessType}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">Owner: {retailer.ownerName}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{retailer.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {retailer.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {retailer.location}
                  </div>
                  {retailer.pincode && (
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {retailer.pincode}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {isSearch && (
            <button
              onClick={() => setShowSendRequest(!showSendRequest)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
            >
              <Send className="w-3 h-3" />
              Connect
            </button>
          )}
        </div>
        
        {showSendRequest && (
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message (optional)"
              className="w-full p-2 border border-gray-200 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows="2"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  sendConnectionRequest(retailer._id, message);
                  setShowSendRequest(false);
                  setMessage('');
                }}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors"
              >
                Send Request
              </button>
              <button
                onClick={() => {
                  setShowSendRequest(false);
                  setMessage('');
                }}
                className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Connection Management</h1>
            <p className="text-blue-100 text-sm">Manage your retailer connections and expand your network</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 flex-shrink-0">
          <nav className="flex space-x-6 px-4">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Requests ({connectionRequests.filter(r => r.status === 'pending').length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('connected')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'connected'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Connected ({connectedRetailers.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Find New
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'requests' && (
            <div>
              {connectionRequests.filter(r => r.status === 'pending').length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Requests</h3>
                  <p className="text-gray-500">You don't have any pending connection requests at the moment.</p>
                </div>
              ) : (
                <div>
                  {connectionRequests
                    .filter(r => r.status === 'pending')
                    .map(request => (
                      <ConnectionRequestCard key={request._id} request={request} />
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'connected' && (
            <div>
              {connectedRetailers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Connected Retailers</h3>
                  <p className="text-gray-500">Start connecting with retailers to grow your business network.</p>
                </div>
              ) : (
                <div>
                  {connectedRetailers.map(retailer => (
                    <RetailerCard key={retailer._id} retailer={retailer} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              {/* Search and Filters */}
              <div className="mb-4">
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by business name..."
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors disabled:opacity-50 text-sm"
                  >
                    <Search className="w-4 h-4" />
                    Search
                  </button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded">
                    <input
                      type="text"
                      value={searchFilters.location}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Location"
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      value={searchFilters.businessType}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, businessType: e.target.value }))}
                      placeholder="Business Type"
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      value={searchFilters.pincode}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, pincode: e.target.value }))}
                      placeholder="Pincode"
                      className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Search Results */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Searching for retailers...</p>
                </div>
              ) : (
                <div>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-12">
                      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
                      <p className="text-gray-500">Try adjusting your search criteria to find retailers.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-3 text-sm text-gray-500">
                        Found {searchResults.length} retailers
                      </div>No Res
                      {searchResults.map(retailer => (
                        <RetailerCard key={retailer._id} retailer={retailer} isSearch={true} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {searchQuery.trim() === "" && suggestedRetailers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Retailers in your area or business type</h4>
                  {suggestedRetailers.map((retailer) => (
                    <RetailerCard key={retailer._id} retailer={retailer} isSearch={true} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Reject Connection Request</h3>
              <p className="text-gray-600 mb-3 text-sm">
                Are you sure you want to reject the connection request from {selectedRequest.retailer.businessName}?
              </p>
              <textarea
                placeholder="Reason for rejection (optional)"
                className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 text-sm"
                rows="2"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleRequestResponse(selectedRequest._id, 'reject', 'Connection rejected by distributor')}
                  className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium transition-colors text-sm"
                >
                  Reject Request
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default function DistributorProfile() {
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [distributor, setDistributor] = useState(null);
  const [loading, setLoading] = useState(true);

  const carouselItems = [
    {
      title: "Slege Distributor Insights",
      description: "Track retailers, sales, orders all in one place.",
      image: Card1,
    },
    {
      title: "Automated Billing",
      description: "Focus on business, let us handle the books.",
      image: Card2,
    },
    {
      title: "Logistics Made Easy",
      description: "Plan delivery and pickups without calls.",
      image: Card3,
    },
    {
      title: "Everything Connected",
      description: "Your business. Your control. Anywhere.",
      image: Card4,
    },
  ];

  const carouselRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);

  // Fetch distributor profile from backend
  useEffect(() => {
    const fetchDistributor = async () => {
      setLoading(true);
      try {
        const res = await API.get("/distributors/profile");
        setDistributor(res.data);
      } catch (err) {
        setDistributor(null);
      }
      setLoading(false);
    };
    fetchDistributor();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        const cardWidth = container.offsetWidth / 2;
        const maxScroll = container.scrollWidth - container.offsetWidth;

        const newPos = scrollPos + cardWidth;
        container.scrollTo({
          left: newPos >= maxScroll ? 0 : newPos,
          behavior: "smooth",
        });
        setScrollPos(newPos >= maxScroll ? 0 : newPos);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [scrollPos]);

  return (
    <div className="min-h-screen bg-blue-100 p-3 md:p-6 flex flex-col lg:flex-row gap-3 md:gap-6">
      <div className="flex-1 bg-blue-600 text-white rounded-lg shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Distributor Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Manage Orders</h3>
              <p className="text-sm text-gray-200">View and fulfill incoming retailer requests.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <Settings className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Account Settings</h3>
              <p className="text-sm text-gray-200">Configure your distributor profile and regions.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Delivery Zones</h3>
              <p className="text-sm text-gray-200">Set and update your delivery service areas.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Payments</h3>
              <p className="text-sm text-gray-200">Track payments received from retailers.</p>
            </div>
          </div>

          {/* New Connection Management Card */}
          <div 
            className="flex items-center bg-blue-700 p-4 rounded-lg shadow cursor-pointer hover:bg-blue-800 transition-colors"
            onClick={() => setIsConnectionModalOpen(true)}
          >
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Manage Connections</h3>
              <p className="text-sm text-gray-200">Connect with retailers and manage partnerships.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-4 rounded-lg shadow">
            <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-pink-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold">Support</h3>
              <p className="text-sm text-gray-200">Need help? Get in touch with our team.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-800 mb-4">What’s New</h2>
          <div ref={carouselRef} className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
            {carouselItems.map((item, idx) => (
              <div
                key={idx}
                className="min-w-[80%] sm:min-w-[45%] bg-blue-100 rounded-xl shadow-md p-4 flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-28 w-full object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-bold text-blue-800">{item.title}</h3>
                <p className="text-sm text-blue-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/5 bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Your Profile</h2>
        {loading ? (
          <div className="text-center text-blue-700 py-8">Loading profile...</div>
        ) : distributor ? (
          <>
            <div className="flex flex-col sm:flex-row items-center bg-blue-50 p-4 rounded-lg shadow mb-6">
              <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
                <img src={NishantImage} alt="Distributor" className="w-full h-full object-cover" />
              </div>
              <div className="sm:ml-4 text-center sm:text-left mt-3 sm:mt-0">
                <h3 className="text-xl font-semibold text-blue-800">{distributor.ownerName}</h3>
                <p className="text-base text-gray-600">Owner : {distributor.companyName}</p>
                <p className="text-base text-gray-600 break-all">Email: {distributor.email}</p>
                <p className="text-base text-gray-600">Phone: {distributor.phone}</p>
                <p className="text-base text-gray-600">GST: {distributor.gstNumber}</p>
                <p className="text-base text-gray-600">Business Type: {distributor.businessType}</p>
                <p className="text-base text-gray-600">Pincode: {distributor.pincode}</p>
                <p className="text-base text-gray-600">Location: {distributor.location}</p>
                <p className="text-base text-gray-600">Address: {distributor.address}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Top Retailers</h3>
              <div className="overflow-y-auto" style={{ maxHeight: "150px" }}>
                {distributor.retailers && distributor.retailers.length > 0 ? (
                  distributor.retailers.map((retailer, index) => (
                    <div
                      key={retailer._id || index}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-3 rounded-lg shadow mb-2"
                    >
                      <p className="text-blue-800 font-medium text-base">{retailer.businessName}</p>
                      <p className="text-gray-600 text-sm break-all">{retailer.phone}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">No connected retailers yet.</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-red-600 py-8">Failed to load profile.</div>
        )}
      </div>

      {isConnectionModalOpen && (
        <ConnectionModal
          isOpen={isConnectionModalOpen}
          onClose={() => setIsConnectionModalOpen(false)}
        />
      )}
    </div>
  );
}
