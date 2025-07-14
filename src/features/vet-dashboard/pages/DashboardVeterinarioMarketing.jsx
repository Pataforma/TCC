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
} from "react-icons/fa";

const DashboardVeterinarioMarketing = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("perfil");
  const [activeTab, setActiveTab] = useState("perfil");

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
  });

  // Dados mockados dos anúncios
  const [anuncios] = useState([
    {
      id: 1,
      titulo: "Vacinação em Massa - Cães e Gatos",
      descricao:
        "Promoção especial de vacinação para cães e gatos. Preços especiais para múltiplos pets.",
      tipo: "promocao",
      dataInicio: "2024-01-15",
      dataFim: "2024-01-31",
      status: "ativo",
      visualizacoes: 245,
      cliques: 18,
    },
    {
      id: 2,
      titulo: "Dicas de Saúde - Cuidados no Verão",
      descricao:
        "Aprenda como proteger seu pet durante o verão. Dicas importantes sobre hidratação e proteção solar.",
      tipo: "dica",
      dataInicio: "2024-01-10",
      dataFim: "2024-01-25",
      status: "ativo",
      visualizacoes: 189,
      cliques: 32,
    },
    {
      id: 3,
      titulo: "Consulta de Rotina com Desconto",
      descricao:
        "Agende sua consulta de rotina com 20% de desconto. Válido para novos clientes.",
      tipo: "promocao",
      dataInicio: "2024-01-01",
      dataFim: "2024-01-15",
      status: "inativo",
      visualizacoes: 156,
      cliques: 12,
    },
  ]);

  // Dados mockados das dicas de saúde
  const [dicas] = useState([
    {
      id: 1,
      titulo: "Como identificar sinais de dor no seu pet",
      conteudo:
        "Os pets não falam, mas demonstram sinais claros quando estão sentindo dor. Fique atento a mudanças no comportamento...",
      categoria: "Saúde Geral",
      dataCriacao: "2024-01-15",
      status: "publicado",
    },
    {
      id: 2,
      titulo: "Alimentação adequada para filhotes",
      conteudo:
        "A alimentação correta nos primeiros meses de vida é fundamental para o desenvolvimento saudável do seu pet...",
      categoria: "Nutrição",
      dataCriacao: "2024-01-12",
      status: "rascunho",
    },
    {
      id: 3,
      titulo: "Prevenção de parasitas externos",
      conteudo:
        "Pulgas e carrapatos podem causar sérios problemas de saúde. Saiba como prevenir e tratar...",
      categoria: "Prevenção",
      dataCriacao: "2024-01-10",
      status: "publicado",
    },
  ]);

  const getStatusBadge = (status) => {
    const variants = {
      ativo: "success",
      inativo: "secondary",
      rascunho: "warning",
      publicado: "success",
    };

    const labels = {
      ativo: "Ativo",
      inativo: "Inativo",
      rascunho: "Rascunho",
      publicado: "Publicado",
    };

    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const getTipoBadge = (tipo) => {
    const variants = {
      promocao: "danger",
      dica: "info",
      evento: "warning",
    };

    const labels = {
      promocao: "Promoção",
      dica: "Dica de Saúde",
      evento: "Evento",
    };

    return <Badge bg={variants[tipo]}>{labels[tipo]}</Badge>;
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const handleNovoAnuncio = () => {
    setModalType("anuncio");
    setShowModal(true);
  };

  const handleNovaDica = () => {
    setModalType("dica");
    setShowModal(true);
  };

  const handleEditarPerfil = () => {
    setModalType("perfil");
    setShowModal(true);
  };

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario="Dr. André Silva">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Marketing</h2>
            <p className="text-muted mb-0">
              Gerencie seu perfil público e campanhas de marketing
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleNovoAnuncio}
            >
              <FaPlus className="me-2" />
              Novo Anúncio
            </Button>
            <Button variant="outline-info" size="sm" onClick={handleNovaDica}>
              <FaPlus className="me-2" />
              Nova Dica
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
                <Nav.Link eventKey="anuncios">Anúncios</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="dicas">Dicas de Saúde</Nav.Link>
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
                              <FaUser size={40} />
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
                              {perfil.especialidades.map(
                                (especialidade, index) => (
                                  <Badge key={index} bg="primary">
                                    {especialidade}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h6 className="fw-semibold mb-3">Descrição</h6>
                          <p className="text-muted">{perfil.descricao}</p>
                        </div>

                        <div className="mt-4">
                          <h6 className="fw-semibold mb-3">
                            Horários de Atendimento
                          </h6>
                          <p className="text-muted">{perfil.horarios}</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <div className="d-flex flex-column gap-4">
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="fw-semibold mb-3">
                            Estatísticas do Perfil
                          </h6>
                          <div className="d-flex flex-column gap-3">
                            <div className="d-flex justify-content-between">
                              <span>Visualizações</span>
                              <span className="fw-semibold">1,247</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Contatos</span>
                              <span className="fw-semibold">89</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Avaliações</span>
                              <span className="fw-semibold">
                                {perfil.totalAvaliacoes}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Média</span>
                              <span className="fw-semibold">
                                {perfil.avaliacao}/5
                              </span>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>

                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <h6 className="fw-semibold mb-3">Ações Rápidas</h6>
                          <div className="d-flex flex-column gap-2">
                            <Button variant="outline-primary" size="sm">
                              <FaEye className="me-2" />
                              Visualizar Perfil
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                              <FaShare className="me-2" />
                              Compartilhar
                            </Button>
                            <Button variant="outline-success" size="sm">
                              <FaDownload className="me-2" />
                              Exportar Dados
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Anúncios */}
              <Tab.Pane active={activeTab === "anuncios"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold text-dark mb-0">
                    Anúncios e Promoções
                  </h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleNovoAnuncio}
                  >
                    <FaPlus className="me-2" />
                    Novo Anúncio
                  </Button>
                </div>
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Título</th>
                      <th>Tipo</th>
                      <th>Período</th>
                      <th>Status</th>
                      <th>Visualizações</th>
                      <th>Cliques</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anuncios.map((anuncio) => (
                      <tr key={anuncio.id}>
                        <td>
                          <div className="fw-semibold">{anuncio.titulo}</div>
                          <small className="text-muted">
                            {anuncio.descricao.substring(0, 50)}...
                          </small>
                        </td>
                        <td>{getTipoBadge(anuncio.tipo)}</td>
                        <td>
                          <div>{formatarData(anuncio.dataInicio)}</div>
                          <small className="text-muted">
                            até {formatarData(anuncio.dataFim)}
                          </small>
                        </td>
                        <td>{getStatusBadge(anuncio.status)}</td>
                        <td>{anuncio.visualizacoes}</td>
                        <td>{anuncio.cliques}</td>
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

              {/* Dicas de Saúde */}
              <Tab.Pane active={activeTab === "dicas"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold text-dark mb-0">Dicas de Saúde</h5>
                  <Button variant="info" size="sm" onClick={handleNovaDica}>
                    <FaPlus className="me-2" />
                    Nova Dica
                  </Button>
                </div>
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Título</th>
                      <th>Categoria</th>
                      <th>Data Criação</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dicas.map((dica) => (
                      <tr key={dica.id}>
                        <td>
                          <div className="fw-semibold">{dica.titulo}</div>
                          <small className="text-muted">
                            {dica.conteudo.substring(0, 60)}...
                          </small>
                        </td>
                        <td>
                          <Badge bg="info">{dica.categoria}</Badge>
                        </td>
                        <td>{formatarData(dica.dataCriacao)}</td>
                        <td>{getStatusBadge(dica.status)}</td>
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
            </Tab.Content>
          </Card.Body>
        </Card>
      </div>

      {/* Modal para Editar Perfil/Novo Anúncio/Nova Dica */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-semibold">
            {modalType === "perfil" && <FaUser className="me-2 text-primary" />}
            {modalType === "anuncio" && (
              <FaBullhorn className="me-2 text-danger" />
            )}
            {modalType === "dica" && <FaEdit className="me-2 text-info" />}
            {modalType === "perfil" && "Editar Perfil"}
            {modalType === "anuncio" && "Novo Anúncio"}
            {modalType === "dica" && "Nova Dica de Saúde"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {modalType === "perfil" && (
              <>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Nome Completo</Form.Label>
                      <Form.Control type="text" defaultValue={perfil.nome} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Especialidade</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={perfil.especialidade}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Anos de Experiência</Form.Label>
                      <Form.Control
                        type="number"
                        defaultValue={perfil.experiencia}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control type="tel" defaultValue={perfil.telefone} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" defaultValue={perfil.email} />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Endereço</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={perfil.endereco}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Website</Form.Label>
                      <Form.Control type="url" defaultValue={perfil.website} />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        defaultValue={perfil.descricao}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Horários de Atendimento</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        defaultValue={perfil.horarios}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {modalType === "anuncio" && (
              <>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Título do Anúncio</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: Promoção de Vacinação"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select>
                        <option>Promoção</option>
                        <option>Dica de Saúde</option>
                        <option>Evento</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select>
                        <option>Ativo</option>
                        <option>Inativo</option>
                      </Form.Select>
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
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Descreva o anúncio..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {modalType === "dica" && (
              <>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Título da Dica</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: Como identificar sinais de dor no seu pet"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Categoria</Form.Label>
                      <Form.Select>
                        <option>Saúde Geral</option>
                        <option>Nutrição</option>
                        <option>Prevenção</option>
                        <option>Comportamento</option>
                        <option>Emergências</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select>
                        <option>Publicado</option>
                        <option>Rascunho</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Conteúdo</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={8}
                        placeholder="Escreva o conteúdo da dica..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary">
            <FaSave className="me-2" />
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default DashboardVeterinarioMarketing;
