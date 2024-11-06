import React, { useEffect, useState } from 'react';
import api from '../api';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener productos:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    return (
        <div className="container">
            <h2>Lista de Productos</h2>
            <div className="row">
                {products.map((product) => (
                    <div key={product._id} className="col-md-4">
                        <div className="card mb-4">
                            <img src={product.image} className="card-img-top" alt={product.name} />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text"><strong>Precio:</strong> ${product.price}</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
