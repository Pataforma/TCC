import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Nav,
  Tab,
  Form,
  InputGroup,
  Modal,
  Alert,
} from "react-bootstrap";
import {
  FaMoneyBill,
  FaChartBar,
  FaChartPie,
  FaDownload,
  FaFilter,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFileInvoice,
  FaCreditCard,
  FaPiggyBank,
  FaCalendarAlt,
  FaUser,
  FaPaw,
  FaSyringe,
  FaStethoscope,
  FaHome,
  FaCar,
  FaShoppingCart,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaCut,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import SimpleChart from "../../../components/Dashboard/SimpleChart";

const DashboardTutorFinanceiro = () => {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filtroPeriodo, setFiltroPeriodo] = useState("mes");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroPet, setFiltroPet] = useState("");

  // Dados mockados financeiros
  const [dadosFinanceiros] = useState({
    totalGasto: 2840.5,
    mediaMensal: 236.71,
    totalTransacoes: 12,
    gastoMesAtual: 420.0,
    gastoMesAnterior: 380.0,
    variacao: 10.5,
  });

  const [transacoes] = useState([
    {
      id: 1,
      data: "2024-01-15",
      descricao: "Consulta de Rotina - Thor",
      categoria: "Consulta",
      pet: "Thor",
      clinica: "Clínica Veterinária Pataforma",
      valor: 120.0,
      status: "pago",
      formaPagamento: "Cartão de Crédito",
      parcelas: 1,
      observacoes: "Consulta de rotina anual",
    },
    {
      id: 2,
      data: "2024-01-12",
      descricao: "Vacina Antirrábica - Luna",
      categoria: "Vacinação",
      pet: "Luna",
      clinica: "Clínica Veterinária Pataforma",
      valor: 75.0,
      status: "pago",
      formaPagamento: "PIX",
      parcelas: 1,
      observacoes: "Vacina obrigatória anual",
    },
    {
      id: 3,
      data: "2024-01-10",
      descricao: "Cirurgia de Castração - Max",
      categoria: "Cirurgia",
      pet: "Max",
      clinica: "Clínica Veterinária Pataforma",
      valor: 450.0,
      status: "pago",
      formaPagamento: "Cartão de Crédito",
      parcelas: 3,
      observacoes: "Cirurgia eletiva de castração",
    },
    {
      id: 4,
      data: "2024-01-08",
      descricao: "Exames Laboratoriais - Thor",
      categoria: "Exames",
      pet: "Thor",
      clinica: "Clínica Veterinária Pataforma",
      valor: 180.0,
      status: "pago",
      formaPagamento: "Cartão de Débito",
      parcelas: 1,
      observacoes: "Hemograma completo e bioquímico",
    },
    {
      id: 5,
      data: "2024-01-05",
      descricao: "Banho e Tosa - Luna",
      categoria: "Pet Shop",
      pet: "Luna",
      clinica: "Pet Shop Cão & Gato",
      valor: 60.0,
      status: "pago",
      formaPagamento: "Dinheiro",
      parcelas: 1,
      observacoes: "Banho, tosa e corte de unhas",
    },
    {
      id: 6,
      data: "2024-01-03",
      descricao: "Ração Premium - Thor",
      categoria: "Alimentação",
      pet: "Thor",
      clinica: "Pet Shop Cão & Gato",
      valor: 85.0,
      status: "pago",
      formaPagamento: "Cartão de Crédito",
      parcelas: 1,
      observacoes: "Ração especial para cães adultos",
    },
  ]);

  const [gastosPorCategoria] = useState([
    { label: "Consultas", value: 480, color: "#4ecdc4" },
    { label: "Vacinas", value: 150, color: "#ff6b6b" },
    { label: "Cirurgias", value: 450, color: "#45b7d1" },
    { label: "Exames", value: 180, color: "#96ceb4" },
    { label: "Pet Shop", value: 145, color: "#feca57" },
    { label: "Alimentação", value: 85, color: "#ff9ff3" },
  ]);

  const [gastosPorPet] = useState([
    { label: "Thor", value: 785, color: "#4ecdc4" },
    { label: "Luna", value: 135, color: "#ff6b6b" },
    { label: "Max", value: 450, color: "#45b7d1" },
  ]);

  const [gastosMensais] = useState([
    { label: "Jan", value: 420 },
    { label: "Dez", value: 380 },
    { label: "Nov", value: 320 },
    { label: "Out", value: 450 },
    { label: "Set", value: 280 },
    { label: "Ago", value: 390 },
  ]);

  useEffect(() => {
    // TODO: Buscar dados do usuário do Supabase
    setNomeUsuario("Maria Silva");
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status) => {
    const variants = {
      pago: "success",
      pendente: "warning",
      atrasado: "danger",
    };
    return variants[status] || "secondary";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pago: "Pago",
      pendente: "Pendente",
      atrasado: "Atrasado",
    };
    return labels[status] || status;
  };

  const getCategoriaIcon = (categoria) => {
    switch (categoria) {
      case "Consulta":
        return <FaStethoscope className="text-primary" />;
      case "Vacinação":
        return <FaSyringe className="text-warning" />;
      case "Cirurgia":
        return <FaUser className="text-danger" />;
      case "Exames":
        return <FaFileInvoice className="text-info" />;
      case "Pet Shop":
        return <FaShoppingCart className="text-success" />;
      case "Alimentação":
        return <FaPaw className="text-secondary" />;
      default:
        return <FaMoneyBill className="text-muted" />;
    }
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const transacoesFiltradas = transacoes.filter((transacao) => {
    const matchCategoria =
      !filtroCategoria || transacao.categoria === filtroCategoria;
    const matchPet = !filtroPet || transacao.pet === filtroPet;
    return matchCategoria && matchPet;
  });

  const totalGastoFiltrado = transacoesFiltradas.reduce(
    (sum, t) => sum + t.valor,
    0
  );

  return (
    <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  <FaMoneyBill className="me-2" />
                  Financeiro
                </h2>
                <p className="text-muted mb-0">
                  Acompanhe seus gastos com os pets
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <FaPlus className="me-2" />
                Nova Despesa
              </Button>
            </div>
          </Col>
        </Row>

        {/* Cards de Resumo */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Total Gasto</h6>
                    <h4 className="fw-bold text-primary mb-0">
                      {formatCurrency(dadosFinanceiros.totalGasto)}
                    </h4>
                  </div>
                  <div className="text-primary">
                    <FaMoneyBill size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Média Mensal</h6>
                    <h4 className="fw-bold text-success mb-0">
                      {formatCurrency(dadosFinanceiros.mediaMensal)}
                    </h4>
                  </div>
                  <div className="text-success">
                    <FaPiggyBank size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Total Transações</h6>
                    <h4 className="fw-bold text-info mb-0">
                      {dadosFinanceiros.totalTransacoes}
                    </h4>
                  </div>
                  <div className="text-info">
                    <FaFileInvoice size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Mês Atual</h6>
                    <h4 className="fw-bold text-warning mb-0">
                      {formatCurrency(dadosFinanceiros.gastoMesAtual)}
                    </h4>
                    <small
                      className={`${
                        dadosFinanceiros.variacao > 0
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {dadosFinanceiros.variacao > 0 ? "+" : ""}
                      {dadosFinanceiros.variacao}% vs mês anterior
                    </small>
                  </div>
                  <div className="text-warning">
                    <FaCalendarAlt size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navegação por Abas */}
        <Row className="mb-4">
          <Col>
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
              <Nav.Item>
                <Nav.Link eventKey="dashboard">
                  <FaChartBar className="me-2" />
                  Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="transacoes">
                  <FaFileInvoice className="me-2" />
                  Transações
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="relatorios">
                  <FaChartPie className="me-2" />
                  Relatórios
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        {/* Conteúdo das Abas */}
        <Tab.Content>
          {/* Aba Dashboard */}
          <Tab.Pane active={activeTab === "dashboard"}>
            <Row className="g-4">
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h6 className="mb-0 fw-bold">Gastos por Categoria</h6>
                  </Card.Header>
                  <Card.Body>
                    <SimpleChart
                      data={gastosPorCategoria}
                      color="#4ecdc4"
                      height={300}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h6 className="mb-0 fw-bold">Gastos por Pet</h6>
                  </Card.Header>
                  <Card.Body>
                    <SimpleChart
                      data={gastosPorPet}
                      color="#ff6b6b"
                      height={300}
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h6 className="mb-0 fw-bold">Evolução Mensal</h6>
                  </Card.Header>
                  <Card.Body>
                    <SimpleChart
                      data={gastosMensais}
                      color="#45b7d1"
                      height={200}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Aba Transações */}
          <Tab.Pane active={activeTab === "transacoes"}>
            <Row className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0 fw-bold">Histórico de Transações</h6>
                      <div className="d-flex gap-2">
                        <Form.Select
                          size="sm"
                          style={{ width: "auto" }}
                          value={filtroCategoria}
                          onChange={(e) => setFiltroCategoria(e.target.value)}
                        >
                          <option value="">Todas as categorias</option>
                          <option value="Consulta">Consulta</option>
                          <option value="Vacinação">Vacinação</option>
                          <option value="Cirurgia">Cirurgia</option>
                          <option value="Exames">Exames</option>
                          <option value="Pet Shop">Pet Shop</option>
                          <option value="Alimentação">Alimentação</option>
                        </Form.Select>
                        <Form.Select
                          size="sm"
                          style={{ width: "auto" }}
                          value={filtroPet}
                          onChange={(e) => setFiltroPet(e.target.value)}
                        >
                          <option value="">Todos os pets</option>
                          <option value="Thor">Thor</option>
                          <option value="Luna">Luna</option>
                          <option value="Max">Max</option>
                        </Form.Select>
                        <Button variant="outline-secondary" size="sm">
                          <FaDownload className="me-1" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table responsive className="table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Data</th>
                          <th>Descrição</th>
                          <th>Categoria</th>
                          <th>Pet</th>
                          <th>Clínica</th>
                          <th>Valor</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transacoesFiltradas.map((transacao) => (
                          <tr key={transacao.id}>
                            <td>
                              <div>
                                <strong>{formatDate(transacao.data)}</strong>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                {getCategoriaIcon(transacao.categoria)}
                                <span>{transacao.descricao}</span>
                              </div>
                            </td>
                            <td>
                              <Badge bg="light" text="dark">
                                {transacao.categoria}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <FaPaw className="text-primary" />
                                <span>{transacao.pet}</span>
                              </div>
                            </td>
                            <td>
                              <span>{transacao.clinica}</span>
                            </td>
                            <td>
                              <span className="fw-semibold text-success">
                                {formatCurrency(transacao.valor)}
                              </span>
                            </td>
                            <td>
                              <Badge bg={getStatusBadge(transacao.status)}>
                                {getStatusLabel(transacao.status)}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => handleViewDetails(transacao)}
                                  title="Ver Detalhes"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  title="Download Recibo"
                                >
                                  <FaDownload />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">
                        {transacoesFiltradas.length} transação(ões)
                        encontrada(s)
                      </span>
                      <span className="fw-semibold">
                        Total: {formatCurrency(totalGastoFiltrado)}
                      </span>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Aba Relatórios */}
          <Tab.Pane active={activeTab === "relatorios"}>
            <Row className="g-4">
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h6 className="mb-0 fw-bold">Resumo por Categoria</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="list-group list-group-flush">
                      {gastosPorCategoria.map((categoria, index) => (
                        <div
                          key={index}
                          className="list-group-item border-0 px-0"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle"
                                style={{
                                  width: 12,
                                  height: 12,
                                  backgroundColor: categoria.color,
                                }}
                              />
                              <span>{categoria.label}</span>
                            </div>
                            <span className="fw-semibold">
                              {formatCurrency(categoria.value)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white border-0">
                    <h6 className="mb-0 fw-bold">Resumo por Pet</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="list-group list-group-flush">
                      {gastosPorPet.map((pet, index) => (
                        <div
                          key={index}
                          className="list-group-item border-0 px-0"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                              <FaPaw className="text-primary" />
                              <span>{pet.label}</span>
                            </div>
                            <span className="fw-semibold">
                              {formatCurrency(pet.value)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>

        {/* Modal de Detalhes */}
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaFileInvoice className="me-2" />
              Detalhes da Transação
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedTransaction && (
              <div>
                <Row>
                  <Col md={6}>
                    <h6 className="fw-bold">Informações da Transação</h6>
                    <div className="mb-3">
                      <strong>Descrição:</strong>{" "}
                      {selectedTransaction.descricao}
                    </div>
                    <div className="mb-3">
                      <strong>Categoria:</strong>{" "}
                      {selectedTransaction.categoria}
                    </div>
                    <div className="mb-3">
                      <strong>Pet:</strong> {selectedTransaction.pet}
                    </div>
                    <div className="mb-3">
                      <strong>Data:</strong>{" "}
                      {formatDate(selectedTransaction.data)}
                    </div>
                    <div className="mb-3">
                      <strong>Valor:</strong>{" "}
                      {formatCurrency(selectedTransaction.valor)}
                    </div>
                    <div className="mb-3">
                      <strong>Status:</strong>{" "}
                      <Badge bg={getStatusBadge(selectedTransaction.status)}>
                        {getStatusLabel(selectedTransaction.status)}
                      </Badge>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold">Informações de Pagamento</h6>
                    <div className="mb-3">
                      <strong>Clínica:</strong> {selectedTransaction.clinica}
                    </div>
                    <div className="mb-3">
                      <strong>Forma de Pagamento:</strong>{" "}
                      {selectedTransaction.formaPagamento}
                    </div>
                    <div className="mb-3">
                      <strong>Parcelas:</strong> {selectedTransaction.parcelas}x
                    </div>
                    <div className="mb-3">
                      <strong>Observações:</strong>
                      <p className="text-muted">
                        {selectedTransaction.observacoes}
                      </p>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-4">
                  <Button variant="outline-success">
                    <FaDownload className="me-2" />
                    Download Recibo
                  </Button>
                  <Button variant="outline-primary">
                    <FaFileInvoice className="me-2" />
                    Solicitar Nota Fiscal
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Modal Nova Despesa */}
        <Modal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaPlus className="me-2" />
              Nova Despesa
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Descrição *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Consulta de rotina"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Categoria *</Form.Label>
                    <Form.Select>
                      <option value="">Selecione a categoria</option>
                      <option value="Consulta">Consulta</option>
                      <option value="Vacinação">Vacinação</option>
                      <option value="Cirurgia">Cirurgia</option>
                      <option value="Exames">Exames</option>
                      <option value="Pet Shop">Pet Shop</option>
                      <option value="Alimentação">Alimentação</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pet *</Form.Label>
                    <Form.Select>
                      <option value="">Selecione o pet</option>
                      <option value="Thor">Thor</option>
                      <option value="Luna">Luna</option>
                      <option value="Max">Max</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data *</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Valor *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Forma de Pagamento</Form.Label>
                    <Form.Select>
                      <option value="">Selecione</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Cartão de Débito">Cartão de Débito</option>
                      <option value="Cartão de Crédito">
                        Cartão de Crédito
                      </option>
                      <option value="PIX">PIX</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Clínica/Estabelecimento</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nome da clínica ou estabelecimento"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Observações sobre a despesa..."
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary">
              <FaPlus className="me-2" />
              Adicionar Despesa
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default DashboardTutorFinanceiro;
