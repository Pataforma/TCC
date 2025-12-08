import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  Tab,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaUserPlus,
  FaPlus,
  FaBullhorn,
  FaHeart,
  FaComment,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";
import { api } from "../../../utils/api";
import PostCard from "../components/PostCard";
import CriarPostModal from "../components/CriarPostModal";
import PerfilVeterinario from "../components/PerfilVeterinario";

const MarketingPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [meusPosts, setMeusPosts] = useState([]);
  const [seguindo, setSeguindo] = useState([]);
  const [seguidores, setSeguidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCriarPost, setShowCriarPost] = useState(false);
  const [veterinarioPerfil, setVeterinarioPerfil] = useState(null);
  const [estatisticas, setEstatisticas] = useState({
    posts: 0,
    seguidores: 0,
    seguindo: 0,
  });

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user, activeTab]);

  const carregarDados = async () => {
    try {
      setLoading(true);

      if (activeTab === "feed") {
        // Feed público ou personalizado
        if (user) {
          try {
            const feedData = await api.get("/marketing/posts/feed/seguindo");
            setPosts(Array.isArray(feedData) ? feedData : []);
          } catch (error) {
            // Se não conseguir feed personalizado, usar público
            const feedPublico = await api.get("/marketing/posts/feed/publico");
            setPosts(Array.isArray(feedPublico) ? feedPublico : []);
          }
        } else {
          const feedPublico = await api.get("/marketing/posts/feed/publico");
          setPosts(Array.isArray(feedPublico) ? feedPublico : []);
        }
      } else if (activeTab === "meus-posts") {
        const meusPostsData = await api.get("/marketing/posts");
        setMeusPosts(Array.isArray(meusPostsData) ? meusPostsData : []);
      } else if (activeTab === "seguindo") {
        const seguindoData = await api.get("/seguidores/seguindo");
        setSeguindo(Array.isArray(seguindoData) ? seguindoData : []);
      } else if (activeTab === "seguidores") {
        if (user?.tipo_usuario === "veterinario") {
          const vet = await api.get("/veterinarios/me");
          if (vet?.id_veterinarios) {
            const seguidoresData = await api.get(
              `/seguidores/${vet.id_veterinarios}/seguidores`
            );
            setSeguidores(Array.isArray(seguidoresData) ? seguidoresData : []);
          }
        }
      } else if (activeTab === "perfil") {
        if (user?.tipo_usuario === "veterinario") {
          const vet = await api.get("/veterinarios/me");
          setVeterinarioPerfil(vet);

          // Carregar estatísticas
          if (vet?.id_veterinarios) {
            const postsCount = await api.get("/marketing/posts");
            const seguidoresCount = await api.get(
              `/seguidores/${vet.id_veterinarios}/seguidores/count`
            );
            const seguindoCount = await api.get("/seguidores/seguindo/count");

            setEstatisticas({
              posts: Array.isArray(postsCount) ? postsCount.length : 0,
              seguidores: seguidoresCount?.count || 0,
              seguindo: seguindoCount?.count || 0,
            });
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCriado = () => {
    carregarDados();
  };

  const isVeterinario = user?.tipo_usuario === "veterinario";

  return (
    <DashboardLayout tipoUsuario={user?.tipo_usuario} nomeUsuario={user?.nome}>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  <FaBullhorn className="me-2" />
                  Rede Social
                </h2>
                <p className="text-muted mb-0">
                  Conecte-se com outros veterinários e tutores
                </p>
              </div>
              {isVeterinario && (
                <Button
                  variant="primary"
                  onClick={() => setShowCriarPost(true)}
                >
                  <FaPlus className="me-2" />
                  Novo Post
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Navegação por Abas */}
        <Row className="mb-4">
          <Col>
            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || "feed")}>
              <Nav.Item>
                <Nav.Link eventKey="feed">
                  <FaHome className="me-2" />
                  Feed
                </Nav.Link>
              </Nav.Item>
              {isVeterinario && (
                <>
                  <Nav.Item>
                    <Nav.Link eventKey="meus-posts">
                      <FaBullhorn className="me-2" />
                      Meus Posts
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="perfil">
                      <FaUser className="me-2" />
                      Perfil
                    </Nav.Link>
                  </Nav.Item>
                </>
              )}
              <Nav.Item>
                <Nav.Link eventKey="seguindo">
                  <FaUserPlus className="me-2" />
                  Seguindo
                  {seguindo.length > 0 && (
                    <Badge bg="primary" className="ms-2">
                      {seguindo.length}
                    </Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
              {isVeterinario && (
                <Nav.Item>
                  <Nav.Link eventKey="seguidores">
                    <FaUsers className="me-2" />
                    Seguidores
                    {seguidores.length > 0 && (
                      <Badge bg="primary" className="ms-2">
                        {seguidores.length}
                      </Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </Col>
        </Row>

        {/* Conteúdo das Abas */}
        <Tab.Content>
          <Tab.Pane eventKey="feed" active={activeTab === "feed"}>
            {loading ? (
              <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : posts.length > 0 ? (
              <Row>
                <Col lg={8} className="mx-auto">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onUpdate={carregarDados}
                      showSeguir={true}
                    />
                  ))}
                </Col>
              </Row>
            ) : (
              <Card className="text-center p-5">
                <Card.Body>
                  <FaBullhorn size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">Nenhum post encontrado</h5>
                  <p className="text-muted">
                    {user
                      ? "Siga veterinários para ver posts no seu feed"
                      : "Faça login para ver posts personalizados"}
                  </p>
                </Card.Body>
              </Card>
            )}
          </Tab.Pane>

          {isVeterinario && (
            <>
              <Tab.Pane eventKey="meus-posts" active={activeTab === "meus-posts"}>
                {loading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : meusPosts.length > 0 ? (
                  <Row>
                    <Col lg={8} className="mx-auto">
                      {meusPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onUpdate={carregarDados}
                          showSeguir={false}
                        />
                      ))}
                    </Col>
                  </Row>
                ) : (
                  <Card className="text-center p-5">
                    <Card.Body>
                      <FaBullhorn size={48} className="text-muted mb-3" />
                      <h5 className="text-muted">Você ainda não tem posts</h5>
                      <p className="text-muted">
                        Crie seu primeiro post para compartilhar com a comunidade
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => setShowCriarPost(true)}
                      >
                        <FaPlus className="me-2" />
                        Criar Post
                      </Button>
                    </Card.Body>
                  </Card>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="perfil" active={activeTab === "perfil"}>
                {veterinarioPerfil ? (
                  <PerfilVeterinario
                    veterinario={veterinarioPerfil}
                    estatisticas={estatisticas}
                    onUpdate={carregarDados}
                  />
                ) : (
                  <div className="text-center p-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}
              </Tab.Pane>
            </>
          )}

          <Tab.Pane eventKey="seguindo" active={activeTab === "seguindo"}>
            {loading ? (
              <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : seguindo.length > 0 ? (
              <Row>
                {seguindo.map((item) => (
                  <Col md={4} key={item.id} className="mb-4">
                    <Card>
                      <Card.Body className="text-center">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white mx-auto mb-3"
                          style={{ width: 80, height: 80 }}
                        >
                          {item.veterinario_foto ? (
                            <img
                              src={item.veterinario_foto}
                              alt={item.veterinario_nome}
                              className="rounded-circle"
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <FaUser size={32} />
                          )}
                        </div>
                        <h5>{item.veterinario_nome || "Veterinário"}</h5>
                        <p className="text-muted small">
                          {item.veterinario_especialidade || ""}
                        </p>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            // Navegar para perfil do veterinário
                            window.location.href = `/rede-social/perfil/${item.veterinario_id}`;
                          }}
                        >
                          Ver Perfil
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="text-center p-5">
                <Card.Body>
                  <FaUserPlus size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">Você não está seguindo ninguém</h5>
                  <p className="text-muted">
                    Siga veterinários para ver seus posts no feed
                  </p>
                </Card.Body>
              </Card>
            )}
          </Tab.Pane>

          {isVeterinario && (
            <Tab.Pane eventKey="seguidores" active={activeTab === "seguidores"}>
              {loading ? (
                <div className="text-center p-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : seguidores.length > 0 ? (
                <Row>
                  {seguidores.map((item) => (
                    <Col md={4} key={item.id} className="mb-4">
                      <Card>
                        <Card.Body className="text-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white mx-auto mb-3"
                            style={{ width: 80, height: 80 }}
                          >
                            <FaUser size={32} />
                          </div>
                          <h5>{item.seguidor_nome || "Usuário"}</h5>
                          <Badge bg="secondary" className="mb-2">
                            {item.seguidor_tipo || "Usuário"}
                          </Badge>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Card className="text-center p-5">
                  <Card.Body>
                    <FaUsers size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">Você ainda não tem seguidores</h5>
                    <p className="text-muted">
                      Compartilhe seus posts para ganhar seguidores
                    </p>
                  </Card.Body>
                </Card>
              )}
            </Tab.Pane>
          )}
        </Tab.Content>

        {/* Modal de Criar Post */}
        {isVeterinario && (
          <CriarPostModal
            show={showCriarPost}
            onHide={() => setShowCriarPost(false)}
            onPostCriado={handlePostCriado}
          />
        )}
      </Container>
    </DashboardLayout>
  );
};

export default MarketingPage;
