import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaBullseye, FaHandshake, FaUsers, FaHeart } from "react-icons/fa";

const EtapaObjetivos = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    objetivos: data?.objetivos || [],
    publicoAlvo: data?.publicoAlvo || [],
    expectativas: data?.expectativas || "",
    disponibilidade: data?.disponibilidade || "",
    colaboracoes: data?.colaboracoes || [],
  });

  const objetivosOptions = [
    "Adoção de animais",
    "Resgate de animais abandonados",
    "Castração e esterilização",
    "Educação sobre posse responsável",
    "Acolhimento temporário",
    "Campanhas de conscientização",
    "Parcerias com veterinários",
    "Eventos beneficentes",
  ];

  const publicoOptions = [
    "Tutores em potencial",
    "Voluntários",
    "Doadores",
    "Veterinários",
    "Pet shops",
    "Escolas e instituições",
    "Empresas",
    "Público geral",
  ];

  const colaboracoesOptions = [
    "Eventos de adoção",
    "Campanhas de castração",
    "Mutirões de vacinação",
    "Feiras beneficentes",
    "Palestras educativas",
    "Resgates emergenciais",
    "Acolhimento temporário",
    "Divulgação de casos especiais",
  ];

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
    onNext(formData);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <div className="mb-3">
            <FaBullseye size={48} className="text-primary" />
          </div>
          <h4 className="fw-bold">Seus Objetivos na Pataforma</h4>
          <p className="text-muted">
            Defina seus objetivos e expectativas para aproveitar ao máximo nossa
            plataforma
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>
              <FaHeart className="me-2" />
              Principais Objetivos
            </Form.Label>
            <Row>
              {objetivosOptions.map((objetivo) => (
                <Col md={6} key={objetivo}>
                  <Form.Check
                    type="checkbox"
                    id={`objetivo-${objetivo}`}
                    label={objetivo}
                    checked={formData.objetivos.includes(objetivo)}
                    onChange={() => handleMultiSelect("objetivos", objetivo)}
                    className="mb-2"
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <FaUsers className="me-2" />
              Público-Alvo
            </Form.Label>
            <Row>
              {publicoOptions.map((publico) => (
                <Col md={6} key={publico}>
                  <Form.Check
                    type="checkbox"
                    id={`publico-${publico}`}
                    label={publico}
                    checked={formData.publicoAlvo.includes(publico)}
                    onChange={() => handleMultiSelect("publicoAlvo", publico)}
                    className="mb-2"
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Expectativas da Plataforma</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.expectativas}
              onChange={(e) => handleChange("expectativas", e.target.value)}
              placeholder="O que você espera conseguir usando nossa plataforma?"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Disponibilidade para Atividades</Form.Label>
            <Form.Select
              value={formData.disponibilidade}
              onChange={(e) => handleChange("disponibilidade", e.target.value)}
            >
              <option value="">Selecione sua disponibilidade</option>
              <option value="diaria">Diária (todos os dias)</option>
              <option value="semanal">Semanal (fins de semana)</option>
              <option value="mensal">Mensal (eventos pontuais)</option>
              <option value="emergencial">
                Emergencial (quando necessário)
              </option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <FaHandshake className="me-2" />
              Tipos de Colaboração de Interesse
            </Form.Label>
            <Row>
              {colaboracoesOptions.map((colaboracao) => (
                <Col md={6} key={colaboracao}>
                  <Form.Check
                    type="checkbox"
                    id={`colaboracao-${colaboracao}`}
                    label={colaboracao}
                    checked={formData.colaboracoes.includes(colaboracao)}
                    onChange={() =>
                      handleMultiSelect("colaboracoes", colaboracao)
                    }
                    className="mb-2"
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={onBack}>
              Voltar
            </Button>
            <Button variant="primary" type="submit">
              Finalizar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EtapaObjetivos;
