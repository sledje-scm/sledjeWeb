import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Login from "./Login";

export default function NavbarWrapper({ children }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar onLoginClick={openLoginModal} />

      {/* Page Content */}
      <main className={`flex-grow ${isLoginModalOpen ? "blur-background" : ""}`}>{children}</main>

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"  style={{ zIndex: 9999 }}
          onClick={closeLoginModal}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Login />
          </div>
        </div>
      )}
    </div>
  );
}