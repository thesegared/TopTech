import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom'; // Necesitamos usar useNavigate para redirigir

const categories = [
  "Accesorios de Tecnología",
  "Audio y sonido",
  "Cámaras",
  "Cargadores, Cables y Pilas",
  "Celulares y Telefonía",
  "Computadores",
  "Dispositivos De Almacenamiento",
  "Drones",
  "Gaming",
  "Impresión e Insumos",
  "Soporte y Trípodes",
  "Televisión y video",
  "Otros"
];

function AddProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Para redirigir al usuario a otra página

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validaciones en el frontend
    if (!name.trim()) {
      setMessage('El nombre del producto es obligatorio.');
      return;
    }
  
    if (!price || price <= 0) {
      setMessage('El precio debe ser mayor a 0.');
      return;
    }
  
    if (!category) {
      setMessage('La categoría es obligatoria.');
      return;
    }
  
    if (!image) { 
      setMessage('La imagen es obligatoria.');
      return;
    }

    const finalDescription = description.trim() || '';
  
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', finalDescription);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('image', image); // La imagen se envía como un archivo
  
      await api.post('/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage('Producto creado exitosamente');
      setName('');
      setDescription('');
      setPrice('');
      setCategory(categories[0]);
      setImage(null);

      // Redirigir a la página de gestión de productos
      navigate('/admin/manage-products'); // Esto redirige a la página de gestión
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
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Imagen del Producto (obligatoria)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Producto</button>
      </form>
    </div>
  );
}

export default AddProductPage;