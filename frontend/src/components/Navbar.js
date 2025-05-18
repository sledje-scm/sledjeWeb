import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/navBarLogo.png";
import { Layers } from "lucide-react";


export default function Navbar({ onLoginClick }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate(); // Hook for navigation

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  // Scroll listener logic
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
      className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Logo + Dropdowns together */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
          </Link>

          {/* Tracking Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("tracking")}
              className={`text-blue-1000 hover:text-blue-700 text-lg font-bold transition ${
                openDropdown === "tracking" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : ""
              }`}
            >
              Tracking
            </button>
            {openDropdown === "tracking" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50">
                <Link
                  to="/tracking/shipment"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Shipment
                </Link>
                <Link
                  to="/tracking/status"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Status
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
                  to="/services/logistics"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Logistics
                </Link>
                <Link
                  to="/services/warehousing"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Warehousing
                </Link>
              </div>
            )}
          </div>
          {/* Stakeholders Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("stakeholders")}
              className={`text-blue-1000 hover:text-blue-700 text-lg font-bold transition ${
                openDropdown === "stakeholders" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : ""
              }`}
            >
              Stakeholders
            </button>
            {openDropdown === "stakeholders" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50">
                <Link
                  to="/services/logistics"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Partners
                </Link>
                <Link
                  to="/services/warehousing"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Links
                </Link>
              </div>
            )}
          </div>
          {/* Company Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("company")}
              className={`text-blue-1000 hover:text-blue-700 text-lg font-bold transition ${
                openDropdown === "company" ? "bg-blue-800 text-white px-2 py-1 rounded-md" : ""
              }`}
            >
              Company
            </button>
            {openDropdown === "company" && (
              <div className="absolute left-0 mt-2 flex flex-col bg-blue-800 shadow-md rounded-md py-2 z-50">
                <Link
                  to="/company/about"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  About Us
                </Link>
                <Link
                  to="/company/contact"
                  className="px-4 py-2 text-white hover:bg-blue-700 rounded-md"
                  onClick={closeDropdown}
                >
                  Contact
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Login + Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onLoginClick} // Use the prop instead of internal function
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