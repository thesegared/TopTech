import React, { useState } from 'react';
import api from '../api';

function AddProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Asegurarse de que el usuario esté autenticado
      const response = await api.post(
        '/products',
        { name, description, price, category, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Producto creado exitosamente');
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImage('');
    } catch (error) {
      setMessage('Error al crear el producto');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Agregar Producto</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Producto</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Precio</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Categoría</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>URL de la Imagen</label>
          <input
            type="text"
            className="form-control"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Producto</button>
      </form>
    </div>
  );
}

export default AddProductPage;
