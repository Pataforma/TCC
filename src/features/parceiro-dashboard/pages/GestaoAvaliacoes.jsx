import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  Alert,
  Dropdown,
  Image,
} from "react-bootstrap";
import {
  FaStar,
  FaReply,
  FaEye,
  FaEllipsisV,
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaUser,
  FaCalendarAlt,
  FaChartBar,
  FaEdit,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "./GestaoAvaliacoes.module.css";

const GestaoAvaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([
    {
      id: 1,
      cliente: {
        nome: "Eduardo Santos",
        email: "eduardo@email.com",
        avatar: "/src/assets/imgs/eduardo.png",
      },
      servico: "Banho e Tosa Completo",
      nota: 5,
      comentario:
        "Excelente atendimento! Meu cachorro ficou lindo e cheiroso. Recomendo muito!",
      data: "2024-01-15T10:30:00",
      respondida: false,
      resposta: "",
      status: "publicada",
      util: 3,
      naoUtil: 0,
    },
    {
      id: 2,
      cliente: {
        nome: "Johan Victor",
        email: "johan@email.com",
        avatar: "/src/assets/imgs/johan.png",
      },
      servico: "Consulta Veterinária",
      nota: 4,
      comentario:
        "Bom atendimento, veterinário muito atencioso. Só demorou um pouco para ser atendido.",
      data: "2024-01-14T14:20:00",
      respondida: true,
      resposta:
        "Obrigado pelo feedback! Estamos trabalhando para melhorar o tempo de atendimento.",
      status: "publicada",
      util: 1,
      naoUtil: 0,
    },
    {
      id: 3,
      cliente: {
        nome: "Laila Nichole",
        email: "laila@email.com",
        avatar: "/src/assets/imgs/laila.png",
      },
      servico: "Vacinação",
      nota: 5,
      comentario:
        "Profissionais muito competentes. Meu gato nem percebeu que foi vacinado!",
      data: "2024-01-13T09:15:00",
      respondida: false,
      resposta: "",
      status: "publicada",
      util: 2,
      naoUtil: 0,
    },
    {
      id: 4,
      cliente: {
        nome: "Levi Oliveira",
        email: "levi@email.com",
        avatar: "/src/assets/imgs/levi.png",
      },
      servico: "Banho e Tosa Completo",
      nota: 2,
      comentario:
        "Não gostei do serviço. Meu cachorro ficou com mau cheiro e a tosa não ficou boa.",
      data: "2024-01-12T16:45:00",
      respondida: true,
      resposta:
        "Lamentamos muito sua experiência. Entraremos em contato para resolver essa situação.",
      status: "publicada",
      util: 0,
      naoUtil: 1,
    },
  ]);

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [filterRating, setFilterRating] = useState("todas");
  const [message, setMessage] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    media: 0,
    cincoEstrelas: 0,
    umaEstrela: 0,
    respondidas: 0,
    naoRespondidas: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [avaliacoes]);

  const calculateStats = () => {
    const total = avaliacoes.length;
    const media = avaliacoes.reduce((sum, av) => sum + av.nota, 0) / total;
    const cincoEstrelas = avaliacoes.filter((av) => av.nota === 5).length;
    const umaEstrela = avaliacoes.filter((av) => av.nota === 1).length;
    const respondidas = avaliacoes.filter((av) => av.respondida).length;
    const naoRespondidas = total - respondidas;

    setStats({
      total,
      media: media.toFixed(1),
      cincoEstrelas,
      umaEstrela,
      respondidas,
      naoRespondidas,
    });
  };

  const filteredAvaliacoes = avaliacoes.filter((avaliacao) => {
    const matchesStatus =
      filterStatus === "todas" ||
      (filterStatus === "respondidas" && avaliacao.respondida) ||
      (filterStatus === "nao-respondidas" && !avaliacao.respondida);

    const matchesRating =
      filterRating === "todas" ||
      (filterRating === "5" && avaliacao.nota === 5) ||
      (filterRating === "4" && avaliacao.nota === 4) ||
      (filterRating === "3" && avaliacao.nota === 3) ||
      (filterRating === "2" && avaliacao.nota === 2) ||
      (filterRating === "1" && avaliacao.nota === 1);

    return matchesStatus && matchesRating;
  });

  const handleReply = (avaliacao) => {
    setSelectedAvaliacao(avaliacao);
    setReplyText(avaliacao.resposta || "");
    setShowReplyModal(true);
  };

  const submitReply = async () => {
    if (!replyText.trim()) {
      setMessage({
        type: "warning",
        text: "Digite uma resposta antes de enviar.",
      });
      return;
    }

    try {
      setAvaliacoes((prev) =>
        prev.map((av) =>
          av.id === selectedAvaliacao.id
            ? { ...av, resposta: replyText, respondida: true }
            : av
        )
      );

      setMessage({
        type: "success",
        text: "Resposta enviada com sucesso!",
      });

      setShowReplyModal(false);
      setSelectedAvaliacao(null);
      setReplyText("");
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Erro ao enviar resposta. Tente novamente.",
      });
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRatingColor = (nota) => {
    if (nota >= 4) return "success";
    if (nota >= 3) return "warning";
    return "danger";
  };

  const renderStars = (nota) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < nota ? "text-warning" : "text-muted"}
        size={14}
      />
    ));
  };

  return (
    <DashboardLayout
      tipoUsuario="parceiro"
      nomeUsuario="Pet Shop Patinhas Felizes"
    >
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-dark mb-1">Gestão de Avaliações</h1>
            <p className="text-muted mb-0">
              Gerencie as avaliações dos seus clientes e responda aos feedbacks
            </p>
          </div>
        </div>

        {message && (
          <Alert
            variant={message.type}
            dismissible
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        {/* Estatísticas */}
        <Row className="mb-4">
          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-primary">{stats.total}</h3>
                <small className="text-muted">Total de Avaliações</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-warning">{stats.media}</h3>
                <small className="text-muted">Nota Média</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-success">{stats.cincoEstrelas}</h3>
                <small className="text-muted">5 Estrelas</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-danger">{stats.umaEstrela}</h3>
                <small className="text-muted">1 Estrela</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-info">{stats.respondidas}</h3>
                <small className="text-muted">Respondidas</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-secondary">
                  {stats.naoRespondidas}
                </h3>
                <small className="text-muted">Não Respondidas</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtros */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Filtrar por Status</Form.Label>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="todas">Todas as Avaliações</option>
                    <option value="respondidas">Respondidas</option>
                    <option value="nao-respondidas">Não Respondidas</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Filtrar por Nota</Form.Label>
                  <Form.Select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                  >
                    <option value="todas">Todas as Notas</option>
                    <option value="5">5 Estrelas</option>
                    <option value="4">4 Estrelas</option>
                    <option value="3">3 Estrelas</option>
                    <option value="2">2 Estrelas</option>
                    <option value="1">1 Estrela</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <div className="text-muted">
                  {filteredAvaliacoes.length} de {avaliacoes.length} avaliações
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Lista de Avaliações */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-0">
            <h5 className="mb-0">Avaliações dos Clientes</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className={styles.avaliacoesList}>
              {filteredAvaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className={styles.avaliacaoItem}>
                  <div className={styles.avaliacaoHeader}>
                    <div className={styles.clienteInfo}>
                      <Image
                        src={avaliacao.cliente.avatar}
                        alt={avaliacao.cliente.nome}
                        className={styles.clienteAvatar}
                        onError={(e) => {
                          e.target.src = "/src/assets/imgs/placeholder.jpg";
                        }}
                      />
                      <div>
                        <h6 className="mb-1">{avaliacao.cliente.nome}</h6>
                        <small className="text-muted">
                          {avaliacao.servico}
                        </small>
                      </div>
                    </div>
                    <div className={styles.avaliacaoMeta}>
                      <div className={styles.rating}>
                        {renderStars(avaliacao.nota)}
                        <Badge
                          bg={getRatingColor(avaliacao.nota)}
                          className="ms-2"
                        >
                          {avaliacao.nota}/5
                        </Badge>
                      </div>
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        {formatarData(avaliacao.data)}
                      </small>
                    </div>
                  </div>

                  <div className={styles.avaliacaoContent}>
                    <p className="mb-3">{avaliacao.comentario}</p>

                    <div className={styles.avaliacaoActions}>
                      <div className={styles.utilidade}>
                        <Button variant="outline-success" size="sm">
                          <FaThumbsUp className="me-1" />
                          {avaliacao.util}
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <FaThumbsDown className="me-1" />
                          {avaliacao.naoUtil}
                        </Button>
                      </div>

                      <div className={styles.acoes}>
                        {!avaliacao.respondida ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleReply(avaliacao)}
                          >
                            <FaReply className="me-1" />
                            Responder
                          </Button>
                        ) : (
                          <Badge bg="success">Respondida</Badge>
                        )}
                      </div>
                    </div>

                    {avaliacao.respondida && (
                      <div className={styles.resposta}>
                        <div className={styles.respostaHeader}>
                          <FaUser className="me-2" />
                          <strong>Sua resposta:</strong>
                        </div>
                        <p className="mb-2">{avaliacao.resposta}</p>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleReply(avaliacao)}
                        >
                          <FaEdit className="me-1" />
                          Editar Resposta
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredAvaliacoes.length === 0 && (
                <div className="text-center py-5">
                  <FaStar size={48} className="text-muted mb-3" />
                  <h6>Nenhuma avaliação encontrada</h6>
                  <p className="text-muted">
                    Não há avaliações que correspondam aos filtros aplicados.
                  </p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Modal de Resposta */}
        <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Responder Avaliação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAvaliacao && (
              <div className="mb-3">
                <h6>Avaliação de {selectedAvaliacao.cliente.nome}</h6>
                <div className="mb-2">
                  {renderStars(selectedAvaliacao.nota)}
                  <Badge
                    bg={getRatingColor(selectedAvaliacao.nota)}
                    className="ms-2"
                  >
                    {selectedAvaliacao.nota}/5
                  </Badge>
                </div>
                <p className="text-muted">{selectedAvaliacao.comentario}</p>
              </div>
            )}

            <Form.Group>
              <Form.Label>Sua Resposta</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Digite sua resposta à avaliação..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowReplyModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={submitReply}>
              Enviar Resposta
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default GestaoAvaliacoes;
