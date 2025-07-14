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
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Dados mockados de conversas
  const [conversations] = useState([
    {
      id: 1,
      tutor: "Maria Silva",
      pet: "Thor",
      petImage: "https://via.placeholder.com/40x40/ff6b6b/ffffff?text=T",
      lastMessage:
        "Olá Dr. André, o Thor está com uma ferida na pata. Posso enviar uma foto?",
      lastMessageTime: "14:30",
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: 1,
          sender: "tutor",
          text: "Olá Dr. André, o Thor está com uma ferida na pata. Posso enviar uma foto?",
          timestamp: "14:30",
          status: "read",
          attachments: [],
        },
        {
          id: 2,
          sender: "vet",
          text: "Olá Maria! Claro, pode enviar a foto. Vou analisar e te dar as orientações necessárias.",
          timestamp: "14:32",
          status: "read",
          attachments: [],
        },
        {
          id: 3,
          sender: "tutor",
          text: "Perfeito! Aqui está a foto da ferida.",
          timestamp: "14:35",
          status: "read",
          attachments: [
            {
              type: "image",
              url: "https://via.placeholder.com/200x150/ff6b6b/ffffff?text=Foto+Ferida",
              name: "ferida_thor.jpg",
            },
          ],
        },
        {
          id: 4,
          sender: "vet",
          text: "Analisando a foto... Parece ser uma ferida superficial. Vou te passar as instruções de cuidados.",
          timestamp: "14:37",
          status: "read",
          attachments: [],
        },
        {
          id: 5,
          sender: "tutor",
          text: "Obrigada! Estou aguardando as instruções.",
          timestamp: "14:38",
          status: "delivered",
          attachments: [],
        },
        {
          id: 6,
          sender: "tutor",
          text: "Dr. André, o Thor está se coçando muito na ferida. Isso é normal?",
          timestamp: "14:40",
          status: "sent",
          attachments: [],
        },
      ],
    },
    {
      id: 2,
      tutor: "João Santos",
      pet: "Luna",
      petImage: "https://via.placeholder.com/40x40/4ecdc4/ffffff?text=L",
      lastMessage:
        "A Luna tomou a vacina ontem e está bem. Obrigado pelo atendimento!",
      lastMessageTime: "13:45",
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: 1,
          sender: "tutor",
          text: "A Luna tomou a vacina ontem e está bem. Obrigado pelo atendimento!",
          timestamp: "13:45",
          status: "read",
          attachments: [],
        },
        {
          id: 2,
          sender: "vet",
          text: "Que ótimo! Fico feliz que a Luna esteja bem. Lembre-se de marcar o retorno para a próxima dose.",
          timestamp: "13:47",
          status: "read",
          attachments: [],
        },
      ],
    },
    {
      id: 3,
      tutor: "Carlos Oliveira",
      pet: "Max",
      petImage: "https://via.placeholder.com/40x40/45b7d1/ffffff?text=M",
      lastMessage:
        "Dr. André, o Max está comendo bem e brincando normalmente. A cirurgia foi um sucesso!",
      lastMessageTime: "12:20",
      unreadCount: 1,
      isOnline: true,
      messages: [
        {
          id: 1,
          sender: "tutor",
          text: "Dr. André, o Max está comendo bem e brincando normalmente. A cirurgia foi um sucesso!",
          timestamp: "12:20",
          status: "read",
          attachments: [],
        },
        {
          id: 2,
          sender: "tutor",
          text: "Posso agendar o retorno para retirar os pontos?",
          timestamp: "12:22",
          status: "sent",
          attachments: [],
        },
      ],
    },
    {
      id: 4,
      tutor: "Ana Costa",
      pet: "Nina",
      petImage: "https://via.placeholder.com/40x40/f9ca24/ffffff?text=N",
      lastMessage: "A Nina está com o apetite reduzido. Devo me preocupar?",
      lastMessageTime: "11:15",
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: 1,
          sender: "tutor",
          text: "A Nina está com o apetite reduzido. Devo me preocupar?",
          timestamp: "11:15",
          status: "read",
          attachments: [],
        },
        {
          id: 2,
          sender: "vet",
          text: "Olá Ana! Há quanto tempo a Nina está com apetite reduzido? Ela está com outros sintomas?",
          timestamp: "11:18",
          status: "read",
          attachments: [],
        },
        {
          id: 3,
          sender: "tutor",
          text: "Há 2 dias. Ela está mais quieta também.",
          timestamp: "11:20",
          status: "read",
          attachments: [],
        },
        {
          id: 4,
          sender: "vet",
          text: "Vamos agendar uma consulta para avaliar. Pode vir amanhã às 10h?",
          timestamp: "11:22",
          status: "read",
          attachments: [],
        },
      ],
    },
  ]);

  // Funções de manipulação
  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedFile) return;

    // TODO: Connect to backend API or WebSocket to send message data.
    // const response = await sendMessageAPI({
    //   conversationId: selectedConversation.id,
    //   messageText: newMessage,
    //   file: selectedFile
    // });

    const newMessageObj = {
      id: Date.now(),
      sender: "vet",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      attachments: selectedFile
        ? [
            {
              type: selectedFile.type.startsWith("image/") ? "image" : "file",
              url: URL.createObjectURL(selectedFile),
              name: selectedFile.name,
            },
          ]
        : [],
    };

    // Atualizar conversa localmente (mock)
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessageObj],
          lastMessage: newMessage,
          lastMessageTime: newMessageObj.timestamp,
        };
      }
      return conv;
    });

    setNewMessage("");
    setSelectedFile(null);
    scrollToBottom();
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
      conv.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.pet.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario="Dr. André Silva">
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
                                {conversation.tutor}
                              </h6>
                              <small className="text-muted">
                                {conversation.pet}
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
                        <Image
                          src={selectedConversation.petImage}
                          alt={selectedConversation.pet}
                          roundedCircle
                          width={40}
                          height={40}
                        />
                        <div>
                          <h6 className="mb-0 fw-semibold">
                            {selectedConversation.tutor}
                          </h6>
                          <small className="text-muted">
                            {selectedConversation.pet} •{" "}
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
