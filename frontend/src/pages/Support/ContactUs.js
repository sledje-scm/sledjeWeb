import React from "react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-6 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md">
            Contact Us
          </h1>
          <p className="mt-6 text-lg font-medium">
            We're here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-800">
            Contact Information
          </h2>
          <p className="mt-4 text-gray-700">
            Feel free to reach out to us through the following contact details:
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <strong>Email:</strong> support@sledgesolutions.com
            </li>
            <li>
              <strong>Phone:</strong> +1 234 567 890
            </li>
            <li>
              <strong>Address:</strong> 123 Business Street, City, Country
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <form className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-blue-800">
            Send Us a Message
          </h2>
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
            <label className="block text-gray-700 font-bold mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Your Phone Number"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Message</label>
            <textarea
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
              rows="5"
              placeholder="Your Message"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900 transition"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}