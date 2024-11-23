import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Link } from "react-router-dom";
import "./Payment.css";

const Payment = () => {
  return (
    <div className="payment-container">
      <Player
        autoplay
        loop
        src={require("../assets/Animation - 1732161599008.json")} 
        className="payment-animation"
      />
      <h1>Página en Mantenimiento</h1>
      <p>Estamos trabajando para habilitar esta sección pronto.</p>
      <p>
        Por ahora, puedes continuar explorando{" "}
        <Link to="/" className="home-link">nuestros productos</Link>.
      </p>
    </div>
  );
};

export default Payment;
