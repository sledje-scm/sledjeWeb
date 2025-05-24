import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/navBarLogo1.png";
import { Layers } from "lucide-react";

export default function Navbar({ onLoginClick }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const closeDropdown = () => {
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
        boxShadow: "0 8px 20px rgba(0, 0, 255, 0.15)", // Softer and broader bluish shadow
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </Link>

          {/* Vision Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("vision")}
              className={`text-blue-1000 hover:text-blue-700 text-lg font-bold transition ${
                openDropdown === "vision" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : ""
              }`}
            >
              Vision
            </button>
            {openDropdown === "vision" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50">
                <Link
                  to="/vision/goals"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Our Goals
                </Link>
                <Link
                  to="/vision/founders"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Founders
                </Link>
                <Link
                  to="/vision/investors"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
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
              className={`text-blue-1000 hover:text-blue-700 text-lg font-bold transition ${
                openDropdown === "support" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : ""
              }`}
            >
              Support
            </button>
            {openDropdown === "support" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50">
                <Link
                  to="/support/tracking"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Tracking
                </Link>
                <Link
                  to="/support/grievances"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Grievances
                </Link>
                <Link
                  to="/support/contact-us"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
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
              className={`text-blue-1000 hover:text-blue-700 text-lg font-bold transition ${
                openDropdown === "services" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : ""
              }`}
            >
              Services
            </button>
            {openDropdown === "services" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50">
                <Link
                  to="/services/inventory-management"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Inventory Management
                </Link>
                <Link
                  to="/services/billing-credit-management"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Billing and Credit Management
                </Link>
                <Link
                  to="/services/customer-automation"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Customer Automation
                </Link>
                <Link
                  to="/services/supply-chain-optimizations"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Supply Chain Optimizations
                </Link>
                <Link
                  to="/services/ai-driven-analytics"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
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
              className={`text-blue-1000 hover:text-blue-700 text-lg font-bold transition ${
                openDropdown === "partners" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : ""
              }`}
            >
              Partners
            </button>
            {openDropdown === "partners" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50">
                <Link
                  to="/partners/retailers"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Retailers
                </Link>
                <Link
                  to="/partners/distributors"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Distributors
                </Link>
                <Link
                  to="/partners/delivery-partners"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Delivery Partners
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Login + Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onLoginClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Login
          </button>
          <button className="bg-gray-200 text-gray-900 px-5 py-3 rounded-md shadow-md hover:bg-gray-300">
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}







