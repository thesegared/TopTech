import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
//import './AdminProductManagement.css';


function AdminProductManagement() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/'); // Redirige a la página principal si no es administrador
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products'); // Asegúrate de que la ruta sea correcta
        setProducts(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(products.filter((product) => product._id !== productId));
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Gestión de Productos</h2>
      <button onClick={() => navigate('/add-product')} className="btn btn-primary">Agregar Producto</button>
      <input
        type="text"
        className="form-control my-3"
        placeholder="Buscar producto..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table className="table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>
                  <button onClick={() => handleEdit(product._id)} className="btn btn-secondary">Editar</button>
                  <button onClick={() => handleDelete(product._id)} className="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No se encontraron productos.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductManagement;
