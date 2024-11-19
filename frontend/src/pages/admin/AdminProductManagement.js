import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import "./AdminProductManagement.css";

function AdminProductManagement() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceOrder, setPriceOrder] = useState(""); // "asc" para ascendente, "desc" para descendente
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/"); // Redirige a la página principal si no es administrador
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products", {
          params: { includeInactive: true }, // Solicitar todos los productos
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(products.filter((product) => product._id !== productId));
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await api.put(`/products/${productId}/update-quantity`, { quantity: newQuantity });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, quantity: Math.max(newQuantity, 0) } : product
        )
      );
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);
    }
  };

  const handleToggleActive = async (productId, newActiveStatus) => {
    try {
      await api.put(`/products/${productId}/toggle-active`, { active: newActiveStatus });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? { ...product, active: newActiveStatus } : product
        )
      );
    } catch (error) {
      console.error("Error al alternar el estado activo:", error);
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      categoryFilter ? product.category === categoryFilter : true
    )
    .sort((a, b) => {
      if (priceOrder === "asc") return a.price - b.price;
      if (priceOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container">
      <h2>Panel de Administración</h2>

      {/* Botones de agregar productos y gestionar usuarios */}
      <div className="admin-buttons">
        <button
          onClick={() => navigate("/add-product")}
          className="btn btn-primary admin-btn"
        >
          Agregar Producto
        </button>
        <button
          onClick={() => navigate("/admin/manage-roles")}
          className="btn btn-secondary admin-btn"
        >
          Gestionar Usuarios
        </button>
      </div>

      <div className="filters-container">
        <div className="search-and-filters">
          {/* Recuadro de búsqueda mejorado */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          {/* Filtros de categoría y precio mejorados */}
          <div className="filter-group">
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas las Categorías</option>
              <option value="Accesorios de Tecnología">Accesorios de Tecnología</option>
              <option value="Gaming">Gaming</option>
              <option value="Audio y sonido">Audio y sonido</option>
              <option value="Televisión y video">Televisión y video</option>
              <option value="Otros">Otros</option>
            </select>
            <select
              className="form-control"
              value={priceOrder}
              onChange={(e) => setPriceOrder(e.target.value)}
            >
              <option value="">Ordenar por Precio</option>
              <option value="asc">Menor a Mayor</option>
              <option value="desc">Mayor a Menor</option>
            </select>
          </div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0, // Esto elimina los decimales
                  }).format(product.price)}
                </td>
                <td>
                  {/* Mejorar los controles de cantidad */}
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleUpdateQuantity(product._id, product.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(product._id, product.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    className={`toggle-switch ${product.active ? "active" : ""}`}
                    onClick={() => handleToggleActive(product._id, !product.active)}
                  ></button>
                </td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="action-btn edit-btn"
                    >
                      <FaEdit />
                      <span className="tooltip">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="action-btn delete-btn"
                    >
                      <MdDeleteForever />
                      <span className="tooltip">Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No se encontraron productos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductManagement;
