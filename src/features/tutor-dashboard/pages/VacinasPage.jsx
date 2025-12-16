import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Alert,
  Modal,
  Form,
  ProgressBar,
} from "react-bootstrap";
import {
  FaSyringe,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaDownload,
  FaShare,
  FaPaw,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaBell,
  FaFileMedical,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";

const VacinasPage = () => {
  const { user } = useUser();
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVacina, setSelectedVacina] = useState(null);
  const [vacinasPendentes, setVacinasPendentes] = useState([]);
  const [historicoVacinas, setHistoricoVacinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setNomeUsuario(user.nome || user.email || "");
    }
    fetchVacinas();
  }, [user]);

  const fetchVacinas = async () => {
    setLoading(true);
    try {
      // Buscar pets do usuário para mapear IDs
      const pets = await api.get("/pets");
      const petsMap = {};
      pets.forEach((pet) => {
        petsMap[pet.id] = pet.nome;
      });

      // Buscar consultas de vacinação
      const consultas = await api.get("/consultas");
      const consultasVacinas = consultas.filter(
        (c) =>
          c.tipo &&
          (c.tipo.toLowerCase().includes("vacina") ||
            c.tipo.toLowerCase().includes("vacinação"))
      );

      // Buscar lembretes de vacinas
      const lembretes = await api.get("/lembretes");
      const lembretesVacinas = lembretes.filter(
        (l) =>
          l.tipo &&
          (l.tipo.toLowerCase().includes("vacina") ||
            l.titulo.toLowerCase().includes("vacina"))
      );

      // Combinar e formatar
      const pendentes = formatarVacinasPendentes(
        consultasVacinas,
        lembretesVacinas,
        petsMap
      );
      const historico = formatarHistoricoVacinas(
        consultasVacinas,
        lembretesVacinas,
        petsMap
      );

      setVacinasPendentes(pendentes);
      setHistoricoVacinas(historico);
    } catch (error) {
      console.error("Erro ao buscar vacinas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarVacinasPendentes = (consultas, lembretes, petsMap = {}) => {
    const agora = new Date();
    const vacinas = [];

    // Processar consultas futuras
    consultas
      .filter((c) => {
        const dataConsulta = new Date(c.data_consulta);
        return (
          c.status !== "realizado" &&
          c.status !== "cancelado" &&
          dataConsulta >= agora
        );
      })
      .forEach((c) => {
        const dataConsulta = new Date(c.data_consulta);
        const diasAtraso = Math.max(
          0,
          Math.floor((agora - dataConsulta) / (1000 * 60 * 60 * 24))
        );

        vacinas.push({
          id: `consulta-${c.id}`,
          pet: c.pet?.nome || c.pacientes?.nome || "Pet não informado",
          nome: c.tipo || "Vacina",
          tipo: "Anual", // TODO: Extrair do tipo ou observações
          dataAplicacao: null,
          proximaDose: dataConsulta.toISOString().split("T")[0],
          status: "pendente",
          urgente: diasAtraso > 0,
          diasAtraso: diasAtraso,
          veterinario:
            c.veterinario?.nome || "Veterinário não informado",
          clinica: c.veterinario?.nome_clinica || "Clínica não informada",
          valor: 0, // TODO: Adicionar campo valor
          observacoes: c.observacoes || "",
        });
      });

    // Processar lembretes futuros
    lembretes
      .filter((l) => {
        const dataLembrete = new Date(l.data);
        return dataLembrete >= agora;
      })
      .forEach((l) => {
        const dataLembrete = new Date(l.data);
        const diasAtraso = Math.max(
          0,
          Math.floor((agora - dataLembrete) / (1000 * 60 * 60 * 24))
        );

        // Buscar nome do pet
        const petNome = l.pet_id
          ? petsMap[l.pet_id] || "Pet não informado"
          : "Pet não informado";

        vacinas.push({
          id: `lembrete-${l.id}`,
          pet: petNome,
          nome: l.titulo || "Vacina",
          tipo: "Anual", // TODO: Extrair do tipo
          dataAplicacao: null,
          proximaDose: dataLembrete.toISOString().split("T")[0],
          status: "pendente",
          urgente: l.urgente || diasAtraso > 0,
          diasAtraso: diasAtraso,
          veterinario: "Não informado",
          clinica: "Não informada",
          valor: 0,
          observacoes: l.descricao || "",
        });
      });

    return vacinas.sort((a, b) => {
      const dataA = new Date(a.proximaDose);
      const dataB = new Date(b.proximaDose);
      return dataA - dataB;
    });
  };

  const formatarHistoricoVacinas = (consultas, lembretes, petsMap = {}) => {
    const agora = new Date();
    const vacinas = [];

    // Processar consultas realizadas
    consultas
      .filter((c) => c.status === "realizado")
      .forEach((c) => {
        const dataConsulta = new Date(c.data_consulta);
        const proximaDose = new Date(dataConsulta);
        proximaDose.setFullYear(proximaDose.getFullYear() + 1); // Assumindo anual

        vacinas.push({
          id: `consulta-${c.id}`,
          pet: c.pet?.nome || c.pacientes?.nome || "Pet não informado",
          nome: c.tipo || "Vacina",
          tipo: "Anual",
          dataAplicacao: dataConsulta.toISOString().split("T")[0],
          proximaDose: proximaDose.toISOString().split("T")[0],
          status: "aplicada",
          veterinario:
            c.veterinario?.nome || "Veterinário não informado",
          clinica: c.veterinario?.nome_clinica || "Clínica não informada",
          valor: 0,
          observacoes: c.observacoes || "Aplicada com sucesso",
          lote: null, // TODO: Adicionar campo lote
        });
      });

    // Processar lembretes passados
    lembretes
      .filter((l) => {
        const dataLembrete = new Date(l.data);
        return dataLembrete < agora;
      })
      .forEach((l) => {
        const dataLembrete = new Date(l.data);
        const proximaDose = new Date(dataLembrete);
        proximaDose.setFullYear(proximaDose.getFullYear() + 1);

        const petNome = l.pet_id
          ? petsMap[l.pet_id] || "Pet não informado"
          : "Pet não informado";

        vacinas.push({
          id: `lembrete-${l.id}`,
          pet: petNome,
          nome: l.titulo || "Vacina",
          tipo: "Anual",
          dataAplicacao: dataLembrete.toISOString().split("T")[0],
          proximaDose: proximaDose.toISOString().split("T")[0],
          status: "aplicada",
          veterinario: "Não informado",
          clinica: "Não informada",
          valor: 0,
          observacoes: l.descricao || "Aplicada com sucesso",
          lote: null,
        });
      });

    return vacinas.sort((a, b) => {
      const dataA = new Date(a.dataAplicacao);
      const dataB = new Date(b.dataAplicacao);
      return dataB - dataA; // Mais recentes primeiro
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pendente: "warning",
      aplicada: "success",
      atrasada: "danger",
    };
    return variants[status] || "secondary";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendente: "Pendente",
      aplicada: "Aplicada",
      atrasada: "Atrasada",
    };
    return labels[status] || status;
  };

  const handleAgendarVacina = (vacina) => {
    // TODO: Implementar agendamento de vacina
    alert(`Agendando ${vacina.nome} para ${vacina.pet}...`);
  };

  const handleViewDetails = (vacina) => {
    setSelectedVacina(vacina);
    setShowDetailsModal(true);
  };

  const handleDownloadCertificado = (vacina) => {
    // TODO: Implementar download do certificado
    alert(`Baixando certificado de ${vacina.nome} para ${vacina.pet}...`);
  };

  const totalPendentes = vacinasPendentes.length;
  const totalAplicadas = historicoVacinas.length;
  const totalAtrasadas = vacinasPendentes.filter((v) => v.urgente).length;

  if (loading) {
    return (
      <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
        <Container fluid className="py-4">
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  <FaSyringe className="me-2" />
                  Controle de Vacinas
                </h2>
                <p className="text-muted mb-0">
                  Acompanhe o calendário vacinal dos seus pets
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <FaPlus className="me-2" />
                Nova Vacina
              </Button>
            </div>
          </Col>
        </Row>

        {/* Cards de Resumo */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Vacinas Pendentes</h6>
                    <h4 className="fw-bold text-warning mb-0">
                      {totalPendentes}
                    </h4>
                  </div>
                  <div className="text-warning">
                    <FaClock size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Vacinas Aplicadas</h6>
                    <h4 className="fw-bold text-success mb-0">
                      {totalAplicadas}
                    </h4>
                  </div>
                  <div className="text-success">
                    <FaCheckCircle size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-1">Atrasadas</h6>
                    <h4 className="fw-bold text-danger mb-0">
                      {totalAtrasadas}
                    </h4>
                  </div>
                  <div className="text-danger">
                    <FaExclamationTriangle size={24} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Vacinas Pendentes */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0 fw-bold">
                  <FaExclamationTriangle className="me-2 text-warning" />
                  Vacinas Pendentes
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {vacinasPendentes.length === 0 ? (
                  <div className="text-center py-5">
                    <FaCheckCircle size={48} className="text-success mb-3" />
                    <h5>Parabéns!</h5>
                    <p className="text-muted">
                      Todos os seus pets estão com a vacinação em dia.
                    </p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {vacinasPendentes.map((vacina) => (
                      <div key={vacina.id} className="list-group-item border-0">
                        <div className="row align-items-center">
                          <div className="col-md-3">
                            <div className="d-flex align-items-center gap-2">
                              <FaPaw className="text-primary" />
                              <div>
                                <h6 className="fw-semibold mb-1">
                                  {vacina.pet}
                                </h6>
                                <small className="text-muted">
                                  {vacina.nome}
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div>
                              <strong>Tipo:</strong> {vacina.tipo}
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div>
                              <strong>Próxima Dose:</strong>
                              <br />
                              <span
                                className={
                                  vacina.urgente ? "text-danger fw-bold" : ""
                                }
                              >
                                {formatDate(vacina.proximaDose)}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div>
                              <strong>Valor:</strong>
                              <br />
                              <span className="text-success">
                                {formatCurrency(vacina.valor)}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div>
                              <strong>Veterinário:</strong>
                              <br />
                              <small>{vacina.veterinario}</small>
                            </div>
                          </div>
                          <div className="col-md-1">
                            <div className="d-flex gap-1">
                              <Button
                                variant={vacina.urgente ? "danger" : "primary"}
                                size="sm"
                                onClick={() => handleAgendarVacina(vacina)}
                              >
                                {vacina.urgente ? "Urgente!" : "Agendar"}
                              </Button>
                            </div>
                          </div>
                        </div>
                        {vacina.urgente && (
                          <Alert variant="danger" className="mt-2 mb-0">
                            <FaExclamationTriangle className="me-2" />
                            <strong>Atenção!</strong> Esta vacina está atrasada
                            há {vacina.diasAtraso} dias. Agende imediatamente
                            para manter a proteção do seu pet.
                          </Alert>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Histórico de Vacinas */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0 fw-bold">
                  <FaFileMedical className="me-2 text-primary" />
                  Histórico de Vacinas
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Data Aplicação</th>
                      <th>Pet</th>
                      <th>Vacina</th>
                      <th>Tipo</th>
                      <th>Veterinário</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoVacinas.map((vacina) => (
                      <tr key={vacina.id}>
                        <td>
                          <div>
                            <strong>{formatDate(vacina.dataAplicacao)}</strong>
                            <br />
                            <small className="text-muted">
                              Próxima: {formatDate(vacina.proximaDose)}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FaPaw className="text-primary" />
                            <span className="fw-semibold">{vacina.pet}</span>
                          </div>
                        </td>
                        <td>
                          <span className="fw-semibold">{vacina.nome}</span>
                        </td>
                        <td>
                          <Badge bg="info">{vacina.tipo}</Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FaUser className="text-muted" />
                            <span>{vacina.veterinario}</span>
                          </div>
                        </td>
                        <td>
                          <span className="fw-semibold text-success">
                            {formatCurrency(vacina.valor)}
                          </span>
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(vacina.status)}>
                            {getStatusLabel(vacina.status)}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleViewDetails(vacina)}
                              title="Ver Detalhes"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleDownloadCertificado(vacina)}
                              title="Download Certificado"
                            >
                              <FaDownload />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Compartilhar"
                            >
                              <FaShare />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal de Detalhes */}
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaSyringe className="me-2" />
              Detalhes da Vacina
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedVacina && (
              <div>
                <Row>
                  <Col md={6}>
                    <h6 className="fw-bold">Informações da Vacina</h6>
                    <div className="mb-3">
                      <strong>Pet:</strong> {selectedVacina.pet}
                    </div>
                    <div className="mb-3">
                      <strong>Vacina:</strong> {selectedVacina.nome}
                    </div>
                    <div className="mb-3">
                      <strong>Tipo:</strong> {selectedVacina.tipo}
                    </div>
                    <div className="mb-3">
                      <strong>Status:</strong>{" "}
                      <Badge bg={getStatusBadge(selectedVacina.status)}>
                        {getStatusLabel(selectedVacina.status)}
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <strong>Valor:</strong>{" "}
                      {formatCurrency(selectedVacina.valor)}
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold">Datas</h6>
                    {selectedVacina.dataAplicacao && (
                      <div className="mb-3">
                        <strong>Data de Aplicação:</strong>{" "}
                        {formatDate(selectedVacina.dataAplicacao)}
                      </div>
                    )}
                    <div className="mb-3">
                      <strong>Próxima Dose:</strong>{" "}
                      {formatDate(selectedVacina.proximaDose)}
                    </div>
                    <div className="mb-3">
                      <strong>Veterinário:</strong> {selectedVacina.veterinario}
                    </div>
                    <div className="mb-3">
                      <strong>Clínica:</strong> {selectedVacina.clinica}
                    </div>
                  </Col>
                </Row>

                <hr />

                <div className="mb-3">
                  <h6 className="fw-bold">Observações</h6>
                  <p>{selectedVacina.observacoes}</p>
                </div>

                {selectedVacina.lote && (
                  <div className="mb-3">
                    <h6 className="fw-bold">Informações do Lote</h6>
                    <p>
                      <strong>Lote:</strong> {selectedVacina.lote}
                    </p>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <Button variant="outline-primary">
                    <FaPhone className="me-2" />
                    Ligar para Clínica
                  </Button>
                  <Button variant="outline-success">
                    <FaWhatsapp className="me-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline-info">
                    <FaMapMarkerAlt className="me-2" />
                    Ver Localização
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Modal Nova Vacina */}
        <Modal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaPlus className="me-2" />
              Nova Vacina
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pet *</Form.Label>
                    <Form.Select>
                      <option value="">Selecione o pet</option>
                      <option value="thor">Thor</option>
                      <option value="luna">Luna</option>
                      <option value="max">Max</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Vacina *</Form.Label>
                    <Form.Select>
                      <option value="">Selecione a vacina</option>
                      <option value="antirrabica">Vacina Antirrábica</option>
                      <option value="v10">Vacina V10 (Cães)</option>
                      <option value="v8">Vacina V8 (Cães)</option>
                      <option value="v4">Vacina V4 (Gatos)</option>
                      <option value="v3">Vacina V3 (Gatos)</option>
                      <option value="giardia">Vacina Giardia</option>
                      <option value="gripe">Vacina Gripe Canina</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data de Aplicação</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Próxima Dose</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Observações sobre a aplicação..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Número do Lote</Form.Label>
                <Form.Control type="text" placeholder="Ex: LOT-2024-001" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary">
              <FaPlus className="me-2" />
              Adicionar Vacina
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default VacinasPage;
