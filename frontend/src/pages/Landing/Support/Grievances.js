import React from "react";

export default function Grievances() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-6 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md">
            Grievances
          </h1>
          <p className="mt-6 text-lg font-medium">
            Let us know your concerns, and we'll address them promptly.
          </p>
        </div>
      </section>

      {/* Grievance Submission Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <form className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Grievance</label>
            <textarea
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              rows="5"
              placeholder="Describe your grievance"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900 transition"
          >
            Submit Grievance
          </button>
        </form>
      </section>
    </div>
  );
}