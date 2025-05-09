import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, CreditCard, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import Login from "./Login";

export default function LandingPage() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY < lastScrollY);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate("/layout");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-white shadow-md z-10 transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
        <h1 className="text-4xl font-black text-blue-900 tracking-wide">Sledge Solutions</h1>
        <div>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="mr-4 bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition-transform">
            Login
          </button>
          <button className="bg-gray-200 text-gray-900 px-5 py-3 rounded-md shadow-md hover:bg-gray-300">
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative text-left py-48 px-12 text-gray-900 mt-16 flex flex-col items-start justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://www.sap.com/dam/application/shared/photos/homepage/business-unleashed-feb-20.jpg')" }}>
        <div className="max-w-4xl">
          <h1 className="text-7xl font-extrabold leading-tight drop-shadow-md text-gray-900">Bridging Retailers & Distributors</h1>
          <p className="mt-6 text-xl drop-shadow-md font-semibold text-gray-800">Empowering retailers with seamless inventory, billing, and business growth solutions.</p>
          <button className="mt-8 px-12 py-4 text-lg bg-blue-800 text-white shadow-lg rounded-md hover:bg-blue-900 transition-transform">Get Started</button>
        </div>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-lg" onClick={() => setShowLoginModal(false)}>
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-16 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[{ title: "Inventory Management", desc: "Stay updated with real-time stock levels.", icon: Package },
          { title: "Billing Solutions", desc: "Generate invoices and manage transactions effortlessly.", icon: CreditCard },
          { title: "Business Credit Management", desc: "Offer and track credit transactions securely.", icon: Users },
          { title: "Supply Chain Management", desc: "Optimize and streamline supply chain operations.", icon: ShoppingCart },
          { title: "Growth & Analytics", desc: "Gain insights to scale your business effectively.", icon: BarChart },
          { title: "Curated Business Support", desc: "Get expert advice and tailored support.", icon: TrendingUp }].map((feature, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center h-full transition-transform">
            <feature.icon className="w-16 h-16 text-blue-800 mb-4" />
            <h3 className="text-xl font-bold mt-2">{feature.title}</h3>
            <p className="mt-2 text-gray-700">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white">Sledge Solutions</h3>
            <p className="mt-2">Connecting retailers with distributors for seamless business management.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Contact Us</h3>
            <p className="mt-2">Email: support@Sledge Solutions.com</p>
            <p>Phone: +1 234 567 890</p>
            <p>Address: 123 Business Street, City, Country</p>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Sledge Solutions. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
