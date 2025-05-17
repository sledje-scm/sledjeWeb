import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Components
import NavbarWrap from "./components/navbarWrapper";

// Pages
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Shop from "./pages/Shop";
import Shelf from "./pages/Shelf";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import You from "./pages/You";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Tracking Pages
import OrderStatus from "./pages/Tracking/OrderStatus";
import Shipment from "./pages/Tracking/Shipment";

// Services Pages
import Logistics from "./pages/Services/Logistics";
import Inventory from "./pages/Services/Inventory";

// Company Pages
import About from "./pages/Company/About";
import Careers from "./pages/Company/Careers";
import Contact from "./pages/Company/Contact";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <NavbarWrap>
              <Home />
            </NavbarWrap>
          }
        />

        {/* Layout Pages */}
        <Route path="/layout" element={<Layout />}>
          <Route index element={<Navigate to="/layout/shop" />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shelf" element={<Shelf />} />
          <Route path="payment" element={<Payment />} />
          <Route path="orders" element={<Orders />} />
          <Route path="you" element={<You />} />
        </Route>

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Tracking Pages */}
        <Route
          path="/tracking/status"
          element={
            <NavbarWrap>
              <OrderStatus />
            </NavbarWrap>
          }
        />
        <Route
          path="/tracking/shipment"
          element={
            <NavbarWrap>
              <Shipment />
            </NavbarWrap>
          }
        />

        {/* Services Pages */}
        <Route
          path="/services/logistics"
          element={
            <NavbarWrap>
              <Logistics />
            </NavbarWrap>
          }
        />
        <Route
          path="/services/inventory"
          element={
            <NavbarWrap>
              <Inventory />
            </NavbarWrap>
          }
        />

        {/* Company Pages */}
        <Route
          path="/company/about"
          element={
            <NavbarWrap>
              <About />
            </NavbarWrap>
          }
        />
        <Route
          path="/company/careers"
          element={
            <NavbarWrap>
              <Careers />
            </NavbarWrap>
          }
        />
        <Route
          path="/company/contact"
          element={
            <NavbarWrap>
              <Contact />
            </NavbarWrap>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
