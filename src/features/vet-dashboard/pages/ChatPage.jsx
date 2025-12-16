import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  InputGroup,
  ListGroup,
  Image,
  Dropdown,
  Modal,
  Alert,
} from "react-bootstrap";
import {
  FaPaperclip,
  FaPaperPlane,
  FaSearch,
  FaEllipsisV,
  FaImage,
  FaFile,
  FaDownload,
  FaTrash,
  FaReply,
  FaPhone,
  FaVideo,
  FaUser,
  FaClock,
  FaCheck,
  FaCheckDouble,
  FaExclamationTriangle,
  FaSmile,
  FaMicrophone,
  FaPaw,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";
import { api } from "../../../utils/api";
import { connectSocket, disconnectSocket, getSocket } from "../../../utils/socket";

const ChatPage = () => {
  const { user } = useUser();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permitirContato, setPermitirContato] = useState(true);

  // Conectar WebSocket e escutar mensagens (independente da conversa selecionada)
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      if (token) {
        const socket = connectSocket(token);
        
        // Escutar novas mensagens (sempre ativo)
        const handleNewMessage = (mensagem) => {
          console.log('[ChatPage] Nova mensagem recebida via WebSocket:', mensagem);
          console.log('[ChatPage] Conversa ativa:', selectedConversation?.id);
          console.log('[ChatPage] Mensagem conversa_id:', mensagem.conversa_id);
          
          // Se a conversa estiver aberta, adicionar mensagem à lista
          if (selectedConversation && mensagem.conversa_id === selectedConversation.id) {
            console.log('[ChatPage] Adicionando mensagem à lista de mensagens');
            setMessages((prev) => {
              // Verificar se a mensagem já existe para evitar duplicação
              const existe = prev.some((msg) => msg.id === mensagem.id);
              if (!existe) {
                return [...prev, mensagem];
              }
              return prev;
            });
          } else {
            console.log('[ChatPage] Conversa não está aberta, apenas atualizando lista');
          }
          // Sempre atualizar lista de conversas para mostrar novas mensagens
          fetchConversations();
        };
        
        socket?.on('new:message', handleNewMessage);
        
        // Escutar mensagem lida
        socket?.on('message:read', (data) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === data.mensagemId ? { ...msg, lida: true } : msg
            )
          );
        });
        
        return () => {
          socket?.off('new:message', handleNewMessage);
          socket?.off('message:read');
        };
      }
    }
  }, [user, selectedConversation]);

  // Carregar conversas e configurações
  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchPermitirContato();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await api.get('/conversas');
      setConversations(data || []);
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermitirContato = async () => {
    try {
      const vet = await api.get('/veterinarios/me');
      setPermitirContato(vet.permitir_contato !== false && vet.permitir_contato !== 0);
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
    }
  };

  const handleTogglePermitirContato = async () => {
    try {
      await api.put('/veterinarios/me', {
        permitir_contato: !permitirContato,
      });
      setPermitirContato(!permitirContato);
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      alert('Erro ao atualizar configuração. Tente novamente.');
    }
  };

  const fetchMensagens = async (conversaId) => {
    try {
      const data = await api.get(`/conversas/${conversaId}/mensagens`);
      setMessages(data || []);
      
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


  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  // Função wrapper para enviar mensagem (com suporte a anexos)
  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedFile) return;

    // Usar a função async para enviar mensagem ao Supabase
    handleSendMessageAsync();
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMensagens(conversation.id);
  };

  // Funções de manipulação

  const handleSendMessageAsync = async () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedConversation) return;

    try {
      const mensagemData = {
        conteudo: newMessage.trim(),
        tipo: selectedFile ? 'arquivo' : 'texto',
        anexo_url: null, // TODO: Implementar upload
      };

      const mensagem = await api.post(
        `/conversas/${selectedConversation.id}/mensagens`,
        mensagemData
      );

      // Limpar campos
      setNewMessage('');
      setSelectedFile(null);

      // Não adicionar localmente - deixar o WebSocket adicionar para evitar duplicação
      // O WebSocket vai receber a mensagem e adicionar automaticamente
      
      // Emitir via WebSocket (opcional, o servidor pode já estar enviando)
      const socket = getSocket();
      if (socket) {
        socket.emit('send:message', {
          conversaId: selectedConversation.id,
          mensagem: mensagem,
        });
      }

      // Adicionar mensagem localmente apenas se não for recebida via WebSocket em breve
      // Usar um timeout para garantir que aparece mesmo se WebSocket falhar
      setTimeout(() => {
        setMessages((prev) => {
          // Verificar se a mensagem já existe (adicionada via WebSocket)
          const existe = prev.some((msg) => msg.id === mensagem.id);
          if (!existe) {
            return [...prev, mensagem];
          }
          return prev;
        });
        scrollToBottom();
      }, 500);

      // Atualizar lista de conversas
      fetchConversations();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowAttachmentModal(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <FaCheck size={12} className="text-muted" />;
      case "delivered":
        return <FaCheckDouble size={12} className="text-muted" />;
      case "read":
        return <FaCheckDouble size={12} className="text-primary" />;
      default:
        return null;
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      (conv.tutor_nome || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-scroll para o final das mensagens quando uma conversa é selecionada ou novas mensagens chegam
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, selectedConversation]);

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
      <Container fluid className="py-4">
        <Row className="h-100">
          {/* Lista de Conversas - Coluna Esquerda */}
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">Conversas</h5>
                  <Badge bg="primary" className="ms-2">
                    {conversations.reduce(
                      (total, conv) => total + (conv.nao_lidas_count || 0),
                      0
                    )}
                  </Badge>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <small className="text-muted">Permitir contato de tutores</small>
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={handleTogglePermitirContato}
                  >
                    {permitirContato ? (
                      <FaToggleOn size={24} className="text-success" />
                    ) : (
                      <FaToggleOff size={24} className="text-muted" />
                    )}
                  </Button>
                </div>
                <InputGroup className="mt-3">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {filteredConversations.map((conversation) => (
                    <ListGroup.Item
                      key={conversation.id}
                      action
                      className={`border-0 py-3 px-3 ${
                        selectedConversation?.id === conversation.id
                          ? "bg-light"
                          : ""
                      }`}
                      onClick={() => handleConversationSelect(conversation)}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div className="position-relative">
                          {conversation.tutor_foto ? (
                            <Image
                              src={conversation.tutor_foto}
                              alt={conversation.tutor_nome || 'Tutor'}
                              roundedCircle
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                              style={{ width: 40, height: 40 }}
                            >
                              {(conversation.tutor_nome || 'T')[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1 fw-semibold">
                                {conversation.tutor_nome || 'Tutor'}
                              </h6>
                              {conversation.assunto && (
                                <small className="text-muted">
                                  {conversation.assunto}
                                </small>
                              )}
                            </div>
                            <div className="text-end">
                              <small className="text-muted d-block">
                                {conversation.ultima_mensagem_at
                                  ? new Date(conversation.ultima_mensagem_at).toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : ''}
                              </small>
                              {(conversation.nao_lidas_count || 0) > 0 && (
                                <Badge bg="primary" className="mt-1">
                                  {conversation.nao_lidas_count}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-muted mb-0 mt-1 small text-truncate">
                            {conversation.ultima_mensagem || 'Sem mensagens'}
                          </p>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Área de Chat - Coluna Direita */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm h-100">
              {selectedConversation ? (
                <>
                  {/* Header do Chat */}
                  <Card.Header className="bg-white border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle"
                          style={{ width: 40, height: 40 }}
                        >
                          <FaPaw size={16} />
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold">
                            {selectedConversation.tutor_nome || 'Tutor'}
                          </h6>
                          <small className="text-muted">
                            Conversa #{selectedConversation.id}
                            {selectedConversation.assunto && ` • ${selectedConversation.assunto}`}
                          </small>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <Button variant="outline-primary" size="sm">
                          <FaPhone />
                        </Button>
                        <Button variant="outline-primary" size="sm">
                          <FaVideo />
                        </Button>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <FaUser className="me-2" />
                              Ver Perfil
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <FaDownload className="me-2" />
                              Exportar Conversa
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="text-danger">
                              <FaTrash className="me-2" />
                              Excluir Conversa
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </Card.Header>

                  {/* Área de Mensagens */}
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
                      {messages.length === 0 ? (
                        <div className="text-center text-muted py-4">
                          Nenhuma mensagem ainda. Inicie a conversa!
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isVet = message.remetente_tipo === 'veterinario';
                          return (
                            <div
                              key={message.id}
                              className={`d-flex mb-3 ${
                                isVet
                                  ? "justify-content-end"
                                  : "justify-content-start"
                              }`}
                            >
                              <div
                                className={`max-w-75 ${
                                  isVet
                                    ? "bg-primary text-white"
                                    : "bg-light text-dark"
                                } rounded-3 p-3`}
                                style={{ maxWidth: "75%" }}
                              >
                                <p className="mb-2">{message.conteudo}</p>

                                {/* Anexos */}
                                {message.anexo_url && (
                                  <div className="mb-2">
                                    {message.tipo === "imagem" ? (
                                      <Image
                                        src={message.anexo_url}
                                        alt="Anexo"
                                        fluid
                                        className="rounded"
                                        style={{ maxHeight: "200px" }}
                                      />
                                    ) : (
                                      <div className="d-flex align-items-center gap-2 p-2 bg-white rounded">
                                        <FaFile className="text-primary" />
                                        <a
                                          href={message.anexo_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="small"
                                        >
                                          Ver anexo
                                        </a>
                                        <Button
                                          variant="link"
                                          size="sm"
                                          className="p-0"
                                          href={message.anexo_url}
                                          download
                                        >
                                          <FaDownload />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="opacity-75">
                                    {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </small>
                                  {isVet && (
                                    <span className="ms-2">
                                      {message.lida ? (
                                        <FaCheckDouble className={isVet ? "text-white" : "text-primary"} />
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

                      {/* Indicador de Digitação */}
                      {isTyping && (
                        <div className="d-flex justify-content-start mb-3">
                          <div className="bg-light text-dark rounded-3 p-3">
                            <small className="text-muted">
                              {selectedConversation.tutor_nome || 'Tutor'} está digitando...
                            </small>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </Card.Body>

                  {/* Área de Input */}
                  <Card.Footer className="bg-white border-top">
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setShowAttachmentModal(true)}
                      >
                        <FaPaperclip />
                      </Button>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-grow-1"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() && !selectedFile}
                      >
                        <FaPaperPlane />
                      </Button>
                    </div>

                    {/* Anexo Selecionado */}
                    {selectedFile && (
                      <div className="mt-2 p-2 bg-light rounded">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <FaFile className="text-primary" />
                            <small>{selectedFile.name}</small>
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
                  </Card.Footer>
                </>
              ) : (
                /* Estado vazio quando nenhuma conversa está selecionada */
                <Card.Body
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "500px" }}
                >
                  <div className="text-center">
                    <FaUser size={64} className="text-muted mb-3" />
                    <h5 className="text-muted">Selecione uma conversa</h5>
                    <p className="text-muted">
                      Escolha uma conversa da lista para começar a trocar
                      mensagens
                    </p>
                  </div>
                </Card.Body>
              )}
            </Card>
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
            <Form.Group>
              <Form.Label>Selecione um arquivo</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
              />
              <Form.Text className="text-muted">
                Formatos aceitos: Imagens, PDF, DOC, DOCX (máx. 10MB)
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAttachmentModal(false)}
            >
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default ChatPage;
