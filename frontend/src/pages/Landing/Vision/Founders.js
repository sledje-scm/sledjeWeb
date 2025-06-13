import React from "react";
import { motion } from "framer-motion";

// Import images
import NishantImage from "../../../assets/founders/N.png";
import GunjanImage from "../../../assets/founders/G.jpeg";

export default function Founders() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-6 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md">
            Meet Our Founders
          </h1>
          <p className="mt-6 text-lg font-medium">
            The visionaries behind our success.
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

      {/* Founders Section */}
      <section className="py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            name: "Nishant",
            role: "Co-Founder & CEO",
            desc: "Nishant is a visionary leader with a passion for innovation and growth. He drives the company’s mission to empower businesses worldwide.",
            image: NishantImage,
          },
          {
            name: "Gunjan",
            role: "Co-Founder & CTO",
            desc: "Gunjan is a tech enthusiast and problem solver. She leads the development of cutting-edge solutions to transform businesses.",
            image: GunjanImage,
          },
        ].map((founder, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center h-full transition-transform"
          >
            <img
              src={founder.image}
              alt={founder.name}
              className="w-32 h-32 rounded-full mb-4"
            />
            <h3 className="text-xl font-bold">{founder.name}</h3>
            <p className="text-blue-800 font-semibold">{founder.role}</p>
            <p className="mt-2 text-gray-700">{founder.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">
            Join Us in Building the Future
          </h2>
          <p className="mt-4 text-lg">
            Be a part of our journey to empower businesses and communities.
          </p>
          <button className="mt-8 px-12 py-4 text-lg bg-white text-blue-800 shadow-lg rounded-md hover:bg-gray-100 transition-transform">
            Get Involved
          </button>
        </div>
      </section>
    </div>
  );
}