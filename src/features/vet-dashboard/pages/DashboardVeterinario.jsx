import React, { useState, useEffect } from "react";
import { Row, Col, Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatCard from "../../../components/Dashboard/StatCard";
import SimpleChart from "../../../components/Dashboard/SimpleChart";
import { useUser } from "../../../contexts/UserContext";
import { api } from "../../../utils/api";
import {
  FaCalendarAlt,
  FaUsers,
  FaComments,
  FaMoneyBill,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartBar,
  FaPaw,
  FaInbox,
  FaFileMedical,
  FaBox,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

const DashboardVeterinario = () => {
  const [stats, setStats] = useState({
    consultasAgendadas: 0,
    consultasPendentes: 0,
    novasMensagens: 0,
    faturamentoMes: 0,
  });

  const [consultasHoje, setConsultasHoje] = useState([]);

  // Dados para a caixa de entrada (inbox) – vindo do banco
  const [inboxItems, setInboxItems] = useState([]);

  const [faturamentoData, setFaturamentoData] = useState([]);

  const [servicosData, setServicosData] = useState([]);

  const carregarResumo = async () => {
    try {
      // Carregar stats do dashboard
      const dashboardStats = await api.get("/veterinarios/dashboard/stats");
      
      setStats({
        consultasAgendadas: dashboardStats.consultasAgendadas || 0,
        consultasPendentes: dashboardStats.consultasPendentes || 0,
        novasMensagens: dashboardStats.novasMensagens || 0,
        faturamentoMes: dashboardStats.faturamentoMes || 0,
      });

      // Range de hoje (timestamp)
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      // Consultas de hoje
      const consultasDeHoje = await api.get(
        `/consultas?data=${start.toISOString().split("T")[0]}`
      );

      setConsultasHoje(
        (consultasDeHoje || []).map((c) => ({
          id: c.id,
          paciente: c.pacientes?.nome || "N/A",
          tutor: c.tutores?.nome || "N/A",
          horario: new Date(c.data_consulta).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          tipo: c.tipo,
          status: c.status,
        }))
      );

      // Inbox: deixar vazio por enquanto (chat não implementado)
      setInboxItems([]);

      // Faturamento (transações receitas) e serviços por tipo (consultas + serviços)
      const now = new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const fimMes = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      // Carregar consultas do mês
      const consultasMes = await api.get(
        `/consultas?data_inicio=${inicioMes}&data_fim=${fimMes}`
      );

      // Carregar serviços veterinários ativos
      const servicosVet = await api.get("/servicos?status=ativo");

      // Combinar dados de consultas e serviços
      let servicosCombinados = {};

      // Adicionar consultas realizadas
      if (consultasMes && Array.isArray(consultasMes)) {
        consultasMes.forEach((c) => {
          const key = c.tipo || "Outros";
          servicosCombinados[key] = (servicosCombinados[key] || 0) + 1;
        });
      }

      // Adicionar serviços disponíveis (se não houver consultas)
      if (
        servicosVet &&
        Array.isArray(servicosVet) &&
        Object.keys(servicosCombinados).length === 0
      ) {
        servicosVet.forEach((s) => {
          const key = s.categoria || "Outros";
          servicosCombinados[key] = (servicosCombinados[key] || 0) + 1;
        });
      }

      // Mapear categorias para nomes mais amigáveis
      const mapearCategoria = (categoria) => {
        const mapeamento = {
          consultas: "Consultas",
          vacinas: "Vacinas",
          exames: "Exames",
          cirurgias: "Cirurgias",
          consulta_rotina: "Consulta de Rotina",
          vacina: "Vacinação",
          exame: "Exame",
          cirurgia: "Cirurgia",
          consulta_emergencia: "Consulta de Emergência",
          retorno: "Retorno",
          outro: "Outro",
        };
        return mapeamento[categoria] || categoria;
      };

      setServicosData(
        Object.entries(servicosCombinados).map(([label, value]) => ({
          label: mapearCategoria(label),
          value,
        }))
      );

      // Faturamento do mês via transações do tipo receita
      let faturamentoTotal = dashboardStats.faturamentoMes || 0;
      let faturamentoPorDia = {};

      // Carregar transações financeiras
      const transacoesMes = await api.get(
        `/transacoes?tipo=receita&data_inicio=${inicioMes}&data_fim=${fimMes}`
      );

      if (transacoesMes && Array.isArray(transacoesMes)) {
        transacoesMes.forEach((t) => {
          const valor = Number(t.valor || 0);
          faturamentoTotal += valor;

          const d = new Date(t.data).toISOString().split("T")[0];
          faturamentoPorDia[d] = (faturamentoPorDia[d] || 0) + valor;
        });
      }

      // Se não houver transações, usar serviços como fallback
      if (faturamentoTotal === 0 && servicosVet && Array.isArray(servicosVet)) {
        faturamentoTotal = servicosVet.reduce(
          (acc, s) => acc + Number(s.preco || 0),
          0
        );

        // Distribuir ao longo do mês
        const diasNoMes = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).getDate();
        const receitaPorDia = faturamentoTotal / diasNoMes;

        for (let dia = 1; dia <= diasNoMes; dia++) {
          const dataStr = `${now.getFullYear()}-${String(
            now.getMonth() + 1
          ).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
          faturamentoPorDia[dataStr] = Math.round(receitaPorDia);
        }
      }

      // Atualizar estatísticas
      setStats((prev) => ({ ...prev, faturamentoMes: faturamentoTotal }));

      // Configurar dados do gráfico
      if (Object.keys(faturamentoPorDia).length > 0) {
        const orderedDays = Object.keys(faturamentoPorDia).sort();
        setFaturamentoData(
          orderedDays.map((d) => ({
            label: new Date(d).toLocaleDateString("pt-BR", {
              day: "2-digit",
            }),
            value: faturamentoPorDia[d],
          }))
        );
      }
    } catch (error) {
      console.error("Erro ao carregar resumo do veterinário:", error);
    }
  };

  // useEffect para carregar dados quando o componente montar
  useEffect(() => {
    carregarResumo();
  }, []);

  const getStatusBadge = (status) => {
    const variants = {
      confirmada: "secondary",
      pendente: "secondary",
      cancelada: "secondary",
    };

    const labels = {
      confirmada: "Confirmada",
      pendente: "Pendente",
      cancelada: "Cancelada",
    };

    return (
      <Badge
        bg={variants[status]}
        style={{
          backgroundColor: status === "confirmada" ? "#0DB2AC" : status === "pendente" ? "#FABA32" : "#dc3545",
          color: "white",
          fontSize: "11px",
        }}
      >
        {labels[status]}
      </Badge>
    );
  };

  const handleCardClick = (action) => {
    // Navegação para as respectivas páginas
    switch (action) {
      case "agenda":
        navigate("/dashboard/veterinario/agenda");
        break;
      case "pacientes":
        navigate("/dashboard/veterinario/pacientes");
        break;
      case "financeiro":
        navigate("/dashboard/veterinario/financeiro");
        break;
      case "estoque":
        navigate("/dashboard/veterinario/estoque");
        break;
      case "buscar-paciente":
        navigate("/dashboard/veterinario/pacientes");
        break;
      default:
        break;
    }
  };

  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "24px" }}>
              Dashboard
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              Bem-vindo de volta, {user?.nome?.split(" ")[0] || "Doutor(a)"}!
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleCardClick("agenda")}
              style={{ borderColor: "#e9ecef", color: "#6c757d" }}
            >
              <FaCalendarAlt className="me-2" />
              Agenda
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleCardClick("financeiro")}
              style={{ borderColor: "#e9ecef", color: "#6c757d" }}
            >
              <FaMoneyBill className="me-2" />
              Financeiro
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <Row className="g-3 mb-3">
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Consultas Agendadas"
              value={stats.consultasAgendadas}
              icon={FaCalendarAlt}
              color="secondary"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Pendências"
              value={stats.consultasPendentes}
              icon={FaExclamationTriangle}
              color="secondary"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Novas Mensagens"
              value={stats.novasMensagens}
              icon={FaComments}
              color="secondary"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Faturamento do Mês"
              value={`R$ ${stats.faturamentoMes.toLocaleString()}`}
              icon={FaMoneyBill}
              color="secondary"
            />
          </Col>
        </Row>

        {/* Layout Compacto */}
        <Row className="g-3">
          {/* Bloco 1: Caixa de Entrada (Inbox) */}
          <Col lg={6}>
            <Card
              className="border h-100"
              style={{ borderRadius: 8, borderColor: "#e9ecef" }}
            >
              <Card.Header
                className="bg-white border-0 pb-2"
                style={{ borderBottom: "1px solid #e9ecef" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "15px" }}>
                    <FaInbox className="me-2" style={{ color: "#6c757d" }} />
                    Caixa de Entrada
                  </h6>
                  {inboxItems.length > 0 && (
                    <Badge bg="secondary" style={{ backgroundColor: "#6c757d" }}>
                      {inboxItems.length}
                    </Badge>
                  )}
                </div>
              </Card.Header>
              <Card.Body className="p-3">
                {inboxItems.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {inboxItems.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center gap-2 p-2 rounded"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #e9ecef",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f1f3f5";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#f8f9fa";
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center rounded"
                          style={{
                            width: 32,
                            height: 32,
                            backgroundColor: "#e9ecef",
                            color: "#6c757d",
                          }}
                        >
                          {item.tipo === "exame" && <FaFileMedical size={14} />}
                          {item.tipo === "mensagem" && <FaComments size={14} />}
                          {item.tipo === "estoque" && <FaBox size={14} />}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "14px" }}>
                            {item.titulo}
                          </h6>
                          <small className="text-muted" style={{ fontSize: "12px" }}>
                            {item.paciente || item.produto} •{" "}
                            {new Date(item.data).toLocaleDateString("pt-BR")}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FaInbox size={32} className="text-muted mb-2" />
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                      Nenhuma mensagem
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Bloco 2: Agenda de Hoje */}
          <Col lg={6}>
            <Card
              className="border h-100"
              style={{ borderRadius: 8, borderColor: "#e9ecef" }}
            >
              <Card.Header
                className="bg-white border-0 pb-2"
                style={{ borderBottom: "1px solid #e9ecef" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "15px" }}>
                    <FaClock className="me-2" style={{ color: "#6c757d" }} />
                    Agenda de Hoje
                  </h6>
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    style={{ color: "#6c757d", fontSize: "13px" }}
                    onClick={() => handleCardClick("agenda")}
                  >
                    Ver todas
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-3">
                {consultasHoje.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {consultasHoje.slice(0, 4).map((consulta) => (
                      <div
                        key={consulta.id}
                        className="d-flex justify-content-between align-items-center p-2 rounded"
                        style={{
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded"
                            style={{
                              width: 32,
                              height: 32,
                              backgroundColor: "#e9ecef",
                              color: "#6c757d",
                            }}
                          >
                            <FaPaw size={14} />
                          </div>
                          <div>
                            <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "14px" }}>
                              {consulta.paciente}
                            </h6>
                            <small className="text-muted" style={{ fontSize: "12px" }}>
                              {consulta.tutor} • {consulta.horario}
                            </small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {getStatusBadge(consulta.status)}
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            style={{ borderColor: "#e9ecef", color: "#6c757d", fontSize: "12px" }}
                          >
                            Ver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FaCalendarAlt size={32} className="text-muted mb-2" />
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                      Nenhuma consulta agendada para hoje
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Acesso Rápido */}
        <Row className="mt-3">
          <Col xs={12}>
            <Card className="border" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
              <Card.Body className="p-3">
                <h6 className="fw-semibold text-dark mb-3" style={{ fontSize: "15px" }}>
                  Acesso Rápido
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleCardClick("agenda")}
                    style={{ borderColor: "#e9ecef", color: "#6c757d" }}
                  >
                    <FaPlus className="me-2" />
                    Nova Consulta
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleCardClick("pacientes")}
                    style={{ borderColor: "#e9ecef", color: "#6c757d" }}
                  >
                    <FaUsers className="me-2" />
                    Novo Paciente
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleCardClick("buscar-paciente")}
                    style={{ borderColor: "#e9ecef", color: "#6c757d" }}
                  >
                    <FaSearch className="me-2" />
                    Buscar Paciente
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleCardClick("estoque")}
                    style={{ borderColor: "#e9ecef", color: "#6c757d" }}
                  >
                    <FaBox className="me-2" />
                    Estoque
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Gráficos */}
        {faturamentoData.length > 0 || servicosData.length > 0 ? (
          <Row className="mt-3">
            <Col lg={6}>
              <Card className="border" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
                <Card.Body className="p-3">
                  <SimpleChart
                    title="Faturamento Mensal"
                    data={faturamentoData}
                    color="#6c757d"
                    height={180}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="border" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
                <Card.Body className="p-3">
                  <SimpleChart
                    title="Serviços Realizados"
                    data={servicosData}
                    color="#6c757d"
                    height={180}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default DashboardVeterinario;
