import React from "react";
import "./TermsAndConditions.css";

function TermsAndConditions() {
  return (
    <div className="terms-container">
      <h1>Términos y Condiciones</h1>
      <p>
        Bienvenido a TopTech. Al acceder y utilizar este sitio web, aceptas
        cumplir con los siguientes términos y condiciones. Por favor, léelos
        detenidamente.
      </p>
      <h2>Uso del Sitio Web</h2>
      <p>
        <strong>Registro:</strong> Para realizar compras, debes registrarte
        proporcionando información personal válida.
        <br />
        <strong>Edad Mínima:</strong> Debes ser mayor de 18 años o contar con el
        permiso de tus padres o tutores.
        <br />
        <strong>Propósito Personal:</strong> El uso del sitio está limitado a
        fines personales y no comerciales.
      </p>
      <hr/>
      <h2>Productos</h2>
      <p>
        Las imágenes de los productos son referenciales y pueden variar
        ligeramente del producto real.
        <br />
        TopTech no garantiza la disponibilidad permanente de los productos en
        el inventario.
      </p>
      <hr/>
      <h2>Pagos y Precios</h2>
      <p>
        Todos los precios están expresados en pesos colombianos (COP) e
        incluyen impuestos. Solo se aceptan pagos a través de PSE.
      </p>
      <hr/>
      <h2>Política de Envío</h2>
      <p>
        Los productos serán enviados a la dirección proporcionada durante el
        proceso de compra. No nos hacemos responsables por demoras causadas por
        errores en la dirección proporcionada.
      </p>
      <hr/>
      <h2>Modificaciones</h2>
      <p>
        Podemos actualizar estos términos en cualquier momento. Las
        modificaciones serán publicadas en esta página.
      </p>
    </div>
  );
}

export default TermsAndConditions;
