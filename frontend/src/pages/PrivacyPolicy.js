import React from "react";
import "./PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      <h1>Política de Privacidad</h1>
      <p>
        En TopTech, respetamos tu privacidad y estamos comprometidos con la
        protección de tus datos personales. Este documento describe cómo
        recopilamos, usamos y protegemos tu información.
      </p>
      <h2>Datos que Recopilamos</h2>
      <p>
        <strong>Datos personales:</strong> Nombre, correo electrónico, teléfono,
        dirección, y cualquier otra información proporcionada durante el
        registro o la compra.
        <br />
        <strong>Datos de navegación:</strong> Información técnica como tu
        dirección IP, navegador y sistema operativo.
        <br />
        <strong>Datos de pago:</strong> Información relacionada con transacciones
        realizadas a través de PSE.
      </p>
      <hr/>
      <h2>Cómo Usamos Tus Datos</h2>
      <p>
        1. Para procesar tus compras y gestionar envíos.<br></br> 
        2. Para enviarte actualizaciones sobre tu pedido o promociones (si aceptaste recibirlas).<br></br>
        3. Para mejorar nuestro sitio web y experiencia de usuario.
      </p>
      <hr/>
      <h2>Seguridad de los Datos</h2>
      <p>
        Utilizamos cifrado SSL para proteger tus datos durante las transacciones.
        Limitamos el acceso a tus datos personales a personal autorizado.
      </p>
      <hr/>
      <h2>Cookies</h2>
      <p>
        Usamos cookies para mejorar tu experiencia de navegación. Puedes
        desactivarlas en la configuración de tu navegador, pero algunas
        funcionalidades del sitio podrían verse afectadas.
      </p>
      <hr/>
      <h2>Cambios a esta Política</h2>
      <p>
        Podemos actualizar esta política en cualquier momento. Te recomendamos
        revisar esta página periódicamente.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
