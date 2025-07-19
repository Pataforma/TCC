import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import {
  FaEye,
  FaPhone,
  FaStar,
  FaChartLine,
  FaBell,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatCard from "../../../components/ui/StatCard";
import SimpleChart from "../../../components/Dashboard/SimpleChart";
import styles from "./DashboardParceiroServico.module.css";

const DashboardParceiroServico = () => {
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      visualizacoes: 1247,
      cliquesContato: 89,
      novasAvaliacoes: 12,
      notaMedia: 4.8,
    },
    graficoAtividade: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      data: [120, 190, 300, 500, 200, 300],
    },
    atividadesRecentes: [
      {
        id: 1,
        tipo: "avaliacao",
        mensagem: "Nova avaliação 5 estrelas de Maria Silva",
        tempo: "2 horas atrás",
        nota: 5,
      },
      {
        id: 2,
        tipo: "contato",
        mensagem: "Clique no contato - João Santos",
        tempo: "4 horas atrás",
      },
      {
        id: 3,
        tipo: "visualizacao",
        mensagem: "Perfil visualizado por 15 pessoas",
        tempo: "6 horas atrás",
      },
      {
        id: 4,
        tipo: "avaliacao",
        mensagem: "Nova avaliação 4 estrelas de Ana Costa",
        tempo: "1 dia atrás",
        nota: 4,
      },
    ],
    servicosPopulares: [
      { nome: "Banho e Tosa", visualizacoes: 156, conversoes: 23 },
      { nome: "Consulta Veterinária", visualizacoes: 89, conversoes: 12 },
      { nome: "Vacinação", visualizacoes: 67, conversoes: 8 },
    ],
  });

  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      titulo: "Nova avaliação recebida",
      mensagem: "Maria Silva deixou uma avaliação 5 estrelas",
      tempo: "2h atrás",
      lida: false,
    },
    {
      id: 2,
      titulo: "Perfil atualizado",
      mensagem: "Suas informações foram atualizadas com sucesso",
      tempo: "1 dia atrás",
      lida: true,
    },
  ]);

  const getVariacaoPercentual = (atual, anterior) => {
    if (anterior === 0) return 100;
    return ((atual - anterior) / anterior) * 100;
  };

  const formatarNumero = (numero) => {
    return numero.toLocaleString("pt-BR");
  };

  const getTipoAtividade = (tipo) => {
    const tipos = {
      avaliacao: { icon: FaStar, color: "warning", text: "Avaliação" },
      contato: { icon: FaPhone, color: "success", text: "Contato" },
      visualizacao: { icon: FaEye, color: "info", text: "Visualização" },
    };
    return tipos[tipo] || tipos.visualizacao;
  };

  return (
    <DashboardLayout
      tipoUsuario="parceiro"
      nomeUsuario="Pet Shop Patinhas Felizes"
    >
      <div className="container-fluid">
        {/* Header da Dashboard */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-dark mb-1">Visão Geral</h1>
            <p className="text-muted mb-0">
              Acompanhe o desempenho do seu negócio na Pataforma
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm">
              <FaCalendarAlt className="me-2" />
              Últimos 30 dias
            </Button>
            <Button variant="outline-secondary" size="sm">
              <FaBell className="me-2" />
              {notificacoes.filter((n) => !n.lida).length}
            </Button>
          </div>
        </div>

        {/* KPIs Principais */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Visualizações do Perfil"
              value={dashboardData.kpis.visualizacoes}
              color="primary"
              icon={FaEye}
              subtitle={`+${getVariacaoPercentual(1247, 980)}% vs mês anterior`}
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Cliques no Contato"
              value={dashboardData.kpis.cliquesContato}
              color="success"
              icon={FaPhone}
              subtitle={`+${getVariacaoPercentual(89, 67)}% vs mês anterior`}
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Novas Avaliações"
              value={dashboardData.kpis.novasAvaliacoes}
              color="warning"
              icon={FaStar}
              subtitle={`+${getVariacaoPercentual(12, 8)}% vs mês anterior`}
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Nota Média"
              value={dashboardData.kpis.notaMedia}
              color="info"
              icon={FaStar}
              subtitle="Baseado em 47 avaliações"
            />
          </Col>
        </Row>

        <Row>
          {/* Gráfico de Atividade */}
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <FaChartLine className="me-2" />
                    Evolução das Visualizações
                  </h5>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm">
                      7 dias
                    </Button>
                    <Button variant="primary" size="sm">
                      30 dias
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      90 dias
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <SimpleChart
                  data={dashboardData.graficoAtividade.data}
                  labels={dashboardData.graficoAtividade.labels}
                  title="Visualizações do Perfil"
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Feed de Atividades Recentes */}
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">
                  <FaBell className="me-2" />
                  Atividades Recentes
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className={styles.activityFeed}>
                  {dashboardData.atividadesRecentes.map((atividade) => {
                    const tipoInfo = getTipoAtividade(atividade.tipo);
                    const IconComponent = tipoInfo.icon;

                    return (
                      <div key={atividade.id} className={styles.activityItem}>
                        <div className={styles.activityIcon}>
                          <IconComponent className={`text-${tipoInfo.color}`} />
                        </div>
                        <div className={styles.activityContent}>
                          <div className={styles.activityMessage}>
                            {atividade.mensagem}
                          </div>
                          <div className={styles.activityTime}>
                            {atividade.tempo}
                          </div>
                        </div>
                        {atividade.nota && (
                          <div className={styles.activityRating}>
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < atividade.nota
                                    ? "text-warning"
                                    : "text-muted"
                                }
                                size={12}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Serviços Mais Populares */}
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">
                  <FaUsers className="me-2" />
                  Serviços Mais Populares
                </h5>
              </Card.Header>
              <Card.Body>
                <div className={styles.servicesList}>
                  {dashboardData.servicosPopulares.map((servico, index) => (
                    <div key={index} className={styles.serviceItem}>
                      <div className={styles.serviceInfo}>
                        <h6 className="mb-1">{servico.nome}</h6>
                        <small className="text-muted">
                          {formatarNumero(servico.visualizacoes)} visualizações
                        </small>
                      </div>
                      <div className={styles.serviceStats}>
                        <div className={styles.conversionRate}>
                          <span className="fw-bold text-success">
                            {Math.round(
                              (servico.conversoes / servico.visualizacoes) * 100
                            )}
                            %
                          </span>
                          <small className="text-muted d-block">
                            Taxa de conversão
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Notificações */}
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">
                  <FaBell className="me-2" />
                  Notificações
                </h5>
              </Card.Header>
              <Card.Body>
                <div className={styles.notificationsList}>
                  {notificacoes.map((notificacao) => (
                    <div
                      key={notificacao.id}
                      className={`${styles.notificationItem} ${
                        !notificacao.lida ? styles.unread : ""
                      }`}
                    >
                      <div className={styles.notificationContent}>
                        <h6 className="mb-1">{notificacao.titulo}</h6>
                        <p className="mb-1 text-muted">
                          {notificacao.mensagem}
                        </p>
                        <small className="text-muted">
                          {notificacao.tempo}
                        </small>
                      </div>
                      {!notificacao.lida && (
                        <div className={styles.unreadIndicator}></div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="w-100 mt-3"
                >
                  Ver Todas as Notificações
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Alertas e Dicas */}
        <Row>
          <Col lg={12}>
            <Alert variant="info" className="border-0">
              <div className="d-flex align-items-center">
                <FaStar className="me-3" size={24} />
                <div>
                  <h6 className="mb-1">Dica do Dia</h6>
                  <p className="mb-0">
                    Responder às avaliações dos clientes pode aumentar sua nota
                    média em até 0.5 pontos!
                  </p>
                </div>
              </div>
            </Alert>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default DashboardParceiroServico;
