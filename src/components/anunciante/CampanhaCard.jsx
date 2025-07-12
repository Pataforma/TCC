import React from "react";
import {
  FaBullhorn,
  FaEye,
  FaMousePointer,
  FaDollarSign,
  FaPause,
  FaPlay,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";

const CampanhaCard = ({ campanha, onVerRelatorio, onToggleStatus }) => {
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

  const handleToggleStatus = () => {
    const novoStatus = campanha.status === "ativa" ? "pausada" : "ativa";
    onToggleStatus(novoStatus);
  };

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0 text-truncate" title={campanha.nome}>
          {campanha.nome}
        </h6>
        <span className={`badge bg-${getStatusColor(campanha.status)}`}>
          {getStatusText(campanha.status)}
        </span>
      </div>
      <div className="card-body">
        {/* Métricas */}
        <div className="row text-center mb-3">
          <div className="col-4">
            <div className="d-flex flex-column align-items-center">
              <FaEye className="text-primary mb-1" />
              <small className="text-muted">Impressões</small>
              <strong>{campanha.impressoes.toLocaleString()}</strong>
            </div>
          </div>
          <div className="col-4">
            <div className="d-flex flex-column align-items-center">
              <FaMousePointer className="text-success mb-1" />
              <small className="text-muted">Cliques</small>
              <strong>{campanha.cliques.toLocaleString()}</strong>
            </div>
          </div>
          <div className="col-4">
            <div className="d-flex flex-column align-items-center">
              <FaDollarSign className="text-warning mb-1" />
              <small className="text-muted">Gasto</small>
              <strong>{formatCurrency(campanha.gastoTotal)}</strong>
            </div>
          </div>
        </div>

        {/* Informações da Campanha */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Objetivo:</small>
            <small className="text-truncate ms-2" title={campanha.objetivo}>
              {campanha.objetivo}
            </small>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Formato:</small>
            <small className="text-truncate ms-2" title={campanha.formato}>
              {campanha.formato}
            </small>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Orçamento Diário:</small>
            <small className="text-truncate ms-2">
              {formatCurrency(campanha.orcamentoDiario)}
            </small>
          </div>
        </div>

        {/* Período */}
        <div className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <FaCalendarAlt className="text-muted me-2" size={12} />
            <small className="text-muted">Período:</small>
          </div>
          <small>
            {formatDate(campanha.dataInicio)} - {formatDate(campanha.dataFim)}
          </small>
        </div>

        {/* Ações */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm flex-fill"
            onClick={onVerRelatorio}
            title="Ver relatório detalhado"
          >
            <FaChartLine className="me-1" />
            Relatório
          </button>
          <button
            className={`btn btn-outline-${
              campanha.status === "ativa" ? "warning" : "success"
            } btn-sm`}
            onClick={handleToggleStatus}
            title={
              campanha.status === "ativa"
                ? "Pausar campanha"
                : "Reativar campanha"
            }
          >
            {campanha.status === "ativa" ? (
              <>
                <FaPause className="me-1" />
                Pausar
              </>
            ) : (
              <>
                <FaPlay className="me-1" />
                Reativar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampanhaCard;
