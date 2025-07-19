import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEye,
  FaMousePointer,
  FaDollarSign,
  FaChartLine,
  FaCalendarAlt,
  FaBullhorn,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatCard from "../../../components/Dashboard/StatCard";
import SimpleChart from "../../../components/Dashboard/SimpleChart";

import CriarCampanhaModal from "../../../components/anunciante/CriarCampanhaModal";

const DashboardAnunciante = () => {
  const navigate = useNavigate();
  const [showCriarCampanha, setShowCriarCampanha] = useState(false);

  // Dados mockados para KPIs
  const kpis = {
    impressoes: 150000,
    cliques: 3200,
    ctr: 2.13,
    custoTotal: 450.0,
  };

  // Dados mockados para gráfico de performance (últimos 30 dias)
  const performanceData = [
    { label: "1", value: 450 },
    { label: "2", value: 520 },
    { label: "3", value: 480 },
    { label: "4", value: 610 },
    { label: "5", value: 580 },
    { label: "6", value: 720 },
    { label: "7", value: 680 },
    { label: "8", value: 750 },
    { label: "9", value: 820 },
    { label: "10", value: 780 },
    { label: "11", value: 850 },
    { label: "12", value: 920 },
    { label: "13", value: 890 },
    { label: "14", value: 950 },
    { label: "15", value: 1020 },
    { label: "16", value: 980 },
    { label: "17", value: 1050 },
    { label: "18", value: 1120 },
    { label: "19", value: 1080 },
    { label: "20", value: 1150 },
    { label: "21", value: 1220 },
    { label: "22", value: 1180 },
    { label: "23", value: 1250 },
    { label: "24", value: 1320 },
    { label: "25", value: 1280 },
    { label: "26", value: 1350 },
    { label: "27", value: 1420 },
    { label: "28", value: 1380 },
    { label: "29", value: 1450 },
    { label: "30", value: 1520 },
  ];

  // Dados mockados para campanhas ativas
  const campanhasAtivas = [
    {
      id: 1,
      nome: "Promoção Banho e Tosa",
      status: "ativa",
      cliques: 245,
      impressoes: 3200,
      gastoTotal: 612.5,
      objetivo: "Receber mensagens no WhatsApp",
      formato: "Banner na página de Serviços",
      orcamentoDiario: 25.0,
      dataInicio: "2024-12-01",
      dataFim: "2024-12-31",
    },
    {
      id: 2,
      nome: "Evento de Adoção - Dezembro",
      status: "ativa",
      cliques: 189,
      impressoes: 2800,
      gastoTotal: 472.5,
      objetivo: "Divulgar evento",
      formato: "Banner na página de Eventos",
      orcamentoDiario: 20.0,
      dataInicio: "2024-12-05",
      dataFim: "2024-12-20",
    },
    {
      id: 3,
      nome: "Desconto em Vacinas",
      status: "pausada",
      cliques: 156,
      impressoes: 2100,
      gastoTotal: 390.0,
      objetivo: "Agendar consultas",
      formato: "Banner na página de Veterinários",
      orcamentoDiario: 30.0,
      dataInicio: "2024-11-15",
      dataFim: "2024-12-15",
    },
  ];

  const handleCriarCampanha = () => {
    setShowCriarCampanha(true);
  };

  const handleCampanhaCriada = (novaCampanha) => {
    // TODO: Salvar campanha no backend
    console.log("Nova campanha criada:", novaCampanha);
    setShowCriarCampanha(false);
    // Recarregar dados das campanhas
  };

  const handleVerRelatorio = (campanhaId) => {
    navigate(`/anunciante/campanhas/${campanhaId}/relatorio`);
  };

  const handleToggleStatus = (campanhaId, novoStatus) => {
    // TODO: Atualizar status da campanha no backend
    console.log(`Campanha ${campanhaId} alterada para ${novoStatus}`);
  };

  return (
    <DashboardLayout tipoUsuario="anunciante" nomeUsuario="Anunciante">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="row mb-4">
          <div className="col-12">
            <div>
              <h1 className="h3 mb-1">Dashboard do Anunciante</h1>
              <p className="text-muted mb-0">
                Painel de controle de marketing - Monitore o desempenho das suas
                campanhas publicitárias
              </p>
            </div>
          </div>
        </div>

        {/* KPIs em Destaque */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Impressões"
              value={kpis.impressoes.toLocaleString()}
              icon={FaEye}
              color="primary"
              trend="up"
              trendValue="+12%"
              subtitle="últimos 30 dias"
            />
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Cliques"
              value={kpis.cliques.toLocaleString()}
              icon={FaMousePointer}
              color="success"
              trend="up"
              trendValue="+8%"
              subtitle="últimos 30 dias"
            />
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="CTR (Taxa de Cliques)"
              value={`${kpis.ctr}%`}
              icon={FaDollarSign}
              color="warning"
              trend="up"
              trendValue="+2%"
              subtitle="média do período"
            />
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Custo Total (Mês)"
              value={`R$ ${kpis.custoTotal.toFixed(2)}`}
              icon={FaChartLine}
              color="info"
              trend="up"
              trendValue="+15%"
              subtitle="este mês"
            />
          </div>
        </div>

        {/* Gráfico de Performance */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <FaChartLine className="me-2 text-primary" />
                  Performance dos Últimos 30 Dias
                </h5>
              </div>
              <div className="card-body">
                <SimpleChart
                  data={performanceData}
                  title="Performance dos Últimos 30 Dias"
                  color="#0DB2AC"
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Ações Rápidas e Campanhas Ativas */}
        <div className="row mb-4">
          {/* Botão CTA Principal */}
          <div className="col-xl-4 col-lg-5 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex flex-column justify-content-center align-items-center text-center p-5">
                <div className="mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: "#0DB2AC",
                      color: "white",
                    }}
                  >
                    <FaPlus size={30} />
                  </div>
                </div>
                <h5 className="mb-3">Criar Nova Campanha</h5>
                <p className="text-muted mb-4">
                  Comece uma nova campanha publicitária para alcançar mais
                  clientes
                </p>
                <button
                  className="btn btn-primary btn-lg w-100"
                  onClick={handleCriarCampanha}
                >
                  <FaPlus className="me-2" />+ Criar Nova Campanha
                </button>
              </div>
            </div>
          </div>

          {/* Tabela de Campanhas Recentes */}
          <div className="col-xl-8 col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaBullhorn className="me-2 text-success" />
                  Campanhas Recentes
                </h5>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate("/anunciante/campanhas")}
                >
                  Ver todas as campanhas
                </button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nome da Campanha</th>
                        <th>Status</th>
                        <th>Cliques</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campanhasAtivas.map((campanha) => (
                        <tr key={campanha.id}>
                          <td>
                            <a
                              href="#"
                              className="text-decoration-none fw-semibold"
                              onClick={(e) => {
                                e.preventDefault();
                                handleVerRelatorio(campanha.id);
                              }}
                            >
                              {campanha.nome}
                            </a>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                campanha.status === "ativa"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {campanha.status === "ativa"
                                ? "Ativa"
                                : "Pausada"}
                            </span>
                          </td>
                          <td>{campanha.cliques.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Rápido */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <FaUsers className="me-2 text-info" />
                  Público Alvo
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Localização Principal:</span>
                  <strong>São Paulo, SP</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Faixa Etária:</span>
                  <strong>25-45 anos</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Interesses:</span>
                  <strong>Pets, Veterinários</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <FaClock className="me-2 text-warning" />
                  Próximas Ações
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Campanha expira em:</span>
                  <strong>5 dias</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Orçamento restante:</span>
                  <strong>R$ 314,50</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Meta de cliques:</span>
                  <strong>85% atingida</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Criação de Campanha */}
        <CriarCampanhaModal
          show={showCriarCampanha}
          onHide={() => setShowCriarCampanha(false)}
          onCampanhaCriada={handleCampanhaCriada}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardAnunciante;
