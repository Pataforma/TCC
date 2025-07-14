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
  Dropdown,
} from "react-bootstrap";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaPaw,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaWeight,
  FaRuler,
  FaSyringe,
  FaFileMedical,
  FaPills,
  FaMicroscope,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
} from "react-icons/fa";

const DashboardVeterinarioPacientes = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [activeTab, setActiveTab] = useState("geral");

  // Dados mockados dos pacientes
  const [pacientes] = useState([
    {
      id: 1,
      nome: "Rex",
      especie: "Cão",
      raca: "Golden Retriever",
      idade: 3,
      peso: 28.5,
      tutor: "Maria Silva",
      telefone: "(11) 99999-9999",
      email: "maria@email.com",
      ultimaConsulta: "2024-01-10",
      proximaConsulta: "2024-01-20",
      status: "ativo",
      historico: [
        {
          data: "2024-01-10",
          tipo: "Consulta de Rotina",
          diagnostico: "Pet saudável",
          prescricao: "Manter alimentação atual",
        },
        {
          data: "2023-12-15",
          tipo: "Vacinação",
          diagnostico: "Vacina aplicada",
          prescricao: "Retornar em 1 ano",
        },
      ],
      vacinas: [
        { nome: "V10", data: "2023-12-15", proxima: "2024-12-15" },
        { nome: "Antirrábica", data: "2023-12-15", proxima: "2024-12-15" },
      ],
      exames: [
        { nome: "Hemograma", data: "2024-01-10", resultado: "Normal" },
        { nome: "Bioquímico", data: "2024-01-10", resultado: "Normal" },
      ],
    },
    {
      id: 2,
      nome: "Luna",
      especie: "Gato",
      raca: "Siamês",
      idade: 2,
      peso: 4.2,
      tutor: "João Santos",
      telefone: "(11) 88888-8888",
      email: "joao@email.com",
      ultimaConsulta: "2024-01-08",
      proximaConsulta: "2024-01-25",
      status: "ativo",
      historico: [
        {
          data: "2024-01-08",
          tipo: "Consulta de Rotina",
          diagnostico: "Pet saudável",
          prescricao: "Continuar com ração premium",
        },
      ],
      vacinas: [{ nome: "V4", data: "2023-11-20", proxima: "2024-11-20" }],
      exames: [],
    },
    {
      id: 3,
      nome: "Thor",
      especie: "Cão",
      raca: "Pastor Alemão",
      idade: 5,
      peso: 35.0,
      tutor: "Ana Costa",
      telefone: "(11) 77777-7777",
      email: "ana@email.com",
      ultimaConsulta: "2024-01-05",
      proximaConsulta: "2024-01-30",
      status: "inativo",
      historico: [
        {
          data: "2024-01-05",
          tipo: "Exame",
          diagnostico: "Problema cardíaco leve",
          prescricao: "Medicação cardíaca",
        },
      ],
      vacinas: [{ nome: "V10", data: "2023-10-10", proxima: "2024-10-10" }],
      exames: [
        {
          nome: "Eletrocardiograma",
          data: "2024-01-05",
          resultado: "Arritmia leve",
        },
      ],
    },
  ]);

  const getStatusBadge = (status) => {
    const variants = {
      ativo: "success",
      inativo: "secondary",
      pendente: "warning",
    };

    const labels = {
      ativo: "Ativo",
      inativo: "Inativo",
      pendente: "Pendente",
    };

    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const handlePacienteClick = (paciente) => {
    setSelectedPaciente(paciente);
    setShowModal(true);
  };

  const filteredPacientes = pacientes.filter((paciente) => {
    const matchesSearch =
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.raca.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "todos" || paciente.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario="Dr. André Silva">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Pacientes</h2>
            <p className="text-muted mb-0">
              Gerencie o cadastro e histórico dos seus pacientes
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm">
              <FaDownload className="me-2" />
              Exportar
            </Button>
            <Button variant="primary" size="sm">
              <FaPlus className="me-2" />
              Novo Paciente
            </Button>
          </div>
        </div>

        {/* Busca Avançada */}
        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
          <Card.Body className="p-4">
            <Row className="g-3">
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nome do pet, tutor ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" size="sm">
                    <FaFilter className="me-2" />
                    Filtros Avançados
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <FaDownload className="me-2" />
                    Exportar
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Filtros Rápidos */}
            <Row className="mt-3">
              <Col xs={12}>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant={
                      filterStatus === "todos" ? "primary" : "outline-primary"
                    }
                    size="sm"
                    onClick={() => setFilterStatus("todos")}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={
                      filterStatus === "ativo" ? "success" : "outline-success"
                    }
                    size="sm"
                    onClick={() => setFilterStatus("ativo")}
                  >
                    Ativos
                  </Button>
                  <Button
                    variant={
                      filterStatus === "inativo"
                        ? "secondary"
                        : "outline-secondary"
                    }
                    size="sm"
                    onClick={() => setFilterStatus("inativo")}
                  >
                    Inativos
                  </Button>
                  <Button variant="outline-warning" size="sm">
                    Requer Atenção
                  </Button>
                  <Button variant="outline-info" size="sm">
                    Vacina Pendente
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabela de Pacientes */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <Card.Header className="bg-white border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-semibold text-dark mb-0">
                Lista de Pacientes ({filteredPacientes.length})
              </h5>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" size="sm">
                  <FaDownload className="me-2" />
                  CSV
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <FaDownload className="me-2" />
                  PDF
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">Paciente</th>
                  <th className="border-0">Tutor</th>
                  <th className="border-0">Espécie/Raça</th>
                  <th className="border-0">Idade</th>
                  <th className="border-0">Última Consulta</th>
                  <th className="border-0">Próxima Consulta</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.map((paciente) => (
                  <tr
                    key={paciente.id}
                    className="cursor-pointer"
                    onClick={() => handlePacienteClick(paciente)}
                  >
                    <td className="align-middle">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle"
                          style={{ width: 40, height: 40 }}
                        >
                          <FaPaw size={16} />
                        </div>
                        <div>
                          <div className="fw-semibold">{paciente.nome}</div>
                          <small className="text-muted">
                            ID: {paciente.id}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">
                      <div>{paciente.tutor}</div>
                      <small className="text-muted">{paciente.telefone}</small>
                    </td>
                    <td className="align-middle">
                      <div>{paciente.especie}</div>
                      <small className="text-muted">{paciente.raca}</small>
                    </td>
                    <td className="align-middle">
                      <div>{paciente.idade} anos</div>
                      <small className="text-muted">{paciente.peso} kg</small>
                    </td>
                    <td className="align-middle">
                      <div>{formatarData(paciente.ultimaConsulta)}</div>
                    </td>
                    <td className="align-middle">
                      <div>{formatarData(paciente.proximaConsulta)}</div>
                    </td>
                    <td className="align-middle">
                      {getStatusBadge(paciente.status)}
                    </td>
                    <td className="align-middle">
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          title="Ver detalhes"
                        >
                          <FaEye size={12} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          title="Editar"
                        >
                          <FaEdit size={12} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          title="Excluir"
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
      </div>

      {/* Modal de Detalhes do Paciente */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-semibold">
            <FaPaw className="me-2 text-primary" />
            Ficha do Paciente
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPaciente && (
            <div>
              {/* Informações Básicas */}
              <div className="row g-4 mb-4">
                <div className="col-md-8">
                  <div className="d-flex align-items-center gap-4">
                    <div
                      className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle"
                      style={{ width: 80, height: 80 }}
                    >
                      <FaPaw size={32} />
                    </div>
                    <div>
                      <h3 className="fw-bold mb-1">{selectedPaciente.nome}</h3>
                      <p className="text-muted mb-2">
                        {selectedPaciente.especie} • {selectedPaciente.raca}
                      </p>
                      <div className="d-flex gap-3">
                        <div>
                          <small className="text-muted">Idade</small>
                          <div className="fw-semibold">
                            {selectedPaciente.idade} anos
                          </div>
                        </div>
                        <div>
                          <small className="text-muted">Peso</small>
                          <div className="fw-semibold">
                            {selectedPaciente.peso} kg
                          </div>
                        </div>
                        <div>
                          <small className="text-muted">Status</small>
                          <div>{getStatusBadge(selectedPaciente.status)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-semibold mb-3">Informações do Tutor</h6>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FaUser className="text-muted" />
                        <span>{selectedPaciente.tutor}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FaPhone className="text-muted" />
                        <span>{selectedPaciente.telefone}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FaEnvelope className="text-muted" />
                        <span>{selectedPaciente.email}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              {/* Abas de Informações */}
              <Nav
                variant="tabs"
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="mb-4"
              >
                <Nav.Item>
                  <Nav.Link eventKey="geral">Informações Gerais</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="historico">Histórico Clínico</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="vacinas">Carteira de Vacinas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="exames">Exames</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane active={activeTab === "geral"}>
                  <Row className="g-4">
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="fw-semibold mb-3">Dados Físicos</h6>
                          <div className="row g-3">
                            <div className="col-6">
                              <small className="text-muted">Espécie</small>
                              <div className="fw-semibold">
                                {selectedPaciente.especie}
                              </div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Raça</small>
                              <div className="fw-semibold">
                                {selectedPaciente.raca}
                              </div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Idade</small>
                              <div className="fw-semibold">
                                {selectedPaciente.idade} anos
                              </div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Peso</small>
                              <div className="fw-semibold">
                                {selectedPaciente.peso} kg
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="fw-semibold mb-3">
                            Próximas Consultas
                          </h6>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <FaCalendarAlt className="text-primary" />
                            <span>
                              Próxima consulta:{" "}
                              {formatarData(selectedPaciente.proximaConsulta)}
                            </span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <FaCalendarAlt className="text-muted" />
                            <span>
                              Última consulta:{" "}
                              {formatarData(selectedPaciente.ultimaConsulta)}
                            </span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane active={activeTab === "historico"}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-semibold mb-3">Histórico Clínico</h6>
                      {selectedPaciente.historico.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {selectedPaciente.historico.map((consulta, index) => (
                            <div
                              key={index}
                              className="border rounded p-3 bg-white"
                            >
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="fw-semibold mb-0">
                                  {consulta.tipo}
                                </h6>
                                <small className="text-muted">
                                  {formatarData(consulta.data)}
                                </small>
                              </div>
                              <div className="mb-2">
                                <small className="text-muted">
                                  Diagnóstico:
                                </small>
                                <div>{consulta.diagnostico}</div>
                              </div>
                              <div>
                                <small className="text-muted">
                                  Prescrição:
                                </small>
                                <div>{consulta.prescricao}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">
                          Nenhum histórico encontrado.
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane active={activeTab === "vacinas"}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-semibold mb-3">Carteira de Vacinas</h6>
                      {selectedPaciente.vacinas.length > 0 ? (
                        <Table className="mb-0">
                          <thead>
                            <tr>
                              <th>Vacina</th>
                              <th>Data Aplicação</th>
                              <th>Próxima Dose</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedPaciente.vacinas.map((vacina, index) => (
                              <tr key={index}>
                                <td>{vacina.nome}</td>
                                <td>{formatarData(vacina.data)}</td>
                                <td>{formatarData(vacina.proxima)}</td>
                                <td>
                                  <Badge bg="success">Em dia</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p className="text-muted">Nenhuma vacina registrada.</p>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane active={activeTab === "exames"}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6 className="fw-semibold mb-3">Exames Realizados</h6>
                      {selectedPaciente.exames.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {selectedPaciente.exames.map((exame, index) => (
                            <div
                              key={index}
                              className="border rounded p-3 bg-white"
                            >
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="fw-semibold mb-0">
                                  {exame.nome}
                                </h6>
                                <small className="text-muted">
                                  {formatarData(exame.data)}
                                </small>
                              </div>
                              <div>
                                <small className="text-muted">Resultado:</small>
                                <div>{exame.resultado}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">Nenhum exame registrado.</p>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
          <Button variant="outline-primary">
            <FaEdit className="me-2" />
            Editar Paciente
          </Button>
          <Button variant="primary">
            <FaPlus className="me-2" />
            Nova Consulta
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default DashboardVeterinarioPacientes;
