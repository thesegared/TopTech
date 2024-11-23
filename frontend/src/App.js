import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage'; 
import AdminProductManagement from './pages/admin/AdminProductManagement'; 
import AddProductPage from './pages/admin/AddProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import './App.css';
import ManageRoles from './pages/admin/ManageRoles';
import FAQs from './pages/FAQs'
import ShippingDetails from "./pages/ShippingDetails";
import Payment from "./pages/Payment";
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shipping-details" element={<ShippingDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/admin/manage-products" element={<AdminProductManagement />} />
            <Route path="/admin/manage-roles" element={<ManageRoles />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/admin/edit-product/:id" element={<EditProductPage />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}


export default App;
