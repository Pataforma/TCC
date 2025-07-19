import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaStore, FaMapMarkerAlt, FaPhone, FaShieldAlt } from "react-icons/fa";
import styles from "./EtapaIdentificacao.module.css";

export default function EtapaIdentificacao({ data, onUpdate, onNext, onBack }) {
  const [formData, setFormData] = useState({
    nomeNegocio: data?.nomeNegocio || "",
    categoriaServico: data?.categoriaServico || "",
    endereco: data?.endereco || "",
    telefone: data?.telefone || "",
    cnpj: data?.cnpj || "",
    descricao: data?.descricao || "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const categoriasServico = [
    { value: "", label: "Selecione uma categoria" },
    { value: "pet_shop", label: "Pet Shop" },
    { value: "banho_tosa", label: "Banho e Tosa" },
    { value: "hotel_creche", label: "Hotel e Creche" },
    { value: "adestramento", label: "Adestramento" },
    { value: "pet_sitter", label: "Pet Sitter" },
    { value: "fotografia_pet", label: "Fotografia Pet" },
    { value: "outro", label: "Outro" },
  ];

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeNegocio.trim()) {
      newErrors.nomeNegocio = "Nome do negócio é obrigatório";
    } else if (formData.nomeNegocio.trim().length < 3) {
      newErrors.nomeNegocio = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.categoriaServico) {
      newErrors.categoriaServico = "Categoria do serviço é obrigatória";
    }

    if (!formData.endereco.trim()) {
      newErrors.endereco = "Endereço é obrigatório";
    } else if (formData.endereco.trim().length < 10) {
      newErrors.endereco = "Endereço deve ter pelo menos 10 caracteres";
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = "Telefone/WhatsApp é obrigatório";
    } else if (formData.telefone.replace(/\D/g, "").length < 10) {
      newErrors.telefone = "Telefone deve ter pelo menos 10 dígitos";
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else if (formData.cnpj.replace(/\D/g, "").length !== 14) {
      newErrors.cnpj = "CNPJ deve ter 14 dígitos";
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição do negócio é obrigatória";
    } else if (formData.descricao.trim().length < 20) {
      newErrors.descricao = "Descrição deve ter pelo menos 20 caracteres";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTelefoneChange = (value) => {
    // Máscara para telefone: (XX) XXXXX-XXXX
    const telefone = value.replace(/\D/g, "");
    let maskedTelefone = "";

    if (telefone.length <= 2) {
      maskedTelefone = `(${telefone}`;
    } else if (telefone.length <= 7) {
      maskedTelefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    } else {
      maskedTelefone = `(${telefone.slice(0, 2)}) ${telefone.slice(
        2,
        7
      )}-${telefone.slice(7, 11)}`;
    }

    handleInputChange("telefone", maskedTelefone);
  };

  const handleCNPJChange = (value) => {
    // Máscara para CNPJ: XX.XXX.XXX/XXXX-XX
    const cnpj = value.replace(/\D/g, "");
    let maskedCNPJ = "";

    if (cnpj.length <= 2) {
      maskedCNPJ = cnpj;
    } else if (cnpj.length <= 5) {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    } else if (cnpj.length <= 8) {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    } else if (cnpj.length <= 12) {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(
        5,
        8
      )}/${cnpj.slice(8)}`;
    } else {
      maskedCNPJ = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(
        5,
        8
      )}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
    }

    handleInputChange("cnpj", maskedCNPJ);
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
            <FaStore size={48} className="text-primary" />
          </div>
          <h4 className="fw-bold">Identificação do Negócio</h4>
          <p className="text-muted">
            Vamos começar com as informações básicas do seu negócio
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaStore className="me-2" />
                  Nome do Negócio *
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.nomeNegocio}
                  onChange={(e) =>
                    handleInputChange("nomeNegocio", e.target.value)
                  }
                  placeholder="Ex: Pet Shop Patinhas Felizes"
                  isInvalid={!!errors.nomeNegocio}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nomeNegocio}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaShieldAlt className="me-2" />
                  Categoria Principal do Serviço *
                </Form.Label>
                <Form.Select
                  value={formData.categoriaServico}
                  onChange={(e) =>
                    handleInputChange("categoriaServico", e.target.value)
                  }
                  isInvalid={!!errors.categoriaServico}
                >
                  {categoriasServico.map((categoria) => (
                    <option key={categoria.value} value={categoria.value}>
                      {categoria.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.categoriaServico}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              <FaMapMarkerAlt className="me-2" />
              Endereço Principal *
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.endereco}
              onChange={(e) => handleInputChange("endereco", e.target.value)}
              placeholder="Rua, número, bairro, cidade - estado"
              isInvalid={!!errors.endereco}
            />
            <Form.Control.Feedback type="invalid">
              {errors.endereco}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaPhone className="me-2" />
                  Telefone / WhatsApp *
                </Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleTelefoneChange(e.target.value)}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  isInvalid={!!errors.telefone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.telefone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaShieldAlt className="me-2" />
                  CNPJ *
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  isInvalid={!!errors.cnpj}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.cnpj}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Descrição do Negócio *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.descricao}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              placeholder="Conte-nos sobre seu negócio, os serviços que oferece, sua experiência no mercado e o que torna seu estabelecimento especial..."
              maxLength={500}
              isInvalid={!!errors.descricao}
            />
            <div className="text-muted mt-1">
              {formData.descricao.length}/500 caracteres
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.descricao}
            </Form.Control.Feedback>
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
}
