import React, { useState, useEffect } from "react";
import { Row, Col, Card, Badge, Button } from "react-bootstrap";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/Dashboard/StatCard";
import SimpleChart from "../../components/Dashboard/SimpleChart";
import UpgradeToProBanner from "../../components/UpgradeToProBanner";
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
    consultasAgendadas: 8,
    consultasPendentes: 3,
    novasMensagens: 12,
    faturamentoMes: 15420,
  });

  const [consultasHoje, setConsultasHoje] = useState([
    {
      id: 1,
      paciente: "Rex",
      tutor: "Maria Silva",
      horario: "09:00",
      tipo: "Consulta de Rotina",
      status: "confirmada",
    },
    {
      id: 2,
      paciente: "Luna",
      tutor: "João Santos",
      horario: "10:30",
      tipo: "Vacinação",
      status: "pendente",
    },
    {
      id: 3,
      paciente: "Thor",
      tutor: "Ana Costa",
      horario: "14:00",
      tipo: "Exame",
      status: "confirmada",
    },
  ]);

  // Dados para a caixa de entrada (inbox)
  const [inboxItems] = useState([
    {
      id: 1,
      tipo: "exame",
      titulo: "Novo resultado de exame",
      descricao: "Hemograma do paciente Rex está disponível",
      paciente: "Rex",
      data: "2024-01-15",
      prioridade: "alta",
    },
    {
      id: 2,
      tipo: "mensagem",
      titulo: "Mensagem do tutor",
      descricao: "João Santos enviou uma mensagem sobre Luna",
      paciente: "Luna",
      data: "2024-01-15",
      prioridade: "media",
    },
    {
      id: 3,
      tipo: "estoque",
      titulo: "Alerta de estoque baixo",
      descricao: "Insulina NPH está com estoque baixo",
      produto: "Insulina NPH",
      data: "2024-01-14",
      prioridade: "alta",
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

  const [servicosData] = useState([
    { label: "Consultas", value: 45 },
    { label: "Vacinas", value: 28 },
    { label: "Exames", value: 32 },
    { label: "Cirurgias", value: 8 },
    { label: "Emergências", value: 12 },
  ]);

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
        window.location.href = "/dashboard/veterinario/agenda";
        break;
      case "pacientes":
        window.location.href = "/dashboard/veterinario/pacientes";
        break;
      case "financeiro":
        window.location.href = "/dashboard/veterinario/financeiro";
        break;
      default:
        break;
    }
  };

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario="Dr. André Silva">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Dashboard Veterinário</h2>
            <p className="text-muted mb-0">
              Bem-vindo de volta, Dr. André! Aqui está o resumo do seu dia.
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
                  >
                    <FaSearch className="me-2" />
                    Buscar Paciente
                  </Button>
                  <Button
                    variant="warning"
                    size="lg"
                    className="rounded-pill px-4"
                    onClick={() => (window.location.href = "/inventory")}
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
