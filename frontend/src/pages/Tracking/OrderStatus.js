import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import trackingBackground from "../../assets/trackingBackground.png";

export default function OrderStatus() {
  console.log("OrderStatus component rendered"); // Debugging log

  const [trackingInput, setTrackingInput] = useState("");

  const handleInputChange = (e) => {
    setTrackingInput(e.target.value);
    console.log("Tracking Input Changed:", e.target.value); // Debugging log
  };

  const handleSubmit = () => {
    if (trackingInput.trim()) {
      console.log("Tracking Input Submitted:", trackingInput); // Debugging log
    } else {
      alert("Please enter a valid Tracking Number or Shop ID.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Add padding to push content further below the navbar */}
      <div className="pt-32">
        {/* Background Image with Tracking Box */}
        <div className="relative">
          <div
            className="h-96 w-100 bg-cover bg-center"
            style={{ backgroundImage: `url(${trackingBackground})` }}
          ></div>
          {/* Tracking Box */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
            <h2 className="text-2xl font-bold mb-6">Track Your Order</h2>
            <input
              type="text"
              placeholder="Enter Tracking Number or Shop ID"
              value={trackingInput}
              onChange={handleInputChange}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg mb-6 text-lg"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-800 text-white py-3 rounded-lg text-lg hover:bg-blue-900 transition"
            >
              Track
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}