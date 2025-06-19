import React from "react";
import { motion } from "framer-motion";

export default function InventoryManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-6 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-5xl font-extrabold leading-tight drop-shadow-md"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Inventory Management
          </motion.h1>
          <motion.p
            className="mt-6 text-lg font-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Stay updated with real-time stock levels and streamline your inventory processes.
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          "Real-time stock tracking",
          "Automated inventory updates",
          "Low-stock alerts",
          "Centralized inventory management",
          "Detailed inventory reports",
          "Seamless integration with ERP systems",
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center h-full transition-transform"
          >
            <div className="w-16 h-16 bg-blue-800 text-white rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">{index + 1}</span>
            </div>
            <p className="text-gray-700">{feature}</p>
          </motion.div>
        ))}
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Ready to Optimize Your Inventory?</h2>
          <p className="mt-4 text-lg">
            Take control of your inventory with our advanced management solutions.
          </p>
          <motion.button
            className="mt-8 px-12 py-4 text-lg bg-white text-blue-800 shadow-lg rounded-md hover:bg-gray-100 transition-transform"
            whileHover={{ scale: 1.1 }}
          >
            Get Started
          </motion.button>
        </div>
      </section>
    </div>
  );
}