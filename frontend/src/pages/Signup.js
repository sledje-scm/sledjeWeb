import { useState } from "react";
import { Lock, User, Mail } from "lucide-react";
import bcrypt from "bcryptjs";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Signing up with", email, hashedPassword);
    setStep(2); // Move to OTP verification step
  };

  const verifyOtp = () => {
    console.log("Verifying OTP", otp);
    alert("Sign-up successful");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Sign Up</h2>
        <p className="text-center text-gray-600 mt-2">Create your account</p>
        {step === 1 ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-center border rounded-md px-3 py-2 bg-white">
              <Mail className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-none focus:ring-0 focus:outline-none"
              />
            </div>
            <div className="flex items-center border rounded-md px-3 py-2 bg-white">
              <Lock className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 border-none focus:ring-0 focus:outline-none"
              />
            </div>
            <div className="flex items-center border rounded-md px-3 py-2 bg-white">
              <Lock className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 border-none focus:ring-0 focus:outline-none"
              />
            </div>
            <button 
              onClick={handleSignUp} 
              className="w-full bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-4 rounded-lg shadow-lg text-lg font-semibold hover:scale-105 transition-transform">
              Next
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-center text-gray-600">Enter the OTP sent to your email</p>
            <div className="flex items-center border rounded-md px-3 py-2 bg-white">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 border-none focus:ring-0 focus:outline-none"
              />
            </div>
            <button 
              onClick={verifyOtp} 
              className="w-full bg-green-600 text-white py-4 rounded-lg shadow-lg text-lg font-semibold hover:scale-105 transition-transform">
              Verify OTP
            </button>
          </div>
        )}
        <p className="text-center text-gray-600 mt-4">
          Already have an account? <a href="#" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
