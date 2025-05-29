// src/pages/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

// Importações de imagens
import bgPata from "../assets/imgs/bg-pata.png";
import cachorro from "../assets/imgs/original.png";
import banner from "../assets/imgs/banneredit.png";
import perdido from "../assets/imgs/perdido.png";

const Home = () => {
  const navigate = useNavigate();
  
  // Componente Botao
  const Botao = ({
    text = "Botao",
    bgColor = "var(--main-color)",
    hoverColor = "var(--bg-button)",
    textColor = "white",
    onClick,
    className = ""
  }) => {
    const [isHover, setIsHover] = useState(false);
    
    const buttonStyle = {
      backgroundColor: isHover ? hoverColor : bgColor,
      color: textColor,
      padding: '0.5rem 1.2rem',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.3s ease',
      borderBottom: isHover ? `3px solid ${bgColor}` : `3px solid ${hoverColor}`
    };

    return (
      <button
        className={`custom-button ${className}`}
        style={buttonStyle}
        onClick={onClick}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {text}
      </button>
    );
  };

  // Componente DicaCard para CardsHome
  function DicaCard({ title, text }) {
    return (
      <Card
        className="shadow-sm mx-auto h-100"
        style={{ maxWidth: "20rem", borderRadius: "0.75rem" }}
      >
        <Card.Body>
          <Card.Title
            className="fs-5 mb-3"
            style={{ color: "var(--elements-color)" }}
          >
            {title}
          </Card.Title>
          <Card.Text className="text-muted">{text}</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  // Lista de dicas para o componente CardsHome
  const dicas = [
    {
      title: "Socialização Precoce",
      text: "Exponha seu pet a diferentes pessoas, ambientes e sons desde filhote para torná-lo confiante e equilibrado.",
    },
    {
      title: "Alimentação Balanceada",
      text: "Ofereça ração de qualidade adequada à idade, porte e necessidades do seu animal; evite alimentos humanos sem orientação veterinária.",
    },
    {
      title: "Exercício Diário",
      text: "Caminhadas, brincadeiras e estímulos mentais ajudam a manter seu pet ativo e prevenir obesidade e estresse.",
    },
    {
      title: "Higiene e Pelagem",
      text: "Escove o pelo regularmente para evitar nós e ferimentos, e faça banhos periódicos conforme recomendação do veterinário.",
    },
  ];

  // Eventos para o componente EventSection
  const eventos = [
    {
      titulo: "Feira de Adoção de Pets",
      data: "27 de Abril",
      local: "Praça Central, Feira de Santana",
      descricao: "Adote um amigo! Evento com veterinários, ONGs e muita fofura.",
    },
    {
      titulo: "Campanha de Vacinação Gratuita",
      data: "15 de Maio",
      local: "Clínica Pet Saúde, Bairro São João",
      descricao: "Vacinação antirrábica gratuita para cães e gatos.",
    },
  ];

  return (
    <>
      <Header />
      
      {/* Seção Intro */}
      <section className="container espacamento-header mb-5 pb-0" >
        <div className="row px-3 px-md-5">
          <div className="col-12 col-lg-6 mb-5 mb-lg-0">
            <h1 className="text-elements mb-4 mb-md-5" 
                style={{ 
                  fontSize: "clamp(3rem, 8vw, 5rem)", 
                  textShadow: "3px 3px ##fa745a;" 
                }}>
              Pataforma
            </h1>
            <h3 className="mb-4 mb-md-5 fs-4">
              Descubra um novo jeito de <span className="fw-bold">cuidar 
              do seu amigo de quatro patas</span> com a Pataforma.
            </h3>
            <p className="mb-4 mb-md-5">
              <span className="fw-bold">Cuide da saúde:</span> agende consultas veterinárias, 
              vacinas e exames diretamente pela nossa plataforma, com <span className="fw-bold">total confiança.</span>
            </p>
            <Botao 
              text="Saiba mais" 
              bgColor="var(--secondary-color)" 
              hoverColor="var(--elements-color)" 
              className="mt-2"
              onClick={() => navigate("/Sobre")}
            />
          </div>
          <div className="col-12 col-lg-6 position-relative text-center mt-4 mt-lg-0">
            <img 
              src={bgPata} 
              alt="Background" 
              id="bg-pata" 
              className="d-none d-md-block"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <img 
              src={cachorro} 
              alt="Cachorro" 
              className="img-fluid intro-dog mt-2"
              style={{
                maxWidth: "80%",
                height: "auto",
              }}
            />
          </div>
        </div>
      </section>

      {/* Seção Banner */}
      <section className="py-5 pb-0 bg-elements">
        <div className="container px-5 d-flex flex-column flex-lg-row align-items-center justify-content-between gap-5">
          <img
            src={banner}
            alt="Banner"
            className="img-fluid"
            style={{ maxHeight: '350px'}}
          />
          <div className="text-white mb-4 mb-lg-0 w-100 w-lg-50 d-flex flex-column gap-4">
            <h3 className="fw-bold fs-1">Cuidado e amor conectados em um só lugar!</h3>
            <p className="fs-5">
              Uma plataforma inovadora criada para reunir informações e serviços
              essenciais para o cuidado e bem-estar dos animais.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Carrossel */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="m-0 text-elements">Nossos Carrosséis</h3>
            <Botao 
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
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <img
                  className="img-fluid mb-3 mb-md-0 mx-auto"
                  style={{ 
                    width: "100%", 
                    maxWidth: "300px", 
                    height: "auto", 
                    aspectRatio: "1/1",
                    borderRadius: "5px", 
                    objectFit: "cover" 
                  }}
                  src="src\assets\imgs\petadocao1.jpg"
                  alt="Anúncio de pet perdido 1"
                />
                <img
                  className="img-fluid mb-3 mb-md-0 mx-auto d-none d-sm-block"
                  style={{ 
                    width: "100%", 
                    maxWidth: "300px", 
                    height: "auto", 
                    aspectRatio: "1/1",
                    borderRadius: "5px", 
                    objectFit: "cover" 
                  }}
                  src="src\assets\imgs\petadocao2.jpg"
                  alt="Anúncio de pet perdido 2"
                />
                <img
                  className="img-fluid mb-3 mb-md-0 mx-auto d-none d-md-block"
                  style={{ 
                    width: "100%", 
                    maxWidth: "300px", 
                    height: "auto", 
                    aspectRatio: "1/1",
                    borderRadius: "5px", 
                    objectFit: "cover" 
                  }}
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
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <img
                  className="img-fluid mb-3 mb-md-0 mx-auto"
                  style={{ 
                    width: "100%", 
                    maxWidth: "300px", 
                    height: "auto", 
                    aspectRatio: "1/1",
                    borderRadius: "5px", 
                    objectFit: "cover" 
                  }}
                  src="src\assets\imgs\vetparceiro.jpg"
                  alt="Veterinário 1"
                />
                <img
                  className="img-fluid mb-3 mb-md-0 mx-auto d-none d-sm-block"
                  style={{ 
                    width: "100%", 
                    maxWidth: "300px", 
                    height: "auto", 
                    aspectRatio: "1/1",
                    borderRadius: "5px", 
                    objectFit: "cover" 
                  }}
                  src="src\assets\imgs\vetparceiro2.jpg"
                  alt="Veterinário 2"
                />
                <img
                  className="img-fluid mb-3 mb-md-0 mx-auto d-none d-md-block"
                  style={{ 
                    width: "100%", 
                    maxWidth: "300px", 
                    height: "auto", 
                    aspectRatio: "1/1",
                    borderRadius: "5px", 
                    objectFit: "cover" 
                  }}
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
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                <img
                  className="img-fluid mb-3 mb-md-0 mx-auto"
                  style={{ 
                    width: "100%", 
                    maxWidth: "300px", 
                    height: "auto", 
                    aspectRatio: "1/1",
                    borderRadius: "5px", 
                    objectFit: "contain"
                  }}
                  src="src\assets\imgs\perdido1.png"
                  alt="Anúncio de pet perdido 1"
                />
                <img
                  className="img-fluid mb-3 mb-md-0 mx-auto d-none d-sm-block"
                  style={{ 
                    width: "100%", 
                    maxWidth: "300px", 
                    height: "auto", 
                    aspectRatio: "1/1",
                    borderRadius: "5px", 
                    objectFit: "contain" 
                  }}
                  src="src\assets\imgs\perdido2.png"
                  alt="Anúncio de pet perdido 2"
                />
                <img
                  className="img-fluid mb-3 mb-md-0 mx-auto d-none d-md-block"
                  style={{ 
                    width: "100%", 
                    maxWidth: "300px", 
                    height: "auto", 
                    aspectRatio: "1/1",
                    borderRadius: "5px", 
                    objectFit: "contain" 
                  }}
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
          </Carousel>
        </div>
      </section>

      {/* Seção CardsHome */}
      <section className="py-5">
        <h3
          className="text-center mb-4"
          style={{ color: "var(--black)", fontWeight: "500" }}
        >
          Dicas de Cuidados
        </h3>
        <div className="container">
          <div className="row gx-3 gy-4 justify-content-center">
            {dicas.map((dica, idx) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={idx}>
                <DicaCard {...dica} />
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button
              className="btn text-white custom-btn"
              onClick={() => navigate("/Animais?tab=dicas")}
            >
              Saiba mais
            </Button>
          </div>
        </div>
      </section>

      {/* Seção Eventos */}
      <section className="py-5 bg-light" id="eventos">
        <div className="container">
          <h3 className="text-center mb-5 text-elements">Agenda de Eventos</h3>
          <div className="row">
            {eventos.map((evento, index) => (
              <div key={index} className="col-md-6 mb-4">
                <div className="card h-100 shadow rounded-4">
                  <div className="card-body">
                    <h5 className="card-title text-elements">{evento.titulo}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{evento.data} - {evento.local}</h6>
                    <p className="card-text">{evento.descricao}</p>
                    <Botao 
                      text="Saiba mais" 
                      bgColor="var(--secondary-color)" 
                      hoverColor="var(--elements-color)" 
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção ProductHighlight */}
      <section className="py-5 bg-light text-center">
        <h3>Alimentador Inteligente</h3>
        <p>Descubra como o nosso alimentador pode transformar a alimentação do seu pet.</p>
        <img src="src\assets\imgs\alimentador.png" alt="Alimentador" width={"300px"}  />
        <br />
        <Botao 
          text="Saiba mais" 
          bgColor="var(--secondary-color)" 
          hoverColor="var(--elements-color)" 
          className="mt-3"
        />
      </section>

      {/* Seção Perdidos */}
      <section className="py-5 bg-button text-white">
        <div className="container px-5 d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div>
            <h3 className="bg-white text-center text-elements py-2 px-3 rounded-3">
              Encontre pets perdidos
            </h3>
            <p className="mt-3">
              Com a Pataforma, você pode encontrar pets perdidos e ajudar a trazer de volta para casa aqueles que mais precisam.
            </p>
          </div>
          <img
            src={perdido}
            alt="Gatinho perdido"
            className="img-fluid mt-3 mt-lg-0"
            style={{ maxHeight: '300px' }}
          />
        </div>
      </section>

      {/* Seção CallToAction */}
      <section className="py-5 bg-dark text-white text-center">
        <h3>Junte-se à comunidade!</h3>
        <p>Cadastre-se como tutor ou veterinário e faça a diferença!</p>
        <div>
          <Button 
            className="btn text-black me-3"
            style={{ backgroundColor: "white" }}
            onClick={() => navigate("/cadastro")}
          >
            Cadastrar como Tutor
          </Button>
          <Button 
            className="btn text-black"
            style={{ backgroundColor: "white" }}
            onClick={() => navigate("/veterinarios?cadastro=true")}
          >
            Cadastrar como Veterinário
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;