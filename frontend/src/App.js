import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Components
import NavbarWrap from "./components/Structure";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/AuthContext";
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


// Vision Pages
import Goals from "./pages/Vision/Goals";
import Founders from "./pages/Vision/Founders";
import Investors from "./pages/Vision/Investors";

// Support Pages
import ContactUs from "./pages/Support/ContactUs";
import Grievances from "./pages/Support/Grievances";
import Tracking from "./pages/Support/Tracking";

// Services Pages
import InventoryManagement from "./pages/Services/InventoryManagement";
import BillingCreditManagement from "./pages/Services/BillingCreditManagement";
import CustomerAutomation from "./pages/Services/CustomerAutomation";
import SupplyChainOptimizations from "./pages/Services/SupplyChainOptimizations";
import AIDrivenAnalytics from "./pages/Services/AIDrivenAnalytics";

// Partners Pages
import Retailers from "./pages/Partners/Retailers";
import Distributors from "./pages/Partners/Distributors";
import DeliveryPartners from "./pages/Partners/DeliveryPartners";

// Not Found Page
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
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

        {/* Layout Page with Default Redirect */}
        <Route
          path="/layout"
          element={
            <PrivateRoute>
               <Layout />
            </PrivateRoute>
             
          }
          
        >
          {/* Redirect /layout to /layout/shop */}
          <Route index element={<Navigate to="shop" replace />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shelf" element={<Shelf />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payment" element={<Payment />} />
          <Route path="you" element={<You />} />
        </Route>

        {/* Vision Pages */}
        <Route
          path="/vision/goals"
          element={
            <NavbarWrap>
              <Goals />
            </NavbarWrap>
          }
        />
        <Route
          path="/vision/founders"
          element={
            <NavbarWrap>
              <Founders />
            </NavbarWrap>
          }
        />
        <Route
          path="/vision/investors"
          element={
            <NavbarWrap>
              <Investors />
            </NavbarWrap>
          }
        />

        {/* Support Pages */}
        <Route
          path="/support/contact-us"
          element={
            <NavbarWrap>
              <ContactUs />
            </NavbarWrap>
          }
        />
        <Route
          path="/support/grievances"
          element={
            <NavbarWrap>
              <Grievances />
            </NavbarWrap>
          }
        />
        <Route
          path="/support/tracking"
          element={
            <NavbarWrap>
              <Tracking />
            </NavbarWrap>
          }
        />

        {/* Services Pages */}
        <Route
          path="/services/inventory-management"
          element={
            <NavbarWrap>
              <InventoryManagement />
            </NavbarWrap>
          }
        />
        <Route
          path="/services/billing-credit-management"
          element={
            <NavbarWrap>
              <BillingCreditManagement />
            </NavbarWrap>
          }
        />
        <Route
          path="/services/customer-automation"
          element={
            <NavbarWrap>
              <CustomerAutomation />
            </NavbarWrap>
          }
        />
        <Route
          path="/services/supply-chain-optimizations"
          element={
            <NavbarWrap>
              <SupplyChainOptimizations />
            </NavbarWrap>
          }
        />
        <Route
          path="/services/ai-driven-analytics"
          element={
            <NavbarWrap>
              <AIDrivenAnalytics />
            </NavbarWrap>
          }
        />

        {/* Partners Pages */}
        <Route
          path="/partners/retailers"
          element={
            <NavbarWrap>
              <Retailers />
            </NavbarWrap>
          }
        />
        <Route
          path="/partners/distributors"
          element={
            <NavbarWrap>
              <Distributors />
            </NavbarWrap>
          }
        />
        <Route
          path="/partners/delivery-partners"
          element={
            <NavbarWrap>
              <DeliveryPartners />
            </NavbarWrap>
          }
        />

        {/* Authentication Pages */}
        <Route
          path="/login"
          element={
            <NavbarWrap>
              <Login />
            </NavbarWrap>
          }
        />
        <Route
          path="/signup"
          element={
            <NavbarWrap>
              <Signup />
            </NavbarWrap>
          }
        />

        {/* Fallback route for 404 */}
        <Route
          path="*"
          element={
            <NavbarWrap>
              <NotFound />
            </NavbarWrap>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;