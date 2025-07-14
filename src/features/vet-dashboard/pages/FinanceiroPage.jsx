import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import {
  FaMoneyBill,
  FaChartBar,
  FaPlus,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";

const FinanceiroPage = () => {
  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario="Dr. André Silva">
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  <FaMoneyBill className="me-2" />
                  Gestão Financeira
                </h2>
                <p className="text-muted mb-0">
                  Controle suas receitas, despesas e relatórios financeiros
                </p>
              </div>
              <Button variant="primary">
                <FaPlus className="me-2" />
                Nova Transação
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Receita Total</h6>
                    <h4 className="fw-bold text-success mb-0">R$ 45.680,50</h4>
                  </div>
                  <div className="text-success">
                    <FaChartBar size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default FinanceiroPage;
