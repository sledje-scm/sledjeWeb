import { useState } from "react";
import { Lock, User, ShieldCheck, Loader2 } from "lucide-react"; // Add Loader2 for spinner
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../components/AuthContext";

export default function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [otp, setOtp] = useState(""); 
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // <-- Spinner state
  const navigate = useNavigate();
  const { login } = useAuth();

  const isTestMode = false; // Set to `true` for testing, `false` for real login

  const handleLogin = async () => {
    if (loading) return; // Prevent double click
    try {
      setLoading(true); // Start spinner
      if (isTestMode) {
        console.log('Test mode - bypassing login.');
        localStorage.setItem('userInfo', JSON.stringify({ username: 'Test User', token: 'fake-token' }));
        navigate("/layout");
        return;
      }
      const { data } = await API.post('/retailers/login', {
        email,
        password,
      });
      console.log('Logged in:', data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      login();
      navigate("/layout");
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  const verifyOtp = () => {
    console.log("Verifying OTP", otp);
  };

  return (
    <div className="p-8 rounded-lg w-full bg-transparent backdrop-blur-xl">
      <h2 className="text-3xl font-extrabold text-center text-gray-900">Login</h2>
      <p className="text-center text-gray-600 mt-2">Access your account securely</p>
      {step === 1 ? (
        <div className="mt-6 space-y-4">
          <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
            <User className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none"
              disabled={loading}
            />
          </div>
          <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
            <Lock className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none"
              disabled={loading}
            />
          </div>
          <button 
            onClick={handleLogin}
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-3 rounded-md shadow-md text-lg font-semibold transition-transform
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                Signing in...
              </span>
            ) : (
              "Next"
            )}
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-center text-gray-600">Enter the OTP sent to your email</p>
          <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
            <ShieldCheck className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none"
            />
          </div>
          <button onClick={verifyOtp} className="w-full bg-green-600 text-white py-3 rounded-md shadow-md text-lg font-semibold hover:scale-105 transition-transform">
            Verify OTP
          </button>
        </div>
      )}
      <p className="text-center text-gray-600 mt-4">
        Don't have an account?  <Link to="/signup" className="text-blue-600 hover:underline ml-1">Sign up</Link>
      </p>
    </div>
  );
}