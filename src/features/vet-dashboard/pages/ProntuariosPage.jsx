import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Badge,
  Modal,
  InputGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";
import { supabase } from "../../../utils/supabase";
import {
  FaPlus,
  FaSearch,
  FaFileMedical,
  FaPills,
  FaMicroscope,
  FaStethoscope,
  FaDownload,
  FaWhatsapp,
  FaEnvelope,
  FaPrint,
  FaSignature,
  FaEye,
  FaEdit,
  FaTrash,
  FaPaw,
  FaUser,
  FaCalendarAlt,
  FaWeight,
  FaRuler,
} from "react-icons/fa";

const ProntuariosPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Estados principais
  const [pacientes, setPacientes] = useState([]);
  const [prontuarios, setProntuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  // Estados do modal de prescrição
  const [showModalPrescricao, setShowModalPrescricao] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [prescricao, setPrescricao] = useState({
    diagnostico: "",
    medicamentos: [{ nome: "", dosagem: "", posologia: "", duracao: "" }],
    exames: [],
    recomendacoes: "",
    proximaConsulta: "",
    observacoes: "",
    assinatura: "",
  });

  // Estados para medicamentos e exames
  const [medicamentosDisponiveis, setMedicamentosDisponiveis] = useState([]);
  const [examesDisponiveis, setExamesDisponiveis] = useState([]);

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      // Buscar veterinário logado
      const { data: veterinario } = await supabase
        .from("veterinarios")
        .select("id_veterinarios")
        .eq("id_usuario", session.user.id)
        .single();

      if (!veterinario) return;

      // Carregar pacientes
      const { data: pacientesData } = await supabase
        .from("pets")
        .select(
          `
          *,
          tutor:tutor_id (nome, telefone, email)
        `
        )
        .eq("veterinario_id", veterinario.id_veterinarios)
        .order("nome");

      setPacientes(pacientesData || []);

      // Carregar prontuários existentes (se houver tabela)
      // Por enquanto, vamos simular com dados mockados
      setProntuarios([
        {
          id: 1,
          paciente_id: "1",
          paciente_nome: "Thor",
          tutor_nome: "João Silva",
          data: "2024-01-15",
          diagnostico: "Virose canina",
          status: "ativo",
          medicamentos: ["Antibiótico", "Anti-inflamatório"],
        },
      ]);

      // Medicamentos disponíveis (mockados por enquanto)
      setMedicamentosDisponiveis([
        "Antibiótico",
        "Anti-inflamatório",
        "Antiparasitário",
        "Vitaminas",
        "Analgésico",
        "Antiemético",
      ]);

      // Exames disponíveis (mockados por enquanto)
      setExamesDisponiveis([
        "Hemograma",
        "Bioquímico",
        "Raio-X",
        "Ultrassom",
        "Teste de Função Renal",
        "Teste de Função Hepática",
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funções para prescrição
  const abrirModalPrescricao = (paciente) => {
    setSelectedPaciente(paciente);
    setPrescricao({
      diagnostico: "",
      medicamentos: [{ nome: "", dosagem: "", posologia: "", duracao: "" }],
      exames: [],
      recomendacoes: "",
      proximaConsulta: "",
      observacoes: "",
      assinatura: "",
    });
    setShowModalPrescricao(true);
  };

  const adicionarMedicamento = () => {
    setPrescricao((prev) => ({
      ...prev,
      medicamentos: [
        ...prev.medicamentos,
        { nome: "", dosagem: "", posologia: "", duracao: "" },
      ],
    }));
  };

  const removerMedicamento = (index) => {
    setPrescricao((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.filter((_, i) => i !== index),
    }));
  };

  const atualizarMedicamento = (index, campo, valor) => {
    setPrescricao((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.map((med, i) =>
        i === index ? { ...med, [campo]: valor } : med
      ),
    }));
  };

  const salvarPrescricao = async () => {
    try {
      setLoading(true);

      // Aqui você salvaria no banco de dados
      // Por enquanto, vamos simular
      const novaPrescricao = {
        id: Date.now(),
        paciente_id: selectedPaciente.id,
        paciente_nome: selectedPaciente.nome,
        tutor_nome: selectedPaciente.tutor?.nome,
        data: new Date().toISOString().split("T")[0],
        diagnostico: prescricao.diagnostico,
        status: "ativo",
        medicamentos: prescricao.medicamentos.filter((m) => m.nome),
        exames: prescricao.exames,
        recomendacoes: prescricao.recomendacoes,
        proximaConsulta: prescricao.proximaConsulta,
        observacoes: prescricao.observacoes,
        assinatura: prescricao.assinatura,
      };

      setProntuarios((prev) => [novaPrescricao, ...prev]);
      setShowModalPrescricao(false);

      alert("Prescrição salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar prescrição:", error);
      alert("Erro ao salvar prescrição");
    } finally {
      setLoading(false);
    }
  };

  const exportarReceita = (prontuario) => {
    // Aqui você implementaria a geração de PDF
    alert("Funcionalidade de exportação será implementada em breve!");
  };

  const enviarWhatsApp = (prontuario) => {
    const mensagem = `Receita Veterinária - ${
      prontuario.paciente_nome
    }\n\nDiagnóstico: ${
      prontuario.diagnostico
    }\n\nMedicamentos:\n${prontuario.medicamentos.join(
      "\n"
    )}\n\nPróxima consulta: ${prontuario.proximaConsulta || "A definir"}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const filtrarProntuarios = prontuarios.filter((prontuario) => {
    const matchesSearch =
      prontuario.paciente_nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prontuario.tutor_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prontuario.diagnostico.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "todos" || prontuario.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">
              <FaFileMedical className="me-2 text-primary" />
              Prontuários e Prescrições
            </h2>
            <p className="text-muted mb-0">
              Sistema de prescrição veterinária com receitas digitais e
              assinatura eletrônica
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" size="sm">
              <FaDownload className="me-2" />
              Exportar Todos
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowModalPrescricao(true)}
            >
              <FaPlus className="me-2" />
              Nova Prescrição
            </Button>
          </div>
        </div>

        {/* Busca e Filtros */}
        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
          <Card.Body className="p-4">
            <Row className="g-3">
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por paciente, tutor ou diagnóstico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <div className="d-flex gap-2">
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    size="sm"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="ativo">Ativos</option>
                    <option value="finalizado">Finalizados</option>
                    <option value="pendente">Pendentes</option>
                  </Form.Select>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Lista de Prontuários */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <Card.Header className="bg-white border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-semibold text-dark mb-0">
                Prontuários ({filtrarProntuarios.length})
              </h5>
              <div className="d-flex gap-2">
                <Button variant="outline-secondary" size="sm">
                  <FaDownload className="me-2" />
                  CSV
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <FaPrint className="me-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Carregando prontuários...</p>
              </div>
            ) : filtrarProntuarios.length === 0 ? (
              <div className="text-center py-5">
                <FaFileMedical size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Nenhum prontuário encontrado</h5>
                <p className="text-muted">
                  Comece criando sua primeira prescrição
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowModalPrescricao(true)}
                >
                  <FaPlus className="me-2" />
                  Nova Prescrição
                </Button>
              </div>
            ) : (
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0">Paciente</th>
                    <th className="border-0">Tutor</th>
                    <th className="border-0">Data</th>
                    <th className="border-0">Diagnóstico</th>
                    <th className="border-0">Medicamentos</th>
                    <th className="border-0">Status</th>
                    <th className="border-0">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrarProntuarios.map((prontuario) => (
                    <tr key={prontuario.id}>
                      <td className="align-middle">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle"
                            style={{ width: 40, height: 40 }}
                          >
                            <FaPaw size={16} />
                          </div>
                          <div>
                            <div className="fw-semibold">
                              {prontuario.paciente_nome}
                            </div>
                            <small className="text-muted">
                              ID: {prontuario.paciente_id}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <div>{prontuario.tutor_nome}</div>
                      </td>
                      <td className="align-middle">
                        <div>
                          {new Date(prontuario.data).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div
                          className="text-truncate"
                          style={{ maxWidth: 200 }}
                          title={prontuario.diagnostico}
                        >
                          {prontuario.diagnostico}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex flex-wrap gap-1">
                          {prontuario.medicamentos
                            .slice(0, 2)
                            .map((med, idx) => (
                              <Badge key={idx} bg="info" className="text-white">
                                {med}
                              </Badge>
                            ))}
                          {prontuario.medicamentos.length > 2 && (
                            <Badge bg="secondary">
                              +{prontuario.medicamentos.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="align-middle">
                        <Badge
                          bg={
                            prontuario.status === "ativo"
                              ? "success"
                              : prontuario.status === "finalizado"
                              ? "secondary"
                              : "warning"
                          }
                        >
                          {prontuario.status === "ativo"
                            ? "Ativo"
                            : prontuario.status === "finalizado"
                            ? "Finalizado"
                            : "Pendente"}
                        </Badge>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="Ver detalhes"
                            onClick={() =>
                              navigate(
                                `/dashboard/veterinario/prontuario/${prontuario.paciente_id}`
                              )
                            }
                          >
                            <FaEye size={12} />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            title="Exportar receita"
                            onClick={() => exportarReceita(prontuario)}
                          >
                            <FaDownload size={12} />
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            title="Enviar WhatsApp"
                            onClick={() => enviarWhatsApp(prontuario)}
                          >
                            <FaWhatsapp size={12} />
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            title="Editar"
                          >
                            <FaEdit size={12} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Modal de Nova Prescrição */}
        <Modal
          show={showModalPrescricao}
          onHide={() => setShowModalPrescricao(false)}
          size="xl"
          centered
        >
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fw-semibold">
              <FaFileMedical className="me-2 text-primary" />
              Nova Prescrição Veterinária
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!selectedPaciente ? (
              // Seleção de paciente
              <div>
                <h6 className="fw-semibold mb-3">Selecione o Paciente</h6>
                <div className="row g-3">
                  {pacientes.map((paciente) => (
                    <Col md={6} key={paciente.id}>
                      <Card
                        className="border-2 cursor-pointer hover-shadow"
                        style={{
                          cursor: "pointer",
                          borderColor: "#e9ecef",
                          transition: "all 0.2s ease",
                        }}
                        onClick={() => setSelectedPaciente(paciente)}
                      >
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="bg-primary d-flex align-items-center justify-content-center text-white rounded-circle"
                              style={{ width: 50, height: 50 }}
                            >
                              <FaPaw size={20} />
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">
                                {paciente.nome}
                              </h6>
                              <p className="text-muted mb-1 small">
                                {paciente.especie} • {paciente.raca}
                              </p>
                              <p className="text-muted mb-0 small">
                                Tutor: {paciente.tutor?.nome}
                              </p>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </div>
              </div>
            ) : (
              // Formulário de prescrição
              <div>
                {/* Informações do paciente selecionado */}
                <Alert variant="info" className="mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <FaPaw size={20} />
                    <div>
                      <strong>{selectedPaciente.nome}</strong> -{" "}
                      {selectedPaciente.especie} • {selectedPaciente.raca}
                      <br />
                      <small>
                        Tutor: {selectedPaciente.tutor?.nome} • Tel:{" "}
                        {selectedPaciente.tutor?.telefone}
                      </small>
                    </div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setSelectedPaciente(null)}
                      className="ms-auto"
                    >
                      Trocar Paciente
                    </Button>
                  </div>
                </Alert>

                <Form>
                  <Row className="g-3">
                    {/* Diagnóstico */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <FaStethoscope className="me-2 text-primary" />
                          Diagnóstico
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Descreva o diagnóstico do paciente..."
                          value={prescricao.diagnostico}
                          onChange={(e) =>
                            setPrescricao((prev) => ({
                              ...prev,
                              diagnostico: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    {/* Medicamentos */}
                    <Col md={12}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <Form.Label className="fw-semibold mb-0">
                          <FaPills className="me-2 text-primary" />
                          Medicamentos
                        </Form.Label>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={adicionarMedicamento}
                        >
                          <FaPlus className="me-2" />
                          Adicionar
                        </Button>
                      </div>

                      {prescricao.medicamentos.map((med, index) => (
                        <Card key={index} className="mb-3 border-light">
                          <Card.Body className="p-3">
                            <Row className="g-2">
                              <Col md={4}>
                                <Form.Control
                                  type="text"
                                  placeholder="Nome do medicamento"
                                  value={med.nome}
                                  onChange={(e) =>
                                    atualizarMedicamento(
                                      index,
                                      "nome",
                                      e.target.value
                                    )
                                  }
                                  list="medicamentos-lista"
                                />
                              </Col>
                              <Col md={2}>
                                <Form.Control
                                  type="text"
                                  placeholder="Dosagem"
                                  value={med.dosagem}
                                  onChange={(e) =>
                                    atualizarMedicamento(
                                      index,
                                      "dosagem",
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                              <Col md={3}>
                                <Form.Control
                                  type="text"
                                  placeholder="Posologia"
                                  value={med.posologia}
                                  onChange={(e) =>
                                    atualizarMedicamento(
                                      index,
                                      "posologia",
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                              <Col md={2}>
                                <Form.Control
                                  type="text"
                                  placeholder="Duração"
                                  value={med.duracao}
                                  onChange={(e) =>
                                    atualizarMedicamento(
                                      index,
                                      "duracao",
                                      e.target.value
                                    )
                                  }
                                />
                              </Col>
                              <Col md={1}>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removerMedicamento(index)}
                                  disabled={
                                    prescricao.medicamentos.length === 1
                                  }
                                >
                                  <FaTrash size={12} />
                                </Button>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                    </Col>

                    {/* Exames */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <FaMicroscope className="me-2 text-primary" />
                          Exames Solicitados
                        </Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                          {examesDisponiveis.map((exame) => (
                            <Form.Check
                              key={exame}
                              type="checkbox"
                              id={`exame-${exame}`}
                              label={exame}
                              checked={prescricao.exames.includes(exame)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPrescricao((prev) => ({
                                    ...prev,
                                    exames: [...prev.exames, exame],
                                  }));
                                } else {
                                  setPrescricao((prev) => ({
                                    ...prev,
                                    exames: prev.exames.filter(
                                      (e) => e !== exame
                                    ),
                                  }));
                                }
                              }}
                              className="me-3"
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </Col>

                    {/* Recomendações */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Recomendações
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Recomendações para o tutor..."
                          value={prescricao.recomendacoes}
                          onChange={(e) =>
                            setPrescricao((prev) => ({
                              ...prev,
                              recomendacoes: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    {/* Próxima Consulta */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Próxima Consulta
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={prescricao.proximaConsulta}
                          onChange={(e) =>
                            setPrescricao((prev) => ({
                              ...prev,
                              proximaConsulta: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    {/* Observações */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Observações Adicionais
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Observações importantes..."
                          value={prescricao.observacoes}
                          onChange={(e) =>
                            setPrescricao((prev) => ({
                              ...prev,
                              observacoes: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    {/* Assinatura Eletrônica */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <FaSignature className="me-2 text-primary" />
                          Assinatura Eletrônica
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Digite seu nome completo para assinar digitalmente"
                          value={prescricao.assinatura}
                          onChange={(e) =>
                            setPrescricao((prev) => ({
                              ...prev,
                              assinatura: e.target.value,
                            }))
                          }
                        />
                        <Form.Text className="text-muted">
                          Esta assinatura será validada com seu certificado
                          digital
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              variant="secondary"
              onClick={() => setShowModalPrescricao(false)}
            >
              Cancelar
            </Button>
            {selectedPaciente && (
              <Button
                variant="primary"
                onClick={salvarPrescricao}
                disabled={
                  loading || !prescricao.diagnostico || !prescricao.assinatura
                }
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FaFileMedical className="me-2" />
                    Salvar Prescrição
                  </>
                )}
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* Lista de medicamentos para autocomplete */}
        <datalist id="medicamentos-lista">
          {medicamentosDisponiveis.map((med) => (
            <option key={med} value={med} />
          ))}
        </datalist>
      </div>
    </DashboardLayout>
  );
};

export default ProntuariosPage;
