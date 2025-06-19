import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Components
import NavbarWrap from "./components/Structure";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./components/AuthContext";
// Pages
import Home from "./pages/Landing/Home";
import Layout from "./components/Layout";
import Shop from "./pages/Retailers/retailerShop";
import Shelf from "./pages/Retailers/retailerShelf";
import Orders from "./pages/Retailers/retailerOrders";
import Payment from "./pages/Retailers/retailerPayment";
import You from "./pages/Retailers/retailerYou";
import Login from "./components/Login";
import Signup from "./pages/Utilities/Signup";
import Test from "./pages/Utilities/Resources";

import DistributorLayout from "./pages/Distributors/distributorLayout";
import DistributorProducts from "./pages/Distributors/distributorProducts";
import DistributorOrders from "./pages/Distributors/distributorOrders";
import DistributorOverview from "./pages/Distributors/distributorOverview";
import DistributorPayments from "./pages/Distributors/distributorPayments";
import DistributorProfile from "./pages/Distributors/distributorProfile";


// Vision Pages
import Goals from "./pages/Landing/Vision/Goals";
import Founders from "./pages/Landing/Vision/Founders";
import Investors from "./pages/Landing/Vision/Investors";

// Support Pages
import ContactUs from "./pages/Landing/Support/ContactUs";
import Grievances from "./pages/Landing/Support/Grievances";
import Tracking from "./pages/Landing/Support/Tracking";

// Services Pages
import InventoryManagement from "./pages/Landing/Services/InventoryManagement";
import BillingCreditManagement from "./pages/Landing/Services/BillingCreditManagement";
import CustomerAutomation from "./pages/Landing/Services/CustomerAutomation";
import SupplyChainOptimizations from "./pages/Landing/Services/SupplyChainOptimizations";
import AIDrivenAnalytics from "./pages/Landing/Services/AIDrivenAnalytics";

// Partners Pages
import Retailers from "./pages/Landing/Partners/Retailers";
import Distributors from "./pages/Landing/Partners/Distributors";
import DeliveryPartners from "./pages/Landing/Partners/DeliveryPartners";

// Not Found Page
import NotFound from "./pages/Utilities/NotFound";

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

          {/* Distributor Routes */}<Route path="/distributor" element={<PrivateRoute><DistributorLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="orders" replace />} />
         <Route path="products" element={<DistributorProducts />} />
         <Route path="orders" element={<DistributorOrders />} />
         <Route path="overview" element={<DistributorOverview />} />
         <Route path="payments" element={<DistributorPayments />} />
         <Route path="profile" element={<DistributorProfile />} />
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
         <Route
          path="/Test"
          element={
            
              <Test />
            
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
  );
}

export default App;