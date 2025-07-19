import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";

const DashboardParceiroServico = () => {
  return (
    <DashboardLayout tipoUsuario="parceiro" nomeUsuario="Parceiro de Serviço">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Dashboard do Parceiro de Serviço</h1>
                <p className="text-muted mb-0">
                  Gerencie seus serviços, avaliações e agendamentos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Widgets Placeholder */}
        <div className="row">
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Widget de Visitas ao Perfil</h5>
                <p className="card-text">
                  Placeholder para estatísticas de visitas
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Widget de Agendamentos</h5>
                <p className="card-text">
                  Placeholder para agendamentos recentes
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Widget de Avaliações</h5>
                <p className="card-text">
                  Placeholder para avaliações dos clientes
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Widget de Receita</h5>
                <p className="card-text">
                  Placeholder para informações financeiras
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Área de Conteúdo Principal */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Área de Conteúdo Principal</h5>
                <p className="card-text">
                  Esta área será expandida com funcionalidades específicas para
                  parceiros de serviço, incluindo gestão de serviços, avaliações
                  de clientes, agendamentos e relatórios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardParceiroServico;
