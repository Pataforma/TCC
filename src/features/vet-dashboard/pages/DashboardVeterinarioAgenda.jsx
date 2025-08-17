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
import { useUser } from "../../../contexts/UserContext";
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

  // Recarregar consultas quando a data ou visualização mudar
  useEffect(() => {
    fetchConsultas();
  }, [currentDate, activeTab]);

  const fetchConsultas = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // Calcular range de datas baseado na visualização
      let dataInicio, dataFim;
      const hoje = new Date(currentDate);

      if (activeTab === "dia") {
        dataInicio = new Date(hoje);
        dataFim = new Date(hoje);
      } else if (activeTab === "semana") {
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        dataInicio = inicioSemana;
        dataFim = new Date(inicioSemana);
        dataFim.setDate(inicioSemana.getDate() + 6);
      } else if (activeTab === "mes") {
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      }

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
        .gte("data_consulta", dataInicio.toISOString().split("T")[0])
        .lte("data_consulta", dataFim.toISOString().split("T")[0])
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
    return consultas.filter((consulta) => consulta.horario === horario);
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
    return consultasData.filter((consulta) => consulta.horario === horario);
  };

  const formatarDataConsulta = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const { user } = useUser();
  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
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

        {/* Lista de Consultas - EM DESTAQUE */}
        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
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

        {/* Calendário Geral */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <Card.Header className="bg-white border-0">
            <h5 className="fw-semibold text-dark mb-0">Calendário Geral</h5>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleAnterior}
                >
                  <FaChevronLeft />
                </Button>
                <h5 className="fw-semibold text-dark mb-0">
                  {activeTab === "mes"
                    ? formatarNomeMes(currentDate)
                    : formatarData(currentDate)}
                </h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleProximo}
                >
                  <FaChevronRight />
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleHoje}
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
              {activeTab === "dia" && (
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

                  {/* Grade de Consultas - Visualização Diária */}
                  <div className="flex-grow-1">
                    <div className="p-3 bg-light border-bottom">
                      <small className="text-muted fw-semibold">
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

                  {/* Grade de Consultas - Visualização Semanal */}
                  {datas.slice(0, 7).map((data) => (
                    <div
                      key={data.toISOString()}
                      style={{
                        width: `${100 / 7}%`,
                        borderRight: "1px solid #dee2e6",
                      }}
                    >
                      <div className="p-3 bg-light border-bottom text-center">
                        <small className="text-muted fw-semibold">
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
                  <div className="p-3 bg-light border-bottom text-center">
                    <h6 className="fw-semibold mb-0">
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
                              ? "#e3f2fd"
                              : isCurrentMonth
                              ? "#ffffff"
                              : "#f8f9fa",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <small
                              className={`fw-semibold ${
                                isToday
                                  ? "text-primary"
                                  : isCurrentMonth
                                  ? "text-dark"
                                  : "text-muted"
                              }`}
                            >
                              {formatarDataMes(data)}
                            </small>
                            {consultasDia.length > 0 && (
                              <Badge bg="primary" className="ms-auto">
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
                                      ? "#d1ecf1"
                                      : "#fff3cd",
                                  fontSize: 10,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleConsultaClick(consulta)}
                                title={`${consulta.horario} - ${
                                  consulta.pacientes?.nome || "N/A"
                                }`}
                              >
                                <div className="fw-semibold text-truncate">
                                  {consulta.horario}
                                </div>
                                <div className="text-truncate">
                                  {consulta.pacientes?.nome || "N/A"}
                                </div>
                              </div>
                            ))}
                            {consultasDia.length > 3 && (
                              <small className="text-muted">
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
