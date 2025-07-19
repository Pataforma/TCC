import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import {
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
} from "react-icons/fa";

const EtapaCredibilidade = ({ data, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    email: data?.email || "",
    website: data?.website || "",
    redesSociais: data?.redesSociais || {
      instagram: "",
      facebook: "",
      whatsapp: "",
    },
    horarioFuncionamento: data?.horarioFuncionamento || "",
    formasPagamento: data?.formasPagamento || [],
    certificacoes: data?.certificacoes || "",
    experiencia: data?.experiencia || "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const formasPagamentoOptions = [
    { value: "dinheiro", label: "Dinheiro" },
    { value: "pix", label: "PIX" },
    { value: "cartao_credito", label: "Cartão de Crédito" },
    { value: "cartao_debito", label: "Cartão de Débito" },
    { value: "transferencia", label: "Transferência Bancária" },
    { value: "boleto", label: "Boleto" },
  ];

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email deve ser válido";
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Website deve começar com http:// ou https://";
    }

    if (!formData.horarioFuncionamento.trim()) {
      newErrors.horarioFuncionamento = "Horário de funcionamento é obrigatório";
    }

    if (formData.formasPagamento.length === 0) {
      newErrors.formasPagamento = "Selecione pelo menos uma forma de pagamento";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

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

  const handleFormasPagamentoChange = (forma) => {
    setFormData((prev) => ({
      ...prev,
      formasPagamento: prev.formasPagamento.includes(forma)
        ? prev.formasPagamento.filter((f) => f !== forma)
        : [...prev.formasPagamento, forma],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <div className="mb-3">
            <FaPhone size={48} className="text-primary" />
          </div>
          <h4 className="fw-bold">Contato e Localização</h4>
          <p className="text-muted">
            Informações de contato e detalhes operacionais do seu negócio
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaEnvelope className="me-2" />
                  Email de Contato *
                </Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="contato@seudonegocio.com"
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaGlobe className="me-2" />
                  Website (opcional)
                </Form.Label>
                <Form.Control
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://www.seudonegocio.com"
                  isInvalid={!!errors.website}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.website}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaClock className="me-2" />
              Horário de Funcionamento *
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.horarioFuncionamento}
              onChange={(e) =>
                handleChange("horarioFuncionamento", e.target.value)
              }
              placeholder="Ex: Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h"
              isInvalid={!!errors.horarioFuncionamento}
            />
            <Form.Control.Feedback type="invalid">
              {errors.horarioFuncionamento}
            </Form.Control.Feedback>
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
                  placeholder="@seudonegocio"
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
                  placeholder="Nome do seu negócio"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaWhatsapp className="me-2" />
                  WhatsApp
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.redesSociais.whatsapp}
                  onChange={(e) =>
                    handleRedesSociaisChange("whatsapp", e.target.value)
                  }
                  placeholder="(11) 99999-9999"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Formas de Pagamento Aceitas *</Form.Label>
            <div className="row">
              {formasPagamentoOptions.map((forma) => (
                <Col md={4} key={forma.value} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={forma.value}
                    label={forma.label}
                    checked={formData.formasPagamento.includes(forma.value)}
                    onChange={() => handleFormasPagamentoChange(forma.value)}
                  />
                </Col>
              ))}
            </div>
            {errors.formasPagamento && (
              <div className="text-danger mt-1">{errors.formasPagamento}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Certificações e Registros</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.certificacoes}
              onChange={(e) => handleChange("certificacoes", e.target.value)}
              placeholder="Ex: Registro no CRMV, Certificação de Qualidade, Alvará de Funcionamento..."
            />
            <Form.Text className="text-muted">
              Liste as principais certificações e registros do seu negócio
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Experiência no Mercado</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.experiencia}
              onChange={(e) => handleChange("experiencia", e.target.value)}
              placeholder="Conte-nos sobre sua experiência no mercado, anos de atuação, especialidades..."
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={onBack}>
              Voltar
            </Button>
            <Button variant="primary" type="submit" disabled={!isValid}>
              Continuar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EtapaCredibilidade;
