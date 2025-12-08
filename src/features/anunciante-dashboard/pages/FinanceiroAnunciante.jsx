import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Table,
  Tabs,
  Tab,
  Modal,
  Form,
} from "react-bootstrap";
import {
  FaDollarSign,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaHistory,
  FaDownload,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaChartLine,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatCard from "../../../components/Dashboard/StatCard";
import AdvancedChart from "../../../components/Dashboard/AdvancedChart";

const FinanceiroAnunciante = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("current_month");

  // Dados mockados para KPIs financeiros
  const kpis = {
    gastoTotal: 2500.0,
    faturasEmitidas: 3,
    faturasPagas: 2,
    faturasPendentes: 1,
    comparativo: {
      gasto: 12,
      faturas: 25,
      pagamentos: 18,
    },
  };

  // Dados históricos para gráfico
  const historicalData = [
    { mes: "Jan", gasto: 1800, faturas: 2 },
    { mes: "Fev", gasto: 2100, faturas: 2 },
    { mes: "Mar", gasto: 1900, faturas: 3 },
    { mes: "Abr", gasto: 2200, faturas: 2 },
    { mes: "Mai", gasto: 2400, faturas: 3 },
    { mes: "Jun", gasto: 2500, faturas: 3 },
  ];

  // Dados de faturas
  const faturas = [
    {
      id: 1,
      data: "2024-12-15",
      periodo: "Dezembro 2024",
      valor: 1250.0,
      status: "Paga",
      numeroFatura: "FAT-2024-001",
      campanhas: ["Feira de Adoção", "Promoção de Ração"],
    },
    {
      id: 2,
      data: "2024-11-15",
      periodo: "Novembro 2024",
      valor: 980.0,
      status: "Paga",
      numeroFatura: "FAT-2024-002",
      campanhas: ["Workshop de Adestramento"],
    },
    {
      id: 3,
      data: "2024-10-15",
      periodo: "Outubro 2024",
      valor: 750.0,
      status: "Pendente",
      numeroFatura: "FAT-2024-003",
      campanhas: ["Campanha de Vacinação"],
    },
  ];

  // Dados de transações
  const transacoes = [
    {
      id: 1,
      data: "2024-12-15",
      campanha: "Feira de Adoção - Dezembro",
      descricao: "Cobrança mensal",
      valor: 490.0,
      status: "Processada",
      tipo: "Cobrança",
    },
    {
      id: 2,
      data: "2024-12-14",
      campanha: "Promoção de Ração Premium",
      descricao: "Cobrança diária",
      valor: 18.0,
      status: "Processada",
      tipo: "Cobrança",
    },
    {
      id: 3,
      data: "2024-12-13",
      campanha: "Campanha de Vacinação",
      descricao: "Cobrança diária",
      valor: 20.0,
      status: "Processada",
      tipo: "Cobrança",
    },
    {
      id: 4,
      data: "2024-12-10",
      campanha: "Pagamento de Fatura",
      descricao: "Pagamento da fatura FAT-2024-002",
      valor: -980.0,
      status: "Processada",
      tipo: "Pagamento",
    },
  ];

  // Dados de cartões
  const cartoes = [
    {
      id: 1,
      numero: "**** **** **** 1234",
      titular: "Pet Shop Amigo Fiel",
      bandeira: "Visa",
      vencimento: "12/25",
      principal: true,
    },
  ];

  // Dados para análise de gastos por campanha
  const gastosPorCampanha = [
    { campanha: "Feira de Adoção", percentual: 40, valor: 1000 },
    { campanha: "Promoção de Ração", percentual: 25, valor: 625 },
    { campanha: "Workshop de Adestramento", percentual: 20, valor: 500 },
    { campanha: "Campanha de Vacinação", percentual: 15, valor: 375 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const variants = {
      Paga: "success",
      Pendente: "warning",
      Processada: "success",
      Cancelada: "danger",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const getTipoBadge = (tipo) => {
    const variants = {
      Cobrança: "danger",
      Pagamento: "success",
    };
    return <Badge bg={variants[tipo]}>{tipo}</Badge>;
  };

  const getBandeiraBadge = (bandeira) => {
    const variants = {
      Visa: "primary",
      Mastercard: "warning",
      Elo: "success",
    };
    return <Badge bg={variants[bandeira] || "secondary"}>{bandeira}</Badge>;
  };

  return (
    <DashboardLayout tipoUsuario="anunciante" nomeUsuario="Pet Shop Amigo Fiel">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Gestão Financeira</h2>
            <p className="text-muted mb-0">
              Controle total dos seus investimentos e faturas
            </p>
          </div>
          <div className="d-flex gap-2">
            <Form.Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: "auto" }}
            >
              <option value="current_month">Mês Atual</option>
              <option value="last_month">Mês Anterior</option>
              <option value="last_3_months">Últimos 3 Meses</option>
              <option value="last_6_months">Últimos 6 Meses</option>
            </Form.Select>
          </div>
        </div>

        {/* KPIs Principais */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Gasto Total (Mês)"
              value={formatCurrency(kpis.gastoTotal)}
              icon={FaDollarSign}
              color="primary"
              trend={kpis.comparativo.gasto}
              trendLabel="vs mês anterior"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Faturas Emitidas"
              value={kpis.faturasEmitidas.toString()}
              icon={FaFileInvoiceDollar}
              color="info"
              trend={kpis.comparativo.faturas}
              trendLabel="vs mês anterior"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Faturas Pagas"
              value={kpis.faturasPagas.toString()}
              icon={FaChartBar}
              color="success"
              trend={kpis.comparativo.pagamentos}
              trendLabel="vs mês anterior"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Faturas Pendentes"
              value={kpis.faturasPendentes.toString()}
              icon={FaHistory}
              color="warning"
              trend={-10}
              trendLabel="vs mês anterior"
            />
          </Col>
        </Row>

        {/* Tabs de Navegação */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="overview" title="Visão Geral">
            <Row>
              {/* Gráfico Histórico */}
              <Col lg={8} className="mb-4">
                <Card className="h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaChartLine className="me-2" />
                      Evolução Financeira (Últimos 6 Meses)
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <AdvancedChart
                      data={historicalData}
                      xKey="mes"
                      yKeys={[
                        {
                          key: "gasto",
                          label: "Gasto Mensal",
                          color: "#0d6efd",
                        },
                        { key: "faturas", label: "Faturas", color: "#28a745" },
                      ]}
                      height={300}
                      type="line"
                    />
                  </Card.Body>
                </Card>
              </Col>

              {/* Análise de Gastos por Campanha */}
              <Col lg={4} className="mb-4">
                <Card className="h-100">
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaChartPie className="me-2" />
                      Gastos por Campanha
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {gastosPorCampanha.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center mb-3"
                      >
                        <div className="flex-grow-1 me-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold">{item.campanha}</span>
                            <span className="text-muted">
                              {item.percentual}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar stock-progress-bar"
                              style={{ width: `${item.percentual}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold">
                            {formatCurrency(item.valor)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="faturamento" title="Faturamento">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaFileInvoiceDollar className="me-2" />
                  Histórico de Faturas
                </h5>
                <Button variant="outline-primary" size="sm">
                  <FaDownload className="me-2" />
                  Exportar Relatório
                </Button>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Período</th>
                      <th>Número da Fatura</th>
                      <th>Campanhas</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faturas.map((fatura) => (
                      <tr key={fatura.id}>
                        <td>
                          {new Date(fatura.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td>{fatura.periodo}</td>
                        <td className="fw-semibold">{fatura.numeroFatura}</td>
                        <td>
                          <small className="text-muted">
                            {fatura.campanhas.join(", ")}
                          </small>
                        </td>
                        <td className="fw-bold text-primary">
                          {formatCurrency(fatura.valor)}
                        </td>
                        <td>{getStatusBadge(fatura.status)}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <FaDownload size={12} />
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                              <FaEye size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="pagamentos" title="Métodos de Pagamento">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCreditCard className="me-2" />
                  Cartões Cadastrados
                </h5>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddCardModal(true)}
                >
                  <FaPlus className="me-2" />
                  Adicionar Cartão
                </Button>
              </Card.Header>
              <Card.Body>
                {cartoes.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Cartão</th>
                        <th>Titular</th>
                        <th>Bandeira</th>
                        <th>Vencimento</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartoes.map((cartao) => (
                        <tr key={cartao.id}>
                          <td className="fw-semibold">{cartao.numero}</td>
                          <td>{cartao.titular}</td>
                          <td>{getBandeiraBadge(cartao.bandeira)}</td>
                          <td>{cartao.vencimento}</td>
                          <td>
                            {cartao.principal ? (
                              <Badge bg="success">Principal</Badge>
                            ) : (
                              <Badge bg="secondary">Secundário</Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-secondary" size="sm">
                                <FaEdit size={12} />
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <FaTrash size={12} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5">
                    <FaCreditCard size={48} className="text-muted mb-3" />
                    <h6 className="text-muted">Nenhum cartão cadastrado</h6>
                    <p className="text-muted mb-3">
                      Adicione um cartão de crédito para facilitar os pagamentos
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => setShowAddCardModal(true)}
                    >
                      <FaPlus className="me-2" />
                      Adicionar Primeiro Cartão
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="transacoes" title="Histórico de Transações">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaHistory className="me-2" />
                  Extrato Detalhado
                </h5>
                <Button variant="outline-primary" size="sm">
                  <FaDownload className="me-2" />
                  Exportar Extrato
                </Button>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Campanha</th>
                      <th>Descrição</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacoes.map((transacao) => (
                      <tr key={transacao.id}>
                        <td>
                          {new Date(transacao.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="fw-semibold">{transacao.campanha}</td>
                        <td>{transacao.descricao}</td>
                        <td>{getTipoBadge(transacao.tipo)}</td>
                        <td
                          className={`fw-bold ${
                            transacao.valor < 0 ? "text-success" : "text-danger"
                          }`}
                        >
                          {formatCurrency(Math.abs(transacao.valor))}
                        </td>
                        <td>{getStatusBadge(transacao.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </div>

      {/* Modal para Adicionar Cartão */}
      <Modal show={showAddCardModal} onHide={() => setShowAddCardModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCreditCard className="me-2" />
            Adicionar Cartão de Crédito
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Número do Cartão</Form.Label>
              <Form.Control type="text" placeholder="0000 0000 0000 0000" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Titular</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nome como está no cartão"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Vencimento</Form.Label>
                  <Form.Control type="text" placeholder="MM/AA" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control type="text" placeholder="123" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bandeira</Form.Label>
                  <Form.Select>
                    <option value="">Selecione a bandeira</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="elo">Elo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Check
              type="checkbox"
              label="Definir como cartão principal"
              defaultChecked
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddCardModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary">Adicionar Cartão</Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default FinanceiroAnunciante;
