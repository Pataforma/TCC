import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Table,
  Tabs,
  Tab,
  Modal,
  Form,
} from "react-bootstrap";
import {
  FaChartLine,
  FaChartBar,
  FaPlus,
  FaDownload,
  FaEye,
  FaEdit,
  FaPause,
  FaPlay,
  FaTrash,
  FaDollarSign,
  FaMousePointer,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebook,
  FaGlobe,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaHistory,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaTicketAlt,
  FaShare,
  FaCalendarPlus,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatCard from "../../../components/Dashboard/StatCard";
import AdvancedChart from "../../../components/Dashboard/AdvancedChart";
import CriarCampanhaModal from "../components/CriarCampanhaModal";

const DashboardAnunciante = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [showEventPreviewModal, setShowEventPreviewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dateFilter, setDateFilter] = useState("current_month");

  // Dados mockados para KPIs
  const kpis = {
    gastoTotal: 2500.0,
    cliquesTotais: 1250,
    cpcMedio: 2.0,
    conversoes: 89,
    comparativo: {
      gasto: 12,
      cliques: 25,
      cpc: -8,
      conversoes: 18,
    },
  };

  // Dados históricos para gráfico
  const historicalData = [
    { data: "01/12", gasto: 85, cliques: 42 },
    { data: "02/12", gasto: 92, cliques: 48 },
    { data: "03/12", gasto: 78, cliques: 35 },
    { data: "04/12", gasto: 105, cliques: 52 },
    { data: "05/12", gasto: 88, cliques: 45 },
    { data: "06/12", gasto: 95, cliques: 50 },
    { data: "07/12", gasto: 82, cliques: 38 },
    { data: "08/12", gasto: 110, cliques: 58 },
    { data: "09/12", gasto: 87, cliques: 44 },
    { data: "10/12", gasto: 93, cliques: 49 },
    { data: "11/12", gasto: 89, cliques: 46 },
    { data: "12/12", gasto: 96, cliques: 51 },
    { data: "13/12", gasto: 84, cliques: 41 },
    { data: "14/12", gasto: 101, cliques: 55 },
    { data: "15/12", gasto: 91, cliques: 47 },
  ];

  // Dados de campanhas ativas
  const campanhasAtivas = [
    {
      id: 1,
      nome: "Feira de Adoção - Dezembro",
      tipo: "Evento",
      status: "Ativa",
      cliques: 245,
      gasto: 490.0,
      cpc: 2.0,
      conversoes: 18,
      dataInicio: "2024-12-01",
      dataFim: "2024-12-31",
      orcamento: 500.0,
    },
    {
      id: 2,
      nome: "Promoção de Ração Premium",
      tipo: "Banner",
      status: "Ativa",
      cliques: 189,
      gasto: 378.0,
      cpc: 2.0,
      conversoes: 12,
      dataInicio: "2024-12-10",
      dataFim: "2024-12-25",
      orcamento: 400.0,
    },
    {
      id: 3,
      nome: "Workshop de Adestramento",
      tipo: "Evento",
      status: "Pausada",
      cliques: 156,
      gasto: 312.0,
      cpc: 2.0,
      conversoes: 8,
      dataInicio: "2024-12-05",
      dataFim: "2024-12-20",
      orcamento: 350.0,
    },
    {
      id: 4,
      nome: "Campanha de Vacinação",
      tipo: "Banner",
      status: "Ativa",
      cliques: 203,
      gasto: 406.0,
      cpc: 2.0,
      conversoes: 15,
      dataInicio: "2024-12-08",
      dataFim: "2024-12-28",
      orcamento: 450.0,
    },
  ];

  // Dados de faturas
  const faturas = [
    {
      id: 1,
      data: "2024-12-15",
      periodo: "Dezembro 2024",
      valor: 1250.0,
      status: "Paga",
      numeroFatura: "FAT-2024-001",
    },
    {
      id: 2,
      data: "2024-11-15",
      periodo: "Novembro 2024",
      valor: 980.0,
      status: "Paga",
      numeroFatura: "FAT-2024-002",
    },
    {
      id: 3,
      data: "2024-10-15",
      periodo: "Outubro 2024",
      valor: 750.0,
      status: "Paga",
      numeroFatura: "FAT-2024-003",
    },
  ];

  // Dados de transações
  const transacoes = [
    {
      id: 1,
      data: "2024-12-15",
      campanha: "Feira de Adoção - Dezembro",
      descricao: "Cobrança mensal",
      valor: 490.0,
      status: "Processada",
    },
    {
      id: 2,
      data: "2024-12-14",
      campanha: "Promoção de Ração Premium",
      descricao: "Cobrança diária",
      valor: 18.0,
      status: "Processada",
    },
    {
      id: 3,
      data: "2024-12-13",
      campanha: "Campanha de Vacinação",
      descricao: "Cobrança diária",
      valor: 20.0,
      status: "Processada",
    },
  ];

  // Dados de evento para preview
  const eventoPreview = {
    id: 1,
    titulo: "Feira de Adoção - Dezembro",
    data: "2024-12-28",
    horario: "14:00 - 18:00",
    local: "Pet Shop Amigo Fiel",
    endereco: "Rua das Flores, 123 - Centro, São Paulo - SP",
    descricao:
      "Venha conhecer nossos amigos peludos que estão procurando um lar amoroso! Teremos cães e gatos de todas as idades, já vacinados e castrados. Traga sua família e encontre o companheiro perfeito!",
    imagem: "/src/assets/imgs/petadocao1.jpg",
    linkIngressos: "https://www.sympla.com.br/feira-adocao-dezembro",
    websiteLocal: "https://www.petshopamigofiel.com.br",
    instagram: "@petshopamigofiel",
    facebook: "Pet Shop Amigo Fiel",
    organizador: {
      nome: "Pet Shop Amigo Fiel",
      logo: "/src/assets/imgs/logo.png",
      telefone: "(11) 99999-9999",
      email: "contato@petshopamigofiel.com.br",
    },
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const variants = {
      Ativa: "success",
      Pausada: "warning",
      Paga: "success",
      Pendente: "warning",
      Processada: "success",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const getTipoBadge = (tipo) => {
    const variants = {
      Evento: "primary",
      Banner: "info",
    };
    return <Badge bg={variants[tipo]}>{tipo}</Badge>;
  };

  const handlePreviewEvent = (evento) => {
    setSelectedEvent(evento);
    setShowEventPreviewModal(true);
  };

  const handleToggleCampaignStatus = (campaignId) => {
    // Lógica para alternar status da campanha
    console.log(`Alternando status da campanha ${campaignId}`);
  };

  return (
    <DashboardLayout tipoUsuario="anunciante" nomeUsuario="Pet Shop Amigo Fiel">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Dashboard do Anunciante</h2>
            <p className="text-muted mb-0">
              Gerencie suas campanhas e acompanhe o desempenho dos seus
              investimentos
            </p>
          </div>
          <div className="d-flex gap-2">
            <Form.Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: "auto" }}
            >
              <option value="current_month">Mês Atual</option>
              <option value="last_month">Mês Anterior</option>
              <option value="last_3_months">Últimos 3 Meses</option>
              <option value="last_6_months">Últimos 6 Meses</option>
            </Form.Select>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowCreateCampaignModal(true)}
              className="px-4"
            >
              <FaPlus className="me-2" />
              Criar Nova Campanha
            </Button>
          </div>
        </div>

        {/* KPIs Principais */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Gasto Total (Mês)"
              value={formatCurrency(kpis.gastoTotal)}
              icon={FaDollarSign}
              color="primary"
              trend={kpis.comparativo.gasto}
              trendLabel="vs mês anterior"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Cliques Totais"
              value={kpis.cliquesTotais.toLocaleString("pt-BR")}
              icon={FaMousePointer}
              color="success"
              trend={kpis.comparativo.cliques}
              trendLabel="vs mês anterior"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="CPC Médio"
              value={formatCurrency(kpis.cpcMedio)}
              icon={FaChartBar}
              color="info"
              trend={kpis.comparativo.cpc}
              trendLabel="vs mês anterior"
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <StatCard
              title="Conversões"
              value={kpis.conversoes.toString()}
              icon={FaUsers}
              color="warning"
              trend={kpis.comparativo.conversoes}
              trendLabel="vs mês anterior"
            />
          </Col>
        </Row>

        {/* Tabs de Navegação */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="overview" title="Visão Geral">
            <Row>
              {/* Gráfico Histórico */}
              <Col lg={8} className="mb-4">
                <Card className="h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaChartLine className="me-2" />
                      Desempenho dos Últimos 15 Dias
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <AdvancedChart
                      data={historicalData}
                      xKey="data"
                      yKeys={[
                        {
                          key: "gasto",
                          label: "Gasto Diário",
                          color: "#0d6efd",
                        },
                        { key: "cliques", label: "Cliques", color: "#28a745" },
                      ]}
                      height={300}
                      type="line"
                    />
                  </Card.Body>
                </Card>
              </Col>

              {/* Últimas Campanhas Ativas */}
              <Col lg={4} className="mb-4">
                <Card className="h-100">
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaCalendarAlt className="me-2" />
                      Últimas Campanhas Ativas
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {campanhasAtivas.slice(0, 3).map((campanha) => (
                      <div
                        key={campanha.id}
                        className="border-bottom pb-3 mb-3"
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1 fw-semibold">{campanha.nome}</h6>
                          {getTipoBadge(campanha.tipo)}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">
                            {campanha.cliques} cliques •{" "}
                            {formatCurrency(campanha.gasto)}
                          </small>
                          {getStatusBadge(campanha.status)}
                        </div>
                        <div className="d-flex gap-1">
                          <Button variant="outline-primary" size="sm">
                            <FaEye size={12} />
                          </Button>
                          <Button variant="outline-secondary" size="sm">
                            <FaEdit size={12} />
                          </Button>
                          <Button
                            variant={
                              campanha.status === "Ativa"
                                ? "outline-warning"
                                : "outline-success"
                            }
                            size="sm"
                            onClick={() =>
                              handleToggleCampaignStatus(campanha.id)
                            }
                          >
                            {campanha.status === "Ativa" ? (
                              <FaPause size={12} />
                            ) : (
                              <FaPlay size={12} />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="link" className="p-0">
                      Ver todas as campanhas →
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="campanhas" title="Gestão de Campanhas">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Todas as Campanhas e Eventos
                </h5>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateCampaignModal(true)}
                >
                  <FaPlus className="me-2" />
                  Nova Campanha
                </Button>
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Status</th>
                      <th>Cliques</th>
                      <th>Gasto</th>
                      <th>CPC</th>
                      <th>Conversões</th>
                      <th>Período</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campanhasAtivas.map((campanha) => (
                      <tr key={campanha.id}>
                        <td>
                          <div className="fw-semibold">{campanha.nome}</div>
                          <small className="text-muted">
                            Orçamento: {formatCurrency(campanha.orcamento)}
                          </small>
                        </td>
                        <td>{getTipoBadge(campanha.tipo)}</td>
                        <td>{getStatusBadge(campanha.status)}</td>
                        <td className="fw-semibold">{campanha.cliques}</td>
                        <td className="fw-semibold text-primary">
                          {formatCurrency(campanha.gasto)}
                        </td>
                        <td className="fw-semibold">
                          {formatCurrency(campanha.cpc)}
                        </td>
                        <td className="fw-semibold text-success">
                          {campanha.conversoes}
                        </td>
                        <td>
                          <small>
                            {new Date(campanha.dataInicio).toLocaleDateString(
                              "pt-BR"
                            )}{" "}
                            -{" "}
                            {new Date(campanha.dataFim).toLocaleDateString(
                              "pt-BR"
                            )}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handlePreviewEvent(campanha)}
                            >
                              <FaEye size={12} />
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                              <FaEdit size={12} />
                            </Button>
                            <Button
                              variant={
                                campanha.status === "Ativa"
                                  ? "outline-warning"
                                  : "outline-success"
                              }
                              size="sm"
                              onClick={() =>
                                handleToggleCampaignStatus(campanha.id)
                              }
                            >
                              {campanha.status === "Ativa" ? (
                                <FaPause size={12} />
                              ) : (
                                <FaPlay size={12} />
                              )}
                            </Button>
                            <Button variant="outline-danger" size="sm">
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
          </Tab>

          <Tab eventKey="financeiro" title="Gestão Financeira">
            <Tabs defaultActiveKey="faturamento" className="mb-3">
              <Tab eventKey="faturamento" title="Faturamento">
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <FaFileInvoiceDollar className="me-2" />
                      Histórico de Faturas
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Período</th>
                          <th>Número da Fatura</th>
                          <th>Valor</th>
                          <th>Status</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {faturas.map((fatura) => (
                          <tr key={fatura.id}>
                            <td>
                              {new Date(fatura.data).toLocaleDateString(
                                "pt-BR"
                              )}
                            </td>
                            <td>{fatura.periodo}</td>
                            <td>{fatura.numeroFatura}</td>
                            <td className="fw-semibold">
                              {formatCurrency(fatura.valor)}
                            </td>
                            <td>{getStatusBadge(fatura.status)}</td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                <FaDownload className="me-1" />
                                PDF
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="pagamentos" title="Métodos de Pagamento">
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">
                      <FaCreditCard className="me-2" />
                      Cartões Cadastrados
                    </h6>
                    <Button variant="primary" size="sm">
                      <FaPlus className="me-2" />
                      Adicionar Cartão
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center py-5">
                      <FaCreditCard size={48} className="text-muted mb-3" />
                      <h6 className="text-muted">Nenhum cartão cadastrado</h6>
                      <p className="text-muted mb-3">
                        Adicione um cartão de crédito para facilitar os
                        pagamentos
                      </p>
                      <Button variant="primary">
                        <FaPlus className="me-2" />
                        Adicionar Primeiro Cartão
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>

              <Tab eventKey="transacoes" title="Histórico de Transações">
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaHistory className="me-2" />
                      Extrato Detalhado
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Campanha</th>
                          <th>Descrição</th>
                          <th>Valor</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transacoes.map((transacao) => (
                          <tr key={transacao.id}>
                            <td>
                              {new Date(transacao.data).toLocaleDateString(
                                "pt-BR"
                              )}
                            </td>
                            <td className="fw-semibold">
                              {transacao.campanha}
                            </td>
                            <td>{transacao.descricao}</td>
                            <td className="fw-semibold text-primary">
                              {formatCurrency(transacao.valor)}
                            </td>
                            <td>{getStatusBadge(transacao.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Tab>
        </Tabs>
      </div>

      {/* Modal de Preview do Evento */}
      <Modal
        show={showEventPreviewModal}
        onHide={() => setShowEventPreviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCalendarAlt className="me-2" />
            Preview do Evento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div className="event-preview">
              {/* Banner Principal */}
              <div className="position-relative mb-4">
                <img
                  src={eventoPreview.imagem}
                  alt={eventoPreview.titulo}
                  className="w-100 rounded"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="position-absolute top-0 start-0 m-3">
                  <Badge bg="primary" className="fs-6 px-3 py-2">
                    <FaCalendarAlt className="me-2" />
                    Evento
                  </Badge>
                </div>
              </div>

              {/* Informações Principais */}
              <div className="row mb-4">
                <div className="col-md-8">
                  <h4 className="fw-bold mb-3">{eventoPreview.titulo}</h4>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="text-primary me-3" />
                      <div>
                        <strong>{eventoPreview.data}</strong>
                        <br />
                        <small className="text-muted">
                          {eventoPreview.horario}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaMapMarkerAlt className="text-primary me-3" />
                      <div>
                        <strong>{eventoPreview.local}</strong>
                        <br />
                        <small className="text-muted">
                          {eventoPreview.endereco}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <h6 className="fw-bold mb-3">Organizador</h6>
                      <img
                        src={eventoPreview.organizador.logo}
                        alt="Logo"
                        className="rounded-circle mb-2"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                      <h6 className="mb-1">{eventoPreview.organizador.nome}</h6>
                      <div className="d-flex justify-content-center gap-2 mt-2">
                        <Button variant="outline-primary" size="sm">
                          <FaPhone size={12} />
                        </Button>
                        <Button variant="outline-primary" size="sm">
                          <FaWhatsapp size={12} />
                        </Button>
                        <Button variant="outline-primary" size="sm">
                          <FaEnvelope size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2">Descrição</h6>
                <p className="text-muted">{eventoPreview.descricao}</p>
              </div>

              {/* Botões de Ação */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <Button variant="success" className="w-100" size="lg">
                    <FaTicketAlt className="me-2" />
                    Comprar Ingresso
                  </Button>
                </div>
                <div className="col-md-6">
                  <Button variant="outline-primary" className="w-100" size="lg">
                    <FaGlobe className="me-2" />
                    Visitar Site do Local
                  </Button>
                </div>
                <div className="col-md-6">
                  <Button variant="outline-info" className="w-100">
                    <FaInstagram className="me-2" />
                    Ver Instagram
                  </Button>
                </div>
                <div className="col-md-6">
                  <Button variant="outline-info" className="w-100">
                    <FaFacebook className="me-2" />
                    Ver Facebook
                  </Button>
                </div>
              </div>

              {/* Ações Adicionais */}
              <div className="d-flex justify-content-center gap-3">
                <Button variant="outline-secondary">
                  <FaCalendarPlus className="me-2" />
                  Adicionar ao Meu Calendário
                </Button>
                <Button variant="outline-secondary">
                  <FaShare className="me-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal de Criação de Campanha */}
      <CriarCampanhaModal
        show={showCreateCampaignModal}
        onHide={() => setShowCreateCampaignModal(false)}
      />
    </DashboardLayout>
  );
};

export default DashboardAnunciante;
