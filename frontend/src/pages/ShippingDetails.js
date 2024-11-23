import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShippingDetails.css";

function ShippingDetails() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        document: "",
        companyName: "",
        country: "Colombia", // País fijo
        address: "",
        city: "",
        phone: "",
        email: "",
        orderNotes: "",
    });

    const cities = [
        "Bogotá",
        "Medellín",
        "Cali",
        "Barranquilla",
        "Cartagena",
        "Bucaramanga",
        "Manizales",
        "Pereira",
        "Santa Marta",
        "Armenia",
        "Ibagué",
    ]; // Lista de ciudades colombianas

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validatePhone = (phone) => /^[0-9]{10}$/.test(phone); // Validar 10 dígitos numéricos

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar datos del formulario
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.document ||
            !formData.address ||
            !formData.city ||
            !formData.phone ||
            !formData.email
        ) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        if (!validatePhone(formData.phone)) {
            alert("Por favor ingresa un número de teléfono válido (10 dígitos).");
            return;
        }

        // Guardar los datos de envío en el almacenamiento local (o enviarlos a la API)
        localStorage.setItem("shippingDetails", JSON.stringify(formData));

        // Redirigir al método de pago
        navigate("/payment");
    };

    return (
        <div className="shipping-container">
            <h2>Detalles de Envío</h2>
            <form onSubmit={handleSubmit} className="shipping-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Apellidos:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>C.C o NIT:</label>
                    <input
                        type="text"
                        name="document"
                        value={formData.document}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Nombre de la Empresa (opcional):</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>País:</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        readOnly // Campo fijo
                    />
                </div>
                <div className="form-group">
                    <label>Dirección:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Ciudad:</label>
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una ciudad</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Teléfono:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Dirección de correo electrónico:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Notas del pedido (opcional):</label>
                    <textarea
                        name="orderNotes"
                        value={formData.orderNotes}
                        onChange={handleChange}
                        placeholder="Notas sobre tu pedido, por ejemplo, notas especiales para la entrega."
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Continuar con el Pago
                </button>
            </form>
        </div>
    );
}

export default ShippingDetails;
