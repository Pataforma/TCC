import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";

const GestaoServicos = () => {
  const handleAdicionarServico = () => {
    // Lógica para adicionar novo serviço
    console.log("Adicionar novo serviço");
  };

  return (
    <DashboardLayout tipoUsuario="parceiro" nomeUsuario="Parceiro de Serviço">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Gestão de Serviços</h1>
                <p className="text-muted mb-0">
                  Gerencie os serviços oferecidos pela sua empresa
                </p>
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={handleAdicionarServico}
                >
                  + Adicionar Novo Serviço
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Lista de Serviços</h5>
                <p className="card-text">
                  Esta área será expandida com a lista de serviços, formulários
                  de criação/edição e funcionalidades de gestão específicas para
                  parceiros de serviço.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GestaoServicos;
