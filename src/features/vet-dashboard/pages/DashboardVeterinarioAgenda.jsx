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
  Tabs,
} from "react-bootstrap";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";
import { api } from "../../../utils/api";
import ConfiguracaoDisponibilidade from "../components/ConfiguracaoDisponibilidade";
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
    duracao: "",
    tipo: "",
    observacoes: "",
    status: "",
  });

  // Estado para tarefas (será implementado futuramente)
  const [tarefas] = useState([]);

  // Carregar dados da API
  useEffect(() => {
    fetchConsultas();
    fetchPacientes();
    fetchTutores();
  }, []);

  // Recarregar consultas quando a data ou visualização mudar
  useEffect(() => {
    fetchConsultas();
  }, [currentDate, activeTab]);

  const fetchConsultas = async () => {
    try {
      // Calcular range de datas baseado na visualização
      let dataInicio, dataFim;
      const hoje = new Date(currentDate);

      if (activeTab === "dia") {
        dataInicio = new Date(new Date(hoje).setHours(0, 0, 0, 0));
        dataFim = new Date(new Date(hoje).setHours(23, 59, 59, 999));
      } else if (activeTab === "semana") {
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        dataInicio = new Date(new Date(inicioSemana).setHours(0, 0, 0, 0));
        const fim = new Date(inicioSemana);
        fim.setDate(inicioSemana.getDate() + 6);
        dataFim = new Date(new Date(fim).setHours(23, 59, 59, 999));
      } else if (activeTab === "mes") {
        dataInicio = new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          1,
          0,
          0,
          0,
          0
        );
        dataFim = new Date(
          hoje.getFullYear(),
          hoje.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
      }

      // Buscar consultas via API
      const data = await api.get(
        `/consultas?data_inicio=${dataInicio.toISOString()}&data_fim=${dataFim.toISOString()}`
      );

      // Formatar dados para o formato esperado pelo componente
      const formattedData = (data || []).map((c) => ({
        ...c,
        pacientes: c.pacientes || (c.paciente_id ? { id: c.paciente_id, nome: "N/A" } : null),
        tutores: c.tutores || (c.tutor_id ? { id: c.tutor_id, nome: "N/A" } : null),
      }));

      setConsultas(formattedData);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
    }
  };

  const fetchPacientes = async () => {
    try {
      const data = await api.get("/pacientes");
      setPacientes(data || []);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  };

  const fetchTutores = async () => {
    try {
      const data = await api.get("/tutores");
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

    const colors = {
      confirmada: "#0DB2AC",
      pendente: "#FABA32",
      cancelada: "#dc3545",
    };

    return (
      <Badge
        bg={variants[status]}
        style={{
          backgroundColor: colors[status] || "#6c757d",
          color: "white",
          fontSize: "10px",
          padding: "2px 6px",
        }}
      >
        {labels[status]}
      </Badge>
    );
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
      duracao: "",
      tipo: "",
      observacoes: "",
      status: "",
    });
    setShowConsultaModal(true);
  };

  const handleSalvarConsulta = async () => {
    try {
      // Validação dos campos obrigatórios
      if (!novaConsulta.paciente_id || !novaConsulta.tutor_id ||
        !novaConsulta.data_consulta || !novaConsulta.horario ||
        !novaConsulta.duracao || !novaConsulta.tipo || !novaConsulta.status) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      setLoading(true);

      const consultaData = {
        paciente_id: parseInt(novaConsulta.paciente_id),
        tutor_id: parseInt(novaConsulta.tutor_id),
        data_consulta: new Date(
          `${novaConsulta.data_consulta}T${novaConsulta.horario}:00`
        ).toISOString(),
        duracao: parseInt(novaConsulta.duracao) || 30,
        tipo: novaConsulta.tipo,
        observacoes: novaConsulta.observacoes || '',
        status: novaConsulta.status || 'pendente',
      };

      await api.post("/consultas", consultaData);

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
      await api.delete(`/consultas/${id}`);

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

  const handleConfirmarConsulta = async (id) => {
    try {
      setLoading(true);
      await api.put(`/consultas/${id}/status`, { status: "confirmada" });
      await fetchConsultas();
      alert("Consulta confirmada com sucesso!");
    } catch (error) {
      console.error("Erro ao confirmar consulta:", error);
      alert("Erro ao confirmar consulta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnterior = () => {
    const novaData = new Date(currentDate);

    if (activeTab === "dia") {
      novaData.setDate(novaData.getDate() - 1);
    } else if (activeTab === "semana") {
      novaData.setDate(novaData.getDate() - 7);
    } else if (activeTab === "mes") {
      novaData.setMonth(novaData.getMonth() - 1);
    }

    setCurrentDate(novaData);
  };

  const handleProximo = () => {
    const novaData = new Date(currentDate);

    if (activeTab === "dia") {
      novaData.setDate(novaData.getDate() + 1);
    } else if (activeTab === "semana") {
      novaData.setDate(novaData.getDate() + 7);
    } else if (activeTab === "mes") {
      novaData.setMonth(novaData.getMonth() + 1);
    }

    setCurrentDate(novaData);
  };

  const handleHoje = () => {
    setCurrentDate(new Date());
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatarDataCurta = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatarDataSemana = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatarDataMes = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
    });
  };

  const formatarNomeMes = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
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

  // Função para gerar datas baseada na visualização selecionada
  const gerarDatas = () => {
    const datas = [];
    const hoje = new Date(currentDate);

    if (activeTab === "dia") {
      // Visualização de um dia
      datas.push(hoje);
    } else if (activeTab === "semana") {
      // Visualização de uma semana (7 dias)
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());

      for (let i = 0; i < 7; i++) {
        const data = new Date(inicioSemana);
        data.setDate(inicioSemana.getDate() + i);
        datas.push(data);
      }
    } else if (activeTab === "mes") {
      // Visualização de um mês
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

      // Adicionar dias do mês anterior para completar a primeira semana
      const primeiroDiaSemana = inicioMes.getDay();
      for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
        const data = new Date(inicioMes);
        data.setDate(inicioMes.getDate() - i - 1);
        datas.push(data);
      }

      // Adicionar todos os dias do mês
      for (let i = 1; i <= fimMes.getDate(); i++) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth(), i);
        datas.push(data);
      }

      // Adicionar dias do próximo mês para completar a última semana
      const ultimoDiaSemana = fimMes.getDay();
      for (let i = 1; i <= 6 - ultimoDiaSemana; i++) {
        const data = new Date(fimMes);
        data.setDate(fimMes.getDate() + i);
        datas.push(data);
      }
    }

    return datas;
  };

  const datas = gerarDatas();

  const consultasPorHorario = (horario) => {
    return consultas.filter((consulta) => {
      const consultaHorario = new Date(consulta.data_consulta).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return consultaHorario === horario;
    });
  };

  const consultasPorData = (data) => {
    const dataStr = data.toISOString().split("T")[0];
    return consultas.filter((consulta) => {
      const consultaData = new Date(consulta.data_consulta);
      const consultaDataStr = consultaData.toISOString().split("T")[0];
      return consultaDataStr === dataStr;
    });
  };

  const consultasPorDataHorario = (data, horario) => {
    const consultasData = consultasPorData(data);
    return consultasData.filter((consulta) => {
      const consultaHorario = new Date(consulta.data_consulta).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return consultaHorario === horario;
    });
  };

  const formatarDataConsulta = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const { user } = useUser();
  const [activeTabAgenda, setActiveTabAgenda] = useState("consultas");

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
      <div className="container-fluid" style={{ height: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
        {/* Header da Página - Fixo */}
        <div 
          className="d-flex justify-content-between align-items-center mb-3 bg-white"
          style={{ 
            position: "sticky", 
            top: 0, 
            zIndex: 1000, 
            paddingTop: "1rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid #e9ecef"
          }}
        >
          <div>
            <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "24px" }}>Agenda</h2>
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              Gerencie suas consultas e configure sua disponibilidade
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              size="sm"
              style={{ borderColor: "#e9ecef", color: "#6c757d" }}
            >
              <FaCalendarAlt className="me-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Tabs: Consultas e Disponibilidade - Fixo */}
        <div style={{ position: "sticky", top: "120px", zIndex: 999, backgroundColor: "white", borderBottom: "1px solid #e9ecef", marginBottom: "1rem" }}>
          <Tabs
            activeKey={activeTabAgenda}
            onSelect={(k) => setActiveTabAgenda(k || "consultas")}
            className="mb-0"
          >
          <Tab eventKey="consultas" title="Consultas">
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              {/* Controles do Calendário - Fixo */}
              <div 
                style={{ 
                  position: "sticky", 
                  top: "180px", 
                  zIndex: 998, 
                  backgroundColor: "white", 
                  padding: "1rem 0",
                  borderBottom: "1px solid #e9ecef",
                  marginBottom: "1rem"
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleAnterior}
                      style={{ borderColor: "#e9ecef", color: "#6c757d" }}
                    >
                      <FaChevronLeft />
                    </Button>
                    <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "15px", minWidth: "200px" }}>
                      {activeTab === "mes"
                        ? formatarNomeMes(currentDate)
                        : activeTab === "semana"
                        ? `${formatarDataSemana(datas[0])} - ${formatarDataSemana(datas[6])}`
                        : formatarData(currentDate)}
                    </h6>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleProximo}
                      style={{ borderColor: "#e9ecef", color: "#6c757d" }}
                    >
                      <FaChevronRight />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleHoje}
                      style={{ borderColor: "#e9ecef", color: "#6c757d" }}
                    >
                      Hoje
                    </Button>
                  </div>

                  <Nav
                    variant="pills"
                    activeKey={activeTab}
                    onSelect={setActiveTab}
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="dia" className="rounded-pill" style={{ fontSize: "13px" }}>
                        Dia
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="semana" className="rounded-pill" style={{ fontSize: "13px" }}>
                        Semana
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="mes" className="rounded-pill" style={{ fontSize: "13px" }}>
                        Mês
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>

              {/* Área do Calendário com Scroll Interno */}
              <div 
                style={{ 
                  flex: 1, 
                  overflowY: "auto", 
                  overflowX: "hidden",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  backgroundColor: "white"
                }}
              >
                <div style={{ minHeight: "100%" }}>
                  {activeTab === "dia" && (
                    <div className="d-flex" style={{ position: "relative" }}>
                      {/* Coluna de Horários - Fixa */}
                      <div 
                        style={{ 
                          width: 80, 
                          borderRight: "1px solid #e9ecef",
                          position: "sticky",
                          left: 0,
                          zIndex: 10,
                          backgroundColor: "white"
                        }}
                      >
                        <div className="p-2 border-bottom" style={{ backgroundColor: "#f8f9fa" }}>
                          <small className="text-muted fw-semibold" style={{ fontSize: "12px" }}>Horário</small>
                        </div>
                        {horarios.map((horario) => (
                          <div
                            key={horario}
                            className="p-2 border-bottom d-flex align-items-center justify-content-center"
                            style={{ height: 60, fontSize: 12, color: "#6c757d" }}
                          >
                            {horario}
                          </div>
                        ))}
                      </div>

                      {/* Grade de Consultas - Visualização Diária */}
                      <div className="flex-grow-1">
                        <div className="p-2 border-bottom" style={{ backgroundColor: "#f8f9fa" }}>
                          <small className="text-muted fw-semibold" style={{ fontSize: "12px" }}>
                            {formatarData(currentDate)}
                          </small>
                        </div>
                        {horarios.map((horario) => (
                          <div
                            key={horario}
                            className="p-2 border-bottom position-relative"
                            style={{ height: 60 }}
                          >
                            {consultasPorDataHorario(currentDate, horario).map(
                              (consulta) => (
                                <div
                                  key={consulta.id}
                                  className="position-absolute w-100 h-100 p-2"
                                  style={{ top: 0, left: 0 }}
                                >
                                  <Card
                                    className="h-100 border cursor-pointer"
                                    style={{
                                      backgroundColor:
                                        consulta.status === "confirmada"
                                          ? "rgba(13, 178, 172, 0.1)"
                                          : consulta.status === "pendente"
                                          ? "rgba(250, 186, 50, 0.1)"
                                          : "#f8f9fa",
                                      borderColor:
                                        consulta.status === "confirmada"
                                          ? "#0DB2AC"
                                          : consulta.status === "pendente"
                                          ? "#FABA32"
                                          : "#e9ecef",
                                      borderRadius: 6,
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleConsultaClick(consulta)}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = "scale(1.02)";
                                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = "scale(1)";
                                      e.currentTarget.style.boxShadow = "none";
                                    }}
                                  >
                                    <Card.Body className="p-2">
                                      <div className="d-flex justify-content-between align-items-start">
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <h6
                                            className="fw-semibold mb-1 text-dark"
                                            style={{ fontSize: 12 }}
                                          >
                                            {consulta.pacientes?.nome || "N/A"}
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
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "semana" && (
                    <div className="d-flex" style={{ position: "relative" }}>
                      {/* Coluna de Horários - Fixa */}
                      <div 
                        style={{ 
                          width: 80, 
                          borderRight: "1px solid #e9ecef",
                          position: "sticky",
                          left: 0,
                          zIndex: 10,
                          backgroundColor: "white"
                        }}
                      >
                        <div className="p-2 border-bottom" style={{ backgroundColor: "#f8f9fa" }}>
                          <small className="text-muted fw-semibold" style={{ fontSize: "12px" }}>Horário</small>
                        </div>
                        {horarios.map((horario) => (
                          <div
                            key={horario}
                            className="p-2 border-bottom d-flex align-items-center justify-content-center"
                            style={{ height: 60, fontSize: 12, color: "#6c757d" }}
                          >
                            {horario}
                          </div>
                        ))}
                      </div>

                      {/* Grade de Consultas - Visualização Semanal */}
                      {datas.slice(0, 7).map((data) => (
                        <div
                          key={data.toISOString()}
                          style={{
                            width: `${100 / 7}%`,
                            borderRight: "1px solid #e9ecef",
                          }}
                        >
                          <div className="p-2 border-bottom text-center" style={{ backgroundColor: "#f8f9fa" }}>
                            <small className="text-muted fw-semibold" style={{ fontSize: "12px" }}>
                              {formatarDataSemana(data)}
                            </small>
                          </div>
                          {horarios.map((horario) => (
                            <div
                              key={horario}
                              className="p-2 border-bottom position-relative"
                              style={{ height: 60 }}
                            >
                              {consultasPorDataHorario(data, horario).map(
                                (consulta) => (
                                  <div
                                    key={consulta.id}
                                    className="position-absolute w-100 h-100 p-2"
                                    style={{ top: 0, left: 0 }}
                                  >
                                    <Card
                                      className="h-100 border cursor-pointer"
                                      style={{
                                        backgroundColor:
                                          consulta.status === "confirmada"
                                            ? "rgba(13, 178, 172, 0.1)"
                                            : consulta.status === "pendente"
                                            ? "rgba(250, 186, 50, 0.1)"
                                            : "#f8f9fa",
                                        borderColor:
                                          consulta.status === "confirmada"
                                            ? "#0DB2AC"
                                            : consulta.status === "pendente"
                                            ? "#FABA32"
                                            : "#e9ecef",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleConsultaClick(consulta)}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.02)";
                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = "none";
                                      }}
                                    >
                                      <Card.Body className="p-2">
                                        <div className="d-flex justify-content-between align-items-start">
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                            <h6
                                              className="fw-semibold mb-1 text-dark"
                                              style={{ fontSize: 12 }}
                                            >
                                              {consulta.pacientes?.nome || "N/A"}
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
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "mes" && (
                    <div>
                      {/* Cabeçalho do Mês */}
                      <div className="p-2 border-bottom text-center" style={{ backgroundColor: "#f8f9fa" }}>
                        <h6 className="fw-semibold mb-0" style={{ fontSize: "14px" }}>
                          {formatarNomeMes(currentDate)}
                        </h6>
                      </div>

                      {/* Grade de Dias do Mês */}
                      <div className="d-flex flex-wrap">
                        {/* Cabeçalhos dos dias da semana */}
                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                          (dia) => (
                            <div
                              key={dia}
                              className="p-2 border-bottom border-end text-center fw-semibold"
                              style={{
                                width: `${100 / 7}%`,
                                backgroundColor: "#f8f9fa",
                                minHeight: 40,
                                fontSize: "12px",
                                color: "#6c757d"
                              }}
                            >
                              {dia}
                            </div>
                          )
                        )}

                        {/* Dias do mês */}
                        {datas.map((data, index) => {
                          const consultasDia = consultasPorData(data);
                          const isCurrentMonth =
                            data.getMonth() === currentDate.getMonth();
                          const isToday =
                            data.toDateString() === new Date().toDateString();

                          return (
                            <div
                              key={index}
                              className="p-2 border-bottom border-end position-relative"
                              style={{
                                width: `${100 / 7}%`,
                                minHeight: 80,
                                backgroundColor: isToday
                                  ? "rgba(13, 178, 172, 0.05)"
                                  : isCurrentMonth
                                    ? "#ffffff"
                                    : "#f8f9fa",
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <small
                                  className={`fw-semibold ${isToday
                                      ? "text-primary"
                                      : isCurrentMonth
                                        ? "text-dark"
                                        : "text-muted"
                                    }`}
                                  style={{ fontSize: "12px" }}
                                >
                                  {formatarDataMes(data)}
                                </small>
                                {consultasDia.length > 0 && (
                                  <Badge 
                                    bg="secondary" 
                                    className="ms-auto"
                                    style={{ 
                                      backgroundColor: "#0DB2AC",
                                      fontSize: "10px"
                                    }}
                                  >
                                    {consultasDia.length}
                                  </Badge>
                                )}
                              </div>

                              {/* Lista de consultas do dia */}
                              <div className="mt-1">
                                {consultasDia.slice(0, 3).map((consulta) => (
                                  <div
                                    key={consulta.id}
                                    className="mb-1 p-1 rounded cursor-pointer"
                                    style={{
                                      backgroundColor:
                                        consulta.status === "confirmada"
                                          ? "rgba(13, 178, 172, 0.1)"
                                          : consulta.status === "pendente"
                                          ? "rgba(250, 186, 50, 0.1)"
                                          : "#f8f9fa",
                                      border: `1px solid ${
                                        consulta.status === "confirmada"
                                          ? "#0DB2AC"
                                          : consulta.status === "pendente"
                                          ? "#FABA32"
                                          : "#e9ecef"
                                      }`,
                                      fontSize: 10,
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleConsultaClick(consulta)}
                                    title={`${new Date(consulta.data_consulta).toLocaleTimeString("pt-BR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })} - ${consulta.pacientes?.nome || "N/A"
                                      }`}
                                  >
                                    <div className="fw-semibold text-truncate text-dark">
                                      {new Date(consulta.data_consulta).toLocaleTimeString("pt-BR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                    <div className="text-truncate text-muted">
                                      {consulta.pacientes?.nome || "N/A"}
                                    </div>
                                  </div>
                                ))}
                                {consultasDia.length > 3 && (
                                  <small className="text-muted" style={{ fontSize: "10px" }}>
                                    +{consultasDia.length - 3} mais
                                  </small>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                            {new Date(selectedConsulta.data_consulta).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} ({selectedConsulta.duracao}{" "}
                            min)
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Tipo</label>
                        <div>
                          <Badge bg="primary">
                            {(() => {
                              const tipos = {
                                'consulta_rotina': 'Consulta de Rotina',
                                'vacina': 'Vacinação',
                                'exame': 'Exame',
                                'consulta_emergencia': 'Consulta de Emergência',
                                'cirurgia': 'Cirurgia',
                                'retorno': 'Retorno',
                                'outro': 'Outro'
                              };
                              return tipos[selectedConsulta.tipo] || selectedConsulta.tipo;
                            })()}
                          </Badge>
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
                  <Button
                    variant="success"
                    className="ms-2"
                    onClick={() => handleConfirmarConsulta(selectedConsulta.id)}
                    disabled={loading}
                  >
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
                          max="180"
                          step="15"
                          placeholder="Ex: 30"
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
                          <option value="">Selecione o tipo de consulta</option>
                          <option value="consulta_rotina">Consulta de Rotina</option>
                          <option value="vacina">Vacinação</option>
                          <option value="exame">Exame</option>
                          <option value="consulta_emergencia">Consulta de Emergência</option>
                          <option value="cirurgia">Cirurgia</option>
                          <option value="retorno">Retorno</option>
                          <option value="outro">Outro</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={novaConsulta.status}
                          onChange={(e) =>
                            setNovaConsulta({ ...novaConsulta, status: e.target.value })
                          }
                          required
                        >
                          <option value="">Selecione o status</option>
                          <option value="pendente">Pendente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="cancelada">Cancelada</option>
                          <option value="concluida">Concluída</option>
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
                          placeholder="Descreva os sintomas, motivo da consulta ou observações importantes..."
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
          </Tab>

          <Tab eventKey="disponibilidade" title="Disponibilidade">
            <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 300px)" }}>
              <ConfiguracaoDisponibilidade />
            </div>
          </Tab>
        </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardVeterinarioAgenda;
