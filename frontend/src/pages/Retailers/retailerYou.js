import { useEffect, useRef, useState } from "react";
import { 
  Trash, 
  Check, 
  CircleCheck, 
  CreditCard, 
  Phone, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle,
  UserPlus,
  Building2,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import API from "../../api";

// Mock images (replace with your actual imports)
const GunjanImage = "https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=GS";
const Card1 = "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Delivery";
const Card2 = "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Billing";
const Card3 = "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=IoT";
const Card4 = "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=All-in-One";

export default function RetailerYou() {
  // State management
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('distributors');
  const [connectedDistributors, setConnectedDistributors] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedDistributors, setSuggestedDistributors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [retailerProfile, setRetailerProfile] = useState(null);

  const carouselItems = [
    {
      title: "Slege Delivery Solutions",
      description: "Forget the hectic: from loading to unloading: All Covered.",
      image: Card1,
    },
    {
      title: "Slege Billing Solutions", 
      description: "1 Click and Done: No tangling in bills.",
      image: Card2,
    },
    {
      title: "Slege Business IOT Solutions",
      description: "We build, you enjoy.",
      image: Card3,
    },
    {
      title: "Slege Black ALL-IN-ONE",
      description: "Everything everywhere all at once.",
      image: Card4,
    },
  ];

  // Carousel auto-scroll logic
  const carouselRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);

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

  // Confirmation modal helper
  const showConfirmation = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  // API Functions
  const fetchConnectedDistributors = async () => {
    try {
      setLoading(true);
      const response = await API.get('/connections/retailer/distributors');
      // Ensure we always set an array
      const distributors = response.data?.distributors || response.data || [];
      setConnectedDistributors(Array.isArray(distributors) ? distributors : []);
    } catch (error) {
      console.error('Error fetching connected distributors:', error);
      setConnectedDistributors([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

   const fetchConnectionRequests = async () => {
    try {
      setLoading(true);
      const response = await API.get('/connections/retailer/requests');
      const requests = response.data?.requests || response.data || [];
      setConnectionRequests(Array.isArray(requests) ? requests : []);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      setConnectionRequests([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };
  

   const searchDistributors = async (query) => {
    if (!query.trim()) return;
    
    try {
      setIsSearching(true);
      const response = await API.get(`/connections/search/distributors?companyName=${encodeURIComponent(query)}`);
      
      // Fix: Don't call response.json() on axios response
      if (response.status === 200) {
        const results = response.data?.results || response.data || [];
        setSearchResults(Array.isArray(results) ? results : []);
      }
    } catch (error) {
      console.error('Error searching distributors:', error);
      setSearchResults([]); // Set to empty array on error
    } finally {
      setIsSearching(false);
    }
  };

   const sendConnectionRequest = async (distributorId, message = '') => {
    try {
      const response = await API.post('/connections/request', {
        retailer: user._id,
        distributorId,
        message
      });
      
      // Fix: Don't call response.json() on axios response
      if (response.status === 200 || response.status === 201) {
        alert('Connection request sent successfully!');
        setSearchResults(prev => prev.filter(d => d._id !== distributorId));
        fetchConnectionRequests(); // Refresh requests
      } else {
        alert(response.data?.message || 'Failed to send connection request');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Error sending connection request');
    }
  };

  const removeConnection = async (distributorId) => {
    const actualRemove = async () => {
       
    try {
      const response = await API.delete(`/connections/remove/${distributorId}`);
      if (response.status === 200) {
        alert('Connection removed successfully!');
        fetchConnectedDistributors(); // Refresh connected distributors
      } else {
        alert(response.data?.message || 'Failed to remove connection');
      }
    } catch (error) {
      console.error('Error removing connection:', error);
      alert('Error removing connection');
    }
    };

    showConfirmation('Are you sure you want to remove this connection?', actualRemove);
  };

  const fetchRetailerProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('/retailers/profile');
      setRetailerProfile(response.data);
    } catch (error) {
      console.error('Error fetching retailer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRetailerProfile();
    fetchConnectedDistributors();
    fetchConnectionRequests();
  }, []);

  useEffect(() => {
    if (showSearchModal && retailerProfile) {
      fetchSuggestedDistributors();
    }
  }, [showSearchModal, retailerProfile]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchSuggestedDistributors = async () => {
    try {
      setLoading(true);
      const pincode = retailerProfile?.pincode;
      const businessType = retailerProfile?.businessType;
      if (!pincode && !businessType) return;
      const response = await API.get(`/connections/suggestions?pincode=${pincode}&businessType=${businessType}`);
      const distributors = response.data?.distributors || response.data || [];
      setSuggestedDistributors(Array.isArray(distributors) ? distributors : []);
    } catch (error) {
      console.error('Error fetching suggested distributors:', error);
      setSuggestedDistributors([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-3 md:p-6 flex flex-col lg:flex-row gap-3 md:gap-6">
      {/* Your Account Section */}
      <div className="flex-1 bg-blue-600 text-white rounded-lg shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Your Account</h1>

        {/* Account Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-10">
          <div className="flex items-center bg-blue-700 p-3 md:p-4 rounded-lg shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CircleCheck className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <h3 className="text-base md:text-lg font-bold">Your Orders History</h3>
              <p className="text-xs md:text-sm text-gray-200">View and manage your past orders.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-3 md:p-4 rounded-lg shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <h3 className="text-base md:text-lg font-bold">Login and Security</h3>
              <p className="text-xs md:text-sm text-gray-200">Update your password and account settings.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-3 md:p-4 rounded-lg shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Trash className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <h3 className="text-base md:text-lg font-bold">Your Addresses</h3>
              <p className="text-xs md:text-sm text-gray-200">Manage your saved delivery addresses.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-3 md:p-4 rounded-lg shadow">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <h3 className="text-base md:text-lg font-bold">Your Cards and Payments</h3>
              <p className="text-xs md:text-sm text-gray-200">Manage your saved cards and payment methods.</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-700 p-3 md:p-4 rounded-lg shadow sm:col-span-2">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 md:w-8 md:h-8 text-pink-600" />
            </div>
            <div className="ml-3 md:ml-4">
              <h3 className="text-base md:text-lg font-bold">Contact Us</h3>
              <p className="text-xs md:text-sm text-gray-200">Reach out to us for support or inquiries.</p>
            </div>
          </div>
        </div>

        {/* Carousel Section */}
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-bold text-blue-800 mb-3 md:mb-4">Discover More with Slege</h2>
          <div
            ref={carouselRef}
            className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth"
            style={{ scrollBehavior: "smooth" }}
          >
            {carouselItems.map((item, idx) => (
              <div
                key={idx}
                className="min-w-[80%] sm:min-w-[45%] max-w-[80%] sm:max-w-[45%] bg-blue-100 rounded-xl shadow-md p-3 md:p-4 flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-24 md:h-28 w-full object-cover rounded-lg mb-2 md:mb-3"
                />
                <h3 className="text-base md:text-lg font-bold text-blue-800">{item.title}</h3>
                <p className="text-xs md:text-sm text-blue-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Details Section */}
      <div className="w-full lg:w-2/5 bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-3 md:mb-4">Personal Details</h2>
        <div className="flex flex-col sm:flex-row items-center sm:items-start bg-blue-50 p-3 md:p-4 rounded-lg shadow mb-4 md:mb-6">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-full overflow-hidden flex-shrink-0 mb-3 sm:mb-0">
            <img src={GunjanImage} alt="Owner" className="w-full h-full object-cover" />
          </div>
          <div className="sm:ml-4 text-center sm:text-left">
            <h3 className="text-lg md:text-xl font-semibold text-blue-800">
              {retailerProfile ? retailerProfile.ownerName : "Loading..."}
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Owner : {retailerProfile ? retailerProfile.businessName : ""}
            </p>
            <p className="text-sm md:text-base text-gray-600 break-all sm:break-normal">
              Email: {retailerProfile ? retailerProfile.email : ""}
            </p>
            <p className="text-sm md:text-base text-gray-600">
              Phone: {retailerProfile ? retailerProfile.phone : ""}
            </p>
          </div>
        </div>

        {/* Distributor Management Section */}
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg shadow">
          {/* Tab Navigation */}
          <div className="flex mb-4 bg-white rounded-lg p-1">
            <button
              onClick={() => setActiveTab('distributors')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'distributors'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Building2 className="w-4 h-4 inline mr-1" />
              Connected ({connectedDistributors.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Requests ({connectionRequests.length})
            </button>
          </div>

          {/* Add New Distributor Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Find New Distributors
          </button>

          {/* Content based on active tab */}
          <div className="max-h-80 overflow-y-auto">
            {activeTab === 'distributors' && (
              <div>
                <h3 className="text-base md:text-lg font-semibold text-blue-800 mb-2">Connected Distributors</h3>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : connectedDistributors.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No connected distributors yet</p>
                    <p className="text-sm">Start by finding and connecting with distributors</p>
                  </div>
                ) : (
                  connectedDistributors.map((distributor) => (
                    <div
                      key={distributor._id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-3 rounded-lg shadow mb-2 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1 mb-2 sm:mb-0">
                        <p className="text-blue-800 font-medium text-sm md:text-base">{distributor.companyName}</p>
                        <p className="text-gray-600 text-xs md:text-sm">{distributor.ownerName}</p>
                        <p className="text-gray-600 text-xs">{distributor.phone}</p>
                        <p className="text-gray-600 text-xs">{distributor.location}</p>
                      </div>
                      <button
                        onClick={() => removeConnection(distributor._id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-xs transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <h3 className="text-base md:text-lg font-semibold text-blue-800 mb-2">Connection Requests</h3>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : connectionRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No connection requests</p>
                  </div>
                ) : (
                  connectionRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-white p-3 rounded-lg shadow mb-2 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-blue-800 font-medium text-sm md:text-base">
                            {request.distributor.companyName}
                          </p>
                          <p className="text-gray-600 text-xs md:text-sm">{request.distributor.ownerName}</p>
                          <p className="text-gray-600 text-xs">{request.distributor.phone}</p>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(request.status)}
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Sent: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      {request.message && (
                        <p className="text-xs text-gray-600 mt-1 italic">"{request.message}"</p>
                      )}
                      {request.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1">Reason: {request.rejectionReason}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-800">Find Distributors</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search by company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDistributors(searchQuery)}
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <button
                onClick={() => searchDistributors(searchQuery)}
                disabled={isSearching}
                className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchQuery.trim() === "" && suggestedDistributors.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>No distributor suggestions found for your area or business type.</p>
                </div>
              )}

              {searchQuery.trim() === "" && suggestedDistributors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Distributors in your area or business type</h4>
                  {suggestedDistributors.map((distributor) => (
                    <div key={distributor._id} className="bg-gray-50 p-4 rounded-lg mb-3 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-800">{distributor.companyName}</h4>
                          <p className="text-sm text-gray-600">{distributor.ownerName}</p>
                          <p className="text-sm text-gray-600">{distributor.phone}</p>
                          <p className="text-sm text-gray-600">{distributor.location}</p>
                          <p className="text-sm text-gray-600">{distributor.businessType}</p>
                        </div>
                        {!distributor.requestStatus ? (
                          <button
                            onClick={() => sendConnectionRequest(distributor._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Connect
                          </button>
                        ) : (
                          <span className="px-4 py-2 rounded-lg text-sm bg-gray-200 text-gray-600 font-semibold flex items-center">
                            {distributor.requestStatus === 'pending' && <>Requested</>}
                            {distributor.requestStatus === 'approved' && <>Connected</>}
                            {distributor.requestStatus === 'rejected' && <>Rejected</>}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Existing search results rendering */}
              {searchResults.length === 0 && !isSearching && searchQuery.trim() !== "" ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No distributors found for your search</p>
                </div>
              ) : (
                searchResults.map((distributor) => (
                  <div
                    key={distributor._id}
                    className="bg-gray-50 p-4 rounded-lg mb-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-800">{distributor.companyName}</h4>
                        <p className="text-sm text-gray-600">{distributor.ownerName}</p>
                        <p className="text-sm text-gray-600">{distributor.phone}</p>
                        <p className="text-sm text-gray-600">{distributor.location}</p>
                        <p className="text-sm text-gray-600">{distributor.businessType}</p>
                      </div>
                      <button
                        onClick={() => sendConnectionRequest(distributor._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Connect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirm Action</h3>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{confirmMessage}</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}