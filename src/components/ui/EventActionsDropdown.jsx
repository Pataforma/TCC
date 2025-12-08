import React from "react";
import { Dropdown } from "react-bootstrap";
import {
  FaEdit,
  FaEye,
  FaCheck,
  FaTimes,
  FaEllipsisV,
  FaTrash,
} from "react-icons/fa";

const EventActionsDropdown = ({ event, onEdit, onView, onEnd, onCancel }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" size="sm">
        <FaEllipsisV />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onEdit(event)}>
          <FaEdit className="me-2" />
          Editar
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onView(event)}>
          <FaEye className="me-2" />
          Ver Anúncio
        </Dropdown.Item>
        {event.status === "Publicado" && (
          <Dropdown.Item onClick={() => onEnd(event)}>
            <FaCheck className="me-2" />
            Encerrar Evento
          </Dropdown.Item>
        )}
        {event.status !== "Finalizado" && event.status !== "Cancelado" && (
          <Dropdown.Item
            onClick={() => onCancel(event)}
            className="text-danger"
          >
            <FaTimes className="me-2" />
            Cancelar Evento
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default EventActionsDropdown;
