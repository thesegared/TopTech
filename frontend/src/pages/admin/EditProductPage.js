import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import api from '../../api';
import './EditProductPage.css';


function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // Para manejar la URL de la imagen existente
  const [message, setMessage] = useState('');

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

  // Cargar el producto actual
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data;
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setCategory(product.category);
        setImageUrl(product.image); // Asignar la URL de la imagen existente
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear FormData solo con los campos que deseas actualizar
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);

    // Solo agregar la imagen si se ha seleccionado un archivo
    if (image && image instanceof File) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      await api.put(`/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Producto actualizado exitosamente');
      navigate('/admin/manage-products');
    } catch (error) {
      setMessage('Error al actualizar el producto');
      console.error('Error al actualizar el producto:', error);
    }
  };

  return (
    <div className="edit-product-container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-button">
          <MdArrowBack size={24} />
        </button>
        <h2>Editar Producto</h2>
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
          <label>Imagen del Producto</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {imageUrl && !image && (
            <div className="mt-2">
              <img src={imageUrl} alt={name} style={{ width: '100px', height: '100px' }} />
            </div>
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;
