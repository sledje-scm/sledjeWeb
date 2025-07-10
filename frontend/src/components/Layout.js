import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PlaneLanding, Library, BanknoteArrowUp, Landmark, User, ScanBarcode, MoreVertical, LogOut } from "lucide-react";
import logo from "../assets/navBarLogo1.png"; // Import your logo
import {useAuth} from "./AuthContext.js"; // Import the AuthContext

function TogglingPaymentIcon() {
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirst((prev) => !prev);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="transition-opacity duration-500 ease-in-out">
      {showFirst ? (
        <BanknoteArrowUp className="w-5 h-5 mb-1" />
      ) : (
        <Landmark className="w-5 h-5 mb-1" />
      )}
    </div>
  );
}

export default function Layout() {
  const navItems = [
    { name: "Shop", to: "/layout/shop", icon: ScanBarcode },
    { name: "Shelf", to: "/layout/shelf", icon: Library },
    { name: "Payments", to: "/layout/payment", icon: TogglingPaymentIcon },
    { name: "Orders", to: "/layout/orders", icon: PlaneLanding },
    { name: "You", to: "/layout/you", icon: User },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const [activeItemPosition, setActiveItemPosition] = useState({ left: 0, width: 0 });
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const activeIndex = navItems.findIndex(item => location.pathname === item.to);
      if (activeIndex !== -1) {
        const navElement = document.querySelector(`[data-nav-index="${activeIndex}"]`);
        const navbarElement = document.querySelector('.fixed.top-0');
        
        if (navElement && navbarElement) {
          const rect = navElement.getBoundingClientRect();
          const navbarRect = navbarElement.getBoundingClientRect();
          setActiveItemPosition({
            left: rect.left - navbarRect.left,
            width: rect.width
          });
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileDropdown && !event.target.closest('.mobile-dropdown-container')) {
        setShowMobileDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMobileDropdown]);
  const { logout } = useAuth(); // Import the logout function from AuthContext
  const handleLogout = () => {
    // Clear user session or token (if stored in localStorage or cookies)
    localStorage.removeItem("userInfo");
    logout(); // Call the logout function from AuthContext
    alert("You have been logged out successfully.");
    // Close dropdown
    setShowMobileDropdown(false);
    // Redirect to the home page
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="p-2 md:p-4">
          <div className="flex justify-between items-center nav-container">
            {/* Left Section: Logo and Navigation Items */}
            <div className="flex items-center justify-between space-x-2 md:space-x-6 w-full md:w-auto">
              {/* Logo - Hidden on mobile */}
              <img
                src={logo}
                alt="Logo"
                className="hidden md:block h-12 w-auto cursor-pointer pl-16"
                onClick={() => navigate("/")}
              />

              {/* Navigation Items */}
              <div className="flex justify-between items-centre w-full space-x-2 md:space-x-4 px-2 md:px-[12rem]">
                {navItems.map(({ name, to, icon: Icon }, index) => (
                  <button
                    key={index}
                    data-nav-index={index}
                    onClick={() => {
                      navigate(to);
                      setShowMobileDropdown(false);
                    }}
                    className={`flex flex-col md:flex-row items-center justify-center min-w-0 flex-shrink-0  text-blue-1000 text-xs md:text-xl font-bold transition px-2 md:px-4 py-2 rounded-full font-eudoxus  ${
                      location.pathname === to ? "bg-blue-700 text-white" : "hover:text-black "
                    }`}
                  >
                    {/* Show icon on mobile, hide on desktop */}
                    <div className="block md:hidden mb-1 justify-between items-center">
                      {typeof Icon === 'function' ? <Icon /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className="text-center">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Section: Logout Button - Hidden on mobile, but add mobile dropdown trigger */}
            <div className="hidden md:block pr-16">
              <button
                onClick={handleLogout}
                className="bg-blue-800 text-white font-bold font-eudoxus  px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition"
              >
                Logout
              </button>
            </div>
            
            {/* Mobile Dropdown Toggle Button */}
            <div className="md:hidden mobile-dropdown-container relative">
              <button
                onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  showMobileDropdown 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-blue-1000 hover:bg-gray-100'
                }`}
                aria-label="Menu"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Mobile Dropdown Menu */}
              {showMobileDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* Dropdown arrow */}
                  <div className="absolute -top-2 right-3 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>
                  <div className="absolute -top-3 right-3 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-200"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium transition-colors duration-150 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom border line with gap for active item */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600">
          {/* Gap for active menu item */}
          <div 
            className="absolute top-0 h-0.5 bg-white transition-all duration-300 ease-in-out"
            style={{
              left: `${activeItemPosition.left - 10}px`,
              width: `${activeItemPosition.width + 10}px`
            }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-[72px]">
        <Outlet />
      </div>
    </div>
  );
}