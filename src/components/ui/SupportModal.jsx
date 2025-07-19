import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import {
  FaQuestionCircle,
  FaEnvelope,
  FaPhone,
  FaComments,
} from "react-icons/fa";

const SupportModal = ({ show, onHide }) => {
  const [supportType, setSupportType] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock: enviar solicitação de suporte
    console.log("Solicitação de suporte:", {
      type: supportType,
      subject,
      message,
      email,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onHide();
      setSubject("");
      setMessage("");
      setEmail("");
      setSupportType("general");
    }, 2000);
  };

  const supportOptions = [
    {
      value: "general",
      label: "Dúvida Geral",
      description: "Perguntas sobre funcionalidades da plataforma",
      icon: FaQuestionCircle,
    },
    {
      value: "technical",
      label: "Problema Técnico",
      description: "Erros, bugs ou problemas de funcionamento",
      icon: FaComments,
    },
    {
      value: "billing",
      label: "Faturamento",
      description: "Questões relacionadas a pagamentos e planos",
      icon: FaEnvelope,
    },
    {
      value: "emergency",
      label: "Emergência",
      description: "Problemas urgentes que precisam de atenção imediata",
      icon: FaPhone,
    },
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FaQuestionCircle className="me-2" />
          Central de Suporte
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {submitted ? (
          <Alert variant="success" className="text-center">
            <h5>Solicitação Enviada!</h5>
            <p>Nossa equipe entrará em contato em breve.</p>
          </Alert>
        ) : (
          <>
            <p className="text-muted mb-4">
              Como podemos ajudá-lo? Escolha o tipo de suporte e descreva seu
              problema.
            </p>

            <Form onSubmit={handleSubmit}>
              {/* Tipo de Suporte */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Tipo de Suporte</Form.Label>
                <div className="row g-3">
                  {supportOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.value} className="col-md-6">
                        <div
                          className={`card h-100 cursor-pointer ${
                            supportType === option.value
                              ? "border-primary bg-primary bg-opacity-10"
                              : "border-light"
                          }`}
                          onClick={() => setSupportType(option.value)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="card-body text-center">
                            <Icon
                              size={24}
                              className={`mb-2 ${
                                supportType === option.value
                                  ? "text-primary"
                                  : "text-muted"
                              }`}
                            />
                            <h6 className="card-title mb-1">{option.label}</h6>
                            <small className="text-muted">
                              {option.description}
                            </small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Seu Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </Form.Group>

              {/* Assunto */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Assunto</Form.Label>
                <Form.Control
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Descreva brevemente o problema"
                  required
                />
              </Form.Group>

              {/* Mensagem */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Descrição Detalhada</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva detalhadamente o problema ou dúvida..."
                  required
                />
              </Form.Group>

              {/* Informações de Contato */}
              <Alert variant="info" className="mb-4">
                <h6 className="mb-2">
                  <FaPhone className="me-2" />
                  Contato Rápido
                </h6>
                <p className="mb-1">
                  <strong>WhatsApp:</strong> (11) 99999-9999
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> suporte@pataforma.com
                </p>
                <p className="mb-0">
                  <strong>Horário:</strong> Segunda a Sexta, 8h às 18h
                </p>
              </Alert>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={onHide}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Enviar Solicitação
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SupportModal;
