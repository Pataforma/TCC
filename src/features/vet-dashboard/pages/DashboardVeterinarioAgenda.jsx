import React, { useState, useEffect } from "react";
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
} from "react-bootstrap";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { supabase } from "../../../utils/supabase";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPaw,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaVideo,
  FaCheckCircle,
  FaTimes,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaList,
  FaTasks,
  FaBell,
  FaSave,
  FaTrash,
} from "react-icons/fa";

const DashboardVeterinarioAgenda = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConsultaModal, setShowConsultaModal] = useState(false);
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("semana");
  const [activeView, setActiveView] = useState("agenda");
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [novaConsulta, setNovaConsulta] = useState({
    paciente_id: "",
    tutor_id: "",
    data_consulta: "",
    horario: "",
    duracao: 30,
    tipo: "Consulta de Rotina",
    observacoes: "",
    status: "pendente",
  });

  // Dados mockados das tarefas
  const [tarefas] = useState([
    {
      id: 1,
      titulo: "Ligar para Maria Silva sobre Rex",
      descricao: "Confirmar horário da consulta de amanhã",
      prioridade: "alta",
      status: "pendente",
      data: "2024-01-15",
      hora: "10:00",
    },
    {
      id: 2,
      titulo: "Revisar exames do Thor",
      descricao: "Analisar resultados do hemograma",
      prioridade: "media",
      status: "pendente",
      data: "2024-01-15",
      hora: "14:00",
    },
    {
      id: 3,
      titulo: "Follow-up Luna",
      descricao: "Verificar se a vacina fez efeito",
      prioridade: "baixa",
      status: "concluida",
      data: "2024-01-14",
      hora: "16:00",
    },
  ]);

  // Carregar dados do Supabase
  useEffect(() => {
    fetchConsultas();
    fetchPacientes();
    fetchTutores();
  }, []);

  const fetchConsultas = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("consultas")
        .select(
          `
          *,
          pacientes: paciente_id (nome, especie, raca),
          tutores: tutor_id (nome, telefone, email)
        `
        )
        .eq("veterinario_id", session.user.id)
        .order("data_consulta", { ascending: true });

      if (error) throw error;
      setConsultas(data || []);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
    }
  };

  const fetchPacientes = async () => {
    try {
      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .order("nome");

      if (error) throw error;
      setPacientes(data || []);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  };

  const fetchTutores = async () => {
    try {
      const { data, error } = await supabase
        .from("tutores")
        .select("*")
        .order("nome");

      if (error) throw error;
      setTutores(data || []);
    } catch (error) {
      console.error("Erro ao carregar tutores:", error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmada: "success",
      pendente: "warning",
      cancelada: "danger",
    };

    const labels = {
      confirmada: "Confirmada",
      pendente: "Pendente",
      cancelada: "Cancelada",
    };

    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const handleConsultaClick = (consulta) => {
    setSelectedConsulta(consulta);
    setShowModal(true);
  };

  const handleNovaConsulta = () => {
    setNovaConsulta({
      paciente_id: "",
      tutor_id: "",
      data_consulta: "",
      horario: "",
      duracao: 30,
      tipo: "Consulta de Rotina",
      observacoes: "",
      status: "pendente",
    });
    setShowConsultaModal(true);
  };

  const handleSalvarConsulta = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão expirada");

      const consultaData = {
        ...novaConsulta,
        veterinario_id: session.user.id,
        data_criacao: new Date().toISOString(),
      };

      const { error } = await supabase.from("consultas").insert(consultaData);

      if (error) throw error;

      setShowConsultaModal(false);
      fetchConsultas();
      alert("Consulta criada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      alert("Erro ao salvar consulta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirConsulta = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta consulta?")) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("consultas").delete().eq("id", id);

      if (error) throw error;

      fetchConsultas();
      setShowModal(false);
      alert("Consulta excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir consulta:", error);
      alert("Erro ao excluir consulta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarTeleconsulta = () => {
    // Implementar lógica de teleconsulta
    alert("Iniciando teleconsulta...");
    setShowModal(false);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const gerarHorarios = () => {
    const horarios = [];
    for (let i = 8; i <= 18; i++) {
      horarios.push(`${i.toString().padStart(2, "0")}:00`);
      if (i < 18) horarios.push(`${i.toString().padStart(2, "0")}:30`);
    }
    return horarios;
  };

  const horarios = gerarHorarios();

  const consultasPorHorario = (horario) => {
    return consultas.filter((consulta) => consulta.horario === horario);
  };

  const formatarDataConsulta = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario="Dr. André Silva">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Agenda</h2>
            <p className="text-muted mb-0">
              Gerencie suas consultas e compromissos
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleNovaConsulta}
            >
              <FaPlus className="me-2" />
              Nova Consulta
            </Button>
            <Button variant="primary" size="sm">
              <FaCalendarAlt className="me-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Navegação de Períodos */}
        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-3">
                <Button variant="outline-secondary" size="sm">
                  <FaChevronLeft />
                </Button>
                <h5 className="fw-semibold text-dark mb-0">
                  {formatarData(currentDate)}
                </h5>
                <Button variant="outline-secondary" size="sm">
                  <FaChevronRight />
                </Button>
              </div>

              <Nav
                variant="pills"
                activeKey={activeTab}
                onSelect={setActiveTab}
              >
                <Nav.Item>
                  <Nav.Link eventKey="dia" className="rounded-pill">
                    Dia
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="semana" className="rounded-pill">
                    Semana
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="mes" className="rounded-pill">
                    Mês
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>

            {/* Calendário */}
            <div className="border rounded-3" style={{ minHeight: 600 }}>
              <div className="d-flex">
                {/* Coluna de Horários */}
                <div style={{ width: 80, borderRight: "1px solid #dee2e6" }}>
                  <div className="p-3 bg-light border-bottom">
                    <small className="text-muted fw-semibold">Horário</small>
                  </div>
                  {horarios.map((horario) => (
                    <div
                      key={horario}
                      className="p-2 border-bottom d-flex align-items-center justify-content-center"
                      style={{ height: 60, fontSize: 12 }}
                    >
                      {horario}
                    </div>
                  ))}
                </div>

                {/* Grade de Consultas */}
                <div className="flex-grow-1">
                  <div className="p-3 bg-light border-bottom">
                    <small className="text-muted fw-semibold">Consultas</small>
                  </div>
                  {horarios.map((horario) => (
                    <div
                      key={horario}
                      className="p-2 border-bottom position-relative"
                      style={{ height: 60 }}
                    >
                      {consultasPorHorario(horario).map((consulta) => (
                        <div
                          key={consulta.id}
                          className="position-absolute w-100 h-100 p-2"
                          style={{ top: 0, left: 0 }}
                        >
                          <Card
                            className="h-100 border-0 shadow-sm cursor-pointer"
                            style={{
                              backgroundColor:
                                consulta.status === "confirmada"
                                  ? "#d1ecf1"
                                  : "#fff3cd",
                              borderRadius: 8,
                              cursor: "pointer",
                            }}
                            onClick={() => handleConsultaClick(consulta)}
                          >
                            <Card.Body className="p-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6
                                    className="fw-semibold mb-1"
                                    style={{ fontSize: 12 }}
                                  >
                                    {consulta.paciente}
                                  </h6>
                                  <p
                                    className="mb-0 text-muted"
                                    style={{ fontSize: 10 }}
                                  >
                                    {consulta.tipo}
                                  </p>
                                </div>
                                {getStatusBadge(consulta.status)}
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Lista de Consultas */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <Card.Header className="bg-white border-0">
            <h5 className="fw-semibold text-dark mb-0">Próximas Consultas</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">Horário</th>
                  <th className="border-0">Paciente</th>
                  <th className="border-0">Tutor</th>
                  <th className="border-0">Tipo</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Ações</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map((consulta) => (
                  <tr
                    key={consulta.id}
                    className="cursor-pointer"
                    onClick={() => handleConsultaClick(consulta)}
                  >
                    <td className="align-middle">
                      <div className="fw-semibold">{consulta.horario}</div>
                      <small className="text-muted">
                        {formatarDataConsulta(consulta.data_consulta)} •{" "}
                        {consulta.duracao}min
                      </small>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle"
                          style={{ width: 32, height: 32 }}
                        >
                          <FaPaw size={12} />
                        </div>
                        <div>
                          <div className="fw-semibold">
                            {consulta.pacientes?.nome || "N/A"}
                          </div>
                          <small className="text-muted">
                            {consulta.pacientes?.especie} -{" "}
                            {consulta.pacientes?.raca}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">
                      <div>{consulta.tutores?.nome || "N/A"}</div>
                      <small className="text-muted">
                        {consulta.tutores?.telefone}
                      </small>
                    </td>
                    <td className="align-middle">
                      <span className="badge bg-light text-dark">
                        {consulta.tipo}
                      </span>
                    </td>
                    <td className="align-middle">
                      {getStatusBadge(consulta.status)}
                    </td>
                    <td className="align-middle">
                      <div className="d-flex gap-1">
                        <Button variant="outline-primary" size="sm">
                          <FaVideo size={12} />
                        </Button>
                        <Button variant="outline-success" size="sm">
                          <FaCheckCircle size={12} />
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

      {/* Modal de Detalhes da Consulta */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-semibold">
            <FaCalendarAlt className="me-2 text-primary" />
            Detalhes da Consulta
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedConsulta && (
            <div className="row g-4">
              <div className="col-md-6">
                <h6 className="fw-semibold text-dark mb-3">
                  Informações do Paciente
                </h6>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle"
                    style={{ width: 48, height: 48 }}
                  >
                    <FaPaw size={20} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">
                      {selectedConsulta.pacientes?.nome || "N/A"}
                    </h5>
                    <p className="text-muted mb-0">
                      {selectedConsulta.pacientes?.especie} -{" "}
                      {selectedConsulta.pacientes?.raca}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Tutor</label>
                  <div className="d-flex align-items-center gap-2">
                    <FaUser className="text-muted" />
                    <span>{selectedConsulta.tutores?.nome || "N/A"}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Contato</label>
                  <div className="d-flex flex-column gap-1">
                    <div className="d-flex align-items-center gap-2">
                      <FaPhone className="text-muted" size={12} />
                      <span>{selectedConsulta.tutores?.telefone || "N/A"}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaEnvelope className="text-muted" size={12} />
                      <span>{selectedConsulta.tutores?.email || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <h6 className="fw-semibold text-dark mb-3">
                  Detalhes da Consulta
                </h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Data e Horário
                  </label>
                  <div className="d-flex align-items-center gap-2">
                    <FaClock className="text-muted" />
                    <span>
                      {formatarDataConsulta(selectedConsulta.data_consulta)} às{" "}
                      {selectedConsulta.horario} ({selectedConsulta.duracao}{" "}
                      min)
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Tipo</label>
                  <div>
                    <Badge bg="primary">{selectedConsulta.tipo}</Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Status</label>
                  <div>{getStatusBadge(selectedConsulta.status)}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Observações</label>
                  <p className="text-muted mb-0">
                    {selectedConsulta.observacoes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="danger"
            onClick={() => handleExcluirConsulta(selectedConsulta.id)}
            disabled={loading}
          >
            <FaTrash className="me-2" />
            Excluir
          </Button>
          <div className="ms-auto">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <FaTimes className="me-2" />
              Fechar
            </Button>
            <Button variant="success" className="ms-2">
              <FaCheckCircle className="me-2" />
              Confirmar
            </Button>
            <Button
              variant="primary"
              onClick={handleIniciarTeleconsulta}
              className="ms-2"
            >
              <FaVideo className="me-2" />
              Iniciar Teleconsulta
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Modal para Nova Consulta */}
      <Modal
        show={showConsultaModal}
        onHide={() => setShowConsultaModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-semibold">
            <FaPlus className="me-2 text-primary" />
            Nova Consulta
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Paciente</Form.Label>
                  <Form.Select
                    value={novaConsulta.paciente_id}
                    onChange={(e) =>
                      setNovaConsulta({
                        ...novaConsulta,
                        paciente_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Selecione um paciente</option>
                    {pacientes.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome} ({paciente.especie})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Tutor</Form.Label>
                  <Form.Select
                    value={novaConsulta.tutor_id}
                    onChange={(e) =>
                      setNovaConsulta({
                        ...novaConsulta,
                        tutor_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Selecione um tutor</option>
                    {tutores.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Data da Consulta</Form.Label>
                  <Form.Control
                    type="date"
                    value={novaConsulta.data_consulta}
                    onChange={(e) =>
                      setNovaConsulta({
                        ...novaConsulta,
                        data_consulta: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Horário</Form.Label>
                  <Form.Control
                    type="time"
                    value={novaConsulta.horario}
                    onChange={(e) =>
                      setNovaConsulta({
                        ...novaConsulta,
                        horario: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Duração (minutos)</Form.Label>
                  <Form.Control
                    type="number"
                    value={novaConsulta.duracao}
                    onChange={(e) =>
                      setNovaConsulta({
                        ...novaConsulta,
                        duracao: parseInt(e.target.value),
                      })
                    }
                    min="15"
                    max="120"
                    step="15"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Tipo de Consulta</Form.Label>
                  <Form.Select
                    value={novaConsulta.tipo}
                    onChange={(e) =>
                      setNovaConsulta({ ...novaConsulta, tipo: e.target.value })
                    }
                    required
                  >
                    <option value="Consulta de Rotina">
                      Consulta de Rotina
                    </option>
                    <option value="Vacinação">Vacinação</option>
                    <option value="Exame">Exame</option>
                    <option value="Consulta de Emergência">
                      Consulta de Emergência
                    </option>
                    <option value="Cirurgia">Cirurgia</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-12">
                <Form.Group>
                  <Form.Label>Observações</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={novaConsulta.observacoes}
                    onChange={(e) =>
                      setNovaConsulta({
                        ...novaConsulta,
                        observacoes: e.target.value,
                      })
                    }
                    placeholder="Descreva os sintomas ou motivo da consulta..."
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            onClick={() => setShowConsultaModal(false)}
          >
            <FaTimes className="me-2" />
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSalvarConsulta}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              <FaSave className="me-2" />
            )}
            Salvar Consulta
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default DashboardVeterinarioAgenda;
