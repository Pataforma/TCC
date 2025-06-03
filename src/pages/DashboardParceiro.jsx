import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardBase from "../components/Dashboard/DashboardBase";
import { useNavigate } from "react-router-dom";

const DashboardParceiro = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <DashboardBase titulo="Área do Parceiro" tipoUsuario="parceiro">
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
            <h2>Bem-vindo(a) à sua área de Parceiro!</h2>
            <p>Aqui você terá acesso a recursos especiais para parceiros.</p>
            {/* Aqui você pode adicionar recursos e funcionalidades para parceiros */}
          </div>
        </div>
      </DashboardBase>
      <Footer />
    </div>
  );
};

export default DashboardParceiro;
