import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
import DashboardLayout from "../../../layouts/DashboardLayout";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";
import { connectSocket, disconnectSocket, getSocket } from "../../../utils/socket";
import BuscarVeterinarioModal from "../components/BuscarVeterinarioModal";

const MensagensPage = () => {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [conversas, setConversas] = useState([]);
  const [conversaAtiva, setConversaAtiva] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showBuscarVetModal, setShowBuscarVetModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Dados mockados de conversas (removido - usando dados reais)
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

  // Conectar WebSocket e buscar conversas
  useEffect(() => {
    if (user) {
      setNomeUsuario(user.nome || "");
      fetchConversas();
      
      // Verificar se há conversa na URL
      const conversaId = searchParams.get('conversa');
      if (conversaId) {
        // Buscar conversa e abrir
        api.get(`/conversas/${conversaId}`)
          .then((conversa) => {
            setConversaAtiva(conversa);
            fetchMensagens(conversa.id);
          })
          .catch((error) => {
            console.error('Erro ao buscar conversa:', error);
          });
      }
      
      // Conectar WebSocket
      const token = localStorage.getItem('token');
      if (token) {
        const socket = connectSocket(token);
        
        // Escutar novas mensagens
        socket?.on('new:message', (mensagem) => {
          // Se a conversa estiver aberta, adicionar mensagem à lista
          if (conversaAtiva && mensagem.conversa_id === conversaAtiva.id) {
            setMensagens((prev) => {
              // Verificar se a mensagem já existe para evitar duplicação
              const existe = prev.some((msg) => msg.id === mensagem.id);
              if (!existe) {
                return [...prev, mensagem];
              }
              return prev;
            });
          }
          // Sempre atualizar lista de conversas para mostrar novas mensagens
          fetchConversas();
        });
        
        // Escutar mensagem lida
        socket?.on('message:read', (data) => {
          setMensagens((prev) =>
            prev.map((msg) =>
              msg.id === data.mensagemId ? { ...msg, lida: true } : msg
            )
          );
        });
        
        return () => {
          socket?.off('new:message');
          socket?.off('message:read');
        };
      }
    }
    
    return () => {
      disconnectSocket();
    };
  }, [user, conversaAtiva]);

  const fetchConversas = async () => {
    try {
      setLoading(true);
      const data = await api.get('/conversas');
      setConversas(data || []);
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMensagens = async (conversaId) => {
    try {
      const data = await api.get(`/conversas/${conversaId}/mensagens`);
      setMensagens(data || []);
      
      // Marcar todas como lidas
      await api.put(`/conversas/${conversaId}/mensagens/lidas`);
      
      // Entrar na sala da conversa via WebSocket
      const socket = getSocket();
      if (socket) {
        socket.emit('join:conversa', conversaId);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Scroll para a última mensagem
    scrollToBottom();
  }, [mensagens]);

  const handleConversaClick = (conversa) => {
    setConversaAtiva(conversa);
    fetchMensagens(conversa.id);
  };

  const handleEnviarMensagem = async () => {
    if ((!novaMensagem.trim() && !selectedFile) || !conversaAtiva) return;

    try {
      // TODO: Upload de arquivo se houver selectedFile
      const mensagemData = {
        conteudo: novaMensagem.trim(),
        tipo: selectedFile ? 'arquivo' : 'texto',
        anexo_url: selectedFile ? null : null, // TODO: Implementar upload
      };

      const mensagem = await api.post(
        `/conversas/${conversaAtiva.id}/mensagens`,
        mensagemData
      );

      // Limpar campos
      setNovaMensagem("");
      setSelectedFile(null);
      setShowAttachmentModal(false);

      // Não adicionar localmente - deixar o WebSocket adicionar para evitar duplicação
      // O WebSocket vai receber a mensagem e adicionar automaticamente
      
      // Emitir via WebSocket (opcional, o servidor pode já estar enviando)
      const socket = getSocket();
      if (socket) {
        socket.emit('send:message', {
          conversaId: conversaAtiva.id,
          mensagem: mensagem,
        });
      }

      // Adicionar mensagem localmente apenas se não for recebida via WebSocket em breve
      // Usar um timeout para garantir que aparece mesmo se WebSocket falhar
      setTimeout(() => {
        setMensagens((prev) => {
          // Verificar se a mensagem já existe (adicionada via WebSocket)
          const existe = prev.some((msg) => msg.id === mensagem.id);
          if (!existe) {
            return [...prev, mensagem];
          }
          return prev;
        });
      }, 500);

      // Atualizar lista de conversas
      fetchConversas();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
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
      (conversa.veterinario_nome || '').toLowerCase().includes(filtroBusca.toLowerCase()) ||
      (conversa.nome_clinica || '').toLowerCase().includes(filtroBusca.toLowerCase())
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
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="primary">
                      {conversas.filter((c) => (c.nao_lidas_count || 0) > 0).length}
                    </Badge>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowBuscarVetModal(true)}
                    >
                      <FaPlus />
                    </Button>
                  </div>
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
                  {loading ? (
                    <ListGroup.Item className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </ListGroup.Item>
                  ) : conversasFiltradas.length === 0 ? (
                    <ListGroup.Item className="text-center py-4 text-muted">
                      Nenhuma conversa encontrada
                    </ListGroup.Item>
                  ) : (
                    conversasFiltradas.map((conversa) => (
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
                            {conversa.veterinario_foto ? (
                              <img
                                src={conversa.veterinario_foto}
                                alt={conversa.veterinario_nome || 'Veterinário'}
                                className="rounded-circle"
                                style={{ width: 50, height: 50, objectFit: 'cover' }}
                              />
                            ) : (
                              <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                style={{ width: 50, height: 50 }}
                              >
                                {(conversa.veterinario_nome || 'V')[0].toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="flex-grow-1 min-w-0">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="fw-semibold mb-1">
                                  {conversa.veterinario_nome || 'Veterinário'}
                                </h6>
                                <p className="text-muted small mb-0">
                                  {conversa.nome_clinica || 'Clínica'}
                                </p>
                              </div>
                              <div className="text-end">
                                <small className="text-muted">
                                  {conversa.ultima_mensagem_at
                                    ? new Date(conversa.ultima_mensagem_at).toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : ''}
                                </small>
                                {(conversa.nao_lidas_count || 0) > 0 && (
                                  <Badge bg="danger" className="ms-2">
                                    {conversa.nao_lidas_count}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-muted small mb-0 mt-2">
                              {conversa.ultima_mensagem || 'Sem mensagens'}
                            </p>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))
                  )}
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
                      {conversaAtiva.veterinario_foto ? (
                        <img
                          src={conversaAtiva.veterinario_foto}
                          alt={conversaAtiva.veterinario_nome || 'Veterinário'}
                          className="rounded-circle"
                          style={{ width: 40, height: 40, objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{ width: 40, height: 40 }}
                        >
                          {(conversaAtiva.veterinario_nome || 'V')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h6 className="fw-semibold mb-0">
                          {conversaAtiva.veterinario_nome || 'Veterinário'}
                        </h6>
                        <small className="text-muted">
                          {conversaAtiva.nome_clinica || 'Clínica'}
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
                  style={{ 
                    height: "calc(100vh - 300px)",
                    minHeight: "400px",
                    maxHeight: "600px"
                  }}
                >
                  <div
                    ref={messagesContainerRef}
                    className="flex-grow-1 p-3"
                    style={{ 
                      overflowY: "auto",
                      overflowX: "hidden"
                    }}
                  >
                    {mensagens.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        Nenhuma mensagem ainda. Inicie a conversa!
                      </div>
                    ) : (
                      mensagens.map((mensagem) => {
                        const isTutor = mensagem.remetente_tipo === 'tutor';
                        return (
                          <div
                            key={mensagem.id}
                            className={`d-flex mb-3 ${
                              isTutor
                                ? "justify-content-end"
                                : "justify-content-start"
                            }`}
                          >
                            <div
                              className={`p-3 rounded-3 ${
                                isTutor
                                  ? "bg-primary text-white"
                                  : "bg-light text-dark"
                              }`}
                              style={{ maxWidth: "70%" }}
                            >
                              {mensagem.tipo === "arquivo" && mensagem.anexo_url ? (
                                <div>
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <FaFile />
                                    <a
                                      href={mensagem.anexo_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={isTutor ? "text-white" : "text-dark"}
                                    >
                                      Ver anexo
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <p className="mb-1">{mensagem.conteudo}</p>
                              )}

                              <div className="d-flex align-items-center gap-2 mt-2">
                                <small className="opacity-75">
                                  {new Date(mensagem.created_at).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </small>
                                {isTutor && (
                                  <span>
                                    {mensagem.lida ? (
                                      <FaCheckDouble className={isTutor ? "text-white" : "text-info"} />
                                    ) : (
                                      <FaCheck />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
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

        {/* Modal Buscar Veterinário */}
        <BuscarVeterinarioModal
          show={showBuscarVetModal}
          onHide={() => setShowBuscarVetModal(false)}
          onConversaCriada={(conversa) => {
            setShowBuscarVetModal(false);
            setConversaAtiva(conversa);
            fetchMensagens(conversa.id);
            fetchConversas();
          }}
        />
      </Container>
    </DashboardLayout>
  );
};

export default MensagensPage;
