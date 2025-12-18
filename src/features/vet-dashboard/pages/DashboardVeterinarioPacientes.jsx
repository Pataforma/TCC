import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { useUser } from "../../../contexts/UserContext";
import ModalEditarPaciente from "../components/ModalEditarPaciente";
import { api } from "../../../utils/api";
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
  FaTimes,
  FaChevronLeft,
} from "react-icons/fa";

const DashboardVeterinarioPacientes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [activeTab, setActiveTab] = useState("geral");
  const [loading, setLoading] = useState(false);

  // Sistema de modais empilhados
  const [modalStack, setModalStack] = useState([]);
  const sidebarRef = useRef(null);

  // Dados dos pacientes carregados do banco
  const [pacientes, setPacientes] = useState([]);

  // Carregar pacientes do banco de dados
  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      setLoading(true);

      // Buscar pacientes via API
      const pacientesData = await api.get("/pacientes");

      if (!pacientesData) {
        console.error("Erro ao carregar pacientes: dados vazios");
        setPacientes([]);
        return;
      }

      // Formatar dados para o formato esperado pelo componente
      const pacientesFormatados = (pacientesData || []).map((p) => ({
        ...p,
        tutor: p.tutor_id ? {
          nome: p.tutor_nome || "N/A",
          telefone: p.tutor_telefone || "",
          email: p.tutor_email || "",
        } : null,
      }));

      setPacientes(pacientesFormatados);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePacienteCriado = (novoPaciente) => {
    // Recarregar a lista de pacientes
    carregarPacientes();
  };

  // Função para calcular idade baseada na data de nascimento
  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return null;

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    const diffAnos = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      return diffAnos - 1;
    }

    return diffAnos;
  };

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

  // Funções para gerenciar sidebar
  const handlePacienteClick = (paciente) => {
    setSelectedPaciente(paciente);
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setSelectedPaciente(null);
    setActiveTab("geral");
    // Fechar todos os modais quando fecha o sidebar
    setModalStack([]);
  };

  // Funções para gerenciar modais empilhados
  const openModal = (type, data = {}) => {
    setModalStack((prev) => {
      // Verificar se já existe um modal do mesmo tipo aberto
      const existingModal = prev.find(modal => modal.type === type);
      if (existingModal) {
        // Se já existe, não adiciona outro
        return prev;
      }
      // Limitar a 3 modais empilhados
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, { type, data, id: Date.now() }];
    });
  };

  const closeModal = () => {
    setModalStack((prev) => prev.slice(0, -1));
  };

  const closeAllModals = () => {
    setModalStack([]);
  };

  // Fechar sidebar ao clicar no overlay
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Só fecha se não houver modais abertos
        if (modalStack.length === 0) {
          closeSidebar();
        }
      }
    };

    if (showSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevenir scroll do body quando sidebar está aberto
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showSidebar, modalStack.length]);

  const handleExcluirPaciente = async (pacienteId) => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/pacientes/${pacienteId}`);

      // Recarregar a lista de pacientes
      await carregarPacientes();
      alert("Paciente excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      alert("Erro ao excluir paciente: " + (error.message || "Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter((paciente) => {
    const matchesSearch =
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paciente.tutor?.nome || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (paciente.tutor?.telefone || "").includes(searchTerm);

    const matchesFilter =
      filterStatus === "todos" || paciente.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const { user } = useUser();

  return (
    <DashboardLayout
      tipoUsuario="veterinario"
      nomeUsuario={user?.nome}
      sidebarBlurred={showSidebar}
    >
      <div className="container-fluid">
        {/* Header Compacto */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "24px" }}>
              {location.pathname.includes("/prontuarios")
                ? "Prontuários"
                : "Pacientes"}
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              {location.pathname.includes("/prontuarios")
                ? "Acesse os prontuários médicos dos seus pacientes"
                : "Gerencie o cadastro e histórico dos seus pacientes"}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              style={{ borderColor: "#e9ecef", color: "#6c757d" }}
            >
              <FaDownload className="me-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Busca e Filtros Compactos */}
        <Card className="border mb-3" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
          <Card.Body className="p-3">
            <Row className="g-2">
              <Col md={8}>
                <InputGroup size="sm">
                  <InputGroup.Text className="bg-white border-end-0" style={{ borderColor: "#e9ecef" }}>
                    <FaSearch className="text-muted" style={{ fontSize: "14px" }} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nome do pet, tutor ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                    style={{ fontSize: "14px", borderColor: "#e9ecef" }}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    style={{ borderColor: "#e9ecef", color: "#6c757d", fontSize: "13px" }}
                  >
                    <FaFilter className="me-2" />
                    Filtros
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Filtros Rápidos */}
            <div className="d-flex flex-wrap gap-2 mt-2">
              <Button
                variant={filterStatus === "todos" ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => setFilterStatus("todos")}
                style={{
                  fontSize: "12px",
                  ...(filterStatus === "todos" ? {} : { borderColor: "#e9ecef", color: "#6c757d" })
                }}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === "ativo" ? "success" : "outline-secondary"}
                size="sm"
                onClick={() => setFilterStatus("ativo")}
                style={{
                  fontSize: "12px",
                  ...(filterStatus === "ativo" ? {} : { borderColor: "#e9ecef", color: "#6c757d" })
                }}
              >
                Ativos
              </Button>
              <Button
                variant={filterStatus === "inativo" ? "secondary" : "outline-secondary"}
                size="sm"
                onClick={() => setFilterStatus("inativo")}
                style={{
                  fontSize: "12px",
                  ...(filterStatus === "inativo" ? {} : { borderColor: "#e9ecef", color: "#6c757d" })
                }}
              >
                Inativos
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Tabela Compacta de Pacientes */}
        <Card className="border" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
          <Card.Header
            className="bg-white border-0 pb-2"
            style={{ borderBottom: "1px solid #e9ecef" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "15px" }}>
                Lista de Pacientes ({filteredPacientes.length})
              </h6>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <Table hover className="mb-0" style={{ fontSize: "14px" }}>
              <thead style={{ backgroundColor: "#f8f9fa" }}>
                <tr>
                  <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Paciente</th>
                  <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Tutor</th>
                  <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Espécie/Raça</th>
                  <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Idade</th>
                  <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Status</th>
                  <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.map((paciente) => (
                  <tr
                    key={paciente.id}
                    className="cursor-pointer"
                    onClick={() => handlePacienteClick(paciente)}
                    style={{
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    <td className="align-middle" style={{ padding: "12px" }}>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded"
                          style={{
                            width: 32,
                            height: 32,
                            backgroundColor: "#e9ecef",
                            color: "#6c757d"
                          }}
                        >
                          <FaPaw size={14} />
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: "14px" }}>{paciente.nome}</div>
                          <small className="text-muted" style={{ fontSize: "12px" }}>
                            ID: {String(paciente.id).substring(0, 8)}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle" style={{ padding: "12px" }}>
                      <div style={{ fontSize: "14px" }}>{paciente.tutor?.nome || "N/A"}</div>
                      <small className="text-muted" style={{ fontSize: "12px" }}>
                        {paciente.tutor?.telefone || "N/A"}
                      </small>
                    </td>
                    <td className="align-middle" style={{ padding: "12px" }}>
                      <div className="text-capitalize" style={{ fontSize: "14px" }}>
                        {paciente.especie?.toLowerCase() || "N/A"}
                      </div>
                      <small className="text-muted" style={{ fontSize: "12px" }}>
                        {paciente.raca || "N/A"}
                      </small>
                    </td>
                    <td className="align-middle" style={{ padding: "12px" }}>
                      <div style={{ fontSize: "14px" }}>
                        {paciente.data_nascimento
                          ? calcularIdade(paciente.data_nascimento) + " anos"
                          : "N/A"}
                      </div>
                      <small className="text-muted" style={{ fontSize: "12px" }}>
                        {paciente.peso ? paciente.peso + " kg" : "N/A"}
                      </small>
                    </td>
                    <td className="align-middle" style={{ padding: "12px" }}>
                      {getStatusBadge(paciente.status)}
                    </td>
                    <td className="align-middle" style={{ padding: "12px" }}>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          title="Ver detalhes"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePacienteClick(paciente);
                          }}
                          style={{ borderColor: "#e9ecef", color: "#6c757d", padding: "4px 8px" }}
                        >
                          <FaEye size={12} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          title="Ver Prontuário"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/dashboard/veterinario/prontuario/${paciente.id}`
                            );
                          }}
                          style={{ borderColor: "#e9ecef", color: "#6c757d", padding: "4px 8px" }}
                        >
                          <FaFileMedical size={12} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          title="Editar"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaciente(paciente);
                            openModal("editar", { paciente });
                          }}
                          style={{ borderColor: "#e9ecef", color: "#6c757d", padding: "4px 8px" }}
                        >
                          <FaEdit size={12} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          title="Excluir"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExcluirPaciente(paciente.id);
                          }}
                          style={{ borderColor: "#e9ecef", color: "#dc3545", padding: "4px 8px" }}
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

      {/* Overlay com Background Desfocado */}
      {showSidebar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 1060,
            transition: "opacity 0.3s ease",
          }}
          onClick={() => {
            if (modalStack.length === 0) {
              closeSidebar();
            }
          }}
        />
      )}

      {/* Sidebar Layer */}
      {showSidebar && selectedPaciente && (
        <div
          ref={sidebarRef}
          style={{
            position: "fixed",
            top: 0,
            width: "550px", // Aumentado para notebook visual
            height: "100vh",
            backgroundColor: "white",
            zIndex: 1070, // Base z-index
            boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
            transform: showSidebar ? "translateX(0)" : "translateX(100%)",
            right: 0,
            transition: "transform 0.3s ease, filter 0.3s ease",
            display: "flex",
            flexDirection: "column",
            filter: modalStack.length > 0 ? "brightness(0.9)" : "none",
          }}
        >
          {/* Header do Sidebar */}
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid #e9ecef",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h5 className="fw-semibold text-dark mb-0" style={{ fontSize: "18px" }}>
              <FaPaw className="me-2" style={{ color: "#0DB2AC" }} />
              Ficha do Paciente
            </h5>
            <Button
              variant="link"
              onClick={closeSidebar}
              style={{ padding: 0, color: "#6c757d" }}
            >
              <FaTimes size={20} />
            </Button>
          </div>

          {/* Conteúdo do Sidebar com Scroll */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.5rem",
            }}
          >
            {selectedPaciente && (
              <div>
                {/* Informações Básicas */}
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded"
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: "#e9ecef",
                        color: "#6c757d",
                      }}
                    >
                      <FaPaw size={24} />
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1" style={{ fontSize: "18px" }}>
                        {selectedPaciente.nome}
                      </h4>
                      <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                        {selectedPaciente.especie} • {selectedPaciente.raca}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "12px" }}>Idade</small>
                      <div className="fw-semibold" style={{ fontSize: "14px" }}>
                        {selectedPaciente.data_nascimento
                          ? calcularIdade(selectedPaciente.data_nascimento) + " anos"
                          : "N/A"}
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "12px" }}>Peso</small>
                      <div className="fw-semibold" style={{ fontSize: "14px" }}>
                        {selectedPaciente.peso ? selectedPaciente.peso + " kg" : "N/A"}
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "12px" }}>Status</small>
                      <div>{getStatusBadge(selectedPaciente.status)}</div>
                    </div>
                  </div>

                  {/* Informações do Tutor */}
                  <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                    <Card.Body className="p-3">
                      <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>
                        Informações do Tutor
                      </h6>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FaUser className="text-muted" size={14} />
                        <span style={{ fontSize: "14px" }}>{selectedPaciente.tutor?.nome || "N/A"}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FaPhone className="text-muted" size={14} />
                        <span style={{ fontSize: "14px" }}>{selectedPaciente.tutor?.telefone || "N/A"}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FaEnvelope className="text-muted" size={14} />
                        <span style={{ fontSize: "14px" }}>{selectedPaciente.tutor?.email || "N/A"}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </div>

                {/* Abas de Informações */}
                <Nav
                  variant="tabs"
                  activeKey={activeTab}
                  onSelect={setActiveTab}
                  className="mb-3"
                  style={{ fontSize: "13px" }}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="geral" style={{ fontSize: "13px" }}>Geral</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="historico" style={{ fontSize: "13px" }}>Histórico</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="vacinas" style={{ fontSize: "13px" }}>Vacinas</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="exames" style={{ fontSize: "13px" }}>Exames</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane active={activeTab === "geral"}>
                    <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                      <Card.Body className="p-3">
                        <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>Dados Físicos</h6>
                        <div className="row g-3">
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "12px" }}>Espécie</small>
                            <div className="fw-semibold" style={{ fontSize: "14px" }}>
                              {selectedPaciente.especie || "N/A"}
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "12px" }}>Raça</small>
                            <div className="fw-semibold" style={{ fontSize: "14px" }}>
                              {selectedPaciente.raca || "N/A"}
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "12px" }}>Idade</small>
                            <div className="fw-semibold" style={{ fontSize: "14px" }}>
                              {selectedPaciente.data_nascimento
                                ? calcularIdade(selectedPaciente.data_nascimento) + " anos"
                                : "N/A"}
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "12px" }}>Peso</small>
                            <div className="fw-semibold" style={{ fontSize: "14px" }}>
                              {selectedPaciente.peso ? selectedPaciente.peso + " kg" : "N/A"}
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane active={activeTab === "historico"}>
                    <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                      <Card.Body className="p-3">
                        <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>Histórico Clínico</h6>
                        <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                          Nenhum histórico encontrado.
                        </p>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane active={activeTab === "vacinas"}>
                    <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                      <Card.Body className="p-3">
                        <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>Carteira de Vacinas</h6>
                        <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                          Nenhuma vacina registrada.
                        </p>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane active={activeTab === "exames"}>
                    <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                      <Card.Body className="p-3">
                        <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>Exames Realizados</h6>
                        <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                          Nenhum exame registrado.
                        </p>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            )}
          </div>

          {/* Footer do Sidebar com Ações */}
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid #e9ecef",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => openModal("editar", { paciente: selectedPaciente })}
              style={{
                flex: 1,
                borderColor: "#e9ecef",
                color: "#6c757d",
                fontSize: "13px"
              }}
            >
              <FaEdit className="me-2" />
              Editar
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => openModal("consulta", { paciente: selectedPaciente })}
              style={{
                flex: 1,
                borderColor: "#e9ecef",
                color: "#6c757d",
                fontSize: "13px"
              }}
            >
              <FaPlus className="me-2" />
              Nova Consulta
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate(`/dashboard/veterinario/prontuario/${selectedPaciente.id}`)}
              style={{
                borderColor: "#e9ecef",
                color: "#6c757d",
                fontSize: "13px"
              }}
            >
              <FaFileMedical />
            </Button>
          </div>
        </div>
      )}

      {/* Sistema de Modais Empilhados */}
      {modalStack.map((modal, index) => {
        // Stacking "Notebook" style
        // Newest modals go on top and shift left significantly to show previous content
        // Patient Sidebar is at Right: 0
        const offsetRight = (index + 1) * 500; // 500px shift left per modal (allows reading previous)
        const zIndex = 1080 + index;
        const isActive = index === modalStack.length - 1;

        return (
          <div
            key={modal.id}
            style={{
              position: "fixed",
              top: 0,
              right: `${offsetRight}px`,
              width: "550px",
              height: "100vh",
              backgroundColor: "white",
              zIndex: zIndex,
              boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
              transform: "translateX(0)",
              transition: "right 0.3s ease, filter 0.3s ease",
              display: "flex",
              flexDirection: "column",
              filter: isActive ? "none" : "brightness(0.9)",
            }}
          >
            {modal.type === "editar" && (
              <>
                <div
                  style={{
                    padding: "1.5rem",
                    borderBottom: "1px solid #e9ecef",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h5 className="fw-semibold text-dark mb-0" style={{ fontSize: "18px" }}>
                    <FaEdit className="me-2" style={{ color: "#0DB2AC" }} />
                    Editar Paciente
                  </h5>
                  <Button
                    variant="link"
                    onClick={closeModal}
                    style={{ padding: 0, color: "#6c757d" }}
                  >
                    <FaTimes size={20} />
                  </Button>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
                  {modal.data.paciente && (
                    <ModalEditarPaciente
                      show={true}
                      onHide={closeModal}
                      paciente={modal.data.paciente}
                      onPacienteAtualizado={async () => {
                        await carregarPacientes();
                        // Atualizar paciente selecionado no sidebar se for o mesmo
                        const pacienteId = modal.data.paciente.id;
                        if (selectedPaciente?.id === pacienteId) {
                          // Recarregar e atualizar o paciente selecionado
                          const pacientesData = await api.get("/pacientes");
                          if (pacientesData) {
                            const pacientesFormatados = pacientesData.map((p) => ({
                              ...p,
                              tutor: p.tutor_id ? {
                                nome: p.tutor_nome || "N/A",
                                telefone: p.tutor_telefone || "",
                                email: p.tutor_email || "",
                              } : null,
                            }));
                            const updated = pacientesFormatados.find(p => p.id === pacienteId);
                            if (updated) {
                              setSelectedPaciente(updated);
                            }
                          }
                        }
                        closeModal();
                      }}
                      embedded={true}
                    />
                  )}
                </div>
              </>
            )}

            {modal.type === "consulta" && (
              <>
                <div
                  style={{
                    padding: "1.5rem",
                    borderBottom: "1px solid #e9ecef",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h5 className="fw-semibold text-dark mb-0" style={{ fontSize: "18px" }}>
                    <FaPlus className="me-2" style={{ color: "#0DB2AC" }} />
                    Nova Consulta
                  </h5>
                  <Button
                    variant="link"
                    onClick={closeModal}
                    style={{ padding: 0, color: "#6c757d" }}
                  >
                    <FaTimes size={20} />
                  </Button>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
                  <p className="text-muted" style={{ fontSize: "14px" }}>
                    Funcionalidade de nova consulta será implementada em breve.
                  </p>
                </div>
              </>
            )}
          </div>
        );
      })}
    </DashboardLayout>
  );
};

export default DashboardVeterinarioPacientes;
