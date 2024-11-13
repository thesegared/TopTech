import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

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

    // Verificar si todos los campos están correctamente definidos
    console.log("Formulario enviado con los siguientes datos:", {
      name,
      description,
      price,
      category,
      image,
    });

    // Verifica si los datos requeridos están presentes
    if (!name || !description || !price || !category) {
      setMessage('Por favor complete todos los campos requeridos');
      return;
    }

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

    // Verifica qué se está enviando
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token de autorización:', token);

      // Realiza la solicitud PUT
      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Respuesta de la API:', response);
      setMessage('Producto actualizado exitosamente');
      navigate('/admin/manage-products');
    } catch (error) {
      setMessage('Error al actualizar el producto');
      console.error('Error al actualizar el producto:', error);
    }
};

  return (
    <div className="container">
      <h2>Editar Producto</h2>
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
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditProductPage;