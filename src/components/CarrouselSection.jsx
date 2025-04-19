import React from "react";
import Carousel from "react-bootstrap/Carousel"; // Usando o carousel do Bootstrap
import Button from "./Button";

function CarrouselSection() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="m-0 text-elements">Nossos Carrosséis</h3>
          <Button 
            text="Ver todos" 
            bgColor="var(--secondary-color)" 
            hoverColor="var(--elements-color)" 
          />
        </div>
        <Carousel 
          indicators={true}
          controls={true}
          className="custom-carousel"
          interval={5000}
        >
          <Carousel.Item>
            <div className="d-flex justify-content-center gap-3">
              <img
                className="img-fluid"
                style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "cover" }}
                src="src\assets\imgs\petadocao1.jpg"
                alt="Anúncio de pet perdido 1"
              />
              <img
                className="img-fluid"
                style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "cover" }}
                src="src\assets\imgs\petadocao2.jpg"
                alt="Anúncio de pet perdido 2"
              />
              <img
                className="img-fluid"
                style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "cover" }}
                src="src\assets\imgs\petadocao3.avif"
                alt="Anúncio de pet perdido 3"
              />
            </div>
            <div className="carousel-caption-container">
              <div className="carousel-caption-custom">
                <h3>Pets para Adoção</h3>
                <p>Ofereça um lar para um amigo.</p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="d-flex justify-content-center gap-3">
              <img
                className="img-fluid"
                style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "cover" }}
                src="src\assets\imgs\vetparceiro.jpg"
                alt="Veterinário 1"
              />
              <img
                className="img-fluid"
                style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "cover" }}
                src="src\assets\imgs\vetparceiro2.jpg"
                alt="Veterinário 2"
              />
              <img
                className="img-fluid"
                style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "cover" }}
                src="src\assets\imgs\vetparceiro3.png"
                alt="Veterinário 3"
              />
            </div>
            <div className="carousel-caption-container">
              <div className="carousel-caption-custom">
                <h3>Veterinários Parceiros</h3>
                <p>Veja os veterinários mais próximos de você!</p>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="d-flex justify-content-center gap-3">
              <img
                className="img-fluid"
                style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "contain"}}
                src="src\assets\imgs\perdido1.png"
                alt="Anúncio de pet perdido 1"
              />
              <img
                className="img-fluid"
                style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "contain" }}
                src="src\assets\imgs\perdido2.png"
                alt="Anúncio de pet perdido 2"
              />
              <img
                className="img-fluid"
                style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "contain" }}
                src="src\assets\imgs\perdido3.png"
                alt="Anúncio de pet perdido 3"
              />
            </div>
            <div className="carousel-caption-container">
              <div className="carousel-caption-custom">
                <h3>Pets Perdidos</h3>
                <p>Ajude a encontrar animais perdidos.</p>
              </div>
            </div>
          </Carousel.Item>
          {/* Outros carrosséis */}
        </Carousel>
      </div>
    </section>
  );
}

export default CarrouselSection;
