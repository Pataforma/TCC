import React from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaEdit,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const EventoCausaCard = ({ evento, onEdit, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "agendado":
        return "success";
      case "concluido":
        return "secondary";
      case "cancelado":
        return "danger";
      default:
        return "light";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "agendado":
        return "Agendado";
      case "concluido":
        return "Concluído";
      case "cancelado":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "agendado":
        return <FaCalendarAlt className="text-success" />;
      case "concluido":
        return <FaCheckCircle className="text-secondary" />;
      case "cancelado":
        return <FaExclamationTriangle className="text-danger" />;
      default:
        return <FaCalendarAlt className="text-muted" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getProgressPercentage = () => {
    return Math.round((evento.inscritos / evento.vagas) * 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 90) return "danger";
    if (percentage >= 70) return "warning";
    return "success";
  };

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0 text-truncate" title={evento.titulo}>
          {evento.titulo}
        </h6>
        <span className={`badge bg-${getStatusColor(evento.status)}`}>
          {getStatusIcon(evento.status)}
          <span className="ms-1">{getStatusText(evento.status)}</span>
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <FaCalendarAlt className="text-primary me-2" />
            <small>
              {formatDate(evento.data)} às {evento.horario}
            </small>
          </div>

          <div className="d-flex align-items-center mb-2">
            <FaMapMarkerAlt className="text-success me-2" />
            <small className="text-truncate" title={evento.local}>
              {evento.local}
            </small>
          </div>

          <div className="d-flex align-items-center mb-3">
            <FaUsers className="text-info me-2" />
            <small>
              {evento.inscritos} inscritos de {evento.vagas} vagas
            </small>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="text-muted">Inscrições</small>
              <small className="text-muted">{getProgressPercentage()}%</small>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className={`progress-bar bg-${getProgressColor()} stock-progress-bar`}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {evento.status === "concluido" && evento.adocoes && (
            <div className="alert alert-success py-2 mb-0">
              <small>
                <strong>🎉 {evento.adocoes} adoções realizadas!</strong>
              </small>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="d-flex gap-1">
            <button
              className="btn btn-outline-primary btn-sm flex-fill"
              onClick={onView}
              title="Ver detalhes do evento"
            >
              <FaEye className="me-1" />
              Ver
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={onEdit}
              title="Editar evento"
            >
              <FaEdit />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventoCausaCard;
