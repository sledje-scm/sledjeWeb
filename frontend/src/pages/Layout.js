import { NavLink, Outlet } from "react-router-dom";
import { ShoppingCart, Package, CreditCard, User, List } from "lucide-react";

export default function Layout() {
  const navItems = [
    { name: "Shop", to: "/layout/shop", icon: List },
    { name: "Shelf", to: "/layout/shelf", icon: Package },
    { name: "Payment", to: "/layout/payment", icon: CreditCard },
    { name: "Orders", to: "/layout/orders", icon: ShoppingCart },
    { name: "You", to: "/layout/you", icon: User }
  ]
  return (
    <div className="min-h-screen pt-0 pb-20 sm:pt-20 sm:pb-0 overflow-x-hidden">
      {/* Render the current page inside Layout */}
      <Outlet />

      {/* Bottom Navigation */}
      <div className="fixed w-full bg-gray-100 text-black flex justify-around px-4 shadow-lg border-t 
  bottom-0 sm:top-0 sm:bottom-auto sm:border-b sm:border-t-0">
      {navItems.map(({ name, to, icon: Icon }, index) => (
  <div key={to} className={`flex-1 ${index !== 0 ? "border-l" : ""}`}>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center py-2 font-medium  duration-300 ${
          isActive
            ? "border-t-4 bg-gray-300 text-gray-900 sm:border-b-4 sm:border-t-0"
            : "text-gray-600 bg-gray-100 hover:bg-gray-200"
        }`
      }
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-xs">{name}</span>
    </NavLink>
  </div>
))}

      </div>
    </div>
  );
}
