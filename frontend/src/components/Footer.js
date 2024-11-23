import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer bg-light text-center text-lg-start" style={{ textAlign: "center" }}>

      
      <div className="container">
        {/* Información de contacto */}
        <div className="footer-section">
          <p>
            <FaEnvelope /> Correo: <a href="mailto:Toptech2404@gmail.com">Toptech2404@gmail.com</a>
          </p>
        </div>

        

        {/* Navegación rápida */}
        <div className="footer-section footer-links">
          <Link to="/faqs">FAQs</Link>
          <Link to="/terms">Términos y Condiciones</Link>
          <Link to="/privacy-policy">Política de Privacidad</Link>
        </div>

        

        {/* Redes sociales */}
        <div className="footer-section footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </div>

        

        {/* Derechos reservados */}
        <div className="footer-section">
          <p>© 2024 TopTech - Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
