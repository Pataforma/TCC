import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Badge,
  Form,
  Table,
  Nav,
  Tab,
  InputGroup,
  Image,
  ProgressBar,
} from "react-bootstrap";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  FaBullhorn,
  FaUser,
  FaEdit,
  FaPlus,
  FaEye,
  FaTrash,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaStar,
  FaCheckCircle,
  FaImage,
  FaSave,
  FaShare,
  FaDownload,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaChartLine,
  FaUpload,
  FaEye,
  FaHeart,
  FaComment,
  FaShareAlt,
} from "react-icons/fa";

const DashboardVeterinarioMarketing = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("perfil");
  const [activeTab, setActiveTab] = useState("perfil");
  
  // Estados para novas funcionalidades
  const [showModalCampanha, setShowModalCampanha] = useState(false);
  const [showModalPost, setShowModalPost] = useState(false);
  const [showModalRedesSociais, setShowModalRedesSociais] = useState(false);
  const [showModalAvaliacoes, setShowModalAvaliacoes] = useState(false);
  const [showModalRelatorios, setShowModalRelatorios] = useState(false);
  const [showModalPerfil, setShowModalPerfil] = useState(false);

  // Dados mockados do perfil
  const [perfil] = useState({
    nome: "Dr. André Silva",
    especialidade: "Clínico Geral e Cirurgia",
    experiencia: 8,
    telefone: "(11) 99999-9999",
    email: "dr.andre@vetclinic.com",
    endereco: "Rua das Flores, 123 - Centro, São Paulo/SP",
    website: "www.vetclinic.com",
    descricao:
      "Médico veterinário com 8 anos de experiência em clínica geral e cirurgia de pequenos animais. Especializado em medicina preventiva e tratamento de emergências.",
    especialidades: ["Clínica Geral", "Cirurgia", "Emergências", "Vacinação"],
    horarios: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",
    avaliacao: 4.8,
    totalAvaliacoes: 127,
    foto_url: null,
  });

  // Dados mockados das campanhas
  const [campanhas] = useState([
    {
      id: 1,
      nome: "Campanha de Vacinação 2024",
      tipo: "promocao",
      status: "ativa",
      orcamento: 5000,
      dataInicio: "2024-01-01",
      dataFim: "2024-03-31",
      visualizacoes: 1250,
      cliques: 89,
      conversoes: 23
    },
    {
      id: 2,
      nome: "Promoção de Consultas",
      tipo: "desconto",
      status: "ativa",
      orcamento: 3000,
      dataInicio: "2024-02-01",
      dataFim: "2024-02-28",
      visualizacoes: 890,
      cliques: 67,
      conversoes: 18
    }
  ]);

  // Dados mockados dos posts
  const [posts] = useState([
    {
      id: 1,
      titulo: "Dicas para o verão",
      conteudo: "Como proteger seu pet no verão...",
      plataforma: "instagram",
      dataAgendamento: "2024-01-20T10:00:00",
      status: "agendado",
      engajamento: 45
    },
    {
      id: 2,
      titulo: "Vacinação em dia",
      conteudo: "Importância da vacinação...",
      plataforma: "facebook",
      dataAgendamento: "2024-01-18T15:00:00",
      status: "publicado",
      engajamento: 78
    }
  ]);

  // Dados mockados das redes sociais
  const [redesSociais] = useState([
    {
      id: 1,
      plataforma: "instagram",
      url: "https://instagram.com/drandrevet",
      seguidores: 1250,
      engajamento: 4.2
    },
    {
      id: 2,
      plataforma: "facebook",
      url: "https://facebook.com/drandrevet",
      seguidores: 890,
      engajamento: 3.8
    }
  ]);

  // Dados mockados das avaliações
  const [avaliacoes] = useState([
    {
      id: 1,
      tutor: "Maria Silva",
      paciente: "Rex",
      nota: 5,
      comentario: "Excelente atendimento!",
      data: "2024-01-15"
    },
    {
      id: 2,
      tutor: "João Santos",
      paciente: "Luna",
      nota: 4,
      comentario: "Muito bom profissional",
      data: "2024-01-14"
    }
  ]);

  const getStatusBadge = (status) => {
    const variants = {
      ativo: "success",
      inativo: "secondary",
      rascunho: "warning",
      publicado: "success",
      agendado: "info",
    };

    const labels = {
      ativo: "Ativo",
      inativo: "Inativo",
      rascunho: "Rascunho",
      publicado: "Publicado",
      agendado: "Agendado",
    };

    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const getTipoBadge = (tipo) => {
    const variants = {
      promocao: "danger",
      desconto: "warning",
      dica: "info",
      evento: "warning",
    };

    const labels = {
      promocao: "Promoção",
      desconto: "Desconto",
      dica: "Dica de Saúde",
      evento: "Evento",
    };

    return <Badge bg={variants[tipo]}>{labels[tipo]}</Badge>;
  };

  const getPlataformaIcon = (plataforma) => {
    const icons = {
      instagram: <FaInstagram className="text-danger" />,
      facebook: <FaFacebook className="text-primary" />,
      linkedin: <FaLinkedin className="text-info" />,
      twitter: <FaTwitter className="text-info" />,
    };
    return icons[plataforma] || <FaGlobe />;
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleEditarPerfil = () => {
    setShowModalPerfil(true);
  };

  const handleExportarAvaliacoes = () => {
    // Simular exportação CSV
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Tutor,Paciente,Nota,Comentário,Data\n" +
      avaliacoes.map(av => 
        `${av.tutor},${av.paciente},${av.nota},"${av.comentario}",${av.data}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "avaliacoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario="Dr. André Silva">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Marketing</h2>
            <p className="text-muted mb-0">
              Gerencie seu perfil público, campanhas e redes sociais
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowModalCampanha(true)}
            >
              <FaPlus className="me-2" />
              Nova Campanha
            </Button>
            <Button 
              variant="outline-info" 
              size="sm" 
              onClick={() => setShowModalPost(true)}
            >
              <FaPlus className="me-2" />
              Novo Post
            </Button>
            <Button 
              variant="outline-success" 
              size="sm" 
              onClick={() => setShowModalRedesSociais(true)}
            >
              <FaPlus className="me-2" />
              Redes Sociais
            </Button>
            <Button variant="primary" size="sm">
              <FaDownload className="me-2" />
              Relatório
            </Button>
          </div>
        </div>

        {/* Abas Principais */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <Card.Header className="bg-white border-0">
            <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
              <Nav.Item>
                <Nav.Link eventKey="perfil">Perfil Público</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="campanhas">Campanhas</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="posts">Posts</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="redes-sociais">Redes Sociais</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="avaliacoes">Avaliações</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="relatorios">Relatórios</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body className="p-4">
            <Tab.Content>
              {/* Perfil Público */}
              <Tab.Pane active={activeTab === "perfil"}>
                <Row className="g-4">
                  <Col lg={8}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-4">
                          <div className="d-flex align-items-center gap-4">
                            <div
                              className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle"
                              style={{ width: 100, height: 100 }}
                            >
                              {perfil.foto_url ? (
                                <Image 
                                  src={perfil.foto_url} 
                                  roundedCircle 
                                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                                />
                              ) : (
                                <FaUser size={40} />
                              )}
                            </div>
                            <div>
                              <h3 className="fw-bold mb-1">{perfil.nome}</h3>
                              <p className="text-muted mb-2">
                                {perfil.especialidade}
                              </p>
                              <div className="d-flex align-items-center gap-3">
                                <div className="d-flex align-items-center gap-1">
                                  <FaStar className="text-warning" />
                                  <span className="fw-semibold">
                                    {perfil.avaliacao}
                                  </span>
                                  <span className="text-muted">
                                    ({perfil.totalAvaliacoes})
                                  </span>
                                </div>
                                <Badge bg="success">
                                  {perfil.experiencia} anos de experiência
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline-primary"
                            onClick={handleEditarPerfil}
                          >
                            <FaEdit className="me-2" />
                            Editar Perfil
                          </Button>
                        </div>

                        <div className="row g-4">
                          <div className="col-md-6">
                            <h6 className="fw-semibold mb-3">
                              Informações de Contato
                            </h6>
                            <div className="d-flex flex-column gap-2">
                              <div className="d-flex align-items-center gap-2">
                                <FaPhone className="text-muted" />
                                <span>{perfil.telefone}</span>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <FaEnvelope className="text-muted" />
                                <span>{perfil.email}</span>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <FaMapMarkerAlt className="text-muted" />
                                <span>{perfil.endereco}</span>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <FaGlobe className="text-muted" />
                                <span>{perfil.website}</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <h6 className="fw-semibold mb-3">Especialidades</h6>
                            <div className="d-flex flex-wrap gap-2">
                              {perfil.especialidades.map((esp, index) => (
                                <Badge key={index} bg="light" text="dark">
                                  {esp}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h6 className="fw-semibold mb-3">Descrição</h6>
                          <p className="text-muted mb-0">{perfil.descricao}</p>
                        </div>

                        <div className="mt-4">
                          <h6 className="fw-semibold mb-3">Horários de Atendimento</h6>
                          <p className="text-muted mb-0">{perfil.horarios}</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h6 className="fw-semibold mb-3">Estatísticas</h6>
                        <div className="d-flex flex-column gap-3">
                          <div>
                            <div className="d-flex justify-content-between mb-1">
                              <small className="text-muted">Avaliação Média</small>
                              <small className="fw-semibold">{perfil.avaliacao}/5</small>
                            </div>
                            <ProgressBar 
                              now={(perfil.avaliacao / 5) * 100} 
                              variant="warning" 
                              style={{ height: '8px' }}
                            />
                          </div>
                          <div>
                            <div className="d-flex justify-content-between mb-1">
                              <small className="text-muted">Total de Avaliações</small>
                              <small className="fw-semibold">{perfil.totalAvaliacoes}</small>
                            </div>
                          </div>
                          <div>
                            <div className="d-flex justify-content-between mb-1">
                              <small className="text-muted">Anos de Experiência</small>
                              <small className="fw-semibold">{perfil.experiencia}</small>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Campanhas */}
              <Tab.Pane active={activeTab === "campanhas"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold mb-0">Campanhas de Marketing</h5>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setShowModalCampanha(true)}
                  >
                    <FaPlus className="me-2" />
                    Nova Campanha
                  </Button>
                </div>

                <Row className="g-4">
                  {campanhas.map((campanha) => (
                    <Col lg={6} key={campanha.id}>
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="fw-semibold mb-1">{campanha.nome}</h6>
                              <div className="d-flex gap-2 mb-2">
                                {getTipoBadge(campanha.tipo)}
                                {getStatusBadge(campanha.status)}
                              </div>
                            </div>
                            <div className="text-end">
                              <small className="text-muted">Orçamento</small>
                              <div className="fw-semibold">{formatarMoeda(campanha.orcamento)}</div>
                            </div>
                          </div>

                          <div className="row g-3 mb-3">
                            <div className="col-6">
                              <small className="text-muted">Início</small>
                              <div className="fw-semibold">{formatarData(campanha.dataInicio)}</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">Fim</small>
                              <div className="fw-semibold">{formatarData(campanha.dataFim)}</div>
                            </div>
                          </div>

                          <div className="row g-3 mb-3">
                            <div className="col-4 text-center">
                              <div className="fw-bold text-primary">{campanha.visualizacoes}</div>
                              <small className="text-muted">Visualizações</small>
                            </div>
                            <div className="col-4 text-center">
                              <div className="fw-bold text-info">{campanha.cliques}</div>
                              <small className="text-muted">Cliques</small>
                            </div>
                            <div className="col-4 text-center">
                              <div className="fw-bold text-success">{campanha.conversoes}</div>
                              <small className="text-muted">Conversões</small>
                            </div>
                          </div>

                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                              <FaEye className="me-1" />
                              Ver Detalhes
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                              <FaEdit className="me-1" />
                              Editar
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <FaTrash className="me-1" />
                              Excluir
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Tab.Pane>

              {/* Posts */}
              <Tab.Pane active={activeTab === "posts"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold mb-0">Posts e Conteúdo</h5>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setShowModalPost(true)}
                  >
                    <FaPlus className="me-2" />
                    Novo Post
                  </Button>
                </div>

                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Título</th>
                      <th>Plataforma</th>
                      <th>Data Agendamento</th>
                      <th>Status</th>
                      <th>Engajamento</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <div className="fw-semibold">{post.titulo}</div>
                          <small className="text-muted">{post.conteudo.substring(0, 50)}...</small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {getPlataformaIcon(post.plataforma)}
                            <span className="text-capitalize">{post.plataforma}</span>
                          </div>
                        </td>
                        <td>{formatarData(post.dataAgendamento)}</td>
                        <td>{getStatusBadge(post.status)}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FaHeart className="text-danger" />
                            <span>{post.engajamento}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <FaEye size={12} />
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                              <FaEdit size={12} />
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
              </Tab.Pane>

              {/* Redes Sociais */}
              <Tab.Pane active={activeTab === "redes-sociais"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold mb-0">Redes Sociais</h5>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setShowModalRedesSociais(true)}
                  >
                    <FaPlus className="me-2" />
                    Adicionar Rede
                  </Button>
                </div>

                <Row className="g-4">
                  {redesSociais.map((rede) => (
                    <Col lg={6} key={rede.id}>
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center gap-3">
                              {getPlataformaIcon(rede.plataforma)}
                              <div>
                                <h6 className="fw-semibold mb-1 text-capitalize">{rede.plataforma}</h6>
                                <small className="text-muted">{rede.url}</small>
                              </div>
                            </div>
                            <Button variant="outline-primary" size="sm">
                              <FaChartLine className="me-1" />
                              Relatórios
                            </Button>
                          </div>

                          <div className="row g-3">
                            <div className="col-6 text-center">
                              <div className="fw-bold text-primary">{rede.seguidores}</div>
                              <small className="text-muted">Seguidores</small>
                            </div>
                            <div className="col-6 text-center">
                              <div className="fw-bold text-success">{rede.engajamento}%</div>
                              <small className="text-muted">Engajamento</small>
                            </div>
                          </div>

                          <div className="d-flex gap-2 mt-3">
                            <Button variant="outline-secondary" size="sm">
                              <FaEdit className="me-1" />
                              Editar
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <FaTrash className="me-1" />
                              Remover
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Tab.Pane>

              {/* Avaliações */}
              <Tab.Pane active={activeTab === "avaliacoes"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold mb-0">Avaliações dos Clientes</h5>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={handleExportarAvaliacoes}
                  >
                    <FaDownload className="me-2" />
                    Exportar CSV
                  </Button>
                </div>

                <Table responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Tutor</th>
                      <th>Paciente</th>
                      <th>Nota</th>
                      <th>Comentário</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avaliacoes.map((avaliacao) => (
                      <tr key={avaliacao.id}>
                        <td className="fw-semibold">{avaliacao.tutor}</td>
                        <td>{avaliacao.paciente}</td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <FaStar className="text-warning" />
                            <span>{avaliacao.nota}/5</span>
                          </div>
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '200px' }}>
                            {avaliacao.comentario}
                          </div>
                        </td>
                        <td>{formatarData(avaliacao.data)}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <FaEye size={12} />
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                              <FaEdit size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>

              {/* Relatórios */}
              <Tab.Pane active={activeTab === "relatorios"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold mb-0">Relatórios e Métricas</h5>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setShowModalRelatorios(true)}
                  >
                    <FaChartLine className="me-2" />
                    Gerar Relatório
                  </Button>
                </div>

                <Row className="g-4">
                  <Col lg={3}>
                    <Card className="border-0 bg-primary text-white">
                      <Card.Body className="text-center">
                        <FaEye size={24} className="mb-2" />
                        <h4 className="fw-bold mb-1">12.5K</h4>
                        <small>Visualizações Totais</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={3}>
                    <Card className="border-0 bg-success text-white">
                      <Card.Body className="text-center">
                        <FaHeart size={24} className="mb-2" />
                        <h4 className="fw-bold mb-1">2.3K</h4>
                        <small>Engajamentos</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={3}>
                    <Card className="border-0 bg-info text-white">
                      <Card.Body className="text-center">
                        <FaShare size={24} className="mb-2" />
                        <h4 className="fw-bold mb-1">890</h4>
                        <small>Compartilhamentos</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={3}>
                    <Card className="border-0 bg-warning text-white">
                      <Card.Body className="text-center">
                        <FaCheckCircle size={24} className="mb-2" />
                        <h4 className="fw-bold mb-1">156</h4>
                        <small>Conversões</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                      <Card.Body>
                        <h6 className="fw-semibold mb-3">Performance das Campanhas</h6>
                        <div className="text-center text-muted py-5">
                          <FaChartLine size={48} className="mb-3" />
                          <p>Grafícos de performance serão exibidos aqui</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="border-0 shadow-sm">
                      <Card.Body>
                        <h6 className="fw-semibold mb-3">Top Posts</h6>
                        <div className="d-flex flex-column gap-3">
                          {posts.slice(0, 3).map((post, index) => (
                            <div key={post.id} className="d-flex align-items-center gap-2">
                              <div className="fw-bold text-primary">#{index + 1}</div>
                              <div className="flex-grow-1">
                                <div className="fw-semibold small">{post.titulo}</div>
                                <small className="text-muted">{post.engajamento} engajamentos</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>

        {/* Modal de Edição de Perfil */}
        <Modal show={showModalPerfil} onHide={() => setShowModalPerfil(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Editar Perfil Público</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Foto do Perfil</Form.Label>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle"
                        style={{ width: 80, height: 80 }}
                      >
                        {perfil.foto_url ? (
                          <Image 
                            src={perfil.foto_url} 
                            roundedCircle 
                            style={{ width: 80, height: 80, objectFit: 'cover' }}
                          />
                        ) : (
                          <FaUser size={32} />
                        )}
                      </div>
                      <Button variant="outline-primary">
                        <FaUpload className="me-2" />
                        Upload de Foto
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" defaultValue={perfil.nome} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Especialidade</Form.Label>
                    <Form.Control type="text" defaultValue={perfil.especialidade} />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control as="textarea" rows={4} defaultValue={perfil.descricao} />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalPerfil(false)}>
              Cancelar
            </Button>
            <Button variant="primary">
              <FaSave className="me-2" />
              Salvar Alterações
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Nova Campanha */}
        <Modal show={showModalCampanha} onHide={() => setShowModalCampanha(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Nova Campanha de Marketing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Nome da Campanha</Form.Label>
                    <Form.Control type="text" placeholder="Ex: Campanha de Vacinação 2024" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select>
                      <option>Promoção</option>
                      <option>Desconto</option>
                      <option>Evento</option>
                      <option>Educativo</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Orçamento</Form.Label>
                    <Form.Control type="number" placeholder="0.00" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Data de Início</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Data de Fim</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control as="textarea" rows={4} placeholder="Descreva a campanha..." />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalCampanha(false)}>
              Cancelar
            </Button>
            <Button variant="primary">
              <FaSave className="me-2" />
              Criar Campanha
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Novo Post */}
        <Modal show={showModalPost} onHide={() => setShowModalPost(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Novo Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Título do Post</Form.Label>
                    <Form.Control type="text" placeholder="Ex: Dicas para o verão" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Plataforma</Form.Label>
                    <Form.Select>
                      <option>Instagram</option>
                      <option>Facebook</option>
                      <option>LinkedIn</option>
                      <option>Twitter</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Data de Agendamento</Form.Label>
                    <Form.Control type="datetime-local" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Conteúdo</Form.Label>
                    <Form.Control as="textarea" rows={6} placeholder="Escreva o conteúdo do post..." />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Imagem (opcional)</Form.Label>
                    <Form.Control type="file" accept="image/*" />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalPost(false)}>
              Cancelar
            </Button>
            <Button variant="primary">
              <FaSave className="me-2" />
              Agendar Post
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Redes Sociais */}
        <Modal show={showModalRedesSociais} onHide={() => setShowModalRedesSociais(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Configurar Redes Sociais</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Plataforma</Form.Label>
                    <Form.Select>
                      <option>Instagram</option>
                      <option>Facebook</option>
                      <option>LinkedIn</option>
                      <option>Twitter</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>URL do Perfil</Form.Label>
                    <Form.Control type="url" placeholder="https://..." />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Breve descrição da rede social..." />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalRedesSociais(false)}>
              Cancelar
            </Button>
            <Button variant="primary">
              <FaSave className="me-2" />
              Adicionar Rede
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Relatórios */}
        <Modal show={showModalRelatorios} onHide={() => setShowModalRelatorios(false)} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>Gerar Relatório</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tipo de Relatório</Form.Label>
                    <Form.Select>
                      <option>Performance Geral</option>
                      <option>Campanhas</option>
                      <option>Redes Sociais</option>
                      <option>Avaliações</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Período</Form.Label>
                    <Form.Select>
                      <option>Últimos 7 dias</option>
                      <option>Últimos 30 dias</option>
                      <option>Últimos 3 meses</option>
                      <option>Último ano</option>
                      <option>Personalizado</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Data Início</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Data Fim</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Formato de Exportação</Form.Label>
                    <div className="d-flex gap-3">
                      <Form.Check
                        type="radio"
                        name="formato"
                        id="pdf"
                        label="PDF"
                        defaultChecked
                      />
                      <Form.Check
                        type="radio"
                        name="formato"
                        id="excel"
                        label="Excel"
                      />
                      <Form.Check
                        type="radio"
                        name="formato"
                        id="csv"
                        label="CSV"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalRelatorios(false)}>
              Cancelar
            </Button>
            <Button variant="primary">
              <FaDownload className="me-2" />
              Gerar Relatório
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default DashboardVeterinarioMarketing;
