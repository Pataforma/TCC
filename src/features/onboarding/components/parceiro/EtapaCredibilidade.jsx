import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaShieldAlt, FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";

const EtapaCredibilidade = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    telefone: data?.telefone || "",
    email: data?.email || "",
    website: data?.website || "",
    redesSociais: data?.redesSociais || {
      instagram: "",
      facebook: "",
      linkedin: "",
    },
    certificacoes: data?.certificacoes || [],
    experiencia: data?.experiencia || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRedesSociaisChange = (rede, value) => {
    setFormData((prev) => ({
      ...prev,
      redesSociais: {
        ...prev.redesSociais,
        [rede]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <div className="mb-3">
            <FaShieldAlt size={48} className="text-primary" />
          </div>
          <h4 className="fw-bold">Credibilidade e Contato</h4>
          <p className="text-muted">
            Forneça informações de contato e credenciais para estabelecer
            confiança
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaPhone className="me-2" />
                  Telefone
                </Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaEnvelope className="me-2" />
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="contato@organizacao.org"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaGlobe className="me-2" />
              Website (opcional)
            </Form.Label>
            <Form.Control
              type="url"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://www.organizacao.org"
            />
          </Form.Group>

          <h6 className="mb-3">Redes Sociais</h6>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Instagram</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.redesSociais.instagram}
                  onChange={(e) =>
                    handleRedesSociaisChange("instagram", e.target.value)
                  }
                  placeholder="@organizacao"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Facebook</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.redesSociais.facebook}
                  onChange={(e) =>
                    handleRedesSociaisChange("facebook", e.target.value)
                  }
                  placeholder="Organização ONG"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>LinkedIn</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.redesSociais.linkedin}
                  onChange={(e) =>
                    handleRedesSociaisChange("linkedin", e.target.value)
                  }
                  placeholder="organizacao-ong"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Certificações e Registros</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.certificacoes.join(", ")}
              onChange={(e) =>
                handleChange(
                  "certificacoes",
                  e.target.value.split(", ").filter(Boolean)
                )
              }
              placeholder="Ex: OSCIP, Utilidade Pública Municipal, Registro no CMDCA..."
            />
            <Form.Text className="text-muted">
              Liste as principais certificações e registros da sua organização
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Anos de Experiência</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.experiencia}
              onChange={(e) => handleChange("experiencia", e.target.value)}
              placeholder="Descreva brevemente a experiência da organização no trabalho com animais..."
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={onBack}>
              Voltar
            </Button>
            <Button variant="primary" type="submit">
              Continuar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EtapaCredibilidade;
