import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  Image,
  ListGroup,
} from "react-bootstrap";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUsers,
  FaUserPlus,
  FaBullhorn,
  FaComments,
  FaHeart,
} from "react-icons/fa";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";

const PerfilVeterinario = ({ veterinario, estatisticas, onUpdate }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agendaPublica, setAgendaPublica] = useState(false);

  useEffect(() => {
    if (veterinario?.id_veterinarios) {
      carregarPosts();
      verificarAgendaPublica();
    }
  }, [veterinario]);

  const carregarPosts = async () => {
    try {
      setLoading(true);
      const postsData = await api.get(
        `/marketing/posts/feed/publico?veterinario_id=${veterinario.id_veterinarios}`
      );
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const verificarAgendaPublica = async () => {
    try {
      const disponibilidade = await api.get(
        `/disponibilidade/publica/${veterinario.id_veterinarios}`
      );
      setAgendaPublica(disponibilidade?.disponibilidades?.length > 0);
    } catch (error) {
      console.error("Erro ao verificar agenda:", error);
    }
  };

  const handleEntrarContato = async () => {
    if (!user) {
      alert("Você precisa estar logado para entrar em contato");
      return;
    }

    // Buscar ou criar conversa com o veterinário
    try {
      // Por enquanto, apenas redirecionar para o chat
      // O chat pode ser atualizado depois para buscar/criar conversa automaticamente
      navigate("/dashboard/veterinario/chat", {
        state: { veterinario_id: veterinario.id_veterinarios },
      });
    } catch (error) {
      console.error("Erro ao entrar em contato:", error);
      // Mesmo assim, redirecionar para o chat
      navigate("/dashboard/veterinario/chat");
    }
  };

  return (
    <Row>
      <Col lg={4} className="mb-4">
        {/* Card de Perfil */}
        <Card className="mb-4">
          <Card.Body className="text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white mx-auto mb-3"
              style={{ width: 120, height: 120 }}
            >
              {veterinario.foto_url ? (
                <Image
                  src={veterinario.foto_url}
                  roundedCircle
                  style={{ width: 120, height: 120, objectFit: "cover" }}
                />
              ) : (
                <FaUser size={48} />
              )}
            </div>
            <h3>{veterinario.nome_clinica || "Veterinário"}</h3>
            {veterinario.crmv && (
              <p className="text-muted">CRMV: {veterinario.crmv}</p>
            )}
            {veterinario.especialidades && (
              <div className="mb-3">
                {veterinario.especialidades.split(",").map((esp, idx) => (
                  <Badge key={idx} bg="primary" className="me-1">
                    {esp.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Estatísticas */}
        <Card className="mb-4">
          <Card.Body>
            <h6 className="mb-3">Estatísticas</h6>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between">
                <span>
                  <FaBullhorn className="me-2" />
                  Posts
                </span>
                <Badge bg="primary">{estatisticas.posts}</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>
                  <FaUsers className="me-2" />
                  Seguidores
                </span>
                <Badge bg="success">{estatisticas.seguidores}</Badge>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>
                  <FaUserPlus className="me-2" />
                  Seguindo
                </span>
                <Badge bg="info">{estatisticas.seguindo}</Badge>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Informações de Contato */}
        <Card className="mb-4">
          <Card.Body>
            <h6 className="mb-3">Informações</h6>
            {veterinario.bio && <p className="mb-3">{veterinario.bio}</p>}
            {veterinario.nome_clinica && (
              <p className="mb-2">
                <strong>Clínica:</strong> {veterinario.nome_clinica}
              </p>
            )}
            {veterinario.endereco_clinica && (
              <p className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                {veterinario.endereco_clinica}
                {veterinario.cidade_clinica && `, ${veterinario.cidade_clinica}`}
                {veterinario.estado_clinica && ` - ${veterinario.estado_clinica}`}
              </p>
            )}
            {veterinario.telefone_clinica && (
              <p className="mb-2">
                <FaPhone className="me-2" />
                {veterinario.telefone_clinica}
              </p>
            )}
            {agendaPublica && (
              <div className="mt-3">
                <Badge bg="success">
                  <FaCalendarAlt className="me-1" />
                  Agenda Pública
                </Badge>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Botão de Contato */}
        {user && user.tipo_usuario === "tutor" && (
          <Button
            variant="primary"
            className="w-100"
            onClick={handleEntrarContato}
          >
            <FaComments className="me-2" />
            Entrar em Contato
          </Button>
        )}
      </Col>

      <Col lg={8}>
        <Card>
          <Card.Header>
            <h5 className="mb-0">Posts</h5>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUpdate={onUpdate}
                  showSeguir={false}
                />
              ))
            ) : (
              <div className="text-center p-5 text-muted">
                <FaBullhorn size={48} className="mb-3" />
                <p>Este veterinário ainda não tem posts</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PerfilVeterinario;

