import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Table,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { api } from "../../../utils/api";
import {
  FaCalendarAlt,
  FaUser,
  FaPaw,
  FaCheck,
  FaTimes,
  FaClock,
  FaBell,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";

const SolicitacoesAgendamentoPage = () => {
  const { user } = useUser();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const [resposta, setResposta] = useState("");
  const [statusResposta, setStatusResposta] = useState("aceita");
  const [saving, setSaving] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todas");

  useEffect(() => {
    carregarSolicitacoes();
  }, [filtroStatus]);

  const carregarSolicitacoes = async () => {
    try {
      setLoading(true);
      const url = filtroStatus !== "todas" 
        ? `/solicitacoes/veterinario?status=${filtroStatus}`
        : "/solicitacoes/veterinario";
      const data = await api.get(url);
      setSolicitacoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
      setSolicitacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResponder = (solicitacao) => {
    setSelectedSolicitacao(solicitacao);
    setResposta("");
    setStatusResposta("aceita");
    setShowModal(true);
  };

  const handleSalvarResposta = async () => {
    if (!selectedSolicitacao) return;

    try {
      setSaving(true);
      await api.put(`/solicitacoes/${selectedSolicitacao.id}/responder`, {
        status: statusResposta,
        resposta_veterinario: resposta || null,
      });

      setShowModal(false);
      await carregarSolicitacoes();
    } catch (error) {
      console.error("Erro ao responder solicitação:", error);
      alert("Erro ao responder solicitação: " + (error.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5); // HH:MM
  };

  const getStatusBadge = (status) => {
    const variants = {
      pendente: "warning",
      aceita: "success",
      recusada: "danger",
      cancelada: "secondary",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Solicitações de Agendamento</h2>
            <p className="text-muted mb-0">
              Gerencie as solicitações de agendamento dos tutores
            </p>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex gap-2">
              <Button
                variant={filtroStatus === "todas" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setFiltroStatus("todas")}
              >
                Todas
              </Button>
              <Button
                variant={filtroStatus === "pendente" ? "warning" : "outline-warning"}
                size="sm"
                onClick={() => setFiltroStatus("pendente")}
              >
                Pendentes
              </Button>
              <Button
                variant={filtroStatus === "aceita" ? "success" : "outline-success"}
                size="sm"
                onClick={() => setFiltroStatus("aceita")}
              >
                Aceitas
              </Button>
              <Button
                variant={filtroStatus === "recusada" ? "danger" : "outline-danger"}
                size="sm"
                onClick={() => setFiltroStatus("recusada")}
              >
                Recusadas
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Tabela de Solicitações */}
        <Card>
          <Card.Body>
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : solicitacoes.length > 0 ? (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Data/Horário</th>
                    <th>Tutor</th>
                    <th>Paciente</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoes.map((solicitacao) => (
                    <tr key={solicitacao.id}>
                      <td>
                        <div>
                          <FaCalendarAlt className="me-2 text-muted" />
                          {formatDate(solicitacao.data_solicitada)}
                        </div>
                        <small className="text-muted">
                          <FaClock className="me-1" />
                          {formatTime(solicitacao.horario_solicitado)}
                        </small>
                      </td>
                      <td>
                        <div>
                          <FaUser className="me-2 text-muted" />
                          {solicitacao.tutor_nome || "N/A"}
                        </div>
                        <small className="text-muted">
                          {solicitacao.tutor_telefone || solicitacao.tutor_email || ""}
                        </small>
                      </td>
                      <td>
                        {solicitacao.paciente_nome ? (
                          <>
                            <FaPaw className="me-2 text-muted" />
                            {solicitacao.paciente_nome}
                            {solicitacao.paciente_especie && (
                              <small className="text-muted d-block">
                                {solicitacao.paciente_especie}
                              </small>
                            )}
                          </>
                        ) : (
                          <span className="text-muted">Não informado</span>
                        )}
                      </td>
                      <td>{solicitacao.tipo_consulta || "Consulta"}</td>
                      <td>{getStatusBadge(solicitacao.status)}</td>
                      <td>
                        {solicitacao.status === "pendente" ? (
                          <div className="d-flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => {
                                setStatusResposta("aceita");
                                handleResponder(solicitacao);
                              }}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setStatusResposta("recusada");
                                handleResponder(solicitacao);
                              }}
                            >
                              <FaTimes />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {solicitacao.resposta_veterinario && (
                              <small className="text-muted d-block">
                                {solicitacao.resposta_veterinario}
                              </small>
                            )}
                            <small className="text-muted">
                              {solicitacao.data_resposta
                                ? formatDate(solicitacao.data_resposta)
                                : ""}
                            </small>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center p-5">
                <FaBell className="text-muted mb-3" size={48} />
                <h6 className="text-muted">Nenhuma solicitação encontrada</h6>
                <p className="text-muted small">
                  {filtroStatus === "pendente"
                    ? "Não há solicitações pendentes no momento"
                    : "As solicitações aparecerão aqui quando os tutores solicitarem agendamentos"}
                </p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Modal de Resposta */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {statusResposta === "aceita" ? "Aceitar" : "Recusar"} Solicitação
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSolicitacao && (
              <>
                <Alert variant="info">
                  <strong>Data:</strong> {formatDate(selectedSolicitacao.data_solicitada)}
                  <br />
                  <strong>Horário:</strong> {formatTime(selectedSolicitacao.horario_solicitado)}
                  <br />
                  <strong>Tutor:</strong> {selectedSolicitacao.tutor_nome}
                  <br />
                  {selectedSolicitacao.paciente_nome && (
                    <>
                      <strong>Paciente:</strong> {selectedSolicitacao.paciente_nome}
                      <br />
                    </>
                  )}
                  {selectedSolicitacao.observacoes && (
                    <>
                      <strong>Observações:</strong> {selectedSolicitacao.observacoes}
                    </>
                  )}
                </Alert>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {statusResposta === "aceita"
                      ? "Mensagem de confirmação (opcional)"
                      : "Motivo da recusa (opcional)"}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                    placeholder={
                      statusResposta === "aceita"
                        ? "Ex: Agendamento confirmado! Aguardamos você no horário marcado."
                        : "Ex: Horário não disponível. Por favor, escolha outro horário."
                    }
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              variant={statusResposta === "aceita" ? "success" : "danger"}
              onClick={handleSalvarResposta}
              disabled={saving}
            >
              {saving
                ? "Salvando..."
                : statusResposta === "aceita"
                ? "Aceitar"
                : "Recusar"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default SolicitacoesAgendamentoPage;

