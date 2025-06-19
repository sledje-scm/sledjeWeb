import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layers, Menu, X } from "lucide-react";

export default function Navbar({ onLoginClick }) {
 const [openDropdown, setOpenDropdown] = useState(null);
 const [showNavbar, setShowNavbar] = useState(true);
 const [lastScrollY, setLastScrollY] = useState(0);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const navigate = useNavigate();

 const toggleDropdown = (name) => {
 setOpenDropdown((prev) => (prev === name ? null : name));
 };

 const closeDropdown = () => {
 setOpenDropdown(null);
 };

 const toggleMobileMenu = () => {
 setIsMobileMenuOpen(!isMobileMenuOpen);
 setOpenDropdown(null); // Close any open dropdowns when toggling mobile menu
 };

 const closeMobileMenu = () => {
 setIsMobileMenuOpen(false);
 setOpenDropdown(null);
 };

 useEffect(() => {
 const handleScroll = () => {
 const currentY = window.scrollY;
 setShowNavbar(currentY < lastScrollY || currentY < 10);
 setLastScrollY(currentY);
 };

 window.addEventListener("scroll", handleScroll);
 return () => window.removeEventListener("scroll", handleScroll);
 }, [lastScrollY]);

 return (
 <nav
 className={`fixed top-0 left-0 w-full z-50 p-4 transition-transform duration-300 ${
 showNavbar ? "translate-y-0" : "-translate-y-full"
 }`}
 style={{
 background: "rgba(20,30,48,0.35)", // Subtle dark with opacity, no blur
 boxShadow: "0 8px 20px rgba(0, 0, 255, 0.15)",
 backdropFilter: "none" // Ensure no blur
 }}
 >
 <div className="flex justify-between items-center">
 {/* Logo - Fixed size */}
 <div className="flex-shrink-0">
 <Link to="/" className="flex items-center">
 <img src={process.env.PUBLIC_URL + "/logo192.png"} alt="Logo" className="h-12 w-auto" />
 </Link>
 </div>

 {/* Desktop Menu and Login - Right side */}
 <div className="hidden lg:flex items-center space-x-6">
 {/* Vision Dropdown */}
 <div className="relative">
 <button
 onClick={() => toggleDropdown("vision")}
 className={`text-white text-lg font-light transition font-inter ${
 openDropdown === "vision" ? "bg-white text-blue-900 px-2 py-1 rounded-md shadow" : "hover:text-blue-700"
 }`}
 style={{
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 300
 }}
 >
 Vision
 </button>
 {openDropdown === "vision" && (
 <div className="absolute left-0 mt-2 flex flex-col bg-white shadow-lg rounded-md py-2 z-50 min-w-48">
 <Link
 to="/vision/goals"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Our Goals
 </Link>
 <Link
 to="/vision/founders"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Founders
 </Link>
 <Link
 to="/vision/investors"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Investors
 </Link>
 </div>
 )}
 </div>

 {/* Support Dropdown */}
 <div className="relative">
 <button
 onClick={() => toggleDropdown("support")}
 className={`text-white text-lg font-light transition font-inter ${
 openDropdown === "support" ? "bg-white text-white-900 px-2 py-1 rounded-md shadow" : "hover:text-blue-700"
 }`}
 style={{
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 300
 }}
 >
 Support
 </button>
 {openDropdown === "support" && (
 <div className="absolute left-0 mt-2 flex flex-col bg-white shadow-lg rounded-md py-2 z-50 min-w-48">
 <Link
 to="/support/tracking"
 className="px-4 py-2 text-white-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Tracking
 </Link>
 <Link
 to="/support/grievances"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Grievances
 </Link>
 <Link
 to="/support/contact-us"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Contact Us
 </Link>
 </div>
 )}
 </div>

 {/* Services Dropdown */}
 <div className="relative">
 <button
 onClick={() => toggleDropdown("services")}
 className={`text-white text-lg font-light transition font-inter ${
 openDropdown === "services" ? "bg-white text-blue-900 px-2 py-1 rounded-md shadow" : "hover:text-blue-700"
 }`}
 style={{
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 300
 }}
 >
 Services
 </button>
 {openDropdown === "services" && (
 <div className="absolute left-0 mt-2 flex flex-col bg-white shadow-lg rounded-md py-2 z-50 min-w-64">
 <Link
 to="/services/inventory-management"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Inventory Management
 </Link>
 <Link
 to="/services/billing-credit-management"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Billing and Credit Management
 </Link>
 <Link
 to="/services/customer-automation"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Customer Automation
 </Link>
 <Link
 to="/services/supply-chain-optimizations"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Supply Chain Optimizations
 </Link>
 <Link
 to="/services/ai-driven-analytics"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 AI Driven Analytics
 </Link>
 </div>
 )}
 </div>

 {/* Partners Dropdown */}
 <div className="relative">
 <button
 onClick={() => toggleDropdown("partners")}
 className={`text-white text-lg font-light transition font-inter ${
 openDropdown === "partners" ? "bg-white text-white-900 px-2 py-1 rounded-md shadow" : "hover:text-blue-700"
 }`}
 style={{
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 300
 }}
 >
 Partners
 </button>
 {openDropdown === "partners" && (
 <div className="absolute left-0 mt-2 flex flex-col bg-white shadow-lg rounded-md py-2 z-50 min-w-48">
 <Link
 to="/partners/retailers"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Retailers
 </Link>
 <Link
 to="/partners/distributors"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Distributors
 </Link>
 <Link
 to="/partners/delivery-partners"
 className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-md whitespace-nowrap font-light"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeDropdown}
 >
 Delivery Partners
 </Link>
 </div>
 )}
 </div>
 
 {/* Login Button */}
 <button
 onClick={onLoginClick}
 className="px-10 py-3 border border-white text-white rounded-md bg-white bg-opacity-0 backdrop-blur-sm font-medium transition hover:bg-opacity-20"
 style={{
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 400,
 boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)"
 }}
 >
 Login
 </button>
 </div>

 {/* Mobile Menu Button */}
 <div className="lg:hidden flex items-center space-x-2 flex-shrink-0">
 <button
 onClick={onLoginClick}
 className="px-10 py-3 border border-white text-white rounded-md bg-white bg-opacity-0 font-medium transition hover:bg-opacity-20"
 style={{
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 400,
 boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)"
 }}
 >
 Login
 </button>
 <button
 onClick={toggleMobileMenu}
 className="p-2 rounded-md shadow-md hover:bg-white hover:bg-opacity-10 transition bg-transparent"
 style={{
 background: "transparent"
 }}
 >
 {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
 </button>
 </div>
 </div>

 {/* Mobile Menu */}
 {isMobileMenuOpen && (
 <div className="lg:hidden mt-4 border-t border-gray-200" style={{ background: "rgba(20,30,48,0.35)" }}>
 <div className="py-2 space-y-1">
 {/* Vision Mobile */}
 <div>
 <button
 onClick={() => toggleDropdown("vision")}
 className="w-full text-left px-4 py-3 text-white font-semibold transition"
 style={{
 background: "rgba(20,30,48,0.35)",
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 700,
 border: "none"
 }}
 >
 Vision
 </button>
 {openDropdown === "vision" && (
 <div style={{ background: "rgba(20,30,48,0.35)" }} className="pl-8">
 <Link
 to="/vision/goals"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Our Goals
 </Link>
 <Link
 to="/vision/founders"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Founders
 </Link>
 <Link
 to="/vision/investors"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Investors
 </Link>
 </div>
 )}
 </div>

 {/* Support Mobile */}
 <div>
 <button
 onClick={() => toggleDropdown("support")}
 className="w-full text-left px-4 py-3 text-white font-semibold transition"
 style={{
 background: "rgba(20,30,48,0.35)",
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 700,
 border: "none"
 }}
 >
 Support
 </button>
 {openDropdown === "support" && (
 <div style={{ background: "rgba(20,30,48,0.35)" }} className="pl-8">
 <Link
 to="/support/tracking"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Tracking
 </Link>
 <Link
 to="/support/grievances"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Grievances
 </Link>
 <Link
 to="/support/contact-us"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Contact Us
 </Link>
 </div>
 )}
 </div>

 {/* Services Mobile */}
 <div>
 <button
 onClick={() => toggleDropdown("services")}
 className="w-full text-left px-4 py-3 text-white font-semibold transition"
 style={{
 background: "rgba(20,30,48,0.35)",
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 700,
 border: "none"
 }}
 >
 Services
 </button>
 {openDropdown === "services" && (
 <div style={{ background: "rgba(20,30,48,0.35)" }} className="pl-8">
 <Link
 to="/services/inventory-management"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Inventory Management
 </Link>
 <Link
 to="/services/billing-credit-management"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Billing and Credit Management
 </Link>
 <Link
 to="/services/customer-automation"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Customer Automation
 </Link>
 <Link
 to="/services/supply-chain-optimizations"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Supply Chain Optimizations
 </Link>
 <Link
 to="/services/ai-driven-analytics"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 AI Driven Analytics
 </Link>
 </div>
 )}
 </div>

 {/* Partners Mobile */}
 <div>
 <button
 onClick={() => toggleDropdown("partners")}
 className="w-full text-left px-4 py-3 text-white font-semibold transition"
 style={{
 background: "rgba(20,30,48,0.35)",
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 700,
 border: "none"
 }}
 >
 Partners
 </button>
 {openDropdown === "partners" && (
 <div style={{ background: "rgba(20,30,48,0.35)" }} className="pl-8">
 <Link
 to="/partners/retailers"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Retailers
 </Link>
 <Link
 to="/partners/distributors"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Distributors
 </Link>
 <Link
 to="/partners/delivery-partners"
 className="block px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-900 font-light rounded"
 style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'", fontWeight: 300 }}
 onClick={closeMobileMenu}
 >
 Delivery Partners
 </Link>
 </div>
 )}
 </div>

 {/* Mobile Login Button */}
 <div className="px-4 py-2">
 <button
 onClick={onLoginClick}
 className="w-full px-10 py-3 border border-white text-white rounded-md bg-white bg-opacity-0 font-medium transition hover:bg-opacity-20"
 style={{
 fontFamily: "'Inter', 'Helvetica Neue', Arial, 'sans-serif'",
 fontWeight: 400,
 boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)"
 }}
 >
 Login
 </button>
 </div>
 </div>
 </div>
 )}
 </nav>
 );
}