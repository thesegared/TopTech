import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage'; 
import AdminProductManagement from './pages/admin/AdminProductManagement'; 
import AddProductPage from './pages/admin/AddProductPage';
import EditProductPage from './pages/admin/EditProductPage';

function App() {
  return (
    <Router> {/* Envolvemos todo con Router */}
      <Header />
      <main className="py-4">
        <Routes>
          <Route path="/" element={<ProductList />} /> {/* Página principal de productos */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} /> {/* Ruta para el carrito */}
          <Route path="/admin/manage-products" element={<AdminProductManagement />} /> {/* Ruta para gestionar productos */}
          <Route path="/add-product" element={<AddProductPage />} /> {/* Ruta para agregar producto */}
          <Route path="/admin/edit-product/:id" element={<EditProductPage />} /> {/* Ruta para editar producto */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
