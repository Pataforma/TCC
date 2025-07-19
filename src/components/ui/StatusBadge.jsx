import React from "react";
import { Badge } from "react-bootstrap";

const StatusBadge = ({ status }) => {
  const variants = {
    Publicado: "success",
    Rascunho: "warning",
    Finalizado: "secondary",
    Cancelado: "danger",
    Ativo: "success",
    Inativo: "secondary",
    Pendente: "warning",
    Aprovado: "success",
    Rejeitado: "danger",
  };

  return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
};

export default StatusBadge;
