import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function NavbarWrap({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <Navbar />
      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}