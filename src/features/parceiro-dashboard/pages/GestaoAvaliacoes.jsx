import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";

const GestaoAvaliacoes = () => {
  return (
    <DashboardLayout tipoUsuario="parceiro" nomeUsuario="Parceiro de Serviço">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Avaliações de Clientes</h1>
                <p className="text-muted mb-0">
                  Visualize e gerencie as avaliações recebidas dos seus clientes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Lista de Avaliações</h5>
                <p className="card-text">
                  Esta área será expandida com a lista de avaliações dos
                  clientes, incluindo filtros, estatísticas e funcionalidades de
                  resposta.
                </p>

                {/* Placeholder para lista de avaliações */}
                <div className="text-center py-4">
                  <div className="text-muted">
                    <i className="fas fa-star fa-3x mb-3"></i>
                    <p>Lista de avaliações será exibida aqui</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GestaoAvaliacoes;
