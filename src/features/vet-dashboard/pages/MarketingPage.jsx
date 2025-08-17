import React, { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Badge,
  ProgressBar,
  Nav,
  Tab,
  Image,
  Alert,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaCamera,
  FaStar,
  FaThumbsUp,
  FaShare,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaGlobe,
  FaPlus,
  FaTrash,
  FaEye,
  FaChartBar,
  FaBullhorn,
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaDownload,
  FaUpload,
  FaLink,
  FaImage,
  FaVideo,
  FaFileAlt,
  FaCog,
  FaShieldAlt,
  FaBell,
  FaLock,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";

const MarketingPage = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Perfil do veterinário carregado do banco
  const [veterinario, setVeterinario] = useState({
    nome: "",
    crmv: "",
    especialidade: "",
    experiencia: "",
    email: "",
    telefone: "",
    whatsapp: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    horarioFuncionamento: "",
    descricao: "",
    foto: "https://via.placeholder.com/150x150/007bff/ffffff?text=VET",
    banner: "https://via.placeholder.com/800x200/007bff/ffffff?text=Perfil",
    redesSociais: {},
    estatisticas: {
      consultasRealizadas: 0,
      pacientesAtendidos: 0,
      avaliacaoMedia: 0,
      totalAvaliacoes: 0,
      seguidoresInstagram: 0,
      seguidoresFacebook: 0,
    },
  });

  const [campanhas, setCampanhas] = useState([]);

  const [avaliacoes, setAvaliacoes] = useState([]);

  const [posts, setPosts] = useState([]);

  // Funções de formatação
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Funções de manipulação
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddCampaign = () => {
    setShowAddCampaign(true);
  };

  const handleAddReview = () => {
    setShowAddReview(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ativa":
        return <Badge bg="success">Ativa</Badge>;
      case "pausada":
        return <Badge bg="warning">Pausada</Badge>;
      case "finalizada":
        return <Badge bg="secondary">Finalizada</Badge>;
      default:
        return <Badge bg="secondary">Indefinido</Badge>;
    }
  };

  const getCampaignTypeBadge = (tipo) => {
    switch (tipo) {
      case "vacina":
        return <Badge bg="success">Vacinação</Badge>;
      case "cirurgia":
        return <Badge bg="danger">Cirurgia</Badge>;
      case "consulta":
        return <Badge bg="primary">Consulta</Badge>;
      default:
        return (
          <Badge bg="light" text="dark">
            {tipo}
          </Badge>
        );
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "text-warning" : "text-muted"}
      />
    ));
  };

  const { user } = useUser();
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Perfil do veterinário
        const { data: vet, error: vetError } = await supabase
          .from('veterinarios')
          .select('crmv, especialidades, bio, foto_url')
          .eq('id_usuario', session.user.id)
          .single();
        if (!vetError && vet) {
          setVeterinario((prev) => ({
            ...prev,
            nome: user?.nome || '',
            crmv: vet.crmv || '',
            especialidade: vet.especialidades?.[0] || '',
            descricao: vet.bio || '',
            foto: vet.foto_url || prev.foto,
          }));
        }

        // Campanhas
        const { data: camp, error: campError } = await supabase
          .from('marketing_campanhas')
          .select('*')
          .eq('veterinario_id', session.user.id)
          .order('dataInicio', { ascending: false });
        if (!campError) setCampanhas(camp || []);

        // Posts
        const { data: postsData, error: postsError } = await supabase
          .from('marketing_posts')
          .select('*')
          .eq('veterinario_id', session.user.id)
          .order('data', { ascending: false });
        if (!postsError) setPosts(postsData || []);

        // Avaliações
        const { data: avs, error: avError } = await supabase
          .from('avaliacoes')
          .select('*')
          .eq('veterinario_id', session.user.id)
          .order('data', { ascending: false });
        if (!avError) setAvaliacoes(avs || []);
      } catch (error) {
        console.error('Erro ao carregar dados de marketing:', error);
      }
    };
    carregarDados();
  }, [user]);
  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  <FaBullhorn className="me-2" />
                  Marketing & Perfil
                </h2>
                <p className="text-muted mb-0">
                  Gerencie seu perfil profissional e campanhas de marketing
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Navegação por Abas */}
        <Row className="mb-4">
          <Col>
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
              <Nav.Item>
                <Nav.Link eventKey="perfil">
                  <FaUser className="me-2" />
                  Perfil Profissional
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="campanhas">
                  <FaBullhorn className="me-2" />
                  Campanhas
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="avaliacoes">
                  <FaStar className="me-2" />
                  Avaliações
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="redes">
                  <FaShare className="me-2" />
                  Redes Sociais
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="configuracoes">
                  <FaCog className="me-2" />
                  Configurações
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        {/* Conteúdo das Abas */}
        <Tab.Content>
          {/* Aba Perfil Profissional */}
          <Tab.Pane active={activeTab === "perfil"}>
            <Row>
              <Col lg={4}>
                {/* Card do Perfil */}
                <Card className="border-0 shadow-sm mb-4">
                  <div className="position-relative">
                    <Image
                      src={veterinario.banner}
                      alt="Banner"
                      className="w-100"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                    <div
                      className="position-absolute"
                      style={{ bottom: "-50px", left: "20px" }}
                    >
                      <Image
                        src={veterinario.foto}
                        alt="Foto do Veterinário"
                        roundedCircle
                        width={100}
                        height={100}
                        className="border border-3 border-white"
                      />
                    </div>
                  </div>
                  <Card.Body style={{ marginTop: "60px" }}>
                    <div className="text-center mb-3">
                      <h4 className="fw-bold mb-1">{veterinario.nome}</h4>
                      <p className="text-muted mb-1">{veterinario.crmv}</p>
                      <p className="text-muted mb-2">
                        {veterinario.especialidade}
                      </p>
                      <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                        {renderStars(veterinario.estatisticas.avaliacaoMedia)}
                        <span className="fw-semibold">
                          {veterinario.estatisticas.avaliacaoMedia}
                        </span>
                        <span className="text-muted">
                          ({veterinario.estatisticas.totalAvaliacoes}{" "}
                          avaliações)
                        </span>
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowEditProfile(true)}
                      >
                        <FaEdit className="me-2" />
                        Editar Perfil
                      </Button>
                    </div>

                    <hr />

                    <div className="mb-3">
                      <h6 className="fw-bold mb-2">Informações de Contato</h6>
                      <div className="d-flex align-items-center mb-2">
                        <FaPhone className="text-muted me-2" />
                        <small>{veterinario.telefone}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaWhatsapp className="text-success me-2" />
                        <small>{veterinario.whatsapp}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaEnvelope className="text-muted me-2" />
                        <small>{veterinario.email}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <FaMapMarkerAlt className="text-muted me-2" />
                        <small>{veterinario.endereco}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaClock className="text-muted me-2" />
                        <small>{veterinario.horarioFuncionamento}</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6 className="fw-bold mb-2">Redes Sociais</h6>
                      <div className="d-flex gap-2">
                        <Button variant="outline-primary" size="sm">
                          <FaFacebook />
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <FaInstagram />
                        </Button>
                        <Button variant="outline-success" size="sm">
                          <FaWhatsapp />
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                          <FaGlobe />
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Estatísticas */}
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h6 className="mb-0">Estatísticas</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="row text-center">
                      <div className="col-6 mb-3">
                        <h4 className="fw-bold text-primary mb-1">
                          {veterinario.estatisticas.consultasRealizadas}
                        </h4>
                        <small className="text-muted">Consultas</small>
                      </div>
                      <div className="col-6 mb-3">
                        <h4 className="fw-bold text-success mb-1">
                          {veterinario.estatisticas.pacientesAtendidos}
                        </h4>
                        <small className="text-muted">Pacientes</small>
                      </div>
                      <div className="col-6 mb-3">
                        <h4 className="fw-bold text-warning mb-1">
                          {veterinario.estatisticas.seguidoresInstagram}
                        </h4>
                        <small className="text-muted">Instagram</small>
                      </div>
                      <div className="col-6 mb-3">
                        <h4 className="fw-bold text-primary mb-1">
                          {veterinario.estatisticas.seguidoresFacebook}
                        </h4>
                        <small className="text-muted">Facebook</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={8}>
                {/* Descrição */}
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white">
                    <h6 className="mb-0">Sobre Mim</h6>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-0">{veterinario.descricao}</p>
                  </Card.Body>
                </Card>

                {/* Posts Recentes */}
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Posts Recentes</h6>
                      <Button variant="outline-primary" size="sm">
                        <FaPlus className="me-2" />
                        Novo Post
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {posts.map((post) => (
                      <div key={post.id} className="mb-4 pb-4 border-bottom">
                        <div className="d-flex align-items-start gap-3">
                          {post.imagem && (
                            <Image
                              src={post.imagem}
                              alt="Post"
                              width={80}
                              height={60}
                              className="rounded"
                              style={{ objectFit: "cover" }}
                            />
                          )}
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{post.titulo}</h6>
                            <p className="text-muted mb-2">{post.conteudo}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {formatDate(post.data)}
                              </small>
                              <div className="d-flex gap-3">
                                <small className="text-muted">
                                  <FaEye className="me-1" />
                                  {post.alcance}
                                </small>
                                <small className="text-muted">
                                  <FaThumbsUp className="me-1" />
                                  {post.engajamento}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Aba Campanhas */}
          <Tab.Pane active={activeTab === "campanhas"}>
            <Row className="mb-4">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Campanhas de Marketing</h5>
                  <Button variant="primary" onClick={handleAddCampaign}>
                    <FaPlus className="me-2" />
                    Nova Campanha
                  </Button>
                </div>
              </Col>
            </Row>

            <Row>
              {campanhas.map((campanha) => (
                <Col lg={4} key={campanha.id}>
                  <Card className="border-0 shadow-sm mb-4">
                    <Image
                      src={campanha.imagem}
                      alt={campanha.titulo}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        {getCampaignTypeBadge(campanha.tipo)}
                        {getStatusBadge(campanha.status)}
                      </div>
                      <h6 className="fw-bold mb-2">{campanha.titulo}</h6>
                      <p className="text-muted small mb-3">
                        {campanha.descricao}
                      </p>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <small>Orçamento</small>
                          <small className="text-muted">
                            {formatCurrency(campanha.gastoAtual)} /{" "}
                            {formatCurrency(campanha.orcamento)}
                          </small>
                        </div>
                        <ProgressBar
                          variant="primary"
                          now={(campanha.gastoAtual / campanha.orcamento) * 100}
                          style={{ height: "6px" }}
                          className="stock-progress-bar"
                        />
                      </div>

                      <div className="row text-center mb-3">
                        <div className="col-4">
                          <div className="fw-bold text-primary">
                            {campanha.alcance}
                          </div>
                          <small className="text-muted">Alcance</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-bold text-success">
                            {formatPercentage(campanha.engajamento)}
                          </div>
                          <small className="text-muted">Engajamento</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-bold text-warning">
                            {campanha.conversoes}
                          </div>
                          <small className="text-muted">Conversões</small>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="flex-grow-1"
                        >
                          <FaEye className="me-2" />
                          Ver Detalhes
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                          <FaEdit />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab.Pane>

          {/* Aba Avaliações */}
          <Tab.Pane active={activeTab === "avaliacoes"}>
            <Row className="mb-4">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Avaliações dos Clientes</h5>
                    <div className="d-flex align-items-center gap-2">
                      {renderStars(veterinario.estatisticas.avaliacaoMedia)}
                      <span className="fw-semibold">
                        {veterinario.estatisticas.avaliacaoMedia} de 5
                      </span>
                      <span className="text-muted">
                        ({veterinario.estatisticas.totalAvaliacoes} avaliações)
                      </span>
                    </div>
                  </div>
                  <Button variant="outline-primary">
                    <FaDownload className="me-2" />
                    Exportar Avaliações
                  </Button>
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    {avaliacoes.map((avaliacao) => (
                      <div
                        key={avaliacao.id}
                        className="mb-4 pb-4 border-bottom"
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1">
                              {avaliacao.paciente} - {avaliacao.tutor}
                            </h6>
                            <div className="d-flex align-items-center gap-2">
                              {renderStars(avaliacao.nota)}
                              <small className="text-muted">
                                {formatDate(avaliacao.data)}
                              </small>
                            </div>
                          </div>
                          <Badge bg="light" text="dark">
                            {avaliacao.nota}/5
                          </Badge>
                        </div>

                        <p className="mb-2">{avaliacao.comentario}</p>

                        {avaliacao.resposta && (
                          <div className="bg-light p-3 rounded">
                            <small className="text-muted d-block mb-1">
                              <strong>Resposta do Dr. André:</strong>
                            </small>
                            <p className="mb-1">{avaliacao.resposta}</p>
                            <small className="text-muted">
                              {formatDate(avaliacao.dataResposta)}
                            </small>
                          </div>
                        )}
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Aba Redes Sociais */}
          <Tab.Pane active={activeTab === "redes"}>
            <Row>
              <Col lg={6}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white">
                    <h6 className="mb-0">Configurações das Redes Sociais</h6>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaFacebook className="me-2 text-primary" />
                          Facebook
                        </Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://facebook.com/seuperfil"
                          defaultValue={veterinario.redesSociais.facebook}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaInstagram className="me-2 text-danger" />
                          Instagram
                        </Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://instagram.com/seuperfil"
                          defaultValue={veterinario.redesSociais.instagram}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaWhatsapp className="me-2 text-success" />
                          WhatsApp
                        </Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://wa.me/5511999999999"
                          defaultValue={veterinario.redesSociais.whatsapp}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaGlobe className="me-2 text-secondary" />
                          Website
                        </Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://seusite.com.br"
                          defaultValue={veterinario.redesSociais.website}
                        />
                      </Form.Group>

                      <Button variant="primary">
                        <FaSave className="me-2" />
                        Salvar Configurações
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white">
                    <h6 className="mb-0">Agendamento de Posts</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center py-5">
                      <FaCalendarAlt size={48} className="text-muted mb-3" />
                      <h5>Agendamento de Posts</h5>
                      <p className="text-muted">
                        Agende posts para suas redes sociais automaticamente
                      </p>
                      <Button variant="primary">
                        <FaPlus className="me-2" />
                        Agendar Post
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h6 className="mb-0">Análise de Performance</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center py-5">
                      <FaChartBar size={48} className="text-muted mb-3" />
                      <h5>Métricas das Redes Sociais</h5>
                      <p className="text-muted">
                        Visualize o desempenho dos seus posts e campanhas
                      </p>
                      <Button variant="outline-primary">
                        <FaChartBar className="me-2" />
                        Ver Relatórios
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Aba Configurações */}
          <Tab.Pane active={activeTab === "configuracoes"}>
            <Row>
              <Col lg={8}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white">
                    <h6 className="mb-0">Configurações da Conta</h6>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nome Completo</Form.Label>
                            <Form.Control
                              type="text"
                              defaultValue={veterinario.nome}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>CRMV</Form.Label>
                            <Form.Control
                              type="text"
                              defaultValue={veterinario.crmv}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              defaultValue={veterinario.email}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                              type="tel"
                              defaultValue={veterinario.telefone}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Especialidade</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={veterinario.especialidade}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Descrição Profissional</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          defaultValue={veterinario.descricao}
                        />
                      </Form.Group>

                      <Button variant="primary">
                        <FaSave className="me-2" />
                        Salvar Alterações
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-white">
                    <h6 className="mb-0">Segurança</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="mb-1">Alterar Senha</h6>
                        <small className="text-muted">
                          Última alteração: há 30 dias
                        </small>
                      </div>
                      <Button variant="outline-primary" size="sm">
                        <FaLock className="me-2" />
                        Alterar
                      </Button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="mb-1">Autenticação em Duas Etapas</h6>
                        <small className="text-muted">
                          Adicione uma camada extra de segurança
                        </small>
                      </div>
                      <Button variant="outline-secondary" size="sm">
                        <FaShieldAlt className="me-2" />
                        Configurar
                      </Button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Notificações</h6>
                        <small className="text-muted">
                          Configure suas preferências de notificação
                        </small>
                      </div>
                      <Button variant="outline-secondary" size="sm">
                        <FaBell className="me-2" />
                        Configurar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-white">
                    <h6 className="mb-0">Foto do Perfil</h6>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      <Image
                        src={selectedImage || veterinario.foto}
                        alt="Foto do Perfil"
                        roundedCircle
                        width={150}
                        height={150}
                        className="border"
                      />
                    </div>
                    <Form.Group className="mb-3">
                      <Form.Label className="btn btn-outline-primary">
                        <FaCamera className="me-2" />
                        Alterar Foto
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </Form.Group>
                    <small className="text-muted">
                      Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>

        {/* Modal Editar Perfil */}
        <Modal
          show={showEditProfile}
          onHide={() => setShowEditProfile(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaEdit className="me-2" />
              Editar Perfil
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control type="text" defaultValue={veterinario.nome} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CRMV</Form.Label>
                    <Form.Control type="text" defaultValue={veterinario.crmv} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      defaultValue={veterinario.email}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="tel"
                      defaultValue={veterinario.telefone}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control type="text" defaultValue={veterinario.endereco} />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={veterinario.cidade}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={veterinario.estado}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>CEP</Form.Label>
                    <Form.Control type="text" defaultValue={veterinario.cep} />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Horário de Funcionamento</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  defaultValue={veterinario.horarioFuncionamento}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descrição Profissional</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  defaultValue={veterinario.descricao}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditProfile(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary">
              <FaSave className="me-2" />
              Salvar Alterações
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default MarketingPage;
