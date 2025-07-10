import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold text-white">Sledge Solutions</h3>
          <p className="mt-2">
            Connecting retailers with distributors for seamless business management.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-white">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/features" className="hover:text-white">
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-white">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold text-white">Contact Us</h3>
          <p className="mt-2">Email: support@SledgeSolutions.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 Business Street, City, Country</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Sledge Solutions. All rights reserved.
      </div>
    </footer>
  );
}