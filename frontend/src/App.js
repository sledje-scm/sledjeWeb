import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Shop from './pages/Shop';
import Shelf from './pages/Shelf';
import Orders from './pages/Orders';
import Payment from "./pages/Payment"
import You from './pages/You';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Layout from './pages/Layout';
import API from './api';
import addToCartAlert from './pages/addToCartAlert';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        
        {/* Pages with navigation bar inside Layout */}
        <Route path="/layout" element={<Layout />}>
          <Route index element={<Navigate to="/layout/shop" />} />
          <Route path="shop" element={<Shop />} />
          <Route path="api" element={<API />} />
          <Route path="shelf" element={<Shelf />} />
            <Route path="addToCartAlert" element={<addToCartAlert />} />
          <Route path="payment" element={<Payment />} />
          <Route path="orders" element={<Orders />} />
          <Route path="you" element={<You />} />
        </Route>

        {/* Auth pages outside Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </Router>
  );
}

export default App;
