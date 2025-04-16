import React from "react";
import Carousel from "react-bootstrap/Carousel"; // Usando o carousel do Bootstrap

function CarrouselSection() {
  return (
    <section className="py-5">
      <h3 className="text-center mb-4">Nossos Carrosséis</h3>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400?text=Veterin%C3%A1rios+Parceiros"
            alt="Veterinários Parceiros"
          />
          <Carousel.Caption>
            <h3>Veterinários Parceiros</h3>
            <p>Veja os veterinários mais próximos de você!</p>
            <button className="btn btn-secondary">Ver todos</button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400?text=Pets+Perdidos"
            alt="Pets Perdidos"
          />
          <Carousel.Caption>
            <h3>Pets Perdidos</h3>
            <p>Ajude a encontrar animais perdidos.</p>
            <button className="btn btn-secondary">Ver todos</button>
          </Carousel.Caption>
        </Carousel.Item>
        {/* Outros carrosséis */}
      </Carousel>
    </section>
  );
}

export default CarrouselSection;
