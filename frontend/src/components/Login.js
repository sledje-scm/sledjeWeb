import React, { useState ,useEffect} from 'react';
import { User, Building2, Users, Mail, Lock, Phone, MapPin, FileText, Eye, EyeOff } from 'lucide-react';
import API from '../api'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { useAuth } from './AuthContext';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('retailers');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // Destructure the login function with a renamed alias
  const [location, setLocation] = useState("");
  
      useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setLocation(coords);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Please enable location services to auto-fill location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  }, []);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    businessName: '',
    CompanyName: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    gstNumber: '',
    businessType: '',
    pincode: '',
    location: '' // Use the fetched location
  });

  const userTypes = [
    { id: 'retailers', label: 'Retailers', icon: Building2 },
    { id: 'distributors', label: 'Distributors', icon: Users },
    { id: 'partners', label: 'Partners', icon: User }
  ];

  const businessTypes = [
    'Retail Store', 'Wholesale', 'E-commerce', 'Manufacturing', 
    'Distribution', 'Service Provider', 'Other'
  ];

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission if used in a form
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = userType === 'retailers' ? '/retailers/login' : '/distributors/login';
      const response = await API.post(endpoint, {
        email: loginData.email,
        password: loginData.password
      });
      
      setMessage({ type: 'success', text: 'Login successful' });
      console.log('Login response:', response.data);
      
      // Call the auth context login function with response data if needed
      if (authLogin) {
        authLogin({ user: response.data }); // Pass user data to context
      }
      
      // Navigate to appropriate dashboard
      navigate(userType === 'retailers' ? '/retailer' : '/distributor');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form submission if used in a form
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let endpoint, payload;
      
      if (userType === 'retailers') {
        endpoint = '/retailers/register';
        payload = {
          businessName: registerData.businessName,
          ownerName: registerData.ownerName,
          email: registerData.email,
          password: registerData.password,
          phone: registerData.phone,
          gstNumber: registerData.gstNumber,
          businessType: registerData.businessType,
          pincode: registerData.pincode,
          location: location || registerData.location,
        };
      } else {
        endpoint = '/distributors/register';
        payload = {
          CompanyName: registerData.CompanyName,
          ownerName: registerData.ownerName,
          email: registerData.email,
          password: registerData.password,
          phone: registerData.phone,
          gstNumber: registerData.gstNumber,
          businessType: registerData.businessType,
          pincode: registerData.pincode,
          location: location || registerData.location,
        };
      }

      await API.post(endpoint, payload);
      alert('Registration successful!');
      // Optionally, you can redirect to login or dashboard page  
      
      setMessage({ type: 'success', text: 'Account created successfully' });
      
      // Reset form data
      setRegisterData({
        businessName: '',
        CompanyName: '',
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        gstNumber: '',
        businessType: '',
        pincode: '',
        location: ''
      });
      
      // Switch to login tab after successful registration
      setTimeout(() => {
        setActiveTab('login');
        setMessage({ type: '', text: '' });
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (form, field, value) => {
    if (form === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [field]: value }));
    }
  };

  const isLoginFormValid = () => {
    return loginData.email.trim() !== '' && loginData.password.trim() !== '';
  };

  const isRegisterFormValid = () => {
    const requiredFields = ['ownerName', 'email', 'password', 'phone'];
    const businessNameField = userType === 'retailers' ? 'businessName' : 'CompanyName';
    requiredFields.push(businessNameField);
    
    return requiredFields.every(field => registerData[field].trim() !== '');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 lg:flex-none lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-gray-900 mb-2">Business Portal</h1>
            <p className="text-gray-500 text-sm">Sign in to your account</p>
          </div>

          {/* User Type Selection */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            {userTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setUserType(type.id)}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1 ${
                    userType === type.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-3 h-3" />
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Auth Tabs */}
          <div className="flex mb-6">
            <button
              onClick={() => {
                setActiveTab('login');
                setMessage({ type: '', text: '' });
              }}
              className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setMessage({ type: '', text: '' });
              }}
              className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'register'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-4 p-3 text-sm rounded ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isLoginFormValid()}
                className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Registration Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={userType === 'retailers' ? registerData.businessName : registerData.CompanyName}
                  onChange={(e) => handleInputChange('register', userType === 'retailers' ? 'businessName' : 'CompanyName', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`${userType === 'retailers' ? 'Business' : 'Company'} name`}
                  required
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={registerData.ownerName}
                  onChange={(e) => handleInputChange('register', 'ownerName', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Owner name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => handleInputChange('register', 'phone', e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerData.password}
                  onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerData.gstNumber}
                    onChange={(e) => handleInputChange('register', 'gstNumber', e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="GST number"
                  />
                </div>
                <select
                  value={registerData.businessType}
                  onChange={(e) => handleInputChange('register', 'businessType', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerData.pincode}
                    onChange={(e) => handleInputChange('register', 'pincode', e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Pincode"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerData.location}
                    onChange={(e) => handleInputChange('register', 'location', e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Location"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isRegisterFormValid()}
                className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-blue-600 items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-light mb-4">Welcome to Business Portal</h2>
          <p className="text-blue-100 leading-relaxed">
            Connect with retailers, distributors, and partners. Manage your business operations efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}