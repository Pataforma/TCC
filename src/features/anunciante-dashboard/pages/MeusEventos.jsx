import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Alert,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  FaPlus,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEye as FaViews,
  FaMousePointer,
  FaSearch,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTrash,
  FaCheck,
  FaCalendar,
  FaEye,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatusBadge from "../../../components/ui/StatusBadge";
import EventActionsDropdown from "../../../components/ui/EventActionsDropdown";
import StatCard from "../../../components/ui/StatCard";
import styles from "./MeusEventos.module.css";

const MeusEventos = () => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Dados mockados detalhados
  const [events, setEvents] = useState([
    {
      id: 1,
      nomeEvento: "Feira de Adoção Pet Feliz",
      categoria: "Feira de Adoção",
      bannerUrl: "/src/assets/imgs/petadocao1.jpg",
      descricao:
        "Venha encontrar seu novo melhor amigo! Teremos dezenas de cães e gatos esperando por um lar. Evento gratuito com adoção responsável.",
      local: "Parque da Cidade, Feira de Santana - BA",
      dataInicio: "2025-08-25T10:00:00",
      dataFim: "2025-08-25T17:00:00",
      capacidade: 200,
      formaAcesso: "Gratuito",
      custoIngresso: 0.0,
      linkIngressos: "",
      forneceCertificado: false,
      petFriendly: true,
      regrasPets:
        "Todos os cães devem estar na coleira. Gatos devem estar em caixa de transporte. Necessário carteira de vacinação atualizada.",
      preRequisitos:
        "Documento de identificação e comprovante de residência para adoção.",
      websiteLocal: "https://www.feiradesantana.ba.gov.br/",
      linkInstagram: "https://instagram.com/prefefeira",
      linkFacebook: "",
      status: "Publicado",
      visualizacoes: 12500,
      cliquesIngresso: 320,
      tituloAnuncio: "Feira de Adoção - Encontre seu Melhor Amigo!",
      textoAnuncio:
        "Venha encontrar seu novo melhor amigo! Teremos dezenas de cães e gatos esperando por um lar.",
      textoBotao: "Participar",
      linkDestino: "https://exemplo.com/evento1",
    },
    {
      id: 2,
      nomeEvento: "Workshop de Adestramento Positivo",
      categoria: "Workshop",
      bannerUrl: "/src/assets/imgs/adestramento.webp",
      descricao:
        "Aprenda técnicas modernas de adestramento positivo para cães. Workshop prático com especialistas certificados.",
      local: "Centro de Treinamento Canino, Salvador - BA",
      dataInicio: "2025-07-15T14:00:00",
      dataFim: "2025-07-15T18:00:00",
      capacidade: 50,
      formaAcesso: "Pago",
      custoIngresso: 150.0,
      linkIngressos: "https://sympla.com.br/workshop-adestramento",
      forneceCertificado: true,
      petFriendly: true,
      regrasPets:
        "Cães devem estar com coleira e guia. Máximo 1 cão por participante. Carteira de vacinação obrigatória.",
      preRequisitos:
        "Cão com pelo menos 6 meses de idade. Trazer petiscos e brinquedos favoritos.",
      websiteLocal: "https://www.centrocanino.com.br",
      linkInstagram: "https://instagram.com/centrocanino",
      linkFacebook: "https://facebook.com/centrocanino",
      status: "Finalizado",
      visualizacoes: 8750,
      cliquesIngresso: 150,
      tituloAnuncio: "Workshop de Adestramento Positivo",
      textoAnuncio:
        "Aprenda técnicas modernas de adestramento positivo para cães. Workshop prático com especialistas.",
      textoBotao: "Inscrever-se",
      linkDestino: "https://exemplo.com/evento2",
    },
    {
      id: 3,
      nomeEvento: "Cãominhada Beneficente",
      categoria: "Cãominhada",
      bannerUrl: "/src/assets/imgs/cachorro.png",
      descricao:
        "Cãominhada beneficente para arrecadar fundos para ONGs de proteção animal. Traga seu pet e participe!",
      local: "Orla de Salvador, Salvador - BA",
      dataInicio: "2025-09-10T08:00:00",
      dataFim: "2025-09-10T12:00:00",
      capacidade: 300,
      formaAcesso: "Pago",
      custoIngresso: 25.0,
      linkIngressos: "https://eventbrite.com/caominhada-beneficente",
      forneceCertificado: false,
      petFriendly: true,
      regrasPets:
        "Cães devem estar com coleira e guia. Trazer sacos para coleta de fezes. Água será fornecida.",
      preRequisitos:
        "Cão com carteira de vacinação em dia. Inscrição prévia obrigatória.",
      websiteLocal: "https://www.ongprotecaoanimal.org",
      linkInstagram: "https://instagram.com/ongprotecao",
      linkFacebook: "https://facebook.com/ongprotecao",
      status: "Rascunho",
      visualizacoes: 0,
      cliquesIngresso: 0,
      tituloAnuncio: "Cãominhada Beneficente - Ajude os Animais!",
      textoAnuncio:
        "Cãominhada beneficente para arrecadar fundos para ONGs de proteção animal. Traga seu pet!",
      textoBotao: "Inscrever-se",
      linkDestino: "https://exemplo.com/evento3",
    },
    {
      id: 4,
      nomeEvento: "Palestra sobre Nutrição Animal",
      categoria: "Palestra",
      bannerUrl: "/src/assets/imgs/racao.webp",
      descricao:
        "Palestra gratuita sobre nutrição adequada para cães e gatos. Com veterinário especialista em nutrição.",
      local: "Auditório da Faculdade de Veterinária, Feira de Santana - BA",
      dataInicio: "2025-08-30T19:00:00",
      dataFim: "2025-08-30T21:00:00",
      capacidade: 100,
      formaAcesso: "Gratuito",
      custoIngresso: 0.0,
      linkIngressos: "",
      forneceCertificado: true,
      petFriendly: false,
      regrasPets: "",
      preRequisitos: "Inscrição prévia obrigatória. Vagas limitadas.",
      websiteLocal: "https://www.faculdadevet.edu.br",
      linkInstagram: "https://instagram.com/faculdadevet",
      linkFacebook: "https://facebook.com/faculdadevet",
      status: "Publicado",
      visualizacoes: 3200,
      cliquesIngresso: 85,
      tituloAnuncio: "Palestra sobre Nutrição Animal - Gratuita!",
      textoAnuncio:
        "Palestra gratuita sobre nutrição adequada para cães e gatos. Com veterinário especialista.",
      textoBotao: "Participar",
      linkDestino: "https://exemplo.com/evento4",
    },
  ]);

  // Formatar data para exibição
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Formatar data e hora para exibição
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filtrar eventos
  const filteredEvents = events.filter((event) => {
    const matchesStatus =
      filterStatus === "todos" || event.status === filterStatus;
    const matchesSearch =
      event.nomeEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.local.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Ações dos eventos
  const handleEditEvent = (event) => {
    navigate("/dashboard/anunciante/novo-evento", {
      state: { editMode: true, eventData: event },
    });
  };

  const handleViewEvent = (event) => {
    // Simular visualização pública do evento
    window.open(`/evento/${event.id}`, "_blank");
  };

  const handleEndEvent = (event) => {
    setSelectedEvent(event);
    setShowEndModal(true);
  };

  const handleCancelEvent = (event) => {
    setSelectedEvent(event);
    setShowCancelModal(true);
  };

  const confirmEndEvent = () => {
    setEvents(
      events.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, status: "Finalizado" }
          : event
      )
    );
    setShowEndModal(false);
    setSelectedEvent(null);
  };

  const confirmCancelEvent = () => {
    setEvents(
      events.map((event) =>
        event.id === selectedEvent.id
          ? { ...event, status: "Cancelado" }
          : event
      )
    );
    setShowCancelModal(false);
    setSelectedEvent(null);
  };

  // Estatísticas
  const stats = {
    total: events.length,
    publicados: events.filter((e) => e.status === "Publicado").length,
    rascunhos: events.filter((e) => e.status === "Rascunho").length,
    finalizados: events.filter((e) => e.status === "Finalizado").length,
    totalVisualizacoes: events.reduce((sum, e) => sum + e.visualizacoes, 0),
    totalCliques: events.reduce((sum, e) => sum + e.cliquesIngresso, 0),
  };

  return (
    <DashboardLayout tipoUsuario="anunciante" nomeUsuario="Pet Shop Amigo Fiel">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-dark mb-1">Meus Eventos</h1>
            <p className="text-muted mb-0">
              Gerencie e acompanhe o desempenho dos seus eventos
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/dashboard/anunciante/novo-evento")}
            className={styles.createButton}
          >
            <FaPlus className="me-2" />
            Cadastrar Novo Evento
          </Button>
        </div>

        {/* Estatísticas Rápidas */}
        <Row className="mb-4">
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Total de Eventos"
              value={stats.total}
              color="primary"
              icon={FaCalendar}
            />
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Publicados"
              value={stats.publicados}
              color="success"
              icon={FaCheck}
            />
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Rascunhos"
              value={stats.rascunhos}
              color="warning"
              icon={FaEye}
            />
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Visualizações"
              value={stats.totalVisualizacoes}
              color="info"
              icon={FaViews}
            />
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Cliques"
              value={stats.totalCliques}
              color="success"
              icon={FaMousePointer}
            />
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Finalizados"
              value={stats.finalizados}
              color="secondary"
              icon={FaUsers}
            />
          </Col>
        </Row>

        {/* Filtros e Busca */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col lg={6} md={8} className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nome, categoria ou local..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col lg={3} md={4} className="mb-3">
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="todos">Todos os Status</option>
                  <option value="Publicado">Publicados</option>
                  <option value="Rascunho">Rascunhos</option>
                  <option value="Finalizado">Finalizados</option>
                  <option value="Cancelado">Cancelados</option>
                </Form.Select>
              </Col>
              <Col lg={3} className="mb-3">
                <div className="d-flex justify-content-end">
                  <small className="text-muted">
                    {filteredEvents.length} de {events.length} eventos
                  </small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabela de Eventos */}
        <Card>
          <Card.Header>
            <h5 className="mb-0">
              <FaCalendarAlt className="me-2" />
              Lista de Eventos
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Evento</th>
                    <th>Data</th>
                    <th>Local</th>
                    <th>Status</th>
                    <th className="d-none d-md-table-cell">
                      <FaViews className="me-1" />
                      Visualizações
                    </th>
                    <th className="d-none d-lg-table-cell">
                      <FaMousePointer className="me-1" />
                      Cliques
                    </th>
                    <th width="100">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <tr key={event.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className={styles.eventImage}>
                              <img
                                src={event.bannerUrl}
                                alt={event.nomeEvento}
                                className="rounded"
                                onError={(e) => {
                                  e.target.src =
                                    "/src/assets/imgs/event-placeholder.jpg";
                                }}
                              />
                            </div>
                            <div className="ms-3">
                              <div className="fw-semibold">
                                {event.nomeEvento}
                              </div>
                              <small className="text-muted">
                                {event.categoria}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-medium">
                              {formatDate(event.dataInicio)}
                            </div>
                            <small className="text-muted">
                              {formatDateTime(event.dataInicio).split(" ")[1]}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaMapMarkerAlt className="text-muted me-1" />
                            <small
                              className="text-truncate"
                              style={{ maxWidth: "150px" }}
                            >
                              {event.local}
                            </small>
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={event.status} />
                        </td>
                        <td className="d-none d-md-table-cell">
                          <span className="fw-medium">
                            {event.visualizacoes.toLocaleString()}
                          </span>
                        </td>
                        <td className="d-none d-lg-table-cell">
                          <span className="fw-medium">
                            {event.cliquesIngresso.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <EventActionsDropdown
                            event={event}
                            onEdit={() => handleEditEvent(event)}
                            onView={() => handleViewEvent(event)}
                            onEnd={() => handleEndEvent(event)}
                            onCancel={() => handleCancelEvent(event)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <div className="text-muted">
                          <FaCalendarAlt size={48} className="mb-3" />
                          <h6>Nenhum evento encontrado</h6>
                          <p>
                            Não há eventos que correspondam aos filtros
                            aplicados.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Modal de Confirmação - Encerrar Evento */}
      <Modal show={showEndModal} onHide={() => setShowEndModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheck className="me-2 text-success" />
            Encerrar Evento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza que deseja encerrar o evento{" "}
            <strong>"{selectedEvent?.nomeEvento}"</strong>?
          </p>
          <Alert variant="info">
            <FaInfoCircle className="me-2" />
            Eventos encerrados não podem ser editados, mas permanecerão visíveis
            para consulta.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEndModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={confirmEndEvent}>
            <FaCheck className="me-2" />
            Encerrar Evento
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmação - Cancelar Evento */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="me-2 text-danger" />
            Cancelar Evento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza que deseja cancelar o evento{" "}
            <strong>"{selectedEvent?.nomeEvento}"</strong>?
          </p>
          <Alert variant="danger">
            <FaExclamationTriangle className="me-2" />
            <strong>Atenção:</strong> Esta ação não pode ser desfeita. O evento
            será removido permanentemente.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmCancelEvent}>
            <FaTrash className="me-2" />
            Cancelar Evento
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default MeusEventos;
