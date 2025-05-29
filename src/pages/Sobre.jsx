import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import logo from "../assets/imgs/logo.png";
import { useNavigate } from "react-router-dom";
const Sobre = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      {/* Hero Section */}
      <section className="container-fluid text-white py-5 mt-5 position-relative sobre-bg">
        {/* Overlay escuro */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1 }}
        ></div>

        {/* Conteúdo com z-index acima do overlay */}
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-5 fw-bold">Sobre nós</h1>
          <p className="lead">
            Entenda mais um pouco sobre o que é a Pataforma
          </p>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-elements fw-bold">Nossa Missão</h2>
            <div
              className="mx-auto"
              style={{
                width: "50px",
                height: "4px",
                backgroundColor: "var(--secondary-color)",
              }}
            ></div>
          </div>
          <div className="col-md-6">
            <p className="lead">
              A Pataforma nasceu com o objetivo de transformar a relação entre
              tutores, veterinários e animais de estimação, oferecendo soluções
              tecnológicas que facilitam o cuidado e bem-estar dos pets.
            </p>
            <p>
              Acreditamos que cada animal merece cuidados de qualidade e que a
              tecnologia pode aproximar pessoas e recursos para proporcionar uma
              vida mais saudável e feliz aos nossos amigos de quatro patas.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <img
              src={logo}
              alt="Nossa Missão"
              className="img-fluid shadow rounded"
              style={{ maxWidth: "350px" }}
            />
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="container-fluid py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="text-elements fw-bold">Nossos Valores</h2>
              <div
                className="mx-auto"
                style={{
                  width: "50px",
                  height: "4px",
                  backgroundColor: "var(--secondary-color)",
                }}
              ></div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div
                    className="rounded-circle bg-main d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="fas fa-user-doctor text-white fs-3"></i>
                  </div>
                  <h4 className="text-elements">Cuidado</h4>
                  <p>
                    Colocamos o bem-estar dos animais em primeiro lugar,
                    promovendo práticas responsáveis de cuidado e atenção às
                    suas necessidades.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div
                    className="rounded-circle bg-main d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="fas fa-user-doctor text-white fs-3"></i>
                  </div>

                  <h4 className="text-elements">Confiança</h4>
                  <p>
                    Construímos relações baseadas na transparência e
                    confiabilidade, garantindo um ambiente seguro para tutores e
                    profissionais.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div
                    className="rounded-circle bg-main d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="fas fa-solid fa-lightbulb text-white fs-3"></i>
                  </div>

                  <h4 className="text-elements">Inovação</h4>
                  <p>
                    Buscamos constantemente soluções tecnológicas inovadoras
                    para facilitar o acesso aos serviços e melhorar a
                    experiência de todos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-elements fw-bold">Nossa Equipe</h2>
            <div
              className="mx-auto"
              style={{
                width: "50px",
                height: "4px",
                backgroundColor: "var(--secondary-color)",
              }}
            ></div>
            <p className="mt-3">
              Conheça as pessoas por trás da Plataforma que trabalham
              diariamente para proporcionar a melhor experiência para você e seu
              pet.
            </p>
          </div>
        </div>

        {/* Cards dos integrantes */}
        <div className="row g-4">
          {/* Card 1 */}
          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="text-center pt-4">
                <img
                  src="src\assets\imgs\laila.png"
                  alt="Membro da Equipe"
                  className="rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="card-body text-center">
                <h5 className="text-elements">Laila Nichole</h5>
                <p className="text-muted">Desenvolvedora</p>
                {/* <p>
                  Veterinária e empreendedora apaixonada por tecnologia e bem-estar animal.
                </p> */}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="text-center pt-4">
                <img
                  src="src\assets\imgs\eduardo.png"
                  alt="Membro da Equipe"
                  className="rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="card-body text-center">
                <h5 className="text-elements">Eduardo Pires</h5>
                <p className="text-muted">Desenvolvedor</p>
                {/* <p>
                  Desenvolvedor com vasta experiência em aplicações para o setor de saúde animal.
                </p> */}
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="text-center pt-4">
                <img
                  src="src\assets\imgs\johan.png"
                  alt="Membro da Equipe"
                  className="rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="card-body text-center">
                <h5 className="text-elements">Johan Victor</h5>
                <p className="text-muted">Desenvolvedor</p>
                {/* <p>
                  Especialista em estratégias digitais e comunicação para o mercado pet.
                </p> */}
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-md-3 col-sm-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="text-center pt-4">
                <img
                  src="src\assets\imgs\levi.png"
                  alt="Membro da Equipe"
                  className="rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="card-body text-center">
                <h5 className="text-elements">Levi Figueredo</h5>
                <p className="text-muted">Desenvolvedor</p>
                {/* <p>
                  Desenvolvedor com vasta experiência em aplicações para o setor de saúde animal.
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="container-fluid py-5 bg-main text-white text-center">
        <div className="container py-3">
          <h2 className="fw-bold mb-4">Faça parte dessa história</h2>
          <p className="lead mb-4">
            Junte-se à nossa comunidade e transforme a vida do seu pet com a
            Pataforma
          </p>
          <div>
            <Button
              text="Quero fazer parte"
              bgColor="var(--secondary-color)"
              hoverColor="var(--elements-color)"
              textColor="white"
              className="me-3 px-4 py-2"
              onClick={() => navigate("/Auth")}
            />
            <Button
              text="Fale Conosco"
              bgColor="var(--secondary-color)"
              hoverColor="var(--elements-color)"
              textColor="white"
              className="px-4 py-2"
              style={{ border: "1px solid white" }}
              onClick={() => navigate("/Contato")}
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Sobre;
