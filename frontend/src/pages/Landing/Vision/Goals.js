import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Target, TrendingUp, Users, Globe, Lightbulb } from "lucide-react";

export default function Goals() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-6 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md">
            Our Goals
          </h1>
          <p className="mt-6 text-lg font-medium">
            Empowering businesses with innovation, collaboration, and growth.
          </p>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGdvb2xzfGVufDB8fHx8MTY4MjE4Mjk4Nw&ixlib=rb-1.2.1&q=80&w=1080')",
          }}
        ></div>
      </section>

      {/* Goals Section */}
      <section className="py-16 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "Innovation",
            desc: "Foster creativity and bring cutting-edge solutions to businesses.",
            icon: Target,
          },
          {
            title: "Collaboration",
            desc: "Build strong partnerships to create a thriving ecosystem.",
            icon: Users,
          },
          {
            title: "Growth",
            desc: "Empower businesses to scale and achieve their full potential.",
            icon: TrendingUp,
          },
          {
            title: "Sustainability",
            desc: "Promote eco-friendly practices for a better future.",
            icon: CheckCircle,
          },
          {
            title: "Global Impact",
            desc: "Expand our reach to create a worldwide positive impact.",
            icon: Globe,
          },
          {
            title: "Continuous Learning",
            desc: "Encourage innovation through learning and development.",
            icon: Lightbulb,
          },
        ].map((goal, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center h-full transition-transform"
          >
            <goal.icon className="w-16 h-16 text-blue-800 mb-4" />
            <h3 className="text-xl font-bold mt-2">{goal.title}</h3>
            <p className="mt-2 text-gray-700">{goal.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">
            Join Us in Achieving These Goals
          </h2>
          <p className="mt-4 text-lg">
            Together, we can create a brighter future for businesses and
            communities.
          </p>
          <button className="mt-8 px-12 py-4 text-lg bg-white text-blue-800 shadow-lg rounded-md hover:bg-gray-100 transition-transform">
            Get Involved
          </button>
        </div>
      </section>
    </div>
  );
}