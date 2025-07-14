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
import CampanhaCard from "../../../components/anunciante/CampanhaCard";
import CriarCampanhaModal from "../../../components/anunciante/CriarCampanhaModal";

const DashboardAnunciante = () => {
  const navigate = useNavigate();
  const [showCriarCampanha, setShowCriarCampanha] = useState(false);

  // Dados mockados para KPIs
  const kpis = {
    impressoes: 15420,
    cliques: 892,
    cpc: 2.45,
    orcamentoGasto: 2185.5,
  };

  // Dados mockados para gráfico de performance
  const performanceData = [
    { label: "1 Dez", impressoes: 450, cliques: 28 },
    { label: "2 Dez", impressoes: 520, cliques: 32 },
    { label: "3 Dez", impressoes: 480, cliques: 29 },
    { label: "4 Dez", impressoes: 610, cliques: 38 },
    { label: "5 Dez", impressoes: 580, cliques: 35 },
    { label: "6 Dez", impressoes: 720, cliques: 42 },
    { label: "7 Dez", impressoes: 680, cliques: 40 },
    { label: "8 Dez", impressoes: 750, cliques: 45 },
    { label: "9 Dez", impressoes: 820, cliques: 48 },
    { label: "10 Dez", impressoes: 780, cliques: 46 },
    { label: "11 Dez", impressoes: 850, cliques: 50 },
    { label: "12 Dez", impressoes: 920, cliques: 54 },
    { label: "13 Dez", impressoes: 890, cliques: 52 },
    { label: "14 Dez", impressoes: 950, cliques: 56 },
    { label: "15 Dez", impressoes: 1020, cliques: 60 },
    { label: "16 Dez", impressoes: 980, cliques: 58 },
    { label: "17 Dez", impressoes: 1050, cliques: 62 },
    { label: "18 Dez", impressoes: 1120, cliques: 65 },
    { label: "19 Dez", impressoes: 1080, cliques: 63 },
    { label: "20 Dez", impressoes: 1150, cliques: 67 },
    { label: "21 Dez", impressoes: 1220, cliques: 70 },
    { label: "22 Dez", impressoes: 1180, cliques: 68 },
    { label: "23 Dez", impressoes: 1250, cliques: 72 },
    { label: "24 Dez", impressoes: 1320, cliques: 75 },
    { label: "25 Dez", impressoes: 1280, cliques: 73 },
    { label: "26 Dez", impressoes: 1350, cliques: 77 },
    { label: "27 Dez", impressoes: 1420, cliques: 80 },
    { label: "28 Dez", impressoes: 1380, cliques: 78 },
    { label: "29 Dez", impressoes: 1450, cliques: 82 },
    { label: "30 Dez", impressoes: 1520, cliques: 85 },
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
        {/* Header com CTA Principal */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Painel de Performance</h1>
                <p className="text-muted mb-0">
                  Monitore o desempenho das suas campanhas publicitárias
                </p>
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleCriarCampanha}
              >
                <FaPlus className="me-2" />
                Criar Nova Campanha
              </button>
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
              title="Custo por Clique"
              value={`R$ ${kpis.cpc.toFixed(2)}`}
              icon={FaDollarSign}
              color="warning"
              trend="down"
              trendValue="-5%"
              subtitle="média do período"
            />
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Orçamento Gasto"
              value={`R$ ${kpis.orcamentoGasto.toFixed(2)}`}
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
                  xKey="label"
                  yKeys={[
                    {
                      key: "impressoes",
                      label: "Impressões",
                      color: "#0DB2AC",
                    },
                    { key: "cliques", label: "Cliques", color: "#FABA32" },
                  ]}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Campanhas Ativas */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaBullhorn className="me-2 text-success" />
                  Campanhas Ativas
                </h5>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate("/anunciante/campanhas")}
                >
                  Ver todas as campanhas
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  {campanhasAtivas.map((campanha) => (
                    <div key={campanha.id} className="col-md-4 mb-3">
                      <CampanhaCard
                        campanha={campanha}
                        onVerRelatorio={() => handleVerRelatorio(campanha.id)}
                        onToggleStatus={(novoStatus) =>
                          handleToggleStatus(campanha.id, novoStatus)
                        }
                      />
                    </div>
                  ))}
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
