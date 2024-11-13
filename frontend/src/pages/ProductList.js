import React, { useEffect, useState } from 'react';
import api from '../api';
import './ProductList.css';
import { FaSearch } from 'react-icons/fa'; // Importamos el ícono de lupa

const categories = [
    "Todas las Categorías", 
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

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showDescription, setShowDescription] = useState({});

    // Actualizamos el efecto para que escuche tanto a searchTerm como categoryFilter
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products', {
                    params: { search: searchTerm, category: categoryFilter }
                });
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener productos:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchTerm, categoryFilter]); // Ahora se ejecuta cada vez que se cambia el término de búsqueda o la categoría

    const handleSearchChange = (e) => setSearchTerm(e.target.value); // Cambiar el valor al escribir
    const handleCategoryChange = (e) => setCategoryFilter(e.target.value); // Filtrar por categoría

    const addToCart = async (productId) => {
        const userId = 'userId123'; // Obtén el ID del usuario autenticado
        console.log('Enviando al backend:', { userId, productId }); 

        try {
            const response = await api.post('/cart/add', { userId, productId });
            console.log('Producto agregado al carrito:', response.data);
            alert('Producto agregado al carrito');
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            alert('Hubo un error al agregar el producto al carrito');
        }
    };

    const toggleDescription = (productId) => {
        setShowDescription(prevState => ({
            ...prevState,
            [productId]: !prevState[productId]
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
                        value={searchTerm} // El valor de búsqueda se obtiene del estado searchTerm
                        onChange={handleSearchChange} // Cambia el valor al escribir
                    />
                    <button className="search-btn">
                        <FaSearch />
                    </button>
                </div>
                <select value={categoryFilter} onChange={handleCategoryChange}> {/* Filtra por categoría */}
                    {categories.map((category) => (
                        <option key={category} value={category === "Todas las Categorías" ? "" : category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className="product-card">
                            <img src={product.image} className="product-img" alt={product.name} />
                            <div className="product-body">
                                {product.onSale && <div className="product-badge">OFERTA</div>}
                                <h5 className="product-title">{product.name}</h5>
                                <p className="product-price">
                                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(product.price)}
                                </p>
                                {showDescription[product._id] && <p className="product-description">{product.description}</p>}
                                <button onClick={() => addToCart(product._id)} className="btn btn-primary product-btn">Añadir al carrito</button>
                                <button onClick={() => toggleDescription(product._id)} className="btn btn-link">
                                    {showDescription[product._id] ? 'Ver menos...' : 'Ver más...'}
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
