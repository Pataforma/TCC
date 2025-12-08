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
import { supabase } from "../../../utils/supabase";
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
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Carregar conversas do Supabase
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setCurrentUserId(session.user.id);

      // Buscar conversas onde o veterinário é destinatário ou remetente
      const { data, error } = await supabase
        .from('mensagens')
        .select(`
          *,
          remetente: remetente_id (id, nome, email),
          destinatario: destinatario_id (id, nome, email),
          pacientes: paciente_id (nome, especie)
        `)
        .or(`remetente_id.eq.${session.user.id},destinatario_id.eq.${session.user.id}`)
        .order('data_envio', { ascending: false });

      if (error) throw error;

      // Agrupar mensagens por conversa
      const conversasAgrupadas = groupMessagesByConversation(data || []);
      setConversations(conversasAgrupadas);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupMessagesByConversation = (mensagens) => {
    const conversas = {};
    
    mensagens.forEach(msg => {
      // Determinar o outro participante da conversa
      const isRemetente = msg.remetente_id === currentUserId;
      const outroParticipante = isRemetente ? msg.destinatario : msg.remetente;
      const paciente = msg.pacientes;
      
      const conversaKey = `${outroParticipante.id}_${msg.paciente_id || 'sem_paciente'}`;
      
      if (!conversas[conversaKey]) {
        conversas[conversaKey] = {
          id: conversaKey,
          tutor: outroParticipante,
          paciente: paciente,
          lastMessage: msg.conteudo,
          lastMessageTime: formatMessageTime(msg.data_envio),
          unreadCount: isRemetente ? 0 : (msg.lida ? 0 : 1),
          isOnline: false, // Por enquanto sempre false
          messages: []
        };
      }
      
      conversas[conversaKey].messages.push({
        id: msg.id,
        sender: isRemetente ? 'vet' : 'tutor',
        text: msg.conteudo,
        timestamp: formatMessageTime(msg.data_envio),
        status: msg.lida ? 'read' : 'sent',
        attachments: msg.anexos || []
      });
      
      // Atualizar última mensagem se for mais recente
      if (new Date(msg.data_envio) > new Date(conversas[conversaKey].lastMessageTime)) {
        conversas[conversaKey].lastMessage = msg.conteudo;
        conversas[conversaKey].lastMessageTime = formatMessageTime(msg.data_envio);
      }
    });
    
    return Object.values(conversas);
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
    
    // Marcar mensagens como lidas
    if (conversation.unreadCount > 0) {
      markMessagesAsRead(conversation);
    }
  };

  const markMessagesAsRead = async (conversation) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Buscar mensagens não lidas desta conversa
      const { data: unreadMessages, error } = await supabase
        .from('mensagens')
        .select('id')
        .eq('destinatario_id', session.user.id)
        .eq('remetente_id', conversation.tutor.id)
        .eq('lida', false);

      if (error) throw error;

      // Marcar como lidas
      if (unreadMessages && unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(msg => msg.id);
        await supabase
          .from('mensagens')
          .update({ lida: true })
          .in('id', messageIds);
      }

      // Atualizar conversas
      fetchConversations();
    } catch (error) {
      console.error('Erro ao marcar mensagens como lidas:', error);
    }
  };

  // Funções de manipulação

  const handleSendMessageAsync = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const messageData = {
        remetente_id: session.user.id,
        destinatario_id: selectedConversation.tutor.id,
        paciente_id: selectedConversation.paciente?.id || null,
        conteudo: newMessage.trim(),
        tipo: 'texto',
        data_envio: new Date().toISOString(),
        lida: false
      };

      const { error } = await supabase
        .from('mensagens')
        .insert(messageData);

      if (error) throw error;

      // Limpar campo de mensagem
      setNewMessage('');
      setSelectedFile(null);
      
      // Recarregar conversas para atualizar a lista
      fetchConversations();
      
      // Atualizar mensagens da conversa selecionada
      if (selectedConversation) {
        const updatedConversation = { ...selectedConversation };
        updatedConversation.messages.push({
          id: Date.now(), // ID temporário
          sender: 'vet',
          text: messageData.conteudo,
          timestamp: formatMessageTime(messageData.data_envio),
          status: 'sent',
          attachments: selectedFile
            ? [
                {
                  type: selectedFile.type.startsWith("image/") ? "image" : "file",
                  url: URL.createObjectURL(selectedFile),
                  name: selectedFile.name,
                },
              ]
            : []
        });
        setSelectedConversation(updatedConversation);
      }
      
      scrollToBottom();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem: ' + error.message);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      conv.tutor?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.paciente?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-scroll para o final das mensagens quando uma conversa é selecionada
  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  // Simular recebimento de mensagens em tempo real
  useEffect(() => {
    // TODO: Connect to WebSocket listener for real-time messages.
    // socket.on('newMessage', (data) => {
    //   updateConversation(data);
    // });

    const interval = setInterval(() => {
      // Simular digitação
      if (Math.random() > 0.95) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { user } = useUser();

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
      <Container fluid className="py-4">
        <Row className="h-100">
          {/* Lista de Conversas - Coluna Esquerda */}
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Conversas</h5>
                  <Badge bg="primary" className="ms-2">
                    {conversations.reduce(
                      (total, conv) => total + conv.unreadCount,
                      0
                    )}
                  </Badge>
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
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div className="position-relative">
                          <Image
                            src={conversation.petImage}
                            alt={conversation.pet}
                            roundedCircle
                            width={40}
                            height={40}
                          />
                          <div
                            className={`position-absolute bottom-0 end-0 ${
                              conversation.isOnline
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              border: "2px solid white",
                            }}
                          ></div>
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1 fw-semibold">
                                {conversation.tutor?.nome || 'N/A'}
                              </h6>
                              <small className="text-muted">
                                {conversation.paciente?.nome || 'N/A'} ({conversation.paciente?.especie || 'N/A'})
                              </small>
                            </div>
                            <div className="text-end">
                              <small className="text-muted d-block">
                                {conversation.lastMessageTime}
                              </small>
                              {conversation.unreadCount > 0 && (
                                <Badge bg="primary" className="mt-1">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-muted mb-0 mt-1 small text-truncate">
                            {conversation.lastMessage}
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
                            {selectedConversation.tutor?.nome || 'N/A'}
                          </h6>
                          <small className="text-muted">
                            {selectedConversation.paciente?.nome || 'N/A'} •{" "}
                            {selectedConversation.isOnline ? (
                              <span className="text-success">Online</span>
                            ) : (
                              <span className="text-muted">Offline</span>
                            )}
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
                    className="p-0"
                    style={{ height: "400px", overflowY: "auto" }}
                  >
                    <div className="p-3">
                      {selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`d-flex mb-3 ${
                            message.sender === "vet"
                              ? "justify-content-end"
                              : "justify-content-start"
                          }`}
                        >
                          <div
                            className={`max-w-75 ${
                              message.sender === "vet"
                                ? "bg-primary text-white"
                                : "bg-light text-dark"
                            } rounded-3 p-3`}
                            style={{ maxWidth: "75%" }}
                          >
                            <p className="mb-2">{message.text}</p>

                            {/* Anexos */}
                            {message.attachments &&
                              message.attachments.length > 0 && (
                                <div className="mb-2">
                                  {message.attachments.map(
                                    (attachment, index) => (
                                      <div key={index} className="mb-2">
                                        {attachment.type === "image" ? (
                                          <Image
                                            src={attachment.url}
                                            alt={attachment.name}
                                            fluid
                                            className="rounded"
                                            style={{ maxHeight: "200px" }}
                                          />
                                        ) : (
                                          <div className="d-flex align-items-center gap-2 p-2 bg-white rounded">
                                            <FaFile className="text-primary" />
                                            <span className="small">
                                              {attachment.name}
                                            </span>
                                            <Button
                                              variant="link"
                                              size="sm"
                                              className="p-0"
                                            >
                                              <FaDownload />
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}

                            <div className="d-flex justify-content-between align-items-center">
                              <small className="opacity-75">
                                {message.timestamp}
                              </small>
                              {message.sender === "vet" && (
                                <span className="ms-2">
                                  {getMessageStatusIcon(message.status)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Indicador de Digitação */}
                      {isTyping && (
                        <div className="d-flex justify-content-start mb-3">
                          <div className="bg-light text-dark rounded-3 p-3">
                            <small className="text-muted">
                              {selectedConversation.tutor} está digitando...
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
