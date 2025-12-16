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
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";

const DashboardTutorFinanceiro = () => {
  const { user } = useUser();
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filtroPeriodo, setFiltroPeriodo] = useState("mes");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroPet, setFiltroPet] = useState("");
  const [loading, setLoading] = useState(true);

  // Estados para dados reais
  const [transacoes, setTransacoes] = useState([]);
  const [pets, setPets] = useState([]);
  const [dadosFinanceiros, setDadosFinanceiros] = useState({
    totalGasto: 0,
    mediaMensal: 0,
    totalTransacoes: 0,
    gastoMesAtual: 0,
    gastoMesAnterior: 0,
    variacao: 0,
  });
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
  const [gastosPorPet, setGastosPorPet] = useState([]);
  const [gastosMensais, setGastosMensais] = useState([]);

  // Formulário para nova despesa
  const [novaDespesa, setNovaDespesa] = useState({
    valor: "",
    data: new Date().toISOString().split("T")[0],
    descricao: "",
    categoria: "",
    fornecedor: "",
    forma_pagamento: "",
    pet_id: "",
    observacoes: "",
  });

  useEffect(() => {
    if (user) {
      setNomeUsuario(user.nome || "");
      fetchTransacoes();
      fetchEstatisticas();
      fetchPets();
    }
  }, [user, filtroPeriodo]);

  const fetchPets = async () => {
    try {
      const data = await api.get("/pets");
      setPets(data);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
    }
  };

  const fetchTransacoes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtroPeriodo === "mes") {
        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        params.append("data_inicio", primeiroDia);
      } else if (filtroPeriodo === "ano") {
        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), 0, 1)
          .toISOString()
          .split("T")[0];
        params.append("data_inicio", primeiroDia);
      }

      const data = await api.get(`/tutores/transacoes?${params.toString()}`);
      setTransacoes(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstatisticas = async () => {
    try {
      const params = new URLSearchParams();
      params.append("periodo", filtroPeriodo);
      const data = await api.get(
        `/tutores/transacoes/estatisticas?${params.toString()}`
      );
      setDadosFinanceiros({
        totalGasto: data.totalGasto || 0,
        mediaMensal: data.mediaMensal || 0,
        totalTransacoes: data.totalTransacoes || 0,
        gastoMesAtual: data.gastoMesAtual || 0,
        gastoMesAnterior: data.gastoMesAnterior || 0,
        variacao: data.variacao || 0,
      });

      // Mapear dados para gráficos
      const cores = [
        "#4ecdc4",
        "#ff6b6b",
        "#45b7d1",
        "#96ceb4",
        "#feca57",
        "#ff9ff3",
      ];
      setGastosPorCategoria(
        (data.gastosPorCategoria || []).map((item, index) => ({
          ...item,
          color: cores[index % cores.length],
        }))
      );
      setGastosPorPet(
        (data.gastosPorPet || []).map((item, index) => ({
          ...item,
          color: cores[index % cores.length],
        }))
      );
      setGastosMensais(data.gastosMensais || []);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  const handleCreateDespesa = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tutores/transacoes", {
        valor: parseFloat(novaDespesa.valor),
        data: novaDespesa.data,
        descricao: novaDespesa.descricao,
        categoria: novaDespesa.categoria,
        fornecedor: novaDespesa.fornecedor,
        forma_pagamento: novaDespesa.forma_pagamento,
        pet_id: novaDespesa.pet_id ? parseInt(novaDespesa.pet_id) : null,
        observacoes: novaDespesa.observacoes,
        status: "pendente",
      });

      setShowAddModal(false);
      setNovaDespesa({
        valor: "",
        data: new Date().toISOString().split("T")[0],
        descricao: "",
        categoria: "",
        fornecedor: "",
        forma_pagamento: "",
        pet_id: "",
        observacoes: "",
      });
      fetchTransacoes();
      fetchEstatisticas();
    } catch (error) {
      console.error("Erro ao criar despesa:", error);
      alert("Erro ao criar despesa. Tente novamente.");
    }
  };

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
                          {pets.map((pet) => (
                            <option key={pet.id} value={pet.nome}>
                              {pet.nome}
                            </option>
                          ))}
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
                        {loading ? (
                          <tr>
                            <td colSpan={8} className="text-center py-4">
                              <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Carregando...</span>
                              </div>
                            </td>
                          </tr>
                        ) : transacoesFiltradas.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center py-4 text-muted">
                              Nenhuma transação encontrada
                            </td>
                          </tr>
                        ) : (
                          transacoesFiltradas.map((transacao) => (
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
                          ))
                        )}
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
            <Form onSubmit={handleCreateDespesa}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Descrição *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex: Consulta de rotina"
                      value={novaDespesa.descricao}
                      onChange={(e) =>
                        setNovaDespesa({ ...novaDespesa, descricao: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Categoria *</Form.Label>
                    <Form.Select
                      value={novaDespesa.categoria}
                      onChange={(e) =>
                        setNovaDespesa({ ...novaDespesa, categoria: e.target.value })
                      }
                      required
                    >
                      <option value="">Selecione a categoria</option>
                      <option value="Consulta">Consulta</option>
                      <option value="Vacinação">Vacinação</option>
                      <option value="Cirurgia">Cirurgia</option>
                      <option value="Exames">Exames</option>
                      <option value="Pet Shop">Pet Shop</option>
                      <option value="Alimentação">Alimentação</option>
                      <option value="Outros">Outros</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pet</Form.Label>
                    <Form.Select
                      value={novaDespesa.pet_id}
                      onChange={(e) =>
                        setNovaDespesa({ ...novaDespesa, pet_id: e.target.value })
                      }
                    >
                      <option value="">Selecione o pet (opcional)</option>
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data *</Form.Label>
                    <Form.Control
                      type="date"
                      value={novaDespesa.data}
                      onChange={(e) =>
                        setNovaDespesa({ ...novaDespesa, data: e.target.value })
                      }
                      required
                    />
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
                      value={novaDespesa.valor}
                      onChange={(e) =>
                        setNovaDespesa({ ...novaDespesa, valor: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Forma de Pagamento</Form.Label>
                    <Form.Select
                      value={novaDespesa.forma_pagamento}
                      onChange={(e) =>
                        setNovaDespesa({
                          ...novaDespesa,
                          forma_pagamento: e.target.value,
                        })
                      }
                    >
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
                  value={novaDespesa.fornecedor}
                  onChange={(e) =>
                    setNovaDespesa({ ...novaDespesa, fornecedor: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Observações sobre a despesa..."
                  value={novaDespesa.observacoes}
                  onChange={(e) =>
                    setNovaDespesa({ ...novaDespesa, observacoes: e.target.value })
                  }
                />
              </Form.Group>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  <FaPlus className="me-2" />
                  Adicionar Despesa
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default DashboardTutorFinanceiro;
