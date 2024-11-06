import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './pages/ProductList';
import AddProductPage from './pages/AddProductPage';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductList />} /> {/* Nueva ruta */}
          <Route path="/add-product" element={<AddProductPage />} /> {/* Nueva ruta */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;


