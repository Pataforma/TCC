import React from "react";
import {
  FaPaw,
  FaEdit,
  FaEye,
  FaHeart,
  FaUsers,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const AnimalCard = ({ animal, onEdit, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "disponivel":
        return "success";
      case "adotado":
        return "secondary";
      case "reservado":
        return "warning";
      default:
        return "light";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "adotado":
        return "Adotado";
      case "reservado":
        return "Reservado";
      default:
        return "Desconhecido";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "disponivel":
        return <FaHeart className="text-success" />;
      case "adotado":
        return <FaCheckCircle className="text-secondary" />;
      case "reservado":
        return <FaClock className="text-warning" />;
      default:
        return <FaPaw className="text-muted" />;
    }
  };

  return (
    <div className="card h-100">
      <div className="position-relative">
        <img
          src={animal.foto}
          className="card-img-top"
          alt={animal.nome}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className={`badge bg-${getStatusColor(animal.status)}`}>
            {getStatusIcon(animal.status)}
            <span className="ms-1">{getStatusText(animal.status)}</span>
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <h6 className="card-title mb-1">{animal.nome}</h6>
          <p className="card-text small text-muted mb-1">
            {animal.especie} • {animal.raca}
          </p>
          <p className="card-text small text-muted mb-2">{animal.idade}</p>
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              <FaUsers className="text-muted me-1" size={12} />
              <small className="text-muted">
                {animal.candidaturas} candidatura
                {animal.candidaturas !== 1 ? "s" : ""}
              </small>
            </div>
          </div>

          <div className="d-flex gap-1">
            <button
              className="btn btn-outline-primary btn-sm flex-fill"
              onClick={onView}
              title="Ver detalhes"
            >
              <FaEye className="me-1" />
              Ver
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={onEdit}
              title="Editar animal"
            >
              <FaEdit />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
