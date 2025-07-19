import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaDollarSign, FaCalendarAlt, FaChartLine } from "react-icons/fa";

const EtapaOrcamentoDuracao = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    orcamentoDiario: data?.orcamentoDiario || 0,
    orcamentoTotal: data?.orcamentoTotal || 0,
    dataInicio: data?.dataInicio || "",
    dataFim: data?.dataFim || "",
    duracao: data?.duracao || "",
    estrategia: data?.estrategia || "padrao",
  });

  const estrategias = [
    {
      id: "padrao",
      nome: "Padrão",
      descricao: "Distribuição equilibrada do orçamento",
      icon: "⚖️",
    },
    {
      id: "agressiva",
      nome: "Agressiva",
      descricao: "Maior investimento nos primeiros dias",
      icon: "🚀",
    },
    {
      id: "conservadora",
      nome: "Conservadora",
      descricao: "Investimento gradual ao longo do tempo",
      icon: "🐌",
    },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOrcamentoDiarioChange = (value) => {
    const orcamentoDiario = parseFloat(value) || 0;
    const duracao = formData.duracao ? parseInt(formData.duracao) : 0;
    const orcamentoTotal = orcamentoDiario * duracao;

    setFormData((prev) => ({
      ...prev,
      orcamentoDiario,
      orcamentoTotal,
    }));
  };

  const handleDuracaoChange = (value) => {
    const duracao = parseInt(value) || 0;
    const orcamentoTotal = formData.orcamentoDiario * duracao;

    setFormData((prev) => ({
      ...prev,
      duracao,
      orcamentoTotal,
    }));
  };

  const handleDataInicioChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      dataInicio: value,
    }));

    // Calcular data fim automaticamente se duração estiver definida
    if (value && formData.duracao) {
      const dataInicio = new Date(value);
      const dataFim = new Date(dataInicio);
      dataFim.setDate(dataFim.getDate() + parseInt(formData.duracao) - 1);

      setFormData((prev) => ({
        ...prev,
        dataFim: dataFim.toISOString().split("T")[0],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <div className="mb-3">
            <FaDollarSign size={48} className="text-primary" />
          </div>
          <h4 className="fw-bold">Orçamento e Duração</h4>
          <p className="text-muted">
            Defina quanto você quer investir e por quanto tempo sua campanha
            deve rodar
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          {/* Orçamento */}
          <div className="mb-4">
            <h6 className="mb-3">
              <FaDollarSign className="me-2 text-primary" />
              Orçamento
            </h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Orçamento Diário (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.orcamentoDiario}
                    onChange={(e) =>
                      handleOrcamentoDiarioChange(e.target.value)
                    }
                    placeholder="0,00"
                    required
                  />
                  <Form.Text className="text-muted">
                    Valor máximo que você quer gastar por dia
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Orçamento Total (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.orcamentoTotal.toFixed(2)}
                    readOnly
                    className="bg-light"
                  />
                  <Form.Text className="text-muted">
                    Calculado automaticamente
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Duração */}
          <div className="mb-4">
            <h6 className="mb-3">
              <FaCalendarAlt className="me-2 text-primary" />
              Duração da Campanha
            </h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duração (dias)</Form.Label>
                  <Form.Select
                    value={formData.duracao}
                    onChange={(e) => handleDuracaoChange(e.target.value)}
                    required
                  >
                    <option value="">Selecione a duração</option>
                    <option value="7">7 dias (1 semana)</option>
                    <option value="14">14 dias (2 semanas)</option>
                    <option value="30">30 dias (1 mês)</option>
                    <option value="60">60 dias (2 meses)</option>
                    <option value="90">90 dias (3 meses)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Início</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => handleDataInicioChange(e.target.value)}
                    min={getMinDate()}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Fim</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => handleChange("dataFim", e.target.value)}
                    min={formData.dataInicio}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dias Restantes</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      formData.dataInicio && formData.dataFim
                        ? Math.ceil(
                            (new Date(formData.dataFim) -
                              new Date(formData.dataInicio)) /
                              (1000 * 60 * 60 * 24)
                          ) + 1
                        : ""
                    }
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Estratégia de Distribuição */}
          <div className="mb-4">
            <h6 className="mb-3">
              <FaChartLine className="me-2 text-primary" />
              Estratégia de Distribuição
            </h6>
            <Row>
              {estrategias.map((estrategia) => (
                <Col md={4} key={estrategia.id}>
                  <div
                    className={`card h-100 cursor-pointer ${
                      formData.estrategia === estrategia.id
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-light"
                    }`}
                    onClick={() => handleChange("estrategia", estrategia.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body text-center">
                      <div className="mb-2" style={{ fontSize: "2rem" }}>
                        {estrategia.icon}
                      </div>
                      <h6 className="card-title">{estrategia.nome}</h6>
                      <p className="card-text small text-muted">
                        {estrategia.descricao}
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Resumo */}
          {formData.orcamentoDiario > 0 && formData.duracao && (
            <div className="mb-4 p-3 bg-light rounded">
              <h6 className="mb-2">Resumo da Campanha</h6>
              <Row>
                <Col md={3}>
                  <small className="text-muted">Orçamento Diário</small>
                  <div className="fw-bold">
                    R$ {formData.orcamentoDiario.toFixed(2)}
                  </div>
                </Col>
                <Col md={3}>
                  <small className="text-muted">Duração</small>
                  <div className="fw-bold">{formData.duracao} dias</div>
                </Col>
                <Col md={3}>
                  <small className="text-muted">Orçamento Total</small>
                  <div className="fw-bold">
                    R$ {formData.orcamentoTotal.toFixed(2)}
                  </div>
                </Col>
                <Col md={3}>
                  <small className="text-muted">Estratégia</small>
                  <div className="fw-bold">
                    {
                      estrategias.find((e) => e.id === formData.estrategia)
                        ?.nome
                    }
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={onBack}>
              Voltar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={
                !formData.orcamentoDiario ||
                !formData.duracao ||
                !formData.dataInicio ||
                !formData.dataFim
              }
            >
              Continuar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EtapaOrcamentoDuracao;
