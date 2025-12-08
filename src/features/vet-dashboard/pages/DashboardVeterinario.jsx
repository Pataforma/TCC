import React, { useState, useEffect } from "react";
import { Row, Col, Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatCard from "../../../components/Dashboard/StatCard";
import SimpleChart from "../../../components/Dashboard/SimpleChart";
import UpgradeToProBanner from "../../plans/components/UpgradeToProBanner";
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Dashboard Veterinário</h2>
            <p className="text-muted mb-0">
              Bem-vindo de volta, {user?.nome?.split(" ")[0] || "Doutor(a)"}!
              Aqui está o resumo do seu dia.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleCardClick("agenda")}
            >
              <FaCalendarAlt className="me-2" />
              Ver Agenda
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCardClick("financeiro")}
            >
              <FaMoneyBill className="me-2" />
              Financeiro
            </Button>
          </div>
        </div>
        <UpgradeToProBanner />

        {/* Cards de Estatísticas */}
        <Row className="g-4 mb-4">
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Consultas Agendadas"
              value={stats.consultasAgendadas}
              icon={FaCalendarAlt}
              color="primary"
              trend="up"
              trendValue="+12%"
              onClick={() => handleCardClick("agenda")}
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Pendências"
              value={stats.consultasPendentes}
              icon={FaExclamationTriangle}
              color="warning"
              trend="down"
              trendValue="-5%"
              onClick={() => handleCardClick("agenda")}
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Novas Mensagens"
              value={stats.novasMensagens}
              icon={FaComments}
              color="info"
              trend="up"
              trendValue="+8%"
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <StatCard
              title="Faturamento do Mês"
              value={`R$ ${stats.faturamentoMes.toLocaleString()}`}
              icon={FaMoneyBill}
              color="success"
              trend="up"
              trendValue="+15%"
              onClick={() => handleCardClick("financeiro")}
            />
          </Col>
        </Row>

        {/* Layout Orientado a Ações - 4 Blocos */}
        <Row className="g-4">
          {/* Bloco 1: Caixa de Entrada (Inbox) */}
          <Col lg={6}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: 16 }}
            >
              <Card.Header className="bg-white border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-semibold text-dark mb-0">
                    <FaInbox className="me-2 text-primary" />
                    Caixa de Entrada
                  </h5>
                  <Badge bg="danger">{inboxItems.length}</Badge>
                </div>
              </Card.Header>
              <Card.Body className="pt-3">
                <div className="d-flex flex-column gap-3">
                  {inboxItems.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-start gap-3 p-3 rounded-3 cursor-pointer hover-lift"
                      style={{
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor:
                            item.prioridade === "alta" ? "#dc3545" : "#ffc107",
                          color: "white",
                        }}
                      >
                        {item.tipo === "exame" && <FaFileMedical size={16} />}
                        {item.tipo === "mensagem" && <FaComments size={16} />}
                        {item.tipo === "estoque" && <FaBox size={16} />}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-semibold text-dark mb-1">
                          {item.titulo}
                        </h6>
                        <p className="text-muted mb-1" style={{ fontSize: 13 }}>
                          {item.descricao}
                        </p>
                        <small className="text-muted">
                          {item.paciente || item.produto} •{" "}
                          {new Date(item.data).toLocaleDateString("pt-BR")}
                        </small>
                      </div>
                      <Button variant="outline-primary" size="sm">
                        Ver
                      </Button>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Bloco 2: Agenda de Hoje */}
          <Col lg={6}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: 16 }}
            >
              <Card.Header className="bg-white border-0 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-semibold text-dark mb-0">
                    <FaClock className="me-2 text-primary" />
                    Agenda de Hoje
                  </h5>
                  <Button
                    variant="link"
                    className="text-primary p-0"
                    onClick={() => handleCardClick("agenda")}
                  >
                    Ver todas
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="pt-3">
                {consultasHoje.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {consultasHoje.slice(0, 4).map((consulta) => (
                      <div
                        key={consulta.id}
                        className="d-flex justify-content-between align-items-center p-3 rounded-3"
                        style={{
                          backgroundColor:
                            consulta.status === "confirmada"
                              ? "#f8f9fa"
                              : "#fff3cd",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                              width: 40,
                              height: 40,
                              backgroundColor:
                                consulta.status === "confirmada"
                                  ? "#0DB2AC"
                                  : "#FABA32",
                              color: "white",
                            }}
                          >
                            <FaPaw size={16} />
                          </div>
                          <div>
                            <h6 className="fw-semibold text-dark mb-1">
                              {consulta.paciente}
                            </h6>
                            <p
                              className="text-muted mb-0"
                              style={{ fontSize: 13 }}
                            >
                              {consulta.tutor} • {consulta.tipo}
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="text-end">
                            <div className="fw-semibold text-dark">
                              {consulta.horario}
                            </div>
                            {getStatusBadge(consulta.status)}
                          </div>
                          <div className="d-flex flex-column gap-1">
                            <Button variant="outline-primary" size="sm">
                              Ver Prontuário
                            </Button>
                            <Button variant="outline-success" size="sm">
                              Teleconsulta
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <FaCalendarAlt size={48} className="text-muted mb-3" />
                    <h6 className="text-muted">
                      Nenhuma consulta agendada para hoje
                    </h6>
                    <p className="text-muted" style={{ fontSize: 14 }}>
                      Aproveite para organizar sua agenda.
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Bloco 3: Acesso Rápido */}
        <Row className="mt-4">
          <Col xs={12}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4">
                <h6 className="fw-semibold text-dark mb-3">Acesso Rápido</h6>
                <div className="d-flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="rounded-pill px-4"
                    onClick={() => handleCardClick("agenda")}
                  >
                    <FaPlus className="me-2" />
                    Nova Consulta
                  </Button>
                  <Button
                    variant="success"
                    size="lg"
                    className="rounded-pill px-4"
                    onClick={() => handleCardClick("pacientes")}
                  >
                    <FaUsers className="me-2" />
                    Novo Paciente
                  </Button>
                  <Button
                    variant="info"
                    size="lg"
                    className="rounded-pill px-4"
                    onClick={() => handleCardClick("buscar-paciente")}
                  >
                    <FaSearch className="me-2" />
                    Buscar Paciente
                  </Button>
                  <Button
                    variant="warning"
                    size="lg"
                    className="rounded-pill px-4"
                    onClick={() => handleCardClick("estoque")}
                  >
                    <FaBox className="me-2" />
                    Gestão de Estoque
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Gráficos */}
        <Row className="mt-4">
          <Col lg={6}>
            <SimpleChart
              title="Faturamento Mensal"
              data={faturamentoData}
              color="#0DB2AC"
              height={200}
            />
          </Col>
          <Col lg={6}>
            <SimpleChart
              title="Serviços Realizados"
              data={servicosData}
              color="#FC694D"
              height={200}
            />
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default DashboardVeterinario;
