import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/navBarLogo1.png";
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
      className={`fixed top-0 left-0 w-full bg-white z-50 p-4 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        boxShadow: "0 8px 20px rgba(0, 0, 255, 0.15)",
      }}
    >
      <div className="flex justify-between items-center">
        {/* Logo - Fixed size */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </Link>
        </div>

        {/* Desktop Menu and Login - Right side */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Vision Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("vision")}
              className={`text-blue-1000 text-lg font-bold transition ${
                openDropdown === "vision" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : "hover:text-blue-700"
              }`}
            >
              Vision
            </button>
            {openDropdown === "vision" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50 min-w-48">
                <Link
                  to="/vision/goals"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Our Goals
                </Link>
                <Link
                  to="/vision/founders"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Founders
                </Link>
                <Link
                  to="/vision/investors"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
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
              className={`text-blue-1000 text-lg font-bold transition ${
                openDropdown === "support" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : "hover:text-blue-700"
              }`}
            >
              Support
            </button>
            {openDropdown === "support" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50 min-w-48">
                <Link
                  to="/support/tracking"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Tracking
                </Link>
                <Link
                  to="/support/grievances"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Grievances
                </Link>
                <Link
                  to="/support/contact-us"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
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
              className={`text-blue-1000 text-lg font-bold transition ${
                openDropdown === "services" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : "hover:text-blue-700"
              }`}
            >
              Services
            </button>
            {openDropdown === "services" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50 min-w-64">
                <Link
                  to="/services/inventory-management"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Inventory Management
                </Link>
                <Link
                  to="/services/billing-credit-management"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Billing and Credit Management
                </Link>
                <Link
                  to="/services/customer-automation"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Customer Automation
                </Link>
                <Link
                  to="/services/supply-chain-optimizations"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Supply Chain Optimizations
                </Link>
                <Link
                  to="/services/ai-driven-analytics"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
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
              className={`text-blue-1000 text-lg font-bold transition ${
                openDropdown === "partners" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : "hover:text-blue-700"
              }`}
            >
              Partners
            </button>
            {openDropdown === "partners" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50 min-w-48">
                <Link
                  to="/partners/retailers"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Retailers
                </Link>
                <Link
                  to="/partners/distributors"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Distributors
                </Link>
                <Link
                  to="/partners/delivery-partners"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md whitespace-nowrap"
                  onClick={closeDropdown}
                >
                  Delivery Partners
                </Link>
              </div>
            )}
          </div>
          
          {/* Login and Menu buttons */}
          <button
            onClick={onLoginClick}
            className="bg-blue-700 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-900 transition"
          >
            Login
          </button>
          <button className="bg-gray-200 text-gray-900 px-5 py-3 rounded-md shadow-md hover:bg-gray-300">
            <Layers className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={onLoginClick}
            className="bg-blue-700 text-white px-4 py-2 text-sm rounded-md shadow-md hover:bg-blue-900 transition"
          >
            Login
          </button>
          <button
            onClick={toggleMobileMenu}
            className="bg-gray-200 text-gray-900 p-2 rounded-md shadow-md hover:bg-gray-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 bg-white border-t border-gray-200">
          <div className="py-2 space-y-1">
            {/* Vision Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown("vision")}
                className={`w-full text-left px-4 py-3 text-blue-1000 font-semibold transition ${
                  openDropdown === "vision" ? "bg-blue-800 text-white" : "hover:bg-gray-100"
                }`}
              >
                Vision
              </button>
              {openDropdown === "vision" && (
                <div className="bg-blue-50 pl-8">
                  <Link
                    to="/vision/goals"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Our Goals
                  </Link>
                  <Link
                    to="/vision/founders"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Founders
                  </Link>
                  <Link
                    to="/vision/investors"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
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
                className={`w-full text-left px-4 py-3 text-blue-1000 font-semibold transition ${
                  openDropdown === "support" ? "bg-blue-800 text-white" : "hover:bg-gray-100"
                }`}
              >
                Support
              </button>
              {openDropdown === "support" && (
                <div className="bg-blue-50 pl-8">
                  <Link
                    to="/support/tracking"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Tracking
                  </Link>
                  <Link
                    to="/support/grievances"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Grievances
                  </Link>
                  <Link
                    to="/support/contact-us"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
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
                className={`w-full text-left px-4 py-3 text-blue-1000 font-semibold transition ${
                  openDropdown === "services" ? "bg-blue-800 text-white" : "hover:bg-gray-100"
                }`}
              >
                Services
              </button>
              {openDropdown === "services" && (
                <div className="bg-blue-50 pl-8">
                  <Link
                    to="/services/inventory-management"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Inventory Management
                  </Link>
                  <Link
                    to="/services/billing-credit-management"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Billing and Credit Management
                  </Link>
                  <Link
                    to="/services/customer-automation" 
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Customer Automation
                  </Link>
                  <Link
                    to="/services/supply-chain-optimizations"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Supply Chain Optimizations
                  </Link>
                  <Link
                    to="/services/ai-driven-analytics"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
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
                className={`w-full text-left px-4 py-3 text-blue-1000 font-semibold transition ${
                  openDropdown === "partners" ? "bg-blue-800 text-white" : "hover:bg-gray-100"
                }`}
              >
                Partners
              </button>
              {openDropdown === "partners" && (
                <div className="bg-blue-50 pl-8">
                  <Link
                    to="/partners/retailers"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Retailers
                  </Link>
                  <Link
                    to="/partners/distributors"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Distributors
                  </Link>
                  <Link
                    to="/partners/delivery-partners"
                    className="block px-4 py-2 text-blue-800 hover:bg-blue-100"
                    onClick={closeMobileMenu}
                  >
                    Delivery Partners
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="px-4 py-2">
              <button className="w-full bg-gray-200 text-gray-900 py-3 rounded-md shadow-md hover:bg-gray-300 flex justify-center">
                <Layers className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}