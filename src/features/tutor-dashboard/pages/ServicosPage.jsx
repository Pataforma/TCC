import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Modal,
  Alert,
  InputGroup,
} from "react-bootstrap";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaStar,
  FaFilter,
  FaSearch,
  FaClock,
  FaMap,
  FaDirections,
  FaHeart,
  FaShare,
  FaInfoCircle,
  FaUser,
  FaPaw,
  FaCut,
  FaHome,
  FaStore,
  FaCar,
  FaShieldAlt,
  FaMoneyBill,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";

const ServicosPage = () => {
  const { user } = useUser();
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [filtroLocalizacao, setFiltroLocalizacao] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroAvaliacao, setFiltroAvaliacao] = useState("");
  const [ordenacao, setOrdenacao] = useState("distancia");
  const [loading, setLoading] = useState(true);

  // Dados reais de serviços
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    if (user) {
      setNomeUsuario(user.nome || "");
    }
    fetchServicosLocais();
  }, [user, filtroLocalizacao, filtroTipo, filtroAvaliacao]);

  const fetchServicosLocais = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroLocalizacao) params.append("cidade", filtroLocalizacao);
      if (filtroTipo) params.append("tipo", filtroTipo);
      if (filtroAvaliacao) params.append("avaliacao_minima", filtroAvaliacao);

      const data = await api.get(`/servicos-locais?${params.toString()}`);
      setServicos(data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  };


  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "Veterinário":
        return <FaUser className="text-primary" />;
      case "Pet Shop":
        return <FaCut className="text-success" />;
      case "Hospedagem":
        return <FaHome className="text-warning" />;
      case "Adestramento":
        return <FaPaw className="text-info" />;
      case "Transporte":
        return <FaCar className="text-secondary" />;
      default:
        return <FaStore className="text-muted" />;
    }
  };

  const getAvaliacaoStars = (avaliacao) => {
    const stars = [];
    const fullStars = Math.floor(avaliacao);
    const hasHalfStar = avaliacao % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(
        <FaStar key="half" className="text-warning" style={{ opacity: 0.5 }} />
      );
    }

    const emptyStars = 5 - Math.ceil(avaliacao);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-muted" />);
    }

    return stars;
  };

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  const handleCall = (telefone) => {
    window.open(`tel:${telefone}`, "_self");
  };

  const handleWhatsApp = (whatsapp) => {
    const message = encodeURIComponent(
      "Olá! Gostaria de saber mais sobre os serviços."
    );
    window.open(
      `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${message}`,
      "_blank"
    );
  };

  const handleDirections = (endereco) => {
    const address = encodeURIComponent(`${endereco}, São Paulo, SP`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${address}`,
      "_blank"
    );
  };

  // Filtros já são aplicados no backend, mas podemos fazer filtros adicionais no frontend se necessário
  const servicosOrdenados = [...servicos].sort((a, b) => {
    switch (ordenacao) {
      case "distancia":
        // Por enquanto, manter ordem original já que distância é mock
        return 0;
      case "avaliacao":
        return b.avaliacao - a.avaliacao;
      case "preco":
        const precoA = parseFloat(a.precoMedio.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
        const precoB = parseFloat(b.precoMedio.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
        return precoA - precoB;
      default:
        return 0;
    }
  });

  return (
    <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  <FaMapMarkerAlt className="me-2" />
                  Serviços Locais
                </h2>
                <p className="text-muted mb-0">
                  Encontre os melhores serviços para seu pet na sua região
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Filtros */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>
                        <FaSearch className="me-2" />
                        Localização
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite sua cidade ou bairro"
                        value={filtroLocalizacao}
                        onChange={(e) => setFiltroLocalizacao(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>
                        <FaFilter className="me-2" />
                        Tipo de Serviço
                      </Form.Label>
                      <Form.Select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                      >
                        <option value="">Todos os tipos</option>
                        <option value="Veterinário">Veterinário</option>
                        <option value="Pet Shop">Pet Shop</option>
                        <option value="Hospedagem">Hospedagem</option>
                        <option value="Adestramento">Adestramento</option>
                        <option value="Transporte">Transporte</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>
                        <FaStar className="me-2" />
                        Avaliação Mínima
                      </Form.Label>
                      <Form.Select
                        value={filtroAvaliacao}
                        onChange={(e) => setFiltroAvaliacao(e.target.value)}
                      >
                        <option value="">Qualquer avaliação</option>
                        <option value="4.5">4.5+ estrelas</option>
                        <option value="4.0">4.0+ estrelas</option>
                        <option value="3.5">3.5+ estrelas</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>
                        <FaFilter className="me-2" />
                        Ordenar por
                      </Form.Label>
                      <Form.Select
                        value={ordenacao}
                        onChange={(e) => setOrdenacao(e.target.value)}
                      >
                        <option value="distancia">Menor Distância</option>
                        <option value="avaliacao">Melhor Avaliação</option>
                        <option value="preco">Menor Preço</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Resultados */}
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {loading ? (
                  <span>Carregando serviços...</span>
                ) : (
                  <span>{servicosOrdenados.length} serviço(s) encontrado(s)</span>
                )}
              </h5>
            </div>
          </Col>
        </Row>

        {loading ? (
          <Row>
            <Col className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </Col>
          </Row>
        ) : (
          <Row className="g-4">
            {servicosOrdenados.map((servico) => (
            <Col key={servico.id} lg={6} xl={4}>
              <Card className="border-0 shadow-sm h-100">
                {servico.destaque && (
                  <div className="position-absolute top-0 start-0 m-2">
                    <Badge bg="warning" text="dark">
                      <FaStar className="me-1" />
                      Destaque
                    </Badge>
                  </div>
                )}

                <div className="position-relative">
                  <img
                    src={servico.fotos[0]}
                    alt={servico.nome}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    {getTipoIcon(servico.tipo)}
                  </div>
                </div>

                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-1">{servico.nome}</h6>
                    <Badge bg="primary">{servico.tipo}</Badge>
                  </div>

                  <div className="mb-2">
                    <div className="d-flex align-items-center gap-1 mb-1">
                      {getAvaliacaoStars(servico.avaliacao)}
                      <span className="ms-2 fw-semibold">
                        {servico.avaliacao}
                      </span>
                      <span className="text-muted">
                        ({servico.totalAvaliacoes})
                      </span>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <FaMapMarkerAlt />
                      <span>{servico.distancia}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-1">
                      {servico.especialidades
                        .slice(0, 3)
                        .map((especialidade, index) => (
                          <Badge
                            key={index}
                            bg="light"
                            text="dark"
                            className="small"
                          >
                            {especialidade}
                          </Badge>
                        ))}
                      {servico.especialidades.length > 3 && (
                        <Badge bg="light" text="dark" className="small">
                          +{servico.especialidades.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <FaClock />
                      <span>{servico.horarioFuncionamento}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-success small">
                      <FaMoneyBill />
                      <span className="fw-semibold">{servico.precoMedio}</span>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="flex-fill"
                      onClick={() => handleCall(servico.telefone)}
                    >
                      <FaPhone className="me-1" />
                      Ligar
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="flex-fill"
                      onClick={() => handleWhatsApp(servico.whatsapp)}
                    >
                      <FaWhatsapp className="me-1" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleViewDetails(servico)}
                    >
                      <FaInfoCircle />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            ))}
          </Row>
        )}

        {!loading && servicosOrdenados.length === 0 && (
          <Row>
            <Col>
              <Alert variant="info" className="text-center py-5">
                <FaSearch size={48} className="mb-3" />
                <h5>Nenhum serviço encontrado</h5>
                <p className="mb-0">
                  Tente ajustar os filtros para encontrar serviços na sua
                  região.
                </p>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Modal de Detalhes */}
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedService && (
                <div className="d-flex align-items-center gap-2">
                  {getTipoIcon(selectedService.tipo)}
                  {selectedService.nome}
                </div>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedService && (
              <div>
                {/* Carrossel de Fotos */}
                <div className="mb-4">
                  {selectedService.fotos && selectedService.fotos.length > 0 ? (
                    <img
                      src={selectedService.fotos[0]}
                      alt={selectedService.nome}
                      className="img-fluid rounded"
                      style={{ width: "100%", height: 250, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center rounded"
                      style={{ width: "100%", height: 250 }}
                    >
                      <span className="text-muted">Sem foto</span>
                    </div>
                  )}
                </div>

                <Row>
                  <Col md={8}>
                    <h6 className="fw-bold">Sobre</h6>
                    <p className="text-muted">{selectedService.descricao}</p>

                    <h6 className="fw-bold mt-4">Serviços Oferecidos</h6>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {selectedService.servicos.map((servico, index) => (
                        <Badge key={index} bg="primary">
                          {servico}
                        </Badge>
                      ))}
                    </div>

                    <h6 className="fw-bold mt-4">Especialidades</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedService.especialidades.map(
                        (especialidade, index) => (
                          <Badge key={index} bg="light" text="dark">
                            {especialidade}
                          </Badge>
                        )
                      )}
                    </div>
                  </Col>

                  <Col md={4}>
                    <Card className="border-0 shadow-sm">
                      <Card.Body>
                        <h6 className="fw-bold">Informações</h6>

                        <div className="mb-3">
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            <FaMapMarkerAlt />
                            <span>Endereço</span>
                          </div>
                          <p className="mb-1">{selectedService.endereco}</p>
                          <p className="text-muted small mb-0">
                            {selectedService.cidade}, {selectedService.estado}
                          </p>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            <FaClock />
                            <span>Horário</span>
                          </div>
                          <p className="mb-0">
                            {selectedService.horarioFuncionamento}
                          </p>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            <FaMoneyBill />
                            <span>Preço Médio</span>
                          </div>
                          <p className="mb-0 fw-semibold text-success">
                            {selectedService.precoMedio}
                          </p>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            <FaStar />
                            <span>Avaliação</span>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            {getAvaliacaoStars(selectedService.avaliacao)}
                            <span className="ms-2 fw-semibold">
                              {selectedService.avaliacao}
                            </span>
                          </div>
                          <p className="text-muted small mb-0">
                            {selectedService.totalAvaliacoes} avaliações
                          </p>
                        </div>

                        <div className="d-grid gap-2">
                          <Button
                            variant="primary"
                            onClick={() => handleCall(selectedService.telefone)}
                          >
                            <FaPhone className="me-2" />
                            Ligar
                          </Button>
                          <Button
                            variant="success"
                            onClick={() =>
                              handleWhatsApp(selectedService.whatsapp)
                            }
                          >
                            <FaWhatsapp className="me-2" />
                            WhatsApp
                          </Button>
                          <Button
                            variant="outline-info"
                            onClick={() =>
                              handleDirections(selectedService.endereco)
                            }
                          >
                            <FaDirections className="me-2" />
                            Como Chegar
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default ServicosPage;
