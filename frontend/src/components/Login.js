import React, { useState, useEffect } from 'react';
import { User, Building2, Users, Mail, Lock, Phone, MapPin, FileText, Eye, EyeOff, ArrowLeft, X, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from './AuthContext';
import API from '../api'; 
import { useNavigate } from 'react-router-dom';

export default function App() {
 const [activeTab, setActiveTab] = useState(null);
 const [userType, setUserType] = useState(null);
 const { login: authLogin } = useAuth();
 const navigate = useNavigate();
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState({ type: '', text: '' });
 const [location, setLocation] = useState("");
 const [showInitialButtons, setShowInitialButtons] = useState(true);

 const mainContainerVariants = {
 initial: { opacity: 0, scale: 0.9, rotateY: 10, y: 50 },
 enter: { opacity: 1, scale: 1, rotateY: 0, y: 0, transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] } },
 exit: { opacity: 0, scale: 0.8, rotateY: -10, y: -50, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
 };

 const handleGoBackToInitial = () => {
 setShowInitialButtons(true);
 setActiveTab(null);
 setUserType(null);
 setMessage({ type: '', text: '' });
 };

 const handleGoBackToUserTypeSelection = () => {
 setUserType(null);
 setMessage({ type: '', text: '' });
 };

 const handleCloseLogin = () => {
 window.location.href = '/';
 };

 useEffect(() => {
 if ("geolocation" in navigator) {
 navigator.geolocation.getCurrentPosition(
 (position) => setLocation(`${position.coords.latitude},${position.coords.longitude}`),
 (error) => console.error("Error fetching location:", error)
 );
 } else {
 console.warn("Geolocation is not supported by your browser");
 }
 }, []);

 const [loginData, setLoginData] = useState({ email: '', password: '' });
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
 { id: 'retailers', label: 'Retailers', icon: Building2, description: 'Access your Retailer account.' },
 { id: 'distributors', label: 'Distributors', icon: Users, description: 'Access your Distributor account.' },
 { id: 'partners', label: 'Partners', icon: User, description: 'Access your Partner account.' }
 ];

 const businessTypes = ['Retail Store', 'Wholesale', 'E-commerce', 'Manufacturing', 'Distribution', 'Service Provider', 'Other'];

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

 const isLoginFormValid = () => loginData.email.trim() !== '' && loginData.password.trim() !== '';

 const isRegisterFormValid = () => {
 const requiredFields = ['ownerName', 'email', 'password', 'phone'];
 const businessNameField = userType === 'retailers' ? 'businessName' : 'CompanyName';
 requiredFields.push(businessNameField);
 return requiredFields.every(field => registerData[field].trim() !== '');
 };

 // This function now ONLY sets the user type, preserving the activeTab choice.
 const handleUserTypeSelection = (id) => {
 setUserType(id);
 };

 const selectedUserTypeLabel = userTypes.find(type => type.id === userType)?.label;

 const getSubtitle = () => {
 if (userType && activeTab === 'login') {
 return `Sign in to your ${selectedUserTypeLabel} account.`;
 }
 if (userType && activeTab === 'register') {
 return `Create your new ${selectedUserTypeLabel} account.`;
 }
 if (!userType && !showInitialButtons) {
 return `Who are you? Select your business profile to continue.`;
 }
 return 'Seamlessly connect and grow.';
 };

 return (
 <motion.div
 className="fixed w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white flex items-center justify-center font-inter p-4 sm:p-8 overflow-hidden"
 initial="initial" animate="enter" exit="exit" variants={mainContainerVariants} style={{ transformStyle: "preserve-3d", perspective: 1000 }}
 >
 <div className="absolute inset-0 z-0 opacity-20" style={{
 backgroundImage: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M100 0L0 100V0h100zM0 0l100 100H0V0z\' fill=\'%230F172A\' fill-opacity=\'0.4\'/%3E%3C/svg%3E")',
 backgroundSize: '20px 20px', animation: 'grid-pan 60s linear infinite'
 }}></div>
 <style>{`@keyframes grid-pan { from { background-position: 0 0; } to { background-position: -1000px -1000px; } }`}</style>

 <div className="relative h-full w-full max-w-7xl mx-auto bg-slate-800/30 backdrop-blur-3xl shadow-[0_0_60px_rgba(59,130,246,0.25)] border border-blue-700/50 flex flex-col lg:flex-row overflow-hidden rounded-3xl transform-gpu transition-all duration-1000 ease-in-out">
 <AnimatePresence>
 {!showInitialButtons && (
 <motion.button key="back-button"
 onClick={() => userType ? handleGoBackToUserTypeSelection() : handleGoBackToInitial()}
 className="absolute top-6 ml-2 z-50 p-3 rounded-full bg-blue-900/50 border border-blue-700/70 text-blue-300 hover:bg-blue-800/70 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
 >
 <ArrowLeft className="w-5 h-5" />
 <span className="hidden sm:inline">Back</span>
 </motion.button>
 )}
 </AnimatePresence>

 <motion.button key="close-button" onClick={handleCloseLogin}
 className="absolute top-6 right-6 z-50 p-3 rounded-full bg-slate-800/50 border border-slate-600/70 text-slate-300 hover:bg-slate-700/70 hover:text-white transition-all duration-300 shadow-lg hover:shadow-slate-500/30"
 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
 >
 <X className="w-5 h-5" />
 </motion.button>

 <motion.div
 className={`flex-1 flex flex-col items-center justify-center h-full p-8 relative z-10 ${!showInitialButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
 initial={{ opacity: 0, x: -50 }} animate={{ opacity: !showInitialButtons ? 1 : 0, x: !showInitialButtons ? 0 : -50 }}
 transition={{ duration: 0.8, ease: "easeInOut" }}
 >
 <div className="w-full max-w-lg mx-auto p-6">
 <div className="text-center mb-10 mt-10 w-full">
 <motion.h1
 className="text-7xl font-extrabold leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 drop-shadow-lg"
 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
 >
 Welcome 
 </motion.h1>
 <motion.p className="text-xl text-gray-300 mt-4 min-h-[56px]"
 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
 >
 {getSubtitle()}
 </motion.p>
 </div>
 
 {message.text && (
 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
 className={`mb-6 p-4 text-sm rounded-xl border backdrop-blur-sm ${message.type === 'success' ? 'bg-green-600/30 text-green-200 border-green-500/50' : 'bg-red-600/30 text-red-200 border-red-500/50'}`}
 >
 
 </motion.div>
 )}
 
 {/* Login Form */}
 {activeTab === 'login' && userType && (
 <motion.div key="login-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, position: 'absolute' }}
 transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6 w-full"
 >
 <div className="relative">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input type="email" value={loginData.email} onChange={(e) => handleInputChange('login', 'email', e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
 placeholder="Email address" required
 />
 </div>
 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input type={showPassword ? 'text' : 'password'} value={loginData.password} onChange={(e) => handleInputChange('login', 'password', e.target.value)}
 className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
 placeholder="Password" required
 />
 <button type="button" onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-300 transition-colors duration-200"
 >
 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>
 <motion.button type="submit" disabled={loading || !isLoginFormValid()} onClick={handleLogin}
 className="w-full bg-gradient-to-r from-sky-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-sky-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-blue-500/40 transform-gpu"
 whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(59,130,246,0.4)" }} whileTap={{ scale: 0.98 }}
 >
 {loading ? 'Authenticating...' : 'Sign In'}
 </motion.button>
 </motion.div>
 )}
 
 {/* FULL Register Form */}
 {activeTab === 'register' && userType && (
 <motion.div key="register-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, position: 'absolute' }}
 transition={{ duration: 0.5, delay: 0.1 }} className="space-y-5 w-full"
 >
 <div className="relative">
 <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="text"
 value={userType === 'retailers' ? registerData.businessName : registerData.CompanyName}
 onChange={(e) => handleInputChange('register', userType === 'retailers' ? 'businessName' : 'CompanyName', e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
 placeholder={`${userType === 'retailers' ? 'Business' : 'Company'} name`}
 required
 />
 </div>

 <div className="relative">
 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="text"
 value={registerData.ownerName}
 onChange={(e) => handleInputChange('register', 'ownerName', e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
 placeholder="Owner name"
 required
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="relative">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="email"
 value={registerData.email}
 onChange={(e) => handleInputChange('register', 'email', e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
 placeholder="Email"
 required
 />
 </div>
 <div className="relative">
 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="tel"
 value={registerData.phone}
 onChange={(e) => handleInputChange('register', 'phone', e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
 placeholder="Phone"
 required
 />
 </div>
 </div>

 <div className="relative">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type={showPassword ? 'text' : 'password'}
 value={registerData.password}
 onChange={(e) => handleInputChange('register', 'password', e.target.value)}
 className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
 placeholder="Password"
 required
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-300 transition-colors duration-200"
 >
 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="relative">
 <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="text"
 value={registerData.gstNumber}
 onChange={(e) => handleInputChange('register', 'gstNumber', e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
 placeholder="GST number (Optional)"
 />
 </div>
 <div className="relative">
 <select
 value={registerData.businessType}
 onChange={(e) => handleInputChange('register', 'businessType', e.target.value)}
 className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner appearance-none pr-10"
 >
 <option value="" className="bg-gray-800 text-gray-400">Business type (Optional)</option>
 {businessTypes.map((type) => (
 <option key={type} value={type} className="bg-gray-800 text-white">{type}</option>
 ))}
 </select>
 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
 <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="relative">
 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="text"
 value={registerData.pincode}
 onChange={(e) => handleInputChange('register', 'pincode', e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
 placeholder="Pincode (Optional)"
 />
 </div>
 <div className="relative">
 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <input
 type="text"
 value={registerData.location}
 onChange={(e) => handleInputChange('register', 'location', e.target.value)}
 className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 shadow-inner"
 placeholder="Location (Optional)"
 />
 </div>
 </div>
 <motion.button type="submit" disabled={loading || !isRegisterFormValid()} onClick={handleRegister}
 className="w-full bg-gradient-to-r from-sky-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-sky-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-blue-500/40 transform-gpu"
 whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(59,130,246,0.4)" }} whileTap={{ scale: 0.98 }}
 >
 {loading ? 'Creating account...' : 'Create Account'}
 </motion.button>
 </motion.div>
 )}
 </div>
 </motion.div>
 
 <motion.div
 className={`relative flex-shrink-0 bg-center bg-cover flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out rounded-r-3xl ${showInitialButtons ? 'w-full lg:w-full' : (userType ? 'lg:w-[480px]' : 'w-full lg:w-full')}`}
 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
 initial={{ width: '100%' }} animate={{ width: showInitialButtons ? '100%' : (userType ? '480px' : '100%') }} transition={{ duration: 1, ease: "easeInOut" }}
 >
 <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-0" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0" />

 {/* Initial Buttons */}
 <AnimatePresence>
 {showInitialButtons && (
 <motion.div className="h-full w-full mr-64 pr-40 relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 p-12 backdrop-blur-lg"
 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.6, delay: 0.3 }}
 >
 <motion.button onClick={() => { setShowInitialButtons(false); setActiveTab('login'); }}
 className="w-64 h-64 relative bg-white/10 p-8 rounded-3xl border border-white/20 shadow-xl cursor-pointer hover:bg-white/20 transition-all duration-300 max-w-xs text-center flex flex-col items-center justify-center group overflow-hidden transform-gpu"
 whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.4)" }} whileTap={{ scale: 0.95 }}
 >
 <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 to-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
 <div className="relative z-10 w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 border border-white/30">
 <LogIn className="w-16 h-16 text-white group-hover:text-sky-300 transition-colors" />
 </div>
 <h3 className="relative z-10 text-2xl font-bold text-white mb-2 group-hover:text-sky-200 transition-colors">Login</h3>
 <p className="relative z-10 text-gray-200 text-md group-hover:text-gray-100 transition-colors">Access your account.</p>
 </motion.button>
 <motion.button onClick={() => { setShowInitialButtons(false); setActiveTab('register'); }}
 className="w-64 h-64 relative bg-white/10 p-8 rounded-3xl border border-white/20 shadow-xl cursor-pointer hover:bg-white/20 transition-all duration-300 max-w-xs text-center flex flex-col items-center justify-center group overflow-hidden transform-gpu"
 whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.4)" }} whileTap={{ scale: 0.95 }}
 >
 <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 to-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
 <div className="relative z-10 w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 border border-white/30">
 <UserPlus className="w-16 h-16 text-white group-hover:text-sky-300 transition-colors" />
 </div>
 <h3 className="relative z-10 text-2xl font-bold text-white mb-2 group-hover:text-sky-200 transition-colors">New User</h3>
 <p className="relative z-10 text-gray-200 text-md group-hover:text-gray-100 transition-colors">Create a new account.</p>
 </motion.button>
 </motion.div>
 )}
 </AnimatePresence>

 {/* User Type Selection */}
 <AnimatePresence>
 {!showInitialButtons && !userType && (
 <motion.div className="absolute inset-0 flex mr-64 pr-40 flex-col items-center justify-center gap-6 p-12 backdrop-blur-lg z-10"
 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, delay: 0.3 }}
 >
 {userTypes.map((type) => (
 <motion.div key={type.id}
 className="relative bg-white/10 p-6 rounded-3xl border border-white/20 shadow-xl cursor-pointer hover:bg-white/20 transition-all duration-300 w-full max-w-md flex flex-col items-center justify-center text-center group overflow-hidden transform-gpu"
 onClick={() => handleUserTypeSelection(type.id)}
 whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59,130,246,0.3)" }} whileTap={{ scale: 0.95 }}
 >
 <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 to-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
 <div className="relative z-10 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 border border-white/30">
 <type.icon className="w-8 h-8 text-white group-hover:text-sky-300 transition-colors" />
 </div>
 <h3 className="relative z-10 text-xl font-bold text-white mb-2 group-hover:text-sky-200 transition-colors">{type.label}</h3>
 <p className="relative z-10 text-gray-200 text-sm group-hover:text-gray-100 transition-colors">{type.description}</p>
 </motion.div>
 ))}
 </motion.div>
 )}
 </AnimatePresence>
 
 {/* Welcome Message */}
 <AnimatePresence>
 {!showInitialButtons && userType && (
 <motion.div className="flex justify-center items-left h-full w-full relative z-10"
 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
 transition={{ delay: 0.5, duration: 0.5 }}
 >
 <motion.div className="relative z-10 text-center text-white max-w-2/3 p-8 rounded-2xl border border-white/10 shadow-lg"
 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
 >
 <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
 <Building2 className="w-12 h-12 text-sky-300" />
 </div>
 <h2 className="text-4xl font-semibold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400">
 Welcome to Business Portal
 </h2>
 <p className="text-gray-300 leading-relaxed text-xl max-w-md mx-auto">
 Connect with retailers, distributors, and partners. Manage your business operations efficiently.
 </p>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 </div>
 </motion.div>
 );
}