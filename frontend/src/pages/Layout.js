import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PlaneLanding, Library, BanknoteArrowUp, Landmark, User, ScanBarcode } from "lucide-react";
import logo from "../assets/navBarLogo1.png"; // Import your logo

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

  const handleLogout = () => {
    // Clear user session or token (if stored in localStorage or cookies)
    localStorage.removeItem("userInfo");
    // Redirect to the home page
    navigate("/");
  };

  return (
    <div className="min-h-screen ">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4">
        <div className="flex justify-between items-center">
          {/* Left Section: Logo and Navigation Items */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />

            {/* Navigation Items */}
            {navItems.map(({ name, to }, index) => (
              <button
                key={index}
                onClick={() => navigate(to)}
                className={`text-blue-1000 hover:text-blue-700 text-lg font-bold transition ${
                  location.pathname === to ? "bg-blue-800 text-white px-4 py-2 rounded-md" : ""
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Right Section: Logout Button */}
          <div>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  );
}
