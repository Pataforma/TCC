import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  ListGroup,
  InputGroup,
  Dropdown,
  Modal,
  Alert,
} from "react-bootstrap";
import {
  FaComments,
  FaSearch,
  FaPaperPlane,
  FaPaperclip,
  FaImage,
  FaFile,
  FaEllipsisV,
  FaUser,
  FaUserCircle,
  FaClock,
  FaCheck,
  FaCheckDouble,
  FaPhone,
  FaVideo,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPlus,
  FaTrash,
  FaArchive,
  FaBell,
  FaBellSlash,
} from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";

const MensagensPage = () => {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [conversas, setConversas] = useState([]);
  const [conversaAtiva, setConversaAtiva] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  // Dados mockados de conversas
  const [conversasData] = useState([
    {
      id: 1,
      veterinario: "Dr. André Silva",
      clinica: "Clínica Veterinária Pataforma",
      avatar: "https://via.placeholder.com/50x50/4ecdc4/ffffff?text=AS",
      ultimaMensagem: "Olá! Como está o Thor hoje?",
      timestamp: "14:30",
      naoLidas: 2,
      online: true,
      especialidade: "Clínico Geral",
      telefone: "(11) 99999-9999",
      email: "andre.silva@pataforma.com.br",
    },
    {
      id: 2,
      veterinario: "Dra. Juliana Santos",
      clinica: "Clínica Veterinária Pataforma",
      avatar: "https://via.placeholder.com/50x50/ff6b6b/ffffff?text=JS",
      ultimaMensagem: "A vacina da Luna está agendada para amanhã às 10h",
      timestamp: "12:15",
      naoLidas: 0,
      online: false,
      especialidade: "Vacinação",
      telefone: "(11) 88888-8888",
      email: "juliana.santos@pataforma.com.br",
    },
    {
      id: 3,
      veterinario: "Dr. Rafael Costa",
      clinica: "Clínica Veterinária Pataforma",
      avatar: "https://via.placeholder.com/50x50/45b7d1/ffffff?text=RC",
      ultimaMensagem: "Os exames do Max estão prontos. Posso enviar por email?",
      timestamp: "09:45",
      naoLidas: 1,
      online: true,
      especialidade: "Laboratório",
      telefone: "(11) 77777-7777",
      email: "rafael.costa@pataforma.com.br",
    },
    {
      id: 4,
      veterinario: "Dra. Mariana Oliveira",
      clinica: "Clínica Veterinária Pataforma",
      avatar: "https://via.placeholder.com/50x50/96ceb4/ffffff?text=MO",
      ultimaMensagem: "Obrigada pela confiança! Até a próxima consulta.",
      timestamp: "Ontem",
      naoLidas: 0,
      online: false,
      especialidade: "Cirurgia",
      telefone: "(11) 66666-6666",
      email: "mariana.oliveira@pataforma.com.br",
    },
  ]);

  // Dados mockados de mensagens
  const [mensagensData] = useState({
    1: [
      {
        id: 1,
        remetente: "veterinario",
        conteudo: "Olá! Como está o Thor hoje?",
        timestamp: "14:30",
        lida: true,
        tipo: "texto",
      },
      {
        id: 2,
        remetente: "tutor",
        conteudo:
          "Olá Dr. André! Ele está bem, mas notei que está coçando muito a orelha",
        timestamp: "14:32",
        lida: true,
        tipo: "texto",
      },
      {
        id: 3,
        remetente: "veterinario",
        conteudo:
          "Entendo. Pode ser uma otite. Você consegue trazer ele hoje para eu dar uma olhada?",
        timestamp: "14:35",
        lida: false,
        tipo: "texto",
      },
      {
        id: 4,
        remetente: "veterinario",
        conteudo: "Posso encaixar uma consulta às 16h",
        timestamp: "14:36",
        lida: false,
        tipo: "texto",
      },
    ],
    2: [
      {
        id: 1,
        remetente: "veterinario",
        conteudo:
          "A vacina da Luna está agendada para amanhã às 10h. Não esqueça de trazer a carteirinha de vacinação!",
        timestamp: "12:15",
        lida: true,
        tipo: "texto",
      },
      {
        id: 2,
        remetente: "tutor",
        conteudo: "Perfeito! Vou levar a carteirinha. Precisa de jejum?",
        timestamp: "12:20",
        lida: true,
        tipo: "texto",
      },
      {
        id: 3,
        remetente: "veterinario",
        conteudo:
          "Não precisa de jejum para vacina. Pode dar a alimentação normal dela.",
        timestamp: "12:22",
        lida: true,
        tipo: "texto",
      },
    ],
    3: [
      {
        id: 1,
        remetente: "veterinario",
        conteudo: "Os exames do Max estão prontos. Posso enviar por email?",
        timestamp: "09:45",
        lida: false,
        tipo: "texto",
      },
    ],
    4: [
      {
        id: 1,
        remetente: "veterinario",
        conteudo:
          "A cirurgia do Thor foi um sucesso! Ele está se recuperando muito bem.",
        timestamp: "Ontem 16:30",
        lida: true,
        tipo: "texto",
      },
      {
        id: 2,
        remetente: "tutor",
        conteudo: "Que ótimo! Muito obrigada por todo o cuidado, Dra. Mariana!",
        timestamp: "Ontem 17:00",
        lida: true,
        tipo: "texto",
      },
      {
        id: 3,
        remetente: "veterinario",
        conteudo: "Obrigada pela confiança! Até a próxima consulta.",
        timestamp: "Ontem 17:05",
        lida: true,
        tipo: "texto",
      },
    ],
  });

  useEffect(() => {
    // TODO: Buscar dados do usuário do Supabase
    setNomeUsuario("Maria Silva");
    setConversas(conversasData);
  }, [conversasData]);

  useEffect(() => {
    // Scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  const handleConversaClick = (conversa) => {
    setConversaAtiva(conversa);
    setMensagens(mensagensData[conversa.id] || []);
    // Marcar mensagens como lidas
    const conversasAtualizadas = conversas.map((c) =>
      c.id === conversa.id ? { ...c, naoLidas: 0 } : c
    );
    setConversas(conversasAtualizadas);
  };

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim() && !selectedFile) return;

    const novaMsg = {
      id: Date.now(),
      remetente: "tutor",
      conteudo: novaMensagem,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      lida: false,
      tipo: selectedFile ? "arquivo" : "texto",
      arquivo: selectedFile,
    };

    setMensagens([...mensagens, novaMsg]);
    setNovaMensagem("");
    setSelectedFile(null);
    setShowAttachmentModal(false);

    // Simular resposta do veterinário após 2 segundos
    setTimeout(() => {
      const resposta = {
        id: Date.now() + 1,
        remetente: "veterinario",
        conteudo: "Mensagem recebida! Responderei em breve.",
        timestamp: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        lida: false,
        tipo: "texto",
      };
      setMensagens((prev) => [...prev, resposta]);
    }, 2000);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile({
        nome: file.name,
        tamanho: file.size,
        tipo: file.type,
        url: URL.createObjectURL(file),
      });
    }
  };

  const conversasFiltradas = conversas.filter(
    (conversa) =>
      conversa.veterinario.toLowerCase().includes(filtroBusca.toLowerCase()) ||
      conversa.clinica.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    const hoje = new Date().toDateString();
    const dataMsg = new Date(timestamp).toDateString();

    if (dataMsg === hoje) {
      return timestamp;
    } else if (dataMsg === new Date(Date.now() - 86400000).toDateString()) {
      return "Ontem";
    } else {
      return new Date(timestamp).toLocaleDateString("pt-BR");
    }
  };

  return (
    <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
      <Container fluid className="py-4">
        <Row className="h-100" style={{ minHeight: "calc(100vh - 200px)" }}>
          {/* Lista de Conversas */}
          <Col md={4} className="h-100">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <FaComments className="me-2" />
                    Mensagens
                  </h5>
                  <Badge bg="primary">
                    {conversas.filter((c) => c.naoLidas > 0).length}
                  </Badge>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                {/* Busca */}
                <div className="p-3 border-bottom">
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Buscar conversas..."
                      value={filtroBusca}
                      onChange={(e) => setFiltroBusca(e.target.value)}
                    />
                  </InputGroup>
                </div>

                {/* Lista de Conversas */}
                <ListGroup variant="flush">
                  {conversasFiltradas.map((conversa) => (
                    <ListGroup.Item
                      key={conversa.id}
                      action
                      className={`border-0 p-3 ${
                        conversaAtiva?.id === conversa.id ? "bg-light" : ""
                      }`}
                      onClick={() => handleConversaClick(conversa)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="position-relative">
                          <img
                            src={conversa.avatar}
                            alt={conversa.veterinario}
                            className="rounded-circle"
                            style={{ width: 50, height: 50 }}
                          />
                          {conversa.online && (
                            <div
                              className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                              style={{
                                width: 12,
                                height: 12,
                                border: "2px solid white",
                              }}
                            />
                          )}
                        </div>

                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="fw-semibold mb-1">
                                {conversa.veterinario}
                              </h6>
                              <p className="text-muted small mb-1">
                                {conversa.clinica}
                              </p>
                              <p className="text-muted small mb-0">
                                {conversa.especialidade}
                              </p>
                            </div>
                            <div className="text-end">
                              <small className="text-muted">
                                {conversa.timestamp}
                              </small>
                              {conversa.naoLidas > 0 && (
                                <Badge bg="danger" className="ms-2">
                                  {conversa.naoLidas}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-muted small mb-0 mt-2">
                            {conversa.ultimaMensagem}
                          </p>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Chat Ativo */}
          <Col md={8} className="h-100">
            {conversaAtiva ? (
              <Card className="border-0 shadow-sm h-100">
                {/* Header do Chat */}
                <Card.Header className="bg-white border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={conversaAtiva.avatar}
                        alt={conversaAtiva.veterinario}
                        className="rounded-circle"
                        style={{ width: 40, height: 40 }}
                      />
                      <div>
                        <h6 className="fw-semibold mb-0">
                          {conversaAtiva.veterinario}
                        </h6>
                        <small className="text-muted">
                          {conversaAtiva.clinica} •{" "}
                          {conversaAtiva.especialidade}
                        </small>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm">
                        <FaPhone />
                      </Button>
                      <Button variant="outline-success" size="sm">
                        <FaVideo />
                      </Button>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm">
                          <FaEllipsisV />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>
                            <FaUser className="me-2" />
                            Ver Perfil
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <FaCalendarAlt className="me-2" />
                            Agendar Consulta
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <FaMapMarkerAlt className="me-2" />
                            Ver Localização
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item>
                            <FaArchive className="me-2" />
                            Arquivar Conversa
                          </Dropdown.Item>
                          <Dropdown.Item className="text-danger">
                            <FaTrash className="me-2" />
                            Excluir Conversa
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </Card.Header>

                {/* Mensagens */}
                <Card.Body
                  className="p-0 d-flex flex-column"
                  style={{ height: "calc(100% - 140px)" }}
                >
                  <div
                    className="flex-grow-1 p-3"
                    style={{ overflowY: "auto" }}
                  >
                    {mensagens.map((mensagem) => (
                      <div
                        key={mensagem.id}
                        className={`d-flex mb-3 ${
                          mensagem.remetente === "tutor"
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-3 ${
                            mensagem.remetente === "tutor"
                              ? "bg-primary text-white"
                              : "bg-light text-dark"
                          }`}
                          style={{ maxWidth: "70%" }}
                        >
                          {mensagem.tipo === "arquivo" ? (
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <FaFile />
                                <span className="fw-semibold">
                                  {mensagem.arquivo.nome}
                                </span>
                              </div>
                              <small className="text-muted">
                                {Math.round(mensagem.arquivo.tamanho / 1024)} KB
                              </small>
                            </div>
                          ) : (
                            <p className="mb-1">{mensagem.conteudo}</p>
                          )}

                          <div className="d-flex align-items-center gap-2 mt-2">
                            <small className="opacity-75">
                              {mensagem.timestamp}
                            </small>
                            {mensagem.remetente === "tutor" && (
                              <span>
                                {mensagem.lida ? (
                                  <FaCheckDouble className="text-info" />
                                ) : (
                                  <FaCheck />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input de Mensagem */}
                  <div className="p-3 border-top">
                    {selectedFile && (
                      <div className="mb-2 p-2 bg-light rounded">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <FaFile />
                            <span className="small">{selectedFile.nome}</span>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0"
                            onClick={() => setSelectedFile(null)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setShowAttachmentModal(true)}
                      >
                        <FaPaperclip />
                      </Button>

                      <Form.Control
                        type="text"
                        placeholder="Digite sua mensagem..."
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleEnviarMensagem()
                        }
                      />

                      <Button
                        variant="primary"
                        onClick={handleEnviarMensagem}
                        disabled={!novaMensagem.trim() && !selectedFile}
                      >
                        <FaPaperPlane />
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                  <FaComments size={64} className="text-muted mb-3" />
                  <h5>Selecione uma conversa</h5>
                  <p className="text-muted">
                    Escolha um veterinário na lista ao lado para iniciar uma
                    conversa
                  </p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>

        {/* Modal de Anexos */}
        <Modal
          show={showAttachmentModal}
          onHide={() => setShowAttachmentModal(false)}
          size="sm"
        >
          <Modal.Header closeButton>
            <Modal.Title>Anexar Arquivo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-grid gap-2">
              <Button variant="outline-primary" as="label">
                <FaImage className="me-2" />
                Foto ou Imagem
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
              </Button>
              <Button variant="outline-secondary" as="label">
                <FaFile className="me-2" />
                Documento
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default MensagensPage;
