import React from "react";
import Carousel from "react-bootstrap/Carousel"; // Usando o carousel do Bootstrap

function CarrouselSection() {
  return (
    <section className="py-5">
      <h3 className="text-center mb-4">Nossos Carrosséis</h3>
      <Carousel>
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
          <Carousel.Caption>
            <section>
            <h3 style={{ textShadow: "1px 1px 4px black", color: "var(--elements-color)"}}>Pets para Adoção</h3>
            <p>Ofereça um lar para um amigo.</p>
            <button className="btn btn-secondary">Ver todos</button>
            </section>
          </Carousel.Caption>
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
          <Carousel.Caption>
            <section>
            <h3 style={{ textShadow: "1px 1px 4px black", color: "var(--elements-color)" }}>Veterinários Parceiros</h3>
            <p>Veja os veterinários mais próximos de você!</p>
            <button className="btn btn-secondary">Ver todos</button>
            </section>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
        <div className="d-flex justify-content-center gap-3">
              <img
            className="img-fluid"
            style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "cover"}}
            src="src\assets\imgs\petperdido1.webp"
            alt="Anúncio de pet perdido 1"
          />
          <img
            className="img-fluid"
            style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "cover" }}
            src="src\assets\imgs\petperdido2.webp"
            alt="Anúncio de pet perdido 2"
          />
          <img
            className="img-fluid"
            style={{ width: "300px", height: "300px", borderRadius: "5px", objectFit: "cover" }}
            src="src\assets\imgs\petperdido3.png"
            alt="Anúncio de pet perdido 3"
          />
        </div>
          <Carousel.Caption>
            <section>         
            <h3 style={{ textShadow: "1px 1px 4px black", color: "var(--elements-color)"}}> Pets Perdidos</h3>
            <p>Ajude a encontrar animais perdidos.</p>
            <button className="btn btn-secondary">Ver todos</button>
            </section>
          </Carousel.Caption>
        </Carousel.Item>
        {/* Outros carrosséis */}
      </Carousel>
    </section>
  );
}

export default CarrouselSection;
