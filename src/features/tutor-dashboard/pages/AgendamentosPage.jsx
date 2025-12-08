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
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaVideo,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBill,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaPaw,
  FaFileMedical,
  FaDownload,
  FaShare,
  FaChartBar,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";

const AgendamentosPage = () => {
  const [activeTab, setActiveTab] = useState("pendentes");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");

  // Dados mockados de agendamentos
  const [agendamentos] = useState({
    pendentes: [
      {
        id: 1,
        pet: "Thor",
        tipo: "Consulta de Rotina",
        data: "2024-01-20",
        horario: "14:30",
        veterinario: "Dr. André Silva",
        clinica: "Clínica Veterinária Pataforma",
        endereco: "Rua das Flores, 123 - Centro",
        telefone: "(11) 99999-9999",
        whatsapp: "(11) 99999-9999",
        valor: 120.0,
        status: "confirmado",
        isTelemedicina: true,
        observacoes: "Thor está com uma pequena ferida na pata direita",
        sintomas: "Ferida superficial, sem sangramento",
      },
      {
        id: 2,
        pet: "Luna",
        tipo: "Vacinação",
        data: "2024-01-25",
        horario: "10:00",
        veterinario: "Dra. Juliana Santos",
        clinica: "Clínica Veterinária Pataforma",
        endereco: "Rua das Flores, 123 - Centro",
        telefone: "(11) 99999-9999",
        whatsapp: "(11) 99999-9999",
        valor: 75.0,
        status: "pendente",
        isTelemedicina: false,
        observacoes: "Vacina antirrábica anual",
        sintomas: "Preventivo",
      },
      {
        id: 3,
        pet: "Max",
        tipo: "Retorno Pós-Cirurgia",
        data: "2024-01-28",
        horario: "16:00",
        veterinario: "Dr. André Silva",
        clinica: "Clínica Veterinária Pataforma",
        endereco: "Rua das Flores, 123 - Centro",
        telefone: "(11) 99999-9999",
        whatsapp: "(11) 99999-9999",
        valor: 80.0,
        status: "confirmado",
        isTelemedicina: false,
        observacoes: "Retorno para retirar pontos da cirurgia de castração",
        sintomas: "Pós-operatório",
      },
    ],
    completos: [
      {
        id: 4,
        pet: "Thor",
        tipo: "Consulta de Emergência",
        data: "2024-01-10",
        horario: "20:30",
        veterinario: "Dr. André Silva",
        clinica: "Clínica Veterinária Pataforma",
        endereco: "Rua das Flores, 123 - Centro",
        telefone: "(11) 99999-9999",
        whatsapp: "(11) 99999-9999",
        valor: 200.0,
        status: "realizado",
        isTelemedicina: false,
        observacoes: "Thor estava com vômito e diarreia",
        sintomas: "Vômito, diarreia, apatia",
        diagnostico: "Gastrite aguda",
        prescricao: "Antiemético e dieta especial por 3 dias",
        proximoRetorno: "2024-01-20",
      },
      {
        id: 5,
        pet: "Max",
        tipo: "Cirurgia de Castração",
        data: "2024-01-05",
        horario: "08:00",
        veterinario: "Dr. André Silva",
        clinica: "Clínica Veterinária Pataforma",
        endereco: "Rua das Flores, 123 - Centro",
        telefone: "(11) 99999-9999",
        whatsapp: "(11) 99999-9999",
        valor: 450.0,
        status: "realizado",
        isTelemedicina: false,
        observacoes: "Cirurgia de castração eletiva",
        sintomas: "Procedimento eletivo",
        diagnostico: "Castração realizada com sucesso",
        prescricao: "Antibiótico por 7 dias, colar elisabetano por 10 dias",
        proximoRetorno: "2024-01-28",
      },
    ],
  });

  useEffect(() => {
    // TODO: Buscar dados do usuário do Supabase
    setNomeUsuario("Maria Silva");
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmado: "success",
      pendente: "warning",
      cancelado: "danger",
      realizado: "info",
    };
    return variants[status] || "secondary";
  };

  const getStatusLabel = (status) => {
    const labels = {
      confirmado: "Confirmado",
      pendente: "Pendente",
      cancelado: "Cancelado",
      realizado: "Realizado",
    };
    return labels[status] || status;
  };

  const handleJoinTelemedicina = (appointment) => {
    // TODO: Implementar integração com sistema de telemedicina
    alert(`Iniciando chamada de telemedicina para ${appointment.pet}...`);
  };

  const handleCancelAppointment = (appointment) => {
    if (
      window.confirm(
        `Tem certeza que deseja cancelar a consulta de ${appointment.pet}?`
      )
    ) {
      // TODO: Implementar cancelamento via API
      alert("Consulta cancelada com sucesso!");
    }
  };

  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAddModal(true);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const totalGasto = agendamentos.completos.reduce(
    (sum, apt) => sum + apt.valor,
    0
  );
  const mediaMensal = totalGasto / 12; // Simulando 12 meses
  const totalConsultas = agendamentos.completos.length;

  return (
    <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  <FaCalendarAlt className="me-2" />
                  Meus Agendamentos
                </h2>
                <p className="text-muted mb-0">
                  Gerencie suas consultas, vacinas e procedimentos veterinários
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <FaPlus className="me-2" />
                Novo Agendamento
              </Button>
            </div>
          </Col>
        </Row>

        {/* Resumo Financeiro */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Total Gasto</h6>
                    <h4 className="fw-bold text-primary mb-0">
                      {formatCurrency(totalGasto)}
                    </h4>
                  </div>
                  <div className="text-primary">
                    <FaMoneyBill size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Média Mensal</h6>
                    <h4 className="fw-bold text-success mb-0">
                      {formatCurrency(mediaMensal)}
                    </h4>
                  </div>
                  <div className="text-success">
                    <FaChartBar size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Total Consultas</h6>
                    <h4 className="fw-bold text-info mb-0">{totalConsultas}</h4>
                  </div>
                  <div className="text-info">
                    <FaFileMedical size={24} />
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
                <Nav.Link eventKey="pendentes">
                  <FaClock className="me-2" />
                  Pendentes ({agendamentos.pendentes.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="completos">
                  <FaCheckCircle className="me-2" />
                  Completos ({agendamentos.completos.length})
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        {/* Conteúdo das Abas */}
        <Tab.Content>
          {/* Aba Pendentes */}
          <Tab.Pane active={activeTab === "pendentes"}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <Table responsive className="table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Data/Hora</th>
                      <th>Pet</th>
                      <th>Tipo</th>
                      <th>Veterinário</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.pendentes.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <div>
                            <strong>{formatDate(appointment.data)}</strong>
                            <br />
                            <small className="text-muted">
                              {appointment.horario}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FaPaw className="text-primary" />
                            <span className="fw-semibold">
                              {appointment.pet}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <span className="fw-semibold">
                              {appointment.tipo}
                            </span>
                            {appointment.isTelemedicina && (
                              <Badge bg="info" className="ms-2">
                                <FaVideo className="me-1" />
                                Telemedicina
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FaUser className="text-muted" />
                            <span>{appointment.veterinario}</span>
                          </div>
                        </td>
                        <td>
                          <span className="fw-semibold text-success">
                            {formatCurrency(appointment.valor)}
                          </span>
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(appointment.status)}>
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {appointment.isTelemedicina && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  handleJoinTelemedicina(appointment)
                                }
                                title="Entrar na Telemedicina"
                              >
                                <FaVideo />
                              </Button>
                            )}
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleViewDetails(appointment)}
                              title="Ver Detalhes"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() =>
                                handleRescheduleAppointment(appointment)
                              }
                              title="Reagendar"
                            >
                              <FaCalendarAlt />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                handleCancelAppointment(appointment)
                              }
                              title="Cancelar"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Aba Completos */}
          <Tab.Pane active={activeTab === "completos"}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <Table responsive className="table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Data/Hora</th>
                      <th>Pet</th>
                      <th>Tipo</th>
                      <th>Veterinário</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.completos.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <div>
                            <strong>{formatDate(appointment.data)}</strong>
                            <br />
                            <small className="text-muted">
                              {appointment.horario}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FaPaw className="text-primary" />
                            <span className="fw-semibold">
                              {appointment.pet}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="fw-semibold">
                            {appointment.tipo}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FaUser className="text-muted" />
                            <span>{appointment.veterinario}</span>
                          </div>
                        </td>
                        <td>
                          <span className="fw-semibold text-success">
                            {formatCurrency(appointment.valor)}
                          </span>
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(appointment.status)}>
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleViewDetails(appointment)}
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
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Compartilhar"
                            >
                              <FaShare />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
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
              <FaCalendarAlt className="me-2" />
              Detalhes da Consulta
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <div>
                <Row>
                  <Col md={6}>
                    <h6 className="fw-bold">Informações Básicas</h6>
                    <div className="mb-3">
                      <strong>Pet:</strong> {selectedAppointment.pet}
                    </div>
                    <div className="mb-3">
                      <strong>Tipo:</strong> {selectedAppointment.tipo}
                    </div>
                    <div className="mb-3">
                      <strong>Data:</strong>{" "}
                      {formatDate(selectedAppointment.data)}
                    </div>
                    <div className="mb-3">
                      <strong>Horário:</strong> {selectedAppointment.horario}
                    </div>
                    <div className="mb-3">
                      <strong>Veterinário:</strong>{" "}
                      {selectedAppointment.veterinario}
                    </div>
                    <div className="mb-3">
                      <strong>Valor:</strong>{" "}
                      {formatCurrency(selectedAppointment.valor)}
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold">Local</h6>
                    <div className="mb-3">
                      <strong>Clínica:</strong> {selectedAppointment.clinica}
                    </div>
                    <div className="mb-3">
                      <strong>Endereço:</strong> {selectedAppointment.endereco}
                    </div>
                    <div className="mb-3">
                      <strong>Telefone:</strong> {selectedAppointment.telefone}
                    </div>
                    <div className="mb-3">
                      <strong>WhatsApp:</strong> {selectedAppointment.whatsapp}
                    </div>
                  </Col>
                </Row>

                <hr />

                <div className="mb-3">
                  <h6 className="fw-bold">Observações</h6>
                  <p>{selectedAppointment.observacoes}</p>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold">Sintomas/Queixa</h6>
                  <p>{selectedAppointment.sintomas}</p>
                </div>

                {selectedAppointment.diagnostico && (
                  <div className="mb-3">
                    <h6 className="fw-bold">Diagnóstico</h6>
                    <p>{selectedAppointment.diagnostico}</p>
                  </div>
                )}

                {selectedAppointment.prescricao && (
                  <div className="mb-3">
                    <h6 className="fw-bold">Prescrição</h6>
                    <p>{selectedAppointment.prescricao}</p>
                  </div>
                )}

                {selectedAppointment.proximoRetorno && (
                  <div className="mb-3">
                    <h6 className="fw-bold">Próximo Retorno</h6>
                    <p>{formatDate(selectedAppointment.proximoRetorno)}</p>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <Button variant="outline-primary">
                    <FaPhone className="me-2" />
                    Ligar para Clínica
                  </Button>
                  <Button variant="outline-success">
                    <FaWhatsapp className="me-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline-info">
                    <FaMapMarkerAlt className="me-2" />
                    Ver Localização
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Modal Novo Agendamento */}
        <Modal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaPlus className="me-2" />
              Novo Agendamento
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pet *</Form.Label>
                    <Form.Select>
                      <option value="">Selecione o pet</option>
                      <option value="thor">Thor</option>
                      <option value="luna">Luna</option>
                      <option value="max">Max</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Consulta *</Form.Label>
                    <Form.Select>
                      <option value="">Selecione o tipo</option>
                      <option value="rotina">Consulta de Rotina</option>
                      <option value="emergencia">Emergência</option>
                      <option value="vacina">Vacinação</option>
                      <option value="cirurgia">Cirurgia</option>
                      <option value="exame">Exame</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data *</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Horário *</Form.Label>
                    <Form.Control type="time" />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Descreva os sintomas ou motivo da consulta..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Preferência por telemedicina (quando disponível)"
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
              Agendar Consulta
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default AgendamentosPage;
