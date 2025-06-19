import React, { useState, useEffect } from 'react';
import { User, Building2, Users, Mail, Lock, Phone, MapPin, FileText, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('retailers');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
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
    location: ''
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
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Login successful' });
      console.log('Login attempt:', loginData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      setMessage({ type: 'error', text: 'Registration failed' });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 ">
      <div className="h-[70vh] w-[70vw] mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100/50 flex overflow-hidden">
        {/* Left Panel - Form Content */}
        <div className="flex-1 flex items-center justify-center p-10">
          <div className="w-full max-w-xl">
            {/* Header */}
            <div className="text-center mb-10 h-full">
              <h1 className="text-7xl md:text-5xl font-bold leading-tight mb-6 tracking-tight pr-8">Business Portal</h1>
              <p className="text-5xl md:text-3xl font-bold leading-tight mb-6 tracking-tight text-blue-400 pr-8">Sign in to your account</p>
            </div>

            {/* User Type Selection */}
            <div className="flex mb-8 bg-gray-50/80 rounded-2xl p-1.5 backdrop-blur-sm">
              {userTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setUserType(type.id)}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-full transition-all duration-200 flex items-center justify-center gap-2 ${
                      userType === type.id
                        ? 'bg-black text-white shadow-sm border border-gray-100/70'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>

            {/* Auth Tabs */}
            <div className="flex mb-8 bg-gray-50/50 rounded-full p-1">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setMessage({ type: '', text: '' });
                }}
                className={`flex-1 py-3 text-base font-medium rounded-full transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100/70'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setMessage({ type: '', text: '' });
                }}
                className={`flex-1 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-teal-400 text-base text-white font-medium rounded-full transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-black-900 text-white shadow-sm border border-gray-100/70'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-black'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`mb-6 p-4 text-sm rounded-full border backdrop-blur-sm ${
                message.type === 'success' 
                  ? 'bg-green-50/80 text-green-700 border-green-100/50' 
                  : 'bg-red-50/80 text-red-700 border-red-100/50'
              }`}>
                {message.text}
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <div className="space-y-5">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200/50 rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isLoginFormValid()}
                  className="w-full bg-gray-900 text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                
              </div>
            )}

            {/* Registration Form */}
            {activeTab === 'register' && (
              <div className="space-y-5">
                <div className="relative">
                  <Building2 className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={userType === 'retailers' ? registerData.businessName : registerData.CompanyName}
                    onChange={(e) => handleInputChange('register', userType === 'retailers' ? 'businessName' : 'CompanyName', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder={`${userType === 'retailers' ? 'Business' : 'Company'} name`}
                    required
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerData.ownerName}
                    onChange={(e) => handleInputChange('register', 'ownerName', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Owner name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => handleInputChange('register', 'phone', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Phone"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200/50 rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.gstNumber}
                      onChange={(e) => handleInputChange('register', 'gstNumber', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="GST number"
                    />
                  </div>
                  <select
                    value={registerData.businessType}
                    onChange={(e) => handleInputChange('register', 'businessType', e.target.value)}
                    className="w-full px-2 py-2 pr-4 bg-white border rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900"
                  >
                    <option value="">Business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.pincode}
                      onChange={(e) => handleInputChange('register', 'pincode', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Pincode"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.location}
                      onChange={(e) => handleInputChange('register', 'location', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-full focus:outline-none focus:bg-white focus:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Location"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isRegisterFormValid()}
                  className="w-full bg-gray-900 text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-br from-gray-900 to-gray-800 items-center justify-center p-8">
          <div className="text-center text-white max-w-sm">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <Building2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-normal mb-6 tracking-tight">Welcome to Business Portal</h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              Connect with retailers, distributors, and partners. Manage your business operations efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}