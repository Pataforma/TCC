import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import {
  FaCog,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

const EtapaObjetivos = ({ data, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    servicosOferecidos: data?.servicosOferecidos || [],
    especialidades: data?.especialidades || [],
    raioAtendimento: data?.raioAtendimento || "",
    disponibilidade: data?.disponibilidade || "",
    precoMedio: data?.precoMedio || "",
    expectativas: data?.expectativas || "",
    aceitaEmergencias: data?.aceitaEmergencias || false,
    atendeFinaisSemana: data?.atendeFinaisSemana || false,
    atendeFeriados: data?.atendeFeriados || false,
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const servicosOptions = [
    "Banho e Tosa",
    "Consulta Veterinária",
    "Vacinação",
    "Castração",
    "Exames Laboratoriais",
    "Hospedagem",
    "Adestramento",
    "Pet Sitter",
    "Fotografia Pet",
    "Transporte Pet",
    "Fisioterapia",
    "Acupuntura",
    "Outros",
  ];

  const especialidadesOptions = [
    "Cães",
    "Gatos",
    "Aves",
    "Roedores",
    "Répteis",
    "Animais Exóticos",
    "Filhotes",
    "Idosos",
    "Animais com Necessidades Especiais",
  ];

  const raioOptions = [
    { value: "", label: "Selecione o raio de atendimento" },
    { value: "5km", label: "Até 5 km" },
    { value: "10km", label: "Até 10 km" },
    { value: "15km", label: "Até 15 km" },
    { value: "20km", label: "Até 20 km" },
    { value: "30km", label: "Até 30 km" },
    { value: "50km", label: "Até 50 km" },
    { value: "sem_limite", label: "Sem limite" },
  ];

  const disponibilidadeOptions = [
    { value: "", label: "Selecione sua disponibilidade" },
    { value: "diaria", label: "Diária (todos os dias)" },
    { value: "semanal", label: "Semanal (segunda a sexta)" },
    { value: "finais_semana", label: "Fins de semana" },
    { value: "sob_agendamento", label: "Sob agendamento" },
    { value: "emergencial", label: "Emergencial" },
  ];

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (formData.servicosOferecidos.length === 0) {
      newErrors.servicosOferecidos = "Selecione pelo menos um serviço";
    }

    if (formData.especialidades.length === 0) {
      newErrors.especialidades = "Selecione pelo menos uma especialidade";
    }

    if (!formData.raioAtendimento) {
      newErrors.raioAtendimento = "Raio de atendimento é obrigatório";
    }

    if (!formData.disponibilidade) {
      newErrors.disponibilidade = "Disponibilidade é obrigatória";
    }

    if (!formData.precoMedio.trim()) {
      newErrors.precoMedio = "Faixa de preço é obrigatória";
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

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
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
            <FaCog size={48} className="text-primary" />
          </div>
          <h4 className="fw-bold">Configuração do Perfil</h4>
          <p className="text-muted">
            Configure os detalhes dos seus serviços para conectar com os
            clientes ideais
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>
              <FaStar className="me-2" />
              Serviços Oferecidos *
            </Form.Label>
            <Row>
              {servicosOptions.map((servico) => (
                <Col md={4} key={servico}>
                  <Form.Check
                    type="checkbox"
                    id={`servico-${servico}`}
                    label={servico}
                    checked={formData.servicosOferecidos.includes(servico)}
                    onChange={() =>
                      handleMultiSelect("servicosOferecidos", servico)
                    }
                    className="mb-2"
                  />
                </Col>
              ))}
            </Row>
            {errors.servicosOferecidos && (
              <div className="text-danger mt-1">
                {errors.servicosOferecidos}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <FaCheckCircle className="me-2" />
              Especialidades *
            </Form.Label>
            <Row>
              {especialidadesOptions.map((especialidade) => (
                <Col md={4} key={especialidade}>
                  <Form.Check
                    type="checkbox"
                    id={`especialidade-${especialidade}`}
                    label={especialidade}
                    checked={formData.especialidades.includes(especialidade)}
                    onChange={() =>
                      handleMultiSelect("especialidades", especialidade)
                    }
                    className="mb-2"
                  />
                </Col>
              ))}
            </Row>
            {errors.especialidades && (
              <div className="text-danger mt-1">{errors.especialidades}</div>
            )}
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaMapMarkerAlt className="me-2" />
                  Raio de Atendimento *
                </Form.Label>
                <Form.Select
                  value={formData.raioAtendimento}
                  onChange={(e) =>
                    handleChange("raioAtendimento", e.target.value)
                  }
                  isInvalid={!!errors.raioAtendimento}
                >
                  {raioOptions.map((raio) => (
                    <option key={raio.value} value={raio.value}>
                      {raio.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.raioAtendimento}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendarAlt className="me-2" />
                  Disponibilidade *
                </Form.Label>
                <Form.Select
                  value={formData.disponibilidade}
                  onChange={(e) =>
                    handleChange("disponibilidade", e.target.value)
                  }
                  isInvalid={!!errors.disponibilidade}
                >
                  {disponibilidadeOptions.map((disp) => (
                    <option key={disp.value} value={disp.value}>
                      {disp.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.disponibilidade}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Faixa de Preço dos Serviços *</Form.Label>
            <Form.Control
              type="text"
              value={formData.precoMedio}
              onChange={(e) => handleChange("precoMedio", e.target.value)}
              placeholder="Ex: R$ 50 - R$ 200, ou 'A partir de R$ 30'"
              isInvalid={!!errors.precoMedio}
            />
            <Form.Control.Feedback type="invalid">
              {errors.precoMedio}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Opções de Atendimento</Form.Label>
            <Row>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  id="aceitaEmergencias"
                  label="Aceita Emergências"
                  checked={formData.aceitaEmergencias}
                  onChange={(e) =>
                    handleChange("aceitaEmergencias", e.target.checked)
                  }
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  id="atendeFinaisSemana"
                  label="Atende Fins de Semana"
                  checked={formData.atendeFinaisSemana}
                  onChange={(e) =>
                    handleChange("atendeFinaisSemana", e.target.checked)
                  }
                />
              </Col>
              <Col md={4}>
                <Form.Check
                  type="checkbox"
                  id="atendeFeriados"
                  label="Atende Feriados"
                  checked={formData.atendeFeriados}
                  onChange={(e) =>
                    handleChange("atendeFeriados", e.target.checked)
                  }
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Expectativas da Plataforma</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.expectativas}
              onChange={(e) => handleChange("expectativas", e.target.value)}
              placeholder="O que você espera conseguir usando nossa plataforma? (mais clientes, visibilidade, etc.)"
            />
          </Form.Group>

          <Alert variant="info" className="mb-4">
            <FaCheckCircle className="me-2" />
            <strong>Pronto!</strong> Seu perfil será configurado e você poderá
            começar a receber solicitações de clientes.
          </Alert>

          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={onBack}>
              Voltar
            </Button>
            <Button variant="primary" type="submit" disabled={!isValid}>
              Finalizar Configuração
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EtapaObjetivos;
