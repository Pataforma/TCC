import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaHome, FaSignInAlt } from "react-icons/fa";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="text-center">
        <div className="mb-4">
          <FaLock size={64} className="text-danger mb-3" />
          <h1 className="display-4 fw-bold text-danger">Acesso Negado</h1>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <h2 className="card-title mb-4">
                  Você não tem permissão para acessar esta página
                </h2>

                <p className="card-text text-muted mb-4">
                  Esta área requer autenticação e permissões específicas. Por
                  favor, faça login com uma conta que tenha as permissões
                  necessárias.
                </p>

                <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate("/telalogin")}
                  >
                    <FaSignInAlt className="me-2" />
                    Fazer Login
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() => navigate("/")}
                  >
                    <FaHome className="me-2" />
                    Voltar ao Início
                  </button>
                </div>

                <hr className="my-4" />

                <div className="row text-start">
                  <div className="col-md-6">
                    <h5>Precisa de ajuda?</h5>
                    <ul className="list-unstyled">
                      <li>• Verifique se você está logado</li>
                      <li>
                        • Confirme se sua conta tem as permissões corretas
                      </li>
                      <li>• Entre em contato com o suporte se necessário</li>
                    </ul>
                  </div>

                  <div className="col-md-6">
                    <h5>Tipos de usuário:</h5>
                    <ul className="list-unstyled">
                      <li>
                        • <strong>Tutor:</strong> Acesso aos seus pets e
                        consultas
                      </li>
                      <li>
                        • <strong>Veterinário:</strong> Acesso ao dashboard
                        profissional
                      </li>
                      <li>
                        • <strong>Anunciante:</strong> Acesso ao painel de
                        anúncios
                      </li>
                      <li>
                        • <strong>Parceiro:</strong> Acesso ao painel de
                        parcerias
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
