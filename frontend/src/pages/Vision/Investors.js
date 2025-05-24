import React from "react";
import { motion } from "framer-motion";

export default function Investors() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-6 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md">
            Meet Our Investors
          </h1>
          <p className="mt-6 text-lg font-medium">
            The driving force behind our success and innovation.
          </p>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGZvdW5kZXJzfGVufDB8fHx8MTY4MjE4Mjk4Nw&ixlib=rb-1.2.1&q=80&w=1080')",
          }}
        ></div>
      </section>

      {/* Investors Section */}
      <section className="py-16 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            name: "John Doe",
            role: "Angel Investor",
            desc: "John has been a key supporter of our vision, providing invaluable guidance and resources.",
            image:
              "https://via.placeholder.com/300x300.png?text=John+Doe",
          },
          {
            name: "Jane Smith",
            role: "Venture Capitalist",
            desc: "Jane brings years of experience in scaling businesses and has been instrumental in our growth.",
            image:
              "https://via.placeholder.com/300x300.png?text=Jane+Smith",
          },
          {
            name: "Michael Lee",
            role: "Strategic Partner",
            desc: "Michael’s strategic insights and investments have helped us expand our global reach.",
            image:
              "https://via.placeholder.com/300x300.png?text=Michael+Lee",
          },
          {
            name: "Emily Davis",
            role: "Tech Investor",
            desc: "Emily’s passion for technology and innovation aligns perfectly with our mission.",
            image:
              "https://via.placeholder.com/300x300.png?text=Emily+Davis",
          },
          {
            name: "David Brown",
            role: "Seed Investor",
            desc: "David believed in our potential from the very beginning and has been a constant supporter.",
            image:
              "https://via.placeholder.com/300x300.png?text=David+Brown",
          },
          {
            name: "Sophia Wilson",
            role: "Impact Investor",
            desc: "Sophia focuses on sustainable and impactful investments, driving our eco-friendly initiatives.",
            image:
              "https://via.placeholder.com/300x300.png?text=Sophia+Wilson",
          },
        ].map((investor, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center h-full transition-transform"
          >
            <img
              src={investor.image}
              alt={investor.name}
              className="w-32 h-32 rounded-full mb-4"
            />
            <h3 className="text-xl font-bold">{investor.name}</h3>
            <p className="text-blue-800 font-semibold">{investor.role}</p>
            <p className="mt-2 text-gray-700">{investor.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">
            Join Our Journey
          </h2>
          <p className="mt-4 text-lg">
            Be a part of our mission to empower businesses and communities worldwide.
          </p>
          <button className="mt-8 px-12 py-4 text-lg bg-white text-blue-800 shadow-lg rounded-md hover:bg-gray-100 transition-transform">
            Become an Investor
          </button>
        </div>
      </section>
    </div>
  );
}