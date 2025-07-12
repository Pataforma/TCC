import React from "react";
import { Card, Badge, Button, Row, Col } from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaPaw,
  FaSyringe,
  FaCalendarAlt,
} from "react-icons/fa";

const PetCard = ({
  pet,
  onEdit,
  onDelete,
  onViewDetails,
  showActions = true,
  className = "",
  variant = "default", // 'default', 'compact', 'detailed'
}) => {
  const getStatusBadge = (status) => {
    const variants = {
      Saudável: "success",
      "Vacina Pendente": "warning",
      Recuperação: "info",
      Doente: "danger",
    };
    return variants[status] || "secondary";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Vacina Pendente":
        return <FaSyringe className="text-warning" />;
      case "Recuperação":
        return <FaCalendarAlt className="text-info" />;
      default:
        return <FaPaw className="text-success" />;
    }
  };

  const formatAge = (idade) => {
    if (!idade) return "Idade não informada";
    return `${idade} ${idade === 1 ? "ano" : "anos"}`;
  };

  const formatWeight = (peso) => {
    if (!peso) return "Peso não informado";
    return `${peso} kg`;
  };

  // Variante compacta
  if (variant === "compact") {
    return (
      <Card className={`pet-card-compact ${className}`}>
        <Card.Body className="p-2">
          <Row className="align-items-center">
            <Col xs="auto">
              {pet.foto_url ? (
                <img
                  src={pet.foto_url}
                  alt={pet.nome}
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "var(--main-color)",
                    color: "white",
                  }}
                >
                  <FaPaw />
                </div>
              )}
            </Col>
            <Col>
              <h6 className="mb-0">{pet.nome}</h6>
              <small className="text-muted">{pet.raca}</small>
            </Col>
            <Col xs="auto">
              <Badge bg={getStatusBadge(pet.status)}>
                {getStatusIcon(pet.status)} {pet.status}
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }

  // Variante detalhada
  if (variant === "detailed") {
    return (
      <Card className={`pet-card-detailed ${className}`}>
        <div className="position-relative">
          {pet.foto_url ? (
            <Card.Img
              variant="top"
              src={pet.foto_url}
              alt={pet.nome}
              style={{ height: "200px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                height: "200px",
                backgroundColor: "#f8f9fa",
                color: "var(--main-color)",
              }}
            >
              <FaPaw size={48} />
            </div>
          )}
          <Badge
            bg={getStatusBadge(pet.status)}
            className="position-absolute top-0 end-0 m-2"
          >
            {pet.status}
          </Badge>
        </div>

        <Card.Body>
          <Card.Title className="d-flex align-items-center gap-2">
            {pet.nome}
            {getStatusIcon(pet.status)}
          </Card.Title>

          <Row className="mb-3">
            <Col xs={6}>
              <small className="text-muted d-block">Raça</small>
              <strong>{pet.raca || "Não informada"}</strong>
            </Col>
            <Col xs={6}>
              <small className="text-muted d-block">Idade</small>
              <strong>{formatAge(pet.idade)}</strong>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={6}>
              <small className="text-muted d-block">Peso</small>
              <strong>{formatWeight(pet.peso)}</strong>
            </Col>
            <Col xs={6}>
              <small className="text-muted d-block">NFC ID</small>
              <strong>{pet.nfc_id || "Não configurado"}</strong>
            </Col>
          </Row>

          {showActions && (
            <div className="d-flex gap-2">
              {onViewDetails && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onViewDetails(pet)}
                >
                  Ver Detalhes
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => onEdit(pet)}
                >
                  <FaEdit /> Editar
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(pet.id)}
                >
                  <FaTrash /> Excluir
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }

  // Variante padrão
  return (
    <Card className={`pet-card ${className}`}>
      <div className="position-relative">
        {pet.foto_url ? (
          <Card.Img
            variant="top"
            src={pet.foto_url}
            alt={pet.nome}
            style={{ height: "180px", objectFit: "cover" }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              height: "180px",
              backgroundColor: "#f8f9fa",
              color: "var(--main-color)",
            }}
          >
            <FaPaw size={48} />
          </div>
        )}
        <Badge
          bg={getStatusBadge(pet.status)}
          className="position-absolute top-0 end-0 m-2"
        >
          {pet.status}
        </Badge>
      </div>

      <Card.Body>
        <Card.Title className="d-flex align-items-center gap-2">
          {pet.nome}
          {getStatusIcon(pet.status)}
        </Card.Title>

        <Card.Text>
          <small className="text-muted d-block">Raça</small>
          <strong>{pet.raca || "Não informada"}</strong>
        </Card.Text>

        <Card.Text>
          <small className="text-muted d-block">Idade</small>
          <strong>{formatAge(pet.idade)}</strong>
        </Card.Text>

        {showActions && (
          <div className="d-flex gap-2 mt-3">
            {onViewDetails && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onViewDetails(pet)}
              >
                Ver Detalhes
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => onEdit(pet)}
              >
                <FaEdit />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(pet.id)}
              >
                <FaTrash />
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PetCard;
