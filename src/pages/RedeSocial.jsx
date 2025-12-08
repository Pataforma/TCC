import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { api } from "../utils/api";
import { useUser } from "../contexts/UserContext";
import PostCard from "../features/vet-dashboard/components/PostCard";
import {
  FaSearch,
  FaSpinner,
  FaUser,
  FaBullhorn,
  FaHashtag,
} from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
  Badge,
  Tabs,
  Tab,
  Image,
  Alert,
} from "react-bootstrap";

const RedeSocial = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("feed");
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("");
  const [posts, setPosts] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    if (activeTab === "feed" && !termoBusca) {
      carregarFeed();
    }
    if (activeTab === "veterinarios") {
      carregarEspecialidades();
    }
  }, [activeTab, termoBusca]);

  const carregarFeed = async () => {
    try {
      setLoading(true);
      const data = await api.get("/marketing/posts/feed/publico?limit=50");
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const carregarEspecialidades = async () => {
    try {
      // Buscar todos os veterinários para extrair especialidades únicas
      const data = await api.get("/veterinarios/publicos");
      const vets = Array.isArray(data) ? data : [];
      
      // Extrair especialidades únicas
      const especialidadesUnicas = Array.from(
        new Set(
          vets
            .flatMap((v) => (v.especialidades ? v.especialidades.split(",") : []))
            .map((e) => e.trim())
            .filter((e) => e)
        )
      ).sort();
      
      setEspecialidades(especialidadesUnicas);
    } catch (error) {
      console.error("Erro ao carregar especialidades:", error);
      setEspecialidades([]);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!termoBusca.trim()) {
      if (activeTab === "feed") {
        carregarFeed();
      }
      return;
    }

    try {
      setBuscando(true);
      
      if (activeTab === "feed") {
        // Buscar posts
        const postsData = await api.get(
          `/marketing/posts/feed/publico?termo=${encodeURIComponent(termoBusca)}&limit=50`
        );
        setPosts(Array.isArray(postsData) ? postsData : []);
      } else if (activeTab === "veterinarios") {
        // Buscar veterinários
        const params = new URLSearchParams();
        if (termoBusca) params.append("termo", termoBusca);
        if (filtroEspecialidade) params.append("especialidade", filtroEspecialidade);
        
        const url = `/veterinarios/publicos${params.toString() ? `?${params.toString()}` : ""}`;
        const vetsData = await api.get(url);
        setVeterinarios(Array.isArray(vetsData) ? vetsData : []);
      }
    } catch (error) {
      console.error("Erro ao buscar:", error);
      if (activeTab === "feed") {
        setPosts([]);
      } else {
        setVeterinarios([]);
      }
    } finally {
      setBuscando(false);
    }
  };

  const handleLimparBusca = () => {
    setTermoBusca("");
    setFiltroEspecialidade("");
    if (activeTab === "feed") {
      carregarFeed();
    } else {
      setVeterinarios([]);
    }
  };

  return (
    <>
      <Header />
      <Container className="py-5 mt-5">
        <Row className="mb-4">
          <Col>
            <h1 className="display-5 fw-bold text-elements mb-3">
              <FaBullhorn className="me-2" />
              Rede Social
            </h1>
            <p className="text-muted">
              Descubra posts, veterinários e temas relacionados ao cuidado animal
            </p>
          </Col>
        </Row>

        {/* Barra de Busca */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Form onSubmit={handleBuscar}>
              <InputGroup size="lg">
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar posts, veterinários ou temas..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={buscando}
                >
                  {buscando ? (
                    <>
                      <FaSpinner className="spinner-border spinner-border-sm me-2" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <FaSearch className="me-2" />
                      Buscar
                    </>
                  )}
                </Button>
                {termoBusca && (
                  <Button
                    variant="outline-secondary"
                    onClick={handleLimparBusca}
                  >
                    Limpar
                  </Button>
                )}
              </InputGroup>
            </Form>
          </Card.Body>
        </Card>

        {/* Abas */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => {
            setActiveTab(k);
            setTermoBusca("");
            setFiltroEspecialidade("");
            if (k === "feed") {
              carregarFeed();
            } else {
              setVeterinarios([]);
              carregarEspecialidades();
            }
          }}
          className="mb-4"
        >
          <Tab eventKey="feed" title={
            <>
              <FaBullhorn className="me-2" />
              Feed
            </>
          }>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <FaSpinner className="spinner-border text-primary mb-3" size={48} />
                    <p className="text-muted">Carregando feed...</p>
                  </div>
                ) : posts.length > 0 ? (
                  <div>
                    {termoBusca && (
                      <Alert variant="info" className="mb-4">
                        <FaHashtag className="me-2" />
                        {posts.length} resultado(s) encontrado(s) para "{termoBusca}"
                      </Alert>
                    )}
                    {posts.map((post) => (
                      <div key={post.id} className="mb-4">
                        <PostCard
                          post={post}
                          onUpdate={carregarFeed}
                          showSeguir={true}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <FaBullhorn size={48} className="text-muted mb-3" />
                    <p className="text-muted">
                      {termoBusca
                        ? `Nenhum post encontrado para "${termoBusca}"`
                        : "Nenhum post disponível no momento"}
                    </p>
                    {termoBusca && (
                      <Button
                        variant="outline-primary"
                        onClick={handleLimparBusca}
                        className="mt-3"
                      >
                        Ver todos os posts
                      </Button>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="veterinarios" title={
            <>
              <FaUser className="me-2" />
              Veterinários
            </>
          }>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                {/* Filtro de Especialidade */}
                <div className="mb-3">
                  <label htmlFor="filtro-especialidade" className="form-label fw-semibold">
                    Filtrar por Especialidade
                  </label>
                  <select
                    className="form-select"
                    id="filtro-especialidade"
                    value={filtroEspecialidade}
                    onChange={async (e) => {
                      const especialidade = e.target.value;
                      setFiltroEspecialidade(especialidade);
                      
                      if (especialidade) {
                        try {
                          setBuscando(true);
                          const params = new URLSearchParams();
                          params.append("especialidade", especialidade);
                          if (termoBusca) params.append("termo", termoBusca);
                          
                          const url = `/veterinarios/publicos?${params.toString()}`;
                          const vetsData = await api.get(url);
                          setVeterinarios(Array.isArray(vetsData) ? vetsData : []);
                        } catch (error) {
                          console.error("Erro ao filtrar por especialidade:", error);
                          setVeterinarios([]);
                        } finally {
                          setBuscando(false);
                        }
                      } else {
                        // Se limpar o filtro, limpar resultados também (a menos que tenha termo de busca)
                        if (termoBusca) {
                          // Se tem termo de busca, fazer busca sem especialidade
                          try {
                            setBuscando(true);
                            const vetsData = await api.get(
                              `/veterinarios/publicos?termo=${encodeURIComponent(termoBusca)}`
                            );
                            setVeterinarios(Array.isArray(vetsData) ? vetsData : []);
                          } catch (error) {
                            console.error("Erro ao buscar:", error);
                            setVeterinarios([]);
                          } finally {
                            setBuscando(false);
                          }
                        } else {
                          setVeterinarios([]);
                        }
                      }
                    }}
                  >
                    <option value="">Todas as especialidades</option>
                    {especialidades.map((esp, index) => (
                      <option key={index} value={esp}>
                        {esp}
                      </option>
                    ))}
                  </select>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body>
                {buscando ? (
                  <div className="text-center py-5">
                    <FaSpinner className="spinner-border text-primary mb-3" size={48} />
                    <p className="text-muted">Buscando veterinários...</p>
                  </div>
                ) : (termoBusca || filtroEspecialidade) ? (
                  veterinarios.length > 0 ? (
                    <div>
                      <Alert variant="info" className="mb-4">
                        <FaUser className="me-2" />
                        {veterinarios.length} veterinário(s) encontrado(s)
                        {termoBusca && ` para "${termoBusca}"`}
                        {filtroEspecialidade && ` com especialidade "${filtroEspecialidade}"`}
                      </Alert>
                      <Row className="g-4">
                        {veterinarios.map((vet) => (
                          <Col md={6} lg={4} key={vet.id_veterinarios}>
                            <Card className="h-100 border-0 shadow-sm">
                              <Card.Body className="text-center">
                                <div className="mb-3">
                                  {vet.foto_url ? (
                                    <Image
                                      src={vet.foto_url}
                                      roundedCircle
                                      style={{
                                        width: 100,
                                        height: 100,
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <div
                                      className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                                      style={{
                                        width: 100,
                                        height: 100,
                                        fontSize: 40,
                                      }}
                                    >
                                      {(vet.nome_clinica || vet.nome_usuario || "V")[0].toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <h5>{vet.nome_clinica || vet.nome_usuario || "Veterinário"}</h5>
                                {vet.especialidades && (
                                  <div className="mb-2">
                                    {vet.especialidades.split(",").slice(0, 2).map((esp, idx) => (
                                      <Badge key={idx} bg="primary" className="me-1">
                                        {esp.trim()}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                {vet.cidade_clinica && (
                                  <p className="text-muted small mb-2">
                                    <i className="bi bi-geo-alt"></i> {vet.cidade_clinica}
                                    {vet.estado_clinica && `, ${vet.estado_clinica}`}
                                  </p>
                                )}
                                <div className="mb-3">
                                  <small className="text-muted">
                                    {vet.posts_count || 0} posts • {vet.seguidores_count || 0} seguidores
                                  </small>
                                </div>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="w-100"
                                  onClick={() =>
                                    navigate(`/rede-social/veterinario/${vet.id_veterinarios}`)
                                  }
                                >
                                  Ver Perfil
                                </Button>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <FaUser size={48} className="text-muted mb-3" />
                      <p className="text-muted">
                        Nenhum veterinário encontrado
                        {termoBusca && ` para "${termoBusca}"`}
                        {filtroEspecialidade && ` com especialidade "${filtroEspecialidade}"`}
                      </p>
                      <Button
                        variant="outline-primary"
                        onClick={handleLimparBusca}
                        className="mt-3"
                      >
                        Limpar filtros
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-5">
                    <FaSearch size={48} className="text-muted mb-3" />
                    <p className="text-muted">
                      Use a busca ou selecione uma especialidade para encontrar veterinários
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </Container>
      <Footer />
    </>
  );
};

export default RedeSocial;

