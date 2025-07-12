import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEye,
  FaPause,
  FaPlay,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaDollarSign,
  FaMousePointer,
} from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import CriarCampanhaModal from "../../components/anunciante/CriarCampanhaModal";

const GestaoCampanhas = () => {
  const navigate = useNavigate();
  const [showCriarCampanha, setShowCriarCampanha] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Dados mockados das campanhas
  const [campanhas, setCampanhas] = useState([
    {
      id: 1,
      nome: "Promoção Banho e Tosa",
      status: "ativa",
      objetivo: "Receber mensagens no WhatsApp",
      formato: "Banner na página de Serviços",
      cliques: 245,
      impressoes: 3200,
      gastoTotal: 612.5,
      orcamentoDiario: 25.0,
      dataInicio: "2024-12-01",
      dataFim: "2024-12-31",
      dataCriacao: "2024-12-01",
    },
    {
      id: 2,
      nome: "Evento de Adoção - Dezembro",
      status: "ativa",
      objetivo: "Divulgar evento",
      formato: "Banner na página de Eventos",
      cliques: 189,
      impressoes: 2800,
      gastoTotal: 472.5,
      orcamentoDiario: 20.0,
      dataInicio: "2024-12-05",
      dataFim: "2024-12-20",
      dataCriacao: "2024-12-05",
    },
    {
      id: 3,
      nome: "Desconto em Vacinas",
      status: "pausada",
      objetivo: "Agendar consultas",
      formato: "Banner na página de Veterinários",
      cliques: 156,
      impressoes: 2100,
      gastoTotal: 390.0,
      orcamentoDiario: 30.0,
      dataInicio: "2024-11-15",
      dataFim: "2024-12-15",
      dataCriacao: "2024-11-15",
    },
    {
      id: 4,
      nome: "Produtos Pet - Black Friday",
      status: "concluida",
      objetivo: "Vender produtos",
      formato: "Banner na página de Serviços",
      cliques: 432,
      impressoes: 5800,
      gastoTotal: 1080.0,
      orcamentoDiario: 40.0,
      dataInicio: "2024-11-20",
      dataFim: "2024-11-30",
      dataCriacao: "2024-11-20",
    },
    {
      id: 5,
      nome: "Visibilidade da Marca",
      status: "ativa",
      objetivo: "Aumentar visibilidade da marca",
      formato: "Banner na página de Veterinários",
      cliques: 98,
      impressoes: 1500,
      gastoTotal: 245.0,
      orcamentoDiario: 15.0,
      dataInicio: "2024-12-10",
      dataFim: "2024-12-31",
      dataCriacao: "2024-12-10",
    },
  ]);

  const handleCriarCampanha = () => {
    setShowCriarCampanha(true);
  };

  const handleCampanhaCriada = (novaCampanha) => {
    // TODO: Salvar campanha no backend
    setCampanhas((prev) => [novaCampanha, ...prev]);
    setShowCriarCampanha(false);
  };

  const handleToggleStatus = (campanhaId, novoStatus) => {
    // TODO: Atualizar status no backend
    setCampanhas((prev) =>
      prev.map((campanha) =>
        campanha.id === campanhaId
          ? { ...campanha, status: novoStatus }
          : campanha
      )
    );
  };

  const handleDeleteCampanha = (campanhaId) => {
    if (window.confirm("Tem certeza que deseja excluir esta campanha?")) {
      // TODO: Excluir campanha no backend
      setCampanhas((prev) =>
        prev.filter((campanha) => campanha.id !== campanhaId)
      );
    }
  };

  const handleVerRelatorio = (campanhaId) => {
    navigate(`/anunciante/campanhas/${campanhaId}/relatorio`);
  };

  const handleEditCampanha = (campanhaId) => {
    navigate(`/anunciante/campanhas/${campanhaId}/editar`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ativa":
        return "success";
      case "pausada":
        return "warning";
      case "concluida":
        return "secondary";
      default:
        return "light";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ativa":
        return "Ativa";
      case "pausada":
        return "Pausada";
      case "concluida":
        return "Concluída";
      default:
        return "Desconhecido";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Filtros
  const filteredCampanhas = campanhas.filter((campanha) => {
    const matchesSearch =
      campanha.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campanha.objetivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || campanha.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout tipoUsuario="anunciante" nomeUsuario="Anunciante">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Gestão de Campanhas</h1>
                <p className="text-muted mb-0">
                  Gerencie todas as suas campanhas publicitárias
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleCriarCampanha}>
                <FaPlus className="me-2" />
                Nova Campanha
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar campanhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="ativa">Ativas</option>
              <option value="pausada">Pausadas</option>
              <option value="concluida">Concluídas</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary">
                <FaFilter className="me-1" />
                Mais filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Campanhas */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Campanha</th>
                    <th>Status</th>
                    <th>Objetivo</th>
                    <th>Cliques</th>
                    <th>Impressões</th>
                    <th>Gasto Total</th>
                    <th>Período</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampanhas.map((campanha) => (
                    <tr key={campanha.id}>
                      <td>
                        <div>
                          <strong>{campanha.nome}</strong>
                          <br />
                          <small className="text-muted">
                            {campanha.formato}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${getStatusColor(
                            campanha.status
                          )}`}
                        >
                          {getStatusText(campanha.status)}
                        </span>
                      </td>
                      <td>
                        <small>{campanha.objetivo}</small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaMousePointer className="text-success me-1" />
                          {campanha.cliques.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaEye className="text-primary me-1" />
                          {campanha.impressoes.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaDollarSign className="text-warning me-1" />
                          {formatCurrency(campanha.gastoTotal)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="text-muted me-1" />
                          <small>
                            {formatDate(campanha.dataInicio)} -{" "}
                            {formatDate(campanha.dataFim)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleVerRelatorio(campanha.id)}
                            title="Ver relatório"
                          >
                            <FaChartLine />
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleEditCampanha(campanha.id)}
                            title="Editar campanha"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={`btn btn-outline-${
                              campanha.status === "ativa"
                                ? "warning"
                                : "success"
                            }`}
                            onClick={() =>
                              handleToggleStatus(
                                campanha.id,
                                campanha.status === "ativa"
                                  ? "pausada"
                                  : "ativa"
                              )
                            }
                            title={
                              campanha.status === "ativa"
                                ? "Pausar"
                                : "Reativar"
                            }
                          >
                            {campanha.status === "ativa" ? (
                              <FaPause />
                            ) : (
                              <FaPlay />
                            )}
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDeleteCampanha(campanha.id)}
                            title="Excluir campanha"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="text-primary">{campanhas.length}</h5>
                <small className="text-muted">Total de Campanhas</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="text-success">
                  {campanhas.filter((c) => c.status === "ativa").length}
                </h5>
                <small className="text-muted">Campanhas Ativas</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="text-warning">
                  {formatCurrency(
                    campanhas.reduce((sum, c) => sum + c.gastoTotal, 0)
                  )}
                </h5>
                <small className="text-muted">Gasto Total</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="text-info">
                  {campanhas
                    .reduce((sum, c) => sum + c.cliques, 0)
                    .toLocaleString()}
                </h5>
                <small className="text-muted">Total de Cliques</small>
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

export default GestaoCampanhas;
