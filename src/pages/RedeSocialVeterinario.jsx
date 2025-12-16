import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { api } from "../utils/api";
import { useUser } from "../contexts/UserContext";
import PostCard from "../features/vet-dashboard/components/PostCard";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUsers,
  FaBullhorn,
  FaComments,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { Button, Card, Row, Col, Badge, Image, Alert } from "react-bootstrap";

const RedeSocialVeterinario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [veterinario, setVeterinario] = useState(null);
  const [posts, setPosts] = useState([]);
  const [estatisticas, setEstatisticas] = useState({ posts: 0, seguidores: 0 });
  const [seguindo, setSeguindo] = useState(false);
  const [seguindoLoading, setSeguindoLoading] = useState(false);
  const [agendaPublica, setAgendaPublica] = useState(false);

  useEffect(() => {
    if (id) {
      carregarPerfil();
    }
  }, [id]);

  useEffect(() => {
    if (user && veterinario) {
      verificarSeguindo();
    }
  }, [user, veterinario]);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/veterinarios/${id}/perfil-publico`);
      
      setVeterinario(data.veterinario);
      setPosts(Array.isArray(data.posts) ? data.posts : []);
      setEstatisticas(data.estatisticas || { posts: 0, seguidores: 0 });
      setSeguindo(data.seguindo || false);

      // Verificar agenda pública (opcional, não crítico)
      if (data.veterinario?.agenda_publica) {
        try {
          const disponibilidade = await api.get(`/disponibilidade/publica/${id}`);
          setAgendaPublica(disponibilidade?.disponibilidades?.length > 0);
        } catch (error) {
          // Não é crítico, apenas não mostra o badge
          console.error("Erro ao verificar agenda:", error);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const verificarSeguindo = async () => {
    if (!user || !veterinario) return;

    try {
      const data = await api.get(`/seguidores/${id}/verificar`);
      setSeguindo(data.seguindo || false);
    } catch (error) {
      console.error("Erro ao verificar seguindo:", error);
      // Se der erro (ex: não autenticado), usar o valor do perfil público
      setSeguindo(false);
    }
  };

  const handleSeguir = async () => {
    if (!user) {
      alert("Você precisa estar logado para seguir veterinários");
      navigate("/telalogin");
      return;
    }

    // Verificar se o usuário está tentando seguir a si mesmo
    if (veterinario && veterinario.id_usuario === user.id_usuario) {
      alert("Você não pode seguir a si mesmo");
      return;
    }

    try {
      setSeguindoLoading(true);
      const data = await api.post("/seguidores", {
        veterinario_id: id,
      });
      setSeguindo(data.seguindo);
      if (data.seguindo) {
        setEstatisticas((prev) => ({
          ...prev,
          seguidores: prev.seguidores + 1,
        }));
      } else {
        setEstatisticas((prev) => ({
          ...prev,
          seguidores: Math.max(0, prev.seguidores - 1),
        }));
      }
    } catch (error) {
      console.error("Erro ao seguir veterinário:", error);
      alert("Erro ao seguir veterinário: " + (error.message || "Erro desconhecido"));
    } finally {
      setSeguindoLoading(false);
    }
  };

  const handleEntrarContato = async () => {
    if (!user) {
      alert("Você precisa estar logado para entrar em contato");
      navigate("/telalogin");
      return;
    }

    if (user.tipo_usuario !== "tutor") {
      alert("Apenas tutores podem entrar em contato com veterinários");
      return;
    }

    // Verificar se veterinário permite contato
    if (veterinario && (veterinario.permitir_contato === false || veterinario.permitir_contato === 0)) {
      alert("Este veterinário não permite contato de tutores");
      return;
    }

    try {
      // Criar conversa
      const conversa = await api.post('/conversas', {
        veterinario_id: id,
      });
      
      // Redirecionar para página de mensagens com a conversa aberta
      navigate(`/dashboard-tutor/mensagens?conversa=${conversa.id}`);
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      alert(error.message || 'Erro ao entrar em contato. Tente novamente.');
    }
  };

  // Verificar se é o próprio perfil do usuário (usando id_usuario como identificador global)
  const isOwnProfile = user && veterinario && veterinario.id_usuario === user.id_usuario;

  // Verificar se o usuário está tentando seguir a si mesmo
  useEffect(() => {
    if (user && veterinario && veterinario.id_usuario === user.id_usuario) {
      // Não permitir seguir a si mesmo
      setSeguindo(false);
    }
  }, [user, veterinario]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <FaSpinner className="spinner-border text-primary mb-3" size={48} />
          <p className="text-muted">Carregando perfil do veterinário...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!veterinario) {
    return (
      <>
        <Header />
        <div className="container py-5">
          <Alert variant="danger">
            <h5>Veterinário não encontrado</h5>
            <p>O perfil que você está procurando não existe ou foi removido.</p>
            <Button variant="primary" onClick={() => navigate("/veterinarios")}>
              Voltar para lista de veterinários
            </Button>
          </Alert>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5">
        <Button
          variant="outline-secondary"
          className="mb-4"
          onClick={() => navigate("/veterinarios")}
        >
          <FaArrowLeft className="me-2" />
          Voltar para lista
        </Button>

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
                <h3>{veterinario.nome_clinica || veterinario.nome_usuario || "Veterinário"}</h3>
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
                <div className="row text-center">
                  <div className="col-6">
                    <div className="fw-bold text-primary fs-4">
                      {estatisticas.posts}
                    </div>
                    <small className="text-muted">
                      <FaBullhorn className="me-1" />
                      Posts
                    </small>
                  </div>
                  <div className="col-6">
                    <div className="fw-bold text-success fs-4">
                      {estatisticas.seguidores}
                    </div>
                    <small className="text-muted">
                      <FaUsers className="me-1" />
                      Seguidores
                    </small>
                  </div>
                </div>
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

            {/* Botões de Ação */}
            <div className="d-flex flex-column gap-2">
              {!isOwnProfile && (
                <Button
                  variant={seguindo ? "outline-primary" : "primary"}
                  onClick={handleSeguir}
                  disabled={seguindoLoading}
                >
                  {seguindoLoading ? (
                    <>
                      <FaSpinner className="spinner-border spinner-border-sm me-2" />
                      {seguindo ? "Deixando de seguir..." : "Seguindo..."}
                    </>
                  ) : seguindo ? (
                    "Seguindo"
                  ) : (
                    "Seguir"
                  )}
                </Button>
              )}
              {user && user.tipo_usuario === "tutor" && !isOwnProfile && 
               veterinario && veterinario.permitir_contato !== false && veterinario.permitir_contato !== 0 && (
                <Button variant="outline-primary" onClick={handleEntrarContato}>
                  <FaComments className="me-2" />
                  Entrar em Contato
                </Button>
              )}
            </div>
          </Col>

          <Col lg={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <FaBullhorn className="me-2" />
                  Posts
                </h5>
              </Card.Header>
              <Card.Body>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onUpdate={carregarPerfil}
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
      </div>
      <Footer />
    </>
  );
};

export default RedeSocialVeterinario;

