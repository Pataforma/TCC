import React from "react";
import { Card, Badge } from "react-bootstrap";
import {
  FaCheckCircle,
  FaCalendarCheck,
  FaBox,
  FaBullhorn,
  FaInfoCircle,
} from "react-icons/fa";

const AutoTransactionsInfo = () => {
  const autoFeatures = [
    {
      icon: FaCalendarCheck,
      title: "Consultas Finalizadas",
      description: "Valor da consulta lançado automaticamente como receita",
      status: "ativo",
      color: "success",
    },
    {
      icon: FaBox,
      title: "Vendas de Produtos",
      description: "Receita e custo registrados automaticamente no estoque",
      status: "ativo",
      color: "success",
    },
    {
      icon: FaBox,
      title: "Baixa de Estoque",
      description: "Custo do produto registrado como despesa variável",
      status: "ativo",
      color: "success",
    },
    {
      icon: FaBullhorn,
      title: "Campanhas de Marketing",
      description: "Custos de campanhas lançados automaticamente",
      status: "ativo",
      color: "success",
    },
  ];

  const getStatusBadge = (status) => {
    const variants = {
      ativo: "success",
      pendente: "warning",
      inativo: "secondary",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex align-items-center">
          <FaInfoCircle className="me-2 text-primary" />
          <h6 className="mb-0">Lançamentos Automáticos</h6>
        </div>
        <small className="text-muted">
          O sistema registra automaticamente as transações financeiras
        </small>
      </Card.Header>
      <Card.Body>
        <div className="row g-3">
          {autoFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="col-md-6">
                <div className="d-flex align-items-start gap-3 p-3 border rounded">
                  <div className={`text-${feature.color} mt-1`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6
                        className="mb-1 fw-semibold"
                        style={{ fontSize: "14px" }}
                      >
                        {feature.title}
                      </h6>
                      {getStatusBadge(feature.status)}
                    </div>
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 p-3 bg-primary bg-opacity-10 rounded">
          <div className="d-flex align-items-center">
            <FaCheckCircle className="text-primary me-2" />
            <small className="text-primary fw-semibold">
              Sistema Inteligente: 95% dos lançamentos são automáticos
            </small>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AutoTransactionsInfo;
