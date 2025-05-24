import React from "react";
import { motion } from "framer-motion";

export default function DeliveryPartners() {
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
            Delivery Partners
          </motion.h1>
          <motion.p
            className="mt-6 text-lg font-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ensuring timely and efficient delivery with our trusted logistics partners.
          </motion.p>
        </div>
      </section>

      {/* Delivery Partners Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1591012911201-8d3b4e0b7b9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGRlbGl2ZXJ5fGVufDB8fHx8MTY4MjE4Mjk4Nw&ixlib=rb-1.2.1&q=80&w=1080"
            alt="Delivery Partners"
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-blue-800">Delivery Partner Benefits</h3>
            <p className="mt-2 text-gray-700">
              Ensure timely deliveries with optimized routes and real-time tracking.
            </p>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1515165562835-cf75965c0b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGRlbGl2ZXJ5fGVufDB8fHx8MTY4MjE4Mjk4Nw&ixlib=rb-1.2.1&q=80&w=1080"
            alt="Delivery Tools"
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-blue-800">Delivery Tools</h3>
            <p className="mt-2 text-gray-700">
              Access tools to track deliveries, optimize logistics, and ensure customer satisfaction.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Partner With Us for Deliveries</h2>
          <p className="mt-4 text-lg">
            Join our delivery network to ensure seamless and timely deliveries.
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