import React from 'react';
import './FAQs.css';

function FAQs() {
  const questions = [
    {
      question: "¿Debo registrarme para poder comprar en Top Tech?",
      answer:
        "Sí, aunque puedes navegar y añadir productos al carrito sin registrarte, necesitas registrarte o iniciar sesión para completar el proceso de compra, ingresando tus datos personales y detalles de pago.",
    },
    {
      question: "¿Cómo puedo realizar el pago de mis productos?",
      answer:
        "Top Tech acepta pagos únicamente a través de PSE. Al finalizar la compra, selecciona la opción de pago PSE y sigue los pasos indicados para completar el pago de forma segura.",
    },
    {
      question: "¿Es seguro comprar en Top Tech?",
      answer:
        "Sí, la seguridad es una prioridad para nosotros. Utilizamos cifrado para proteger tu información personal y de pago, y empleamos autenticación segura para garantizar que solo tú puedas acceder a tu cuenta.",
    },
    {
      question: "¿Puedo modificar mi pedido después de haberlo realizado?",
      answer:
        "No, una vez confirmado y pagado el pedido, no es posible modificarlo. Por favor, verifica cuidadosamente los productos en el carrito antes de finalizar la compra.",
    },
    {
      question: "¿Top Tech acepta devoluciones o cambios de productos?",
      answer:
        "No, actualmente Top Tech no cuenta con una política de devoluciones o cambios. Asegúrate de revisar bien las especificaciones de cada producto antes de realizar la compra.",
    },
    {
      question: "¿Cómo puedo ver y buscar productos en Top Tech?",
      answer:
        "Puedes explorar el catálogo de productos a través de la página principal o usar la barra de búsqueda para encontrar artículos específicos por nombre o categoría.",
    },
  ];

  return (
    <div className="faqs-container">
      <h1 className="faqs-title">Preguntas Frecuentes (FAQs)</h1>
      <div className="faqs-list">
        {questions.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question">{faq.question}</h3>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQs;
