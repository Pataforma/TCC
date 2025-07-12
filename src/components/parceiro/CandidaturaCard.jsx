import React from "react";
import {
  FaUser,
  FaPaw,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaEye,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";

const CandidaturaCard = ({ candidatura, onView, onAprovar, onReprovar }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "novo-contato":
        return "primary";
      case "analise-formulario":
        return "warning";
      case "entrevista-agendada":
        return "info";
      case "aprovado":
        return "success";
      case "reprovado":
        return "danger";
      default:
        return "light";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "novo-contato":
        return "Novo Contato";
      case "analise-formulario":
        return "Análise";
      case "entrevista-agendada":
        return "Entrevista";
      case "aprovado":
        return "Aprovado";
      case "reprovado":
        return "Reprovado";
      default:
        return "Desconhecido";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "novo-contato":
        return <FaUser className="text-primary" />;
      case "analise-formulario":
        return <FaClock className="text-warning" />;
      case "entrevista-agendada":
        return <FaCalendarAlt className="text-info" />;
      case "aprovado":
        return <FaCheck className="text-success" />;
      case "reprovado":
        return <FaTimes className="text-danger" />;
      default:
        return <FaUser className="text-muted" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="card mb-2">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <h6 className="card-title mb-1">{candidatura.nome}</h6>
            <div className="d-flex align-items-center mb-1">
              <FaPaw className="text-muted me-1" size={12} />
              <small className="text-muted">
                Interesse: {candidatura.animal}
              </small>
            </div>
          </div>
          <span className={`badge bg-${getStatusColor(candidatura.status)}`}>
            {getStatusIcon(candidatura.status)}
          </span>
        </div>

        <div className="mb-2">
          <div className="d-flex align-items-center mb-1">
            <FaEnvelope className="text-muted me-1" size={10} />
            <small className="text-muted">{candidatura.email}</small>
          </div>
          <div className="d-flex align-items-center mb-1">
            <FaPhone className="text-muted me-1" size={10} />
            <small className="text-muted">{candidatura.telefone}</small>
          </div>
          <div className="d-flex align-items-center">
            <FaCalendarAlt className="text-muted me-1" size={10} />
            <small className="text-muted">
              Candidatura: {formatDate(candidatura.dataCandidatura)}
            </small>
          </div>
        </div>

        <div className="d-flex gap-1">
          <button
            className="btn btn-outline-primary btn-sm flex-fill"
            onClick={onView}
            title="Ver detalhes da candidatura"
          >
            <FaEye className="me-1" />
            Ver
          </button>

          {candidatura.status === "entrevista-agendada" && (
            <>
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => onAprovar && onAprovar(candidatura.id)}
                title="Aprovar candidatura"
              >
                <FaCheck />
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onReprovar && onReprovar(candidatura.id)}
                title="Reprovar candidatura"
              >
                <FaTimes />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidaturaCard;
