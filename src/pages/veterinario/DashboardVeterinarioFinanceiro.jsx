import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Badge,
  Form,
  Table,
  Nav,
  Tab,
  InputGroup,
} from "react-bootstrap";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/Dashboard/StatCard";
import SimpleChart from "../../components/Dashboard/SimpleChart";
import {
  FaMoneyBill,
  FaChartBar,
  FaPlus,
  FaMinus,
  FaDownload,
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaPaw,
  FaReceipt,
  FaCreditCard,
  FaMoneyBill,
  FaPiggyBank,
  FaChartBar,
  FaFilter,
} from "react-icons/fa";
import { useSubscription } from "../../context/SubscriptionContext";

const DashboardVeterinarioFinanceiro = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("receita");
  const [activeTab, setActiveTab] = useState("visao-geral");
  const { plan } = useSubscription();

  // Dados mockados financeiros
  const [stats] = useState({
    faturamentoMes: 15420,
    despesasMes: 8200,
    lucroMes: 7220,
    consultasMes: 45,
    receitasPendentes: 3200,
  });

  const [receitas] = useState([
    {
      id: 1,
      data: "2024-01-15",
      paciente: "Rex",
      tutor: "Maria Silva",
      servico: "Consulta de Rotina",
      valor: 120.0,
      formaPagamento: "Cartão",
      status: "pago",
    },
    {
      id: 2,
      data: "2024-01-15",
      paciente: "Luna",
      tutor: "João Santos",
      servico: "Vacinação",
      valor: 85.0,
      formaPagamento: "Dinheiro",
      status: "pago",
    },
    {
      id: 3,
      data: "2024-01-14",
      paciente: "Thor",
      tutor: "Ana Costa",
      servico: "Exame de Sangue",
      valor: 180.0,
      formaPagamento: "PIX",
      status: "pendente",
    },
    {
      id: 4,
      data: "2024-01-14",
      paciente: "Nina",
      tutor: "Carlos Oliveira",
      servico: "Cirurgia",
      valor: 850.0,
      formaPagamento: "Cartão",
      status: "pago",
    },
  ]);

  const [despesas] = useState([
    {
      id: 1,
      data: "2024-01-15",
      categoria: "Insumos",
      descricao: "Vacinas e medicamentos",
      valor: 1200.0,
      formaPagamento: "Cartão",
    },
    {
      id: 2,
      data: "2024-01-14",
      categoria: "Material",
      descricao: "Equipamentos cirúrgicos",
      valor: 800.0,
      formaPagamento: "PIX",
    },
    {
      id: 3,
      data: "2024-01-13",
      categoria: "Aluguel",
      descricao: "Aluguel do consultório",
      valor: 2500.0,
      formaPagamento: "Transferência",
    },
    {
      id: 4,
      data: "2024-01-12",
      categoria: "Marketing",
      descricao: "Anúncios online",
      valor: 300.0,
      formaPagamento: "Cartão",
    },
  ]);

  const [servicos] = useState([
    {
      id: 1,
      nome: "Consulta de Rotina",
      preco: 120.0,
      categoria: "Consultas",
      ativo: true,
    },
    {
      id: 2,
      nome: "Vacinação",
      preco: 85.0,
      categoria: "Vacinas",
      ativo: true,
    },
    {
      id: 3,
      nome: "Exame de Sangue",
      preco: 180.0,
      categoria: "Exames",
      ativo: true,
    },
    {
      id: 4,
      nome: "Cirurgia",
      preco: 850.0,
      categoria: "Cirurgias",
      ativo: true,
    },
    {
      id: 5,
      nome: "Consulta de Emergência",
      preco: 200.0,
      categoria: "Consultas",
      ativo: false,
    },
  ]);

  const [faturamentoData] = useState([
    { label: "Jan", value: 12000 },
    { label: "Fev", value: 13500 },
    { label: "Mar", value: 14200 },
    { label: "Abr", value: 15420 },
    { label: "Mai", value: 16800 },
    { label: "Jun", value: 18200 },
  ]);

  const [despesasData] = useState([
    { label: "Jan", value: 8000 },
    { label: "Fev", value: 8500 },
    { label: "Mar", value: 8200 },
    { label: "Abr", value: 8200 },
    { label: "Mai", value: 8800 },
    { label: "Jun", value: 9200 },
  ]);

  const [categoriasData] = useState([
    { label: "Consultas", value: 5400 },
    { label: "Vacinas", value: 2550 },
    { label: "Exames", value: 3600 },
    { label: "Cirurgias", value: 3400 },
    { label: "Emergências", value: 470 },
  ]);

  const getStatusBadge = (status) => {
    const variants = {
      pago: "success",
      pendente: "warning",
      cancelado: "danger",
    };

    const labels = {
      pago: "Pago",
      pendente: "Pendente",
      cancelado: "Cancelado",
    };

    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const handleNovaReceita = () => {
    setModalType("receita");
    setShowModal(true);
  };

  const handleNovaDespesa = () => {
    setModalType("despesa");
    setShowModal(true);
  };

  const handleNovoServico = () => {
    setModalType("servico");
    setShowModal(true);
  };

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario="Dr. André Silva">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Módulo Financeiro</h2>
            <p className="text-muted mb-0">
              Gerencie suas receitas, despesas e serviços
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleNovaReceita}
            >
              <FaPlus className="me-2" />
              Nova Receita
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleNovaDespesa}
            >
              <FaMinus className="me-2" />
              Nova Despesa
            </Button>
            <Button variant="primary" size="sm">
              <FaDownload className="me-2" />
              Relatório
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <Row className="g-4 mb-4">
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Faturamento do Mês"
              value={formatarMoeda(stats.faturamentoMes)}
              icon={FaMoneyBill}
              color="success"
              trend="up"
              trendValue="+15%"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Despesas do Mês"
              value={formatarMoeda(stats.despesasMes)}
              icon={FaMinus}
              color="danger"
              trend="down"
              trendValue="-8%"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Lucro do Mês"
              value={formatarMoeda(stats.lucroMes)}
              icon={FaChartBar}
              color="primary"
              trend="up"
              trendValue="+22%"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Receitas Pendentes"
              value={formatarMoeda(stats.receitasPendentes)}
              icon={FaReceipt}
              color="warning"
              trend="up"
              trendValue="+5%"
            />
          </Col>
        </Row>

        {/* Abas Principais */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <Card.Header className="bg-white border-0">
            <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
              <Nav.Item>
                <Nav.Link eventKey="visao-geral">Visão Geral</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="receitas">Receitas</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="despesas">Despesas</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="servicos">Serviços</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body className="p-4">
            <Tab.Content>
              {/* Visão Geral */}
              <Tab.Pane active={activeTab === "visao-geral"}>
                <Row className="g-4">
                  <Col lg={8}>
                    <div className="d-flex flex-column gap-4">
                      <SimpleChart
                        title="Faturamento vs Despesas"
                        data={faturamentoData}
                        color="#0DB2AC"
                        height={200}
                      />
                      <SimpleChart
                        title="Receitas por Categoria"
                        data={categoriasData}
                        color="#FC694D"
                        height={200}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <Card className="border-0 bg-light h-100">
                      <Card.Body>
                        <h6 className="fw-semibold mb-3">Resumo Financeiro</h6>
                        <div className="d-flex flex-column gap-3">
                          <div className="d-flex justify-content-between">
                            <span>Faturamento Total</span>
                            <span className="fw-semibold text-success">
                              {formatarMoeda(stats.faturamentoMes)}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Despesas Totais</span>
                            <span className="fw-semibold text-danger">
                              {formatarMoeda(stats.despesasMes)}
                            </span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between">
                            <span className="fw-semibold">Lucro Líquido</span>
                            <span className="fw-semibold text-primary">
                              {formatarMoeda(stats.lucroMes)}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Margem de Lucro</span>
                            <span className="fw-semibold text-primary">
                              {(
                                (stats.lucroMes / stats.faturamentoMes) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Receitas */}
              <Tab.Pane active={activeTab === "receitas"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold text-dark mb-0">Receitas</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNovaReceita}
                  >
                    <FaPlus className="me-2" />
                    Nova Receita
                  </Button>
                </div>
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Data</th>
                      <th>Paciente</th>
                      <th>Serviço</th>
                      <th>Valor</th>
                      <th>Forma Pagamento</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receitas.map((receita) => (
                      <tr key={receita.id}>
                        <td>{formatarData(receita.data)}</td>
                        <td>
                          <div>{receita.paciente}</div>
                          <small className="text-muted">{receita.tutor}</small>
                        </td>
                        <td>{receita.servico}</td>
                        <td className="fw-semibold">
                          {formatarMoeda(receita.valor)}
                        </td>
                        <td>{receita.formaPagamento}</td>
                        <td>{getStatusBadge(receita.status)}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <FaEye size={12} />
                            </Button>
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
              </Tab.Pane>

              {/* Despesas */}
              <Tab.Pane active={activeTab === "despesas"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold text-dark mb-0">Despesas</h5>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleNovaDespesa}
                  >
                    <FaPlus className="me-2" />
                    Nova Despesa
                  </Button>
                </div>
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Data</th>
                      <th>Categoria</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Forma Pagamento</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {despesas.map((despesa) => (
                      <tr key={despesa.id}>
                        <td>{formatarData(despesa.data)}</td>
                        <td>
                          <Badge bg="secondary">{despesa.categoria}</Badge>
                        </td>
                        <td>{despesa.descricao}</td>
                        <td className="fw-semibold text-danger">
                          {formatarMoeda(despesa.valor)}
                        </td>
                        <td>{despesa.formaPagamento}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <FaEye size={12} />
                            </Button>
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
              </Tab.Pane>

              {/* Serviços */}
              <Tab.Pane active={activeTab === "servicos"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold text-dark mb-0">Serviços</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNovoServico}
                  >
                    <FaPlus className="me-2" />
                    Novo Serviço
                  </Button>
                </div>
                <Table hover className="mb-0">
                  <thead className="bg-light">
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
                        <td>
                          <Badge bg="primary">{servico.categoria}</Badge>
                        </td>
                        <td className="fw-semibold">
                          {formatarMoeda(servico.preco)}
                        </td>
                        <td>
                          <Badge bg={servico.ativo ? "success" : "secondary"}>
                            {servico.ativo ? "Ativo" : "Inativo"}
                          </Badge>
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
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>

        {plan === "advanced" && (
          <section
            style={{
              marginTop: "2rem",
              padding: "1rem",
              background: "#e3f2fd",
              borderRadius: 8,
            }}
          >
            <h3>Relatórios Financeiros Avançados</h3>
            <p>
              Visualize análises detalhadas, exporte relatórios e acesse
              previsões exclusivas.
            </p>
            <button
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "0.6rem 1.2rem",
                marginTop: 8,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Exportar Relatório
            </button>
          </section>
        )}
      </div>

      {/* Modal para Nova Receita/Despesa/Serviço */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-semibold">
            {modalType === "receita" && (
              <FaMoneyBill className="me-2 text-success" />
            )}
            {modalType === "despesa" && (
              <FaMinus className="me-2 text-danger" />
            )}
            {modalType === "servico" && (
              <FaEdit className="me-2 text-primary" />
            )}
            {modalType === "receita" && "Nova Receita"}
            {modalType === "despesa" && "Nova Despesa"}
            {modalType === "servico" && "Novo Serviço"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {modalType === "receita" && (
              <>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Data</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Paciente</Form.Label>
                      <Form.Select>
                        <option>Selecione um paciente</option>
                        <option>Rex - Maria Silva</option>
                        <option>Luna - João Santos</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Serviço</Form.Label>
                      <Form.Select>
                        <option>Selecione um serviço</option>
                        <option>Consulta de Rotina</option>
                        <option>Vacinação</option>
                        <option>Exame de Sangue</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Valor</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>R$</InputGroup.Text>
                        <Form.Control type="number" step="0.01" />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Forma de Pagamento</Form.Label>
                      <Form.Select>
                        <option>Dinheiro</option>
                        <option>Cartão</option>
                        <option>PIX</option>
                        <option>Transferência</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select>
                        <option>Pago</option>
                        <option>Pendente</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {modalType === "despesa" && (
              <>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Data</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Categoria</Form.Label>
                      <Form.Select>
                        <option>Insumos</option>
                        <option>Material</option>
                        <option>Aluguel</option>
                        <option>Marketing</option>
                        <option>Outros</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Valor</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>R$</InputGroup.Text>
                        <Form.Control type="number" step="0.01" />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Forma de Pagamento</Form.Label>
                      <Form.Select>
                        <option>Dinheiro</option>
                        <option>Cartão</option>
                        <option>PIX</option>
                        <option>Transferência</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {modalType === "servico" && (
              <>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Nome do Serviço</Form.Label>
                      <Form.Control type="text" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Categoria</Form.Label>
                      <Form.Select>
                        <option>Consultas</option>
                        <option>Vacinas</option>
                        <option>Exames</option>
                        <option>Cirurgias</option>
                        <option>Emergências</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Preço</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>R$</InputGroup.Text>
                        <Form.Control type="number" step="0.01" />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Check
                      type="checkbox"
                      label="Serviço ativo"
                      defaultChecked
                    />
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary">Salvar</Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default DashboardVeterinarioFinanceiro;
