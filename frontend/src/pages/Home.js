import { motion } from "framer-motion";
import { BarChart, CreditCard, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";



export default function LandingPage() {
  


  return (
    <div className={`min-h-screen bg-white text-gray-900 `}>
  

      {/* Hero Section */}
      <section
        className="relative text-left py-24 px-6 md:py-48 md:px-12 text-gray-900 mt-16 flex flex-col items-start justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://www.sap.com/dam/application/shared/photos/homepage/business-unleashed-feb-20.jpg')",
        }}
      >
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-7xl font-extrabold leading-tight drop-shadow-md text-gray-900">
            Bridging Retailers & Distributors
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl drop-shadow-md font-semibold text-gray-800">
            Empowering retailers with seamless inventory, billing, and business growth solutions.
          </p>
          <button className="mt-6 md:mt-8 px-8 md:px-12 py-3 md:py-4 text-lg bg-blue-800 text-white shadow-lg rounded-md hover:bg-blue-900 transition-transform">
            Get Started
          </button>
        </div>
      </section>

      

      {/* Features Section */}
      <section className="py-16 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: "Inventory Management", desc: "Stay updated with real-time stock levels.", icon: Package },
          { title: "Billing Solutions", desc: "Generate invoices and manage transactions effortlessly.", icon: CreditCard },
          { title: "Business Credit Management", desc: "Offer and track credit transactions securely.", icon: Users },
          { title: "Supply Chain Management", desc: "Optimize and streamline supply chain operations.", icon: ShoppingCart },
          { title: "Growth & Analytics", desc: "Gain insights to scale your business effectively.", icon: BarChart },
          { title: "Curated Business Support", desc: "Get expert advice and tailored support.", icon: TrendingUp },
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center h-full transition-transform"
          >
            <feature.icon className="w-12 h-12 text-blue-800 mb-4" />
            <h3 className="text-lg md:text-xl font-bold mt-2">{feature.title}</h3>
            <p className="mt-2 text-gray-700">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
