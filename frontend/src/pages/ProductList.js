import React, { useEffect, useState } from "react";
import api from "../api";
import "./ProductList.css";
import { FaSearch } from "react-icons/fa";
import { useCart } from "../contexts/CartContext"; // Importa el contexto del carrito

const categories = [
  "CATEGORÍAS",
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
  "Otros",
];

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showDescription, setShowDescription] = useState({});
  const { fetchCart } = useCart(); // Usa el contexto del carrito

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products", {
          params: { search: searchTerm, category: categoryFilter },
        });
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, categoryFilter]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId") || "guest"; // Usa "guest" si no hay un userId

    try {
      await api.post("/cart/add", { userId, productId });
      await fetchCart(); // Llama a fetchCart para actualizar el estado global del carrito
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert("Hubo un error al agregar el producto al carrito");
    }
  };

  const toggleDescription = (productId) => {
    setShowDescription((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="container">
      <div className="search-filter">
        <div className="search-input">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>
        <div className="category-container">
          <select value={categoryFilter} onChange={handleCategoryChange}>
            {categories.map((category) => (
              <option
                key={category}
                value={category === "CATEGORÍAS" ? "" : category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.image}
                className="product-img"
                alt={product.name}
              />
              <div className="product-body">
                {product.onSale && <div className="product-badge">OFERTA</div>}
                <h5 className="product-title">{product.name}</h5>
                <p className="product-price">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                </p>
                {showDescription[product._id] && (
                  <p className="product-description">{product.description}</p>
                )}
                <button
                  onClick={() => addToCart(product._id)}
                  className="btn btn-primary product-btn"
                >
                  Añadir al carrito
                </button>
                <button
                  onClick={() => toggleDescription(product._id)}
                  className="btn btn-link"
                >
                  {showDescription[product._id] ? "Ver menos..." : "Ver más..."}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
