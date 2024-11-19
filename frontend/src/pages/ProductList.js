import React, { useEffect, useState } from "react";
import api from "../api";
import "./ProductList.css";
import { FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi"; // Icono de hamburguesa
import { useCart } from "../contexts/CartContext";

const categories = [
  "Categorías",
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

const sortOptions = [
  { value: "", label: "Ordenar por" },
  { value: "newest", label: "Más recientes" },
  { value: "oldest", label: "Más antiguos" },
  { value: "priceAsc", label: "Menor a Mayor precio" },
  { value: "priceDesc", label: "Mayor a Menor precio" },
];



function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortFilter, setSortFilter] = useState(""); // Nuevo estado para el criterio de ordenamiento
  const [showDescription, setShowDescription] = useState({});
  const { fetchCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products", {
          params: { search: searchTerm, category: categoryFilter, sort: sortFilter },
        });
        setProducts(response.data); // El backend devuelve solo los productos activos
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [searchTerm, categoryFilter, sortFilter]);  

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);
  const handleSortChange = (e) => setSortFilter(e.target.value);

  const addToCart = async (productId, availableQuantity) => {
    const userId = localStorage.getItem("userId") || "guest";
  
    if (availableQuantity <= 0) {
      alert("No hay suficiente stock disponible.");
      return;
    }
  
    try {
      await api.post("/cart/add", { userId, productId });
      await fetchCart();
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

  const filteredProducts = products.filter(
    (product) => product.active && product.quantity > 0
  );

  
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
        <div className="filters">
          <div className="category-container">

            <select value={categoryFilter} onChange={handleCategoryChange}>
              {categories.map((category) => (
                <option
                  key={category}
                  value={category === "Categorías" ? "" : category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="sort-container">
            <select value={sortFilter} onChange={handleSortChange}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
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
                <div className="product-footer">
                  <p className="product-price">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </p>
                  <button
                    onClick={() => addToCart(product._id)}
                    className="btn btn-primary product-btn"
                  >
                    Añadir al carrito
                  </button>
                </div>
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
