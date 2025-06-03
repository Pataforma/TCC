import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardBase from "../components/Dashboard/DashboardBase";
import { useNavigate } from "react-router-dom";

const DashboardAnunciante = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <DashboardBase
        titulo="Área do Anunciante de Eventos"
        tipoUsuario="anunciante"
      >
        <div
          className="container d-flex flex-column align-items-center justify-content-center flex-grow-1"
          style={{ minHeight: "50vh" }}
        >
          <div className="text-center w-100" style={{ maxWidth: 600 }}>
            <button
              className="btn btn-link mb-3 p-0 text-primary"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left me-2"></i> Voltar
            </button>
            <h2>Bem-vindo(a) à sua área de Anunciante de Eventos!</h2>
            <p>
              Aqui você poderá cadastrar e gerenciar eventos relacionados a
              pets.
            </p>
            {/* Aqui você pode adicionar o formulário de cadastro e gerenciamento de eventos */}
          </div>
        </div>
      </DashboardBase>
      <Footer />
    </div>
  );
};

export default DashboardAnunciante;
