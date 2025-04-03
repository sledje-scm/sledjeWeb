import { useState } from "react";
import bcrypt from "bcryptjs";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  
  const handleSignUp = async () => {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert("Invalid email format");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Invalid phone number");
      return;
    }
    if (gstNumber && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d{1}[A-Z\d]{1}[A-Z\d]{1}$/.test(gstNumber)) {
      alert("Invalid GST number format");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Signing up with", email, hashedPassword);
    setStep(2);
  };

  const verifyOtp = () => {
    console.log("Verifying OTP", otp);
    setStep(3);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-10 px-12 py-16">
      <h2 className="text-4xl font-bold text-left text-gray-900 mb-8">Register Yourself as a Retailer</h2>
      <div className="w-full max-w-5xl mx-auto">
        {step === 1 ? (
          <div className="grid grid-cols-1 gap-6">
            {[{ label: "Business Name", value: businessName, setter: setBusinessName, type: "text", placeholder: "Enter business name" },
              { label: "Owner Name", value: ownerName, setter: setOwnerName, type: "text", placeholder: "Enter owner name" },
              { label: "Phone Number", value: phone, setter: setPhone, type: "tel", placeholder: "Enter 10-digit phone number" },
              { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "Enter email address" },
              { label: "Password", value: password, setter: setPassword, type: "password", placeholder: "Enter password" },
              { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, type: "password", placeholder: "Confirm password" },
              { label: "GST Number (if applicable)", value: gstNumber, setter: setGstNumber, type: "text", placeholder: "Enter GST number" }
            ].map(({ label, value, setter, type, placeholder }, index) => (
              <div key={index} className="flex items-center">
                <label className="w-1/3 text-gray-700 font-semibold">{label}:</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="w-2/3 p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        ) : step === 2 ? (
          <div className="text-center">
            <p className="text-gray-600">Enter the OTP sent to your email</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            />
            <button onClick={verifyOtp} className="w-full bg-green-600 text-white py-3 rounded-md shadow-md text-lg font-semibold mt-4 hover:bg-green-700 transition">Verify OTP</button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Request Submitted</p>
            <button className="w-full bg-blue-700 text-white py-3 rounded-md shadow-md text-lg font-semibold mt-6 hover:bg-blue-800 transition transform hover:scale-105">Finish</button>
          </div>
        )}
        {step === 1 && (
          <button onClick={handleSignUp} className="w-full bg-blue-800 text-white py-3 rounded-md shadow-md text-lg font-semibold mt-6 hover:bg-blue-800 transition transform hover:scale-105">Next</button>
        )}
      </div>
    </div>
  );
}
