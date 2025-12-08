import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Table,
  Badge,
  Alert,
  Switch,
  FormCheck,
} from "react-bootstrap";
import { api } from "../../../utils/api";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

const ConfiguracaoDisponibilidade = () => {
  const [agendaPublica, setAgendaPublica] = useState(false);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [novaDisponibilidade, setNovaDisponibilidade] = useState({
    dia_semana: 1,
    horario_inicio: "08:00",
    horario_fim: "18:00",
  });

  const diasSemana = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Segunda-feira" },
    { value: 2, label: "Terça-feira" },
    { value: 3, label: "Quarta-feira" },
    { value: 4, label: "Quinta-feira" },
    { value: 5, label: "Sexta-feira" },
    { value: 6, label: "Sábado" },
  ];

  useEffect(() => {
    carregarDisponibilidade();
    carregarConfiguracaoAgenda();
  }, []);

  const carregarDisponibilidade = async () => {
    try {
      setLoading(true);
      const data = await api.get("/disponibilidade/minha");
      setDisponibilidades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar disponibilidade:", error);
      setDisponibilidades([]);
    } finally {
      setLoading(false);
    }
  };

  const carregarConfiguracaoAgenda = async () => {
    try {
      const vet = await api.get("/veterinarios/me");
      setAgendaPublica(vet?.agenda_publica === 1);
    } catch (error) {
      console.error("Erro ao carregar configuração:", error);
    }
  };

  const handleToggleAgendaPublica = async (checked) => {
    try {
      setSaving(true);
      await api.put("/disponibilidade/publica/toggle", {
        agenda_publica: checked,
      });
      setAgendaPublica(checked);
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
      alert("Erro ao atualizar configuração: " + (error.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const handleAdicionarDisponibilidade = async () => {
    try {
      setSaving(true);
      await api.post("/disponibilidade/minha", {
        disponibilidades: [novaDisponibilidade],
      });
      setNovaDisponibilidade({
        dia_semana: 1,
        horario_inicio: "08:00",
        horario_fim: "18:00",
      });
      await carregarDisponibilidade();
    } catch (error) {
      console.error("Erro ao adicionar disponibilidade:", error);
      alert("Erro ao adicionar disponibilidade: " + (error.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const handleExcluirDisponibilidade = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta disponibilidade?")) return;

    try {
      await api.delete(`/disponibilidade/${id}`);
      await carregarDisponibilidade();
    } catch (error) {
      console.error("Erro ao excluir disponibilidade:", error);
      alert("Erro ao excluir disponibilidade: " + (error.message || "Erro desconhecido"));
    }
  };

  const getDiaSemanaLabel = (dia) => {
    return diasSemana.find((d) => d.value === dia)?.label || "N/A";
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FaCalendarAlt className="me-2" />
            Configuração de Agenda Pública
          </h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            <strong>Agenda Pública:</strong> Quando ativada, os tutores podem ver
            sua disponibilidade e solicitar agendamentos diretamente.
          </Alert>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">Tornar agenda pública</h6>
              <p className="text-muted small mb-0">
                Permite que tutores vejam seus horários disponíveis e solicitem
                agendamentos
              </p>
            </div>
            <FormCheck
              type="switch"
              checked={agendaPublica}
              onChange={(e) => handleToggleAgendaPublica(e.target.checked)}
              disabled={saving}
            />
          </div>
        </Card.Body>
      </Card>

      {agendaPublica && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">
              <FaClock className="me-2" />
              Horários de Disponibilidade
            </h5>
          </Card.Header>
          <Card.Body>
            <Row className="mb-4">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Dia da Semana</Form.Label>
                  <Form.Select
                    value={novaDisponibilidade.dia_semana}
                    onChange={(e) =>
                      setNovaDisponibilidade({
                        ...novaDisponibilidade,
                        dia_semana: parseInt(e.target.value),
                      })
                    }
                  >
                    {diasSemana.map((dia) => (
                      <option key={dia.value} value={dia.value}>
                        {dia.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Horário Início</Form.Label>
                  <Form.Control
                    type="time"
                    value={novaDisponibilidade.horario_inicio}
                    onChange={(e) =>
                      setNovaDisponibilidade({
                        ...novaDisponibilidade,
                        horario_inicio: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Horário Fim</Form.Label>
                  <Form.Control
                    type="time"
                    value={novaDisponibilidade.horario_fim}
                    onChange={(e) =>
                      setNovaDisponibilidade({
                        ...novaDisponibilidade,
                        horario_fim: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button
                  variant="primary"
                  onClick={handleAdicionarDisponibilidade}
                  disabled={saving}
                  className="w-100"
                >
                  <FaPlus className="me-2" />
                  Adicionar
                </Button>
              </Col>
            </Row>

            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : disponibilidades.length > 0 ? (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Dia da Semana</th>
                    <th>Horário Início</th>
                    <th>Horário Fim</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {disponibilidades.map((disp) => (
                    <tr key={disp.id}>
                      <td>{getDiaSemanaLabel(disp.dia_semana)}</td>
                      <td>{disp.horario_inicio}</td>
                      <td>{disp.horario_fim}</td>
                      <td>
                        <Badge bg={disp.ativo === 1 ? "success" : "secondary"}>
                          {disp.ativo === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleExcluirDisponibilidade(disp.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Alert variant="info">
                Nenhuma disponibilidade configurada. Adicione seus horários de
                atendimento acima.
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ConfiguracaoDisponibilidade;

