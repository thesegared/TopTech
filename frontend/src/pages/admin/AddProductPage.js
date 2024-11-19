import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md'; // Importar el icono de flecha
import api from '../../api';
import './AddProductPage.css';

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
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      formData.append('image', image);

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
      setPreview(null);

      navigate('/admin/manage-products');
    } catch (error) {
      setMessage('Error al crear el producto');
      console.error(error);
    }
  };

  return (
    <div className="add-product-container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-button">
          <MdArrowBack size={24} />
        </button>
        <h2>Agregar Producto</h2>
      </div>
      {message && <p className={message.includes('exitosamente') ? 'success' : 'error'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Producto</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          />
        </div>
        <div className="form-group">
          <label>Categoría</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            onChange={handleImageChange}
          />
          {preview && <img src={preview} alt="Vista Preliminar" className="image-preview" />}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Agregar Producto</button>
        </div>
      </form>
      
    </div>
  );
}

export default AddProductPage;
