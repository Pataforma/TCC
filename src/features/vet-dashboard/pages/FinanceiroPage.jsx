import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Table,
  Tabs,
  Tab,
  Form,
  Modal,
  InputGroup,
} from "react-bootstrap";
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaPlus,
  FaDownload,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaUser,
  FaPaw,
  FaBox,
  FaBullhorn,
  FaCog,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatCard from "../../../components/Dashboard/StatCard";
import AdvancedChart from "../../../components/Dashboard/AdvancedChart";
import AutoTransactionsInfo from "../../../components/ui/AutoTransactionsInfo";

const FinanceiroPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [dateFilter, setDateFilter] = useState("current_month");

  // Dados mockados para KPIs
  const kpis = {
    faturamentoBruto: 8500.0,
    custosTotais: 3200.0,
    lucroLiquido: 5300.0,
    ticketMedio: 125.0,
    comparativo: {
      faturamento: 15,
      custos: -8,
      lucro: 22,
      ticket: 5,
    },
  };

  // Dados históricos para gráfico
  const historicalData = [
    { mes: "Jan", faturamento: 7200, lucro: 4800 },
    { mes: "Fev", faturamento: 6800, lucro: 4200 },
    { mes: "Mar", faturamento: 7500, lucro: 5100 },
    { mes: "Abr", faturamento: 8200, lucro: 5800 },
    { mes: "Mai", faturamento: 7800, lucro: 5200 },
    { mes: "Jun", faturamento: 8500, lucro: 5300 },
  ];

  // Dados de receitas
  const receitas = [
    {
      id: 1,
      data: "2024-12-15",
      cliente: "Maria Silva",
      paciente: "Luna",
      descricao: "Consulta de Rotina",
      valor: 150.0,
      status: "Recebido",
    },
    {
      id: 2,
      data: "2024-12-15",
      cliente: "João Santos",
      paciente: "Thor",
      descricao: "Vacinação + Vermífugo",
      valor: 200.0,
      status: "Recebido",
    },
    {
      id: 3,
      data: "2024-12-14",
      cliente: "Ana Costa",
      paciente: "Max",
      descricao: "Consulta Emergencial",
      valor: 300.0,
      status: "Pendente",
    },
    {
      id: 4,
      data: "2024-12-14",
      cliente: "Pedro Lima",
      paciente: "Nina",
      descricao: "Venda de Ração Premium",
      valor: 120.0,
      status: "Recebido",
    },
  ];

  // Dados de despesas
  const despesas = [
    {
      id: 1,
      data: "2024-12-15",
      descricao: "Compra de Vermífugos",
      categoria: "Insumo",
      fornecedor: "Distribuidora Pet",
      valor: 500.0,
    },
    {
      id: 2,
      data: "2024-12-10",
      descricao: "Aluguel do Consultório",
      categoria: "Custo Fixo",
      fornecedor: "Imobiliária Central",
      valor: 1200.0,
    },
    {
      id: 3,
      data: "2024-12-05",
      descricao: "Campanha de Marketing",
      categoria: "Marketing",
      fornecedor: "Google Ads",
      valor: 300.0,
    },
    {
      id: 4,
      data: "2024-12-01",
      descricao: "Software Pataforma",
      categoria: "Custo Fixo",
      fornecedor: "Pataforma",
      valor: 99.0,
    },
  ];

  // Dados de serviços
  const [servicos, setServicos] = useState([
    {
      id: 1,
      nome: "Consulta de Rotina",
      preco: 120.0,
      categoria: "Consultas",
      descricao: "Consulta veterinária de rotina com exame físico completo",
      ativo: true,
    },
    {
      id: 2,
      nome: "Vacinação",
      preco: 85.0,
      categoria: "Vacinas",
      descricao: "Aplicação de vacinas essenciais para cães e gatos",
      ativo: true,
    },
    {
      id: 3,
      nome: "Exame de Sangue",
      preco: 180.0,
      categoria: "Exames",
      descricao: "Exame laboratorial completo de sangue",
      ativo: true,
    },
    {
      id: 4,
      nome: "Cirurgia",
      preco: 850.0,
      categoria: "Cirurgias",
      descricao: "Procedimentos cirúrgicos diversos",
      ativo: true,
    },
    {
      id: 5,
      nome: "Consulta de Emergência",
      preco: 200.0,
      categoria: "Consultas",
      descricao: "Atendimento de emergência com prioridade",
      ativo: false,
    },
  ]);

  // Dados para análise de serviços
  const servicosRentaveis = [
    { servico: "Consultas de Rotina", percentual: 40, valor: 3400 },
    { servico: "Vacinação", percentual: 25, valor: 2125 },
    { servico: "Venda de Medicamentos", percentual: 20, valor: 1700 },
    { servico: "Consultas Emergenciais", percentual: 15, valor: 1275 },
  ];

  // Dados para análise de custos
  const analiseCustos = [
    { categoria: "Insumos e Medicamentos", percentual: 50, valor: 1600 },
    { categoria: "Custos Fixos", percentual: 30, valor: 960 },
    { categoria: "Marketing", percentual: 15, valor: 480 },
    { categoria: "Outros", percentual: 5, valor: 160 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status) => {
    return status === "Recebido" ? (
      <Badge bg="success">Recebido</Badge>
    ) : (
      <Badge bg="warning">Pendente</Badge>
    );
  };

  const getCategoryBadge = (categoria) => {
    const variants = {
      "Custo Fixo": "secondary",
      Insumo: "info",
      Marketing: "primary",
    };
    return <Badge bg={variants[categoria] || "light"}>{categoria}</Badge>;
  };

  const getServiceStatusBadge = (ativo) => {
    return ativo ? (
      <Badge bg="success">Ativo</Badge>
    ) : (
      <Badge bg="secondary">Inativo</Badge>
    );
  };

  const getServiceCategoryBadge = (categoria) => {
    const variants = {
      Consultas: "primary",
      Vacinas: "success",
      Exames: "info",
      Cirurgias: "warning",
      Emergências: "danger",
    };
    return <Badge bg={variants[categoria] || "secondary"}>{categoria}</Badge>;
  };

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0]).join(",");
    const csvContent = [
      headers,
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddService = () => {
    setEditingService(null);
    setShowServiceModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowServiceModal(true);
  };

  const handleDeleteService = (serviceId) => {
    setServicos(servicos.filter((service) => service.id !== serviceId));
  };

  const handleSaveService = (serviceData) => {
    if (editingService) {
      // Editar serviço existente
      setServicos(
        servicos.map((service) =>
          service.id === editingService.id
            ? { ...service, ...serviceData }
            : service
        )
      );
    } else {
      // Adicionar novo serviço
      const newService = {
        id: Math.max(...servicos.map((s) => s.id)) + 1,
        ...serviceData,
        ativo: true,
      };
      setServicos([...servicos, newService]);
    }
    setShowServiceModal(false);
    setEditingService(null);
  };

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario="Dr. André Silva">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Dashboard Financeiro</h2>
            <p className="text-muted mb-0">
              Visão completa da saúde financeira do seu negócio
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
              title="Faturamento Bruto"
              value={formatCurrency(kpis.faturamentoBruto)}
              icon={FaDollarSign}
              color="primary"
              trend={kpis.comparativo.faturamento}
              trendLabel="vs mês anterior"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Custos Totais"
              value={formatCurrency(kpis.custosTotais)}
              icon={FaChartLine}
              color="danger"
              trend={kpis.comparativo.custos}
              trendLabel="vs mês anterior"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Lucro Líquido"
              value={formatCurrency(kpis.lucroLiquido)}
              icon={FaChartBar}
              color="success"
              trend={kpis.comparativo.lucro}
              trendLabel="vs mês anterior"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Ticket Médio"
              value={formatCurrency(kpis.ticketMedio)}
              icon={FaUser}
              color="info"
              trend={kpis.comparativo.ticket}
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
                          key: "faturamento",
                          label: "Faturamento",
                          color: "#0d6efd",
                        },
                        { key: "lucro", label: "Lucro", color: "#fd7e14" },
                      ]}
                      height={300}
                      type="line"
                    />
                  </Card.Body>
                </Card>
              </Col>

              {/* Análises Rápidas */}
              <Col lg={4} className="mb-4">
                <Row>
                  <Col className="mb-3">
                    <Card className="h-100">
                      <Card.Header>
                        <h6 className="mb-0">
                          <FaChartPie className="me-2" />
                          Serviços Mais Rentáveis
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {servicosRentaveis.map((servico, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between align-items-center mb-2"
                          >
                            <div>
                              <div className="fw-semibold">
                                {servico.servico}
                              </div>
                              <small className="text-muted">
                                {servico.percentual}%
                              </small>
                            </div>
                            <div className="text-end">
                              <div className="fw-semibold">
                                {formatCurrency(servico.valor)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              {/* Análise de Custos */}
              <Col lg={6} className="mb-4">
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaChartBar className="me-2" />
                      Análise de Custos por Categoria
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {analiseCustos.map((custo, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center mb-3"
                      >
                        <div className="flex-grow-1 me-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold">
                              {custo.categoria}
                            </span>
                            <span className="text-muted">
                              {custo.percentual}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar stock-progress-bar"
                              style={{ width: `${custo.percentual}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold">
                            {formatCurrency(custo.valor)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>

              {/* Projeção de Fluxo de Caixa */}
              <Col lg={6} className="mb-4">
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaCalendarAlt className="me-2" />
                      Projeção do Próximo Mês
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="row text-center">
                      <div className="col-6 mb-3">
                        <div className="text-success fw-bold fs-4">
                          {formatCurrency(9000)}
                        </div>
                        <small className="text-muted">
                          Faturamento Projetado
                        </small>
                      </div>
                      <div className="col-6 mb-3">
                        <div className="text-danger fw-bold fs-4">
                          {formatCurrency(3500)}
                        </div>
                        <small className="text-muted">Custos Projetados</small>
                      </div>
                      <div className="col-12">
                        <div className="text-primary fw-bold fs-4">
                          {formatCurrency(5500)}
                        </div>
                        <small className="text-muted">Lucro Projetado</small>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-light rounded">
                      <small className="text-muted">
                        <strong>Baseado em:</strong> Histórico dos últimos 6
                        meses, sazonalidade e custos fixos cadastrados.
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Lançamentos Automáticos */}
            <Row>
              <Col lg={12} className="mb-4">
                <AutoTransactionsInfo />
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="receitas" title="Receitas">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaDollarSign className="me-2" />
                  Detalhamento de Receitas
                </h5>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => exportToCSV(receitas, "receitas.csv")}
                >
                  <FaDownload className="me-2" />
                  Exportar CSV
                </Button>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Cliente</th>
                      <th>Paciente</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receitas.map((receita) => (
                      <tr key={receita.id}>
                        <td>
                          {new Date(receita.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-muted" />
                            {receita.cliente}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaPaw className="me-2 text-muted" />
                            {receita.paciente}
                          </div>
                        </td>
                        <td>{receita.descricao}</td>
                        <td className="fw-bold text-success">
                          {formatCurrency(receita.valor)}
                        </td>
                        <td>{getStatusBadge(receita.status)}</td>
                        <td>
                          <Button variant="link" size="sm" className="p-0 me-2">
                            <FaEye />
                          </Button>
                          <Button variant="link" size="sm" className="p-0">
                            <FaEdit />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="despesas" title="Despesas">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaChartLine className="me-2" />
                  Detalhamento de Despesas
                </h5>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => exportToCSV(despesas, "despesas.csv")}
                  >
                    <FaDownload className="me-2" />
                    Exportar CSV
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowAddExpenseModal(true)}
                  >
                    <FaPlus className="me-2" />
                    Adicionar Despesa
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Categoria</th>
                      <th>Fornecedor</th>
                      <th>Valor</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {despesas.map((despesa) => (
                      <tr key={despesa.id}>
                        <td>
                          {new Date(despesa.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td>{despesa.descricao}</td>
                        <td>{getCategoryBadge(despesa.categoria)}</td>
                        <td>{despesa.fornecedor}</td>
                        <td className="fw-bold text-danger">
                          {formatCurrency(despesa.valor)}
                        </td>
                        <td>
                          <Button variant="link" size="sm" className="p-0 me-2">
                            <FaEye />
                          </Button>
                          <Button variant="link" size="sm" className="p-0 me-2">
                            <FaEdit />
                          </Button>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 text-danger"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="servicos" title="Meus Serviços">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCog className="me-2" />
                  Gestão de Serviços
                </h5>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => exportToCSV(servicos, "servicos.csv")}
                  >
                    <FaDownload className="me-2" />
                    Exportar CSV
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddService}
                  >
                    <FaPlus className="me-2" />
                    Novo Serviço
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Categoria</th>
                      <th>Preço</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos.map((servico) => (
                      <tr key={servico.id}>
                        <td className="fw-semibold">{servico.nome}</td>
                        <td>{getServiceCategoryBadge(servico.categoria)}</td>
                        <td className="fw-bold text-primary">
                          {formatCurrency(servico.preco)}
                        </td>
                        <td>{getServiceStatusBadge(servico.ativo)}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleEditService(servico)}
                            >
                              <FaEdit size={12} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteService(servico.id)}
                            >
                              <FaTrash size={12} />
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
        </Tabs>
      </div>

      {/* Modal para Adicionar Despesa */}
      <Modal
        show={showAddExpenseModal}
        onHide={() => setShowAddExpenseModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPlus className="me-2" />
            Adicionar Despesa Manual
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Aluguel do consultório"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Select>
                <option value="custo_fixo">Custo Fixo</option>
                <option value="insumo">Insumo</option>
                <option value="marketing">Marketing</option>
                <option value="outros">Outros</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fornecedor</Form.Label>
              <Form.Control type="text" placeholder="Nome do fornecedor" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor</Form.Label>
              <Form.Control type="number" step="0.01" placeholder="0,00" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddExpenseModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary">Salvar Despesa</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Adicionar/Editar Serviço */}
      <Modal
        show={showServiceModal}
        onHide={() => setShowServiceModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-semibold">
            <FaCog className="me-2 text-primary" />
            {editingService ? "Editar Serviço" : "Novo Serviço"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Nome do Serviço</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={editingService?.nome}
                    placeholder="Ex: Consulta de Rotina"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select defaultValue={editingService?.categoria}>
                    <option value="">Selecione uma categoria</option>
                    <option value="Consultas">Consultas</option>
                    <option value="Vacinas">Vacinas</option>
                    <option value="Exames">Exames</option>
                    <option value="Cirurgias">Cirurgias</option>
                    <option value="Emergências">Emergências</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Preço</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      defaultValue={editingService?.preco}
                      placeholder="0,00"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    defaultValue={editingService?.descricao}
                    placeholder="Descreva o serviço oferecido..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  label="Serviço ativo"
                  defaultChecked={editingService?.ativo ?? true}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            onClick={() => setShowServiceModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleSaveService({})}>
            {editingService ? "Atualizar" : "Salvar"} Serviço
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default FinanceiroPage;
