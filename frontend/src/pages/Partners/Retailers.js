import React from "react";
import { motion } from "framer-motion";

export default function Retailers() {
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
            Retailers
          </motion.h1>
          <motion.p
            className="mt-6 text-lg font-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering retailers with tools to manage inventory, billing, and customer relationships.
          </motion.p>
        </div>
      </section>

      {/* Retailers Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1556742400-b5b7c512f6b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHJldGFpbGVyc3xlbnwwfHx8fDE2ODIxODI5ODc&ixlib=rb-1.2.1&q=80&w=1080"
            alt="Retailers"
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-blue-800">Retailer Benefits</h3>
            <p className="mt-2 text-gray-700">
              Access tools to manage inventory, billing, and customer relationships seamlessly.
            </p>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1515165562835-cf75965c0b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHJldGFpbGVyc3xlbnwwfHx8fDE2ODIxODI5ODc&ixlib=rb-1.2.1&q=80&w=1080"
            alt="Retailer Tools"
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-bold text-blue-800">Retailer Tools</h3>
            <p className="mt-2 text-gray-700">
              Leverage advanced tools to track sales, manage stock, and grow your business.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Join Our Retailer Network</h2>
          <p className="mt-4 text-lg">
            Partner with us to streamline your operations and grow your business.
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