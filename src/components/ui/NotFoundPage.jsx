import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft, FaSearch } from "react-icons/fa";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center p-5">
        {/* Ícone de busca estilizado */}
        <div className="mb-4">
          <div className="position-relative d-inline-block">
            <div
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "120px", height: "120px" }}
            >
              <FaSearch size={48} color="white" />
            </div>
            <div
              className="position-absolute top-0 start-100 translate-middle"
              style={{ marginLeft: "-10px" }}
            >
              <span className="badge bg-danger rounded-pill fs-6">404</span>
            </div>
          </div>
        </div>

        {/* Título e mensagem */}
        <h1 className="display-4 fw-bold text-dark mb-3">
          Oops! Parece que se perdeu.
        </h1>
        <p className="lead text-muted mb-4" style={{ maxWidth: "500px" }}>
          A página que você está procurando não existe ou foi movida. Não se
          preocupe, vamos te ajudar a encontrar o que procura!
        </p>

        {/* Botões de ação */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button
            className="btn btn-primary btn-lg px-4 py-3"
            onClick={handleGoHome}
            aria-label="Voltar à página inicial"
          >
            <FaHome className="me-2" />
            Voltar à Página Inicial
          </button>
          <button
            className="btn btn-outline-secondary btn-lg px-4 py-3"
            onClick={handleGoBack}
            aria-label="Voltar à página anterior"
          >
            <FaArrowLeft className="me-2" />
            Voltar
          </button>
        </div>

        {/* Dicas de navegação */}
        <div className="mt-5">
          <h5 className="text-dark mb-3">Precisa de ajuda?</h5>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <h6 className="card-title text-primary">Verificar URL</h6>
                      <p className="card-text small text-muted">
                        Confirme se o endereço foi digitado corretamente
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <h6 className="card-title text-primary">Usar Menu</h6>
                      <p className="card-text small text-muted">
                        Navegue pelo menu principal para encontrar o que procura
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links úteis */}
        <div className="mt-4">
          <p className="text-muted mb-2">Páginas populares:</p>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => navigate("/sobre")}
              aria-label="Ir para página Sobre"
            >
              Sobre
            </button>
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => navigate("/veterinarios")}
              aria-label="Ir para página Veterinários"
            >
              Veterinários
            </button>
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => navigate("/animais")}
              aria-label="Ir para página Animais"
            >
              Animais
            </button>
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => navigate("/contato")}
              aria-label="Ir para página Contato"
            >
              Contato
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
