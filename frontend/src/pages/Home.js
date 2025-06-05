import { motion } from "framer-motion";
import { BarChart, CreditCard, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import Footer from "../components/Footer"; // <-- Import your existing Footer

export default function LandingPage() {
 return (
 <div className="min-h-screen bg-white text-gray-900">
 {/* Hero Section */}
 <section
 className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden p-0 m-0"
 style={{ height: "100vh" }}
 >
 {/* Fullscreen Video - only covers the hero section */}
 <video
 autoPlay
 loop
 muted
 playsInline
 className="absolute top-0 left-0 w-full h-full object-cover z-0"
 style={{ minHeight: "100vh", minWidth: "100vw" }}
 >
 <source src="https://www.onelineage.com/sites/default/files/2023-05/main_page_032323_web.mp4" type="video/mp4" />
 Your browser does not support the video tag.
 </video>
 {/* Subtle dark gradient overlay from right */}
 <div
 className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
 style={{
 background: "linear-gradient(to right, rgba(20,30,48,0.6) 40%, rgba(20,30,48,0.2) 70%, rgba(20,30,48,0) 100%)",
 minHeight: "100vh",
 minWidth: "100vw"
 }}
 />
 {/* Content aligned to left and above the video */}
 <div className="max-w-4xl relative z-20 flex flex-col items-start px-6 md:px-12 ml-0 md:ml-12">
 <h1
 className="text-5xl md:text-7xl font-light leading-tight text-white md:tracking-tight text-left"
 style={{
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 letterSpacing: "0.01em",
 textShadow: "0 4px 24px rgba(0,0,0,0.25)"
 }}
 >
 Bridging Retailers<br />
 & Distributors
 </h1>
 <p
 className="mt-4 md:mt-6 text-base md:text-2xl text-gray-100 font-light text-left"
 style={{
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 textShadow: "0 2px 8px rgba(0,0,0,0.18)",
 letterSpacing: "0.01em"
 }}
 >
 Empowering retailers with seamless inventory,<br />
 billing, and business growth solutions.
 </p>
 <button
 className="mt-8 px-10 py-3 border border-white text-white rounded-md bg-white bg-opacity-0 backdrop-sm font-medium transition hover:bg-opacity-20 text-bold"
 style={{
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif' 'bold'",
 fontWeight: 400,
 boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)"
 }}
 >
 Learn more
 </button>
 </div>
 </section>

 {/* Features Section */}
 <section className="py-16 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-30 bg-white">
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