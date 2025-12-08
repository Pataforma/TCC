import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";
import { FaPlus, FaSpinner, FaMapMarkerAlt } from "react-icons/fa";

export default function ModalNovoPaciente({ show, onHide, onPacienteCriado }) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    raca: "",
    dataNascimento: "",
    peso: "",
    sexo: "",
    cor: "",
    microchip: "",
    observacoes: "",
    tutorNome: "",
    tutorEmail: "",
    tutorTelefone: "",
    tutorCpf: "",
    tutorEndereco: "",
    tutorCidade: "",
    tutorEstado: "",
    tutorCep: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tutoresExistentes, setTutoresExistentes] = useState([]);
  const [modoNovoTutor, setModoNovoTutor] = useState(true);
  const [tutorSelecionado, setTutorSelecionado] = useState(null);

  // Estados para validação
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [buscandoCep, setBuscandoCep] = useState(false);

  // Funções de máscara
  const aplicarMascaraCPF = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9)
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
        6
      )}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
      6,
      9
    )}-${numbers.slice(9, 11)}`;
  };

  const aplicarMascaraTelefone = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
        6
      )}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
      6,
      10
    )}`;
  };

  const aplicarMascaraCep = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const limparMascara = (value) => {
    return value.replace(/\D/g, "");
  };

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep) => {
    if (!cep || cep.length < 8) return;

    try {
      setBuscandoCep(true);
      const cepLimpo = limparMascara(cep);

      if (cepLimpo.length !== 8) return;

      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          tutorEndereco: data.logradouro || "",
          tutorCidade: data.localidade || "",
          tutorEstado: data.uf || "",
          tutorCep: cep, // Mantém o CEP com máscara
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setBuscandoCep(false);
    }
  };

  // Opções para os selects
  const especies = ["Cão", "Gato", "Ave", "Réptil", "Peixe", "Outro"];
  const sexos = ["Macho", "Fêmea"];
  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  useEffect(() => {
    if (show) {
      carregarTutores();
      resetForm();
    }
  }, [show]);

  const carregarTutores = async () => {
    try {
      if (!user) return;

      // Buscar tutores via API
      const tutores = await api.get("/tutores");

      if (!tutores) {
        console.error("Erro ao carregar tutores: dados vazios");
        return;
      }

      // Mapear os dados para o formato esperado
      const tutoresMapeados = (tutores || []).map((tutor) => ({
        id_tutor: tutor.id,
        nome: tutor.nome,
        telefone: tutor.telefone || "",
        email: tutor.email || "",
      }));

      setTutoresExistentes(tutoresMapeados);
    } catch (error) {
      console.error("Erro ao carregar tutores:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      especie: "",
      raca: "",
      dataNascimento: "",
      peso: "",
      sexo: "",
      cor: "",
      microchip: "",
      observacoes: "",
      tutorNome: "",
      tutorEmail: "",
      tutorTelefone: "",
      tutorCpf: "",
      tutorEndereco: "",
      tutorCidade: "",
      tutorEstado: "",
      tutorCep: "",
    });
    setTutorSelecionado(null);
    setModoNovoTutor(true);
    setError("");
    setSuccess("");
    setValidated(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let valorProcessado = value;

    // Aplicar máscaras específicas
    if (name === "tutorCpf") {
      valorProcessado = aplicarMascaraCPF(value);
    } else if (name === "tutorTelefone") {
      valorProcessado = aplicarMascaraTelefone(value);
    } else if (name === "tutorCep") {
      valorProcessado = aplicarMascaraCep(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: valorProcessado,
    }));

    // Limpar erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Buscar endereço automaticamente quando o CEP for digitado
    if (name === "tutorCep" && value.length >= 8) {
      buscarEnderecoPorCep(value);
    }
  };

  const handleTutorChange = (e) => {
    const tutorId = e.target.value;
    if (tutorId === "novo") {
      setModoNovoTutor(true);
      setTutorSelecionado(null);
    } else {
      setModoNovoTutor(false);
      const tutor = tutoresExistentes.find((t) => t.id_tutor === tutorId);
      setTutorSelecionado(tutor);
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    // Validação do paciente
    if (!formData.nome.trim())
      novosErros.nome = "Nome do paciente é obrigatório";
    if (!formData.especie) novosErros.especie = "Espécie é obrigatória";
    if (!formData.sexo) novosErros.sexo = "Sexo é obrigatório";

    // Validação do tutor
    if (modoNovoTutor) {
      if (!formData.tutorNome.trim())
        novosErros.tutorNome = "Nome do tutor é obrigatório";

      if (!formData.tutorEmail.trim()) {
        novosErros.tutorEmail = "Email do tutor é obrigatório";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tutorEmail)) {
        novosErros.tutorEmail = "Email inválido";
      }

      if (!formData.tutorTelefone.trim()) {
        novosErros.tutorTelefone = "Telefone do tutor é obrigatório";
      } else if (limparMascara(formData.tutorTelefone).length < 10) {
        novosErros.tutorTelefone = "Telefone deve ter pelo menos 10 dígitos";
      }

      if (!formData.tutorCpf.trim()) {
        novosErros.tutorCpf = "CPF do tutor é obrigatório";
      } else if (limparMascara(formData.tutorCpf).length !== 11) {
        novosErros.tutorCpf = "CPF deve ter 11 dígitos";
      }
    } else if (!tutorSelecionado) {
      novosErros.tutor = "Selecione um tutor existente";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      setValidated(true);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      let tutorId = tutorSelecionado?.id_tutor;

      // Se for um novo tutor, criar primeiro
      if (modoNovoTutor) {
        // Criar tutor via API
        const novoTutorResponse = await api.post("/tutores", {
          nome: formData.tutorNome,
          email: formData.tutorEmail || null,
          telefone: limparMascara(formData.tutorTelefone) || null,
        });

        if (!novoTutorResponse || !novoTutorResponse.tutor) {
          throw new Error("Erro ao criar perfil do tutor");
        }

        tutorId = novoTutorResponse.tutor.id;
      }

      // Criar o paciente via API
      const novoPacienteResponse = await api.post("/pacientes", {
        nome: formData.nome,
        especie: formData.especie,
        raca: formData.raca || null,
        data_nascimento: formData.dataNascimento || null,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        status: "ativo",
        tutor_id: tutorId || null,
      });

      // A resposta pode vir como { paciente: {...} } ou diretamente como objeto
      const novoPaciente = novoPacienteResponse?.paciente || novoPacienteResponse;

      if (!novoPaciente) {
        throw new Error("Erro ao criar paciente: resposta inválida");
      }

      setSuccess("Paciente criado com sucesso!");

      // Limpar formulário e fechar modal após 1.5 segundos
      setTimeout(() => {
        resetForm();
        onHide();
        if (onPacienteCriado) {
          onPacienteCriado(novoPaciente);
        }
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaPlus className="me-2" />
          Novo Paciente
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate validated={validated}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {/* Seção do Tutor */}
          <div className="mb-4">
            <h6 className="border-bottom pb-2 mb-3">Informações do Tutor</h6>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tutor Existente</Form.Label>
                  <Form.Select
                    name="tutorExistente"
                    onChange={handleTutorChange}
                    value={tutorSelecionado?.id_tutor || "novo"}
                  >
                    <option value="novo">+ Novo Tutor</option>
                    {tutoresExistentes.map((tutor) => (
                      <option key={tutor.id_tutor} value={tutor.id_tutor}>
                        {tutor.nome} - {tutor.telefone}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {modoNovoTutor && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome do Tutor *</Form.Label>
                    <Form.Control
                      type="text"
                      name="tutorNome"
                      value={formData.tutorNome}
                      onChange={handleInputChange}
                      isInvalid={!!errors.tutorNome}
                      placeholder="Nome completo"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.tutorNome}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telefone *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="tutorTelefone"
                      value={formData.tutorTelefone}
                      onChange={handleInputChange}
                      isInvalid={!!errors.tutorTelefone}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.tutorTelefone}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Digite apenas números, a máscara será aplicada
                      automaticamente
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {modoNovoTutor && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>CPF *</Form.Label>
                    <Form.Control
                      type="text"
                      name="tutorCpf"
                      value={formData.tutorCpf}
                      onChange={handleInputChange}
                      isInvalid={!!errors.tutorCpf}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.tutorCpf}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Digite apenas números, a máscara será aplicada
                      automaticamente
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="tutorEmail"
                      value={formData.tutorEmail}
                      onChange={handleInputChange}
                      isInvalid={!!errors.tutorEmail}
                      placeholder="email@exemplo.com"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.tutorEmail}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {modoNovoTutor && (
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>CEP</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="tutorCep"
                        value={formData.tutorCep}
                        onChange={handleInputChange}
                        placeholder="00000-000"
                        maxLength={9}
                        title="Digite apenas números, o formato será aplicado automaticamente"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => buscarEnderecoPorCep(formData.tutorCep)}
                        disabled={buscandoCep}
                      >
                        {buscandoCep ? (
                          <FaSpinner className="fa-spin" />
                        ) : (
                          <FaMapMarkerAlt />
                        )}
                      </Button>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Digite o CEP para preenchimento automático do endereço
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      type="text"
                      name="tutorEndereco"
                      value={formData.tutorEndereco}
                      onChange={handleInputChange}
                      placeholder="Rua, número, bairro"
                      readOnly={buscandoCep}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            {modoNovoTutor && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cidade</Form.Label>
                    <Form.Control
                      type="text"
                      name="tutorCidade"
                      value={formData.tutorCidade}
                      onChange={handleInputChange}
                      placeholder="Nome da cidade"
                      readOnly={buscandoCep}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      name="tutorEstado"
                      value={formData.tutorEstado}
                      onChange={handleInputChange}
                      disabled={buscandoCep}
                    >
                      <option value="">Selecione o estado</option>
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </div>

          {/* Seção do Paciente */}
          <div className="mb-4">
            <h6 className="border-bottom pb-2 mb-3">Informações do Paciente</h6>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Paciente *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    isInvalid={!!errors.nome}
                    placeholder="Nome do pet"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Espécie *</Form.Label>
                  <Form.Select
                    name="especie"
                    value={formData.especie}
                    onChange={handleInputChange}
                    isInvalid={!!errors.especie}
                  >
                    <option value="">Selecione...</option>
                    {especies.map((especie) => (
                      <option key={especie} value={especie}>
                        {especie}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.especie}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Raça</Form.Label>
                  <Form.Control
                    type="text"
                    name="raca"
                    value={formData.raca}
                    onChange={handleInputChange}
                    placeholder="Ex: Golden Retriever"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sexo *</Form.Label>
                  <Form.Select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleInputChange}
                    isInvalid={!!errors.sexo}
                  >
                    <option value="">Selecione...</option>
                    {sexos.map((sexo) => (
                      <option key={sexo} value={sexo}>
                        {sexo}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.sexo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Peso (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="peso"
                    value={formData.peso}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cor</Form.Label>
                  <Form.Control
                    type="text"
                    name="cor"
                    value={formData.cor}
                    onChange={handleInputChange}
                    placeholder="Ex: Marrom"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Microchip</Form.Label>
                  <Form.Control
                    type="text"
                    name="microchip"
                    value={formData.microchip}
                    onChange={handleInputChange}
                    placeholder="Número do microchip"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                placeholder="Informações adicionais sobre o paciente..."
              />
            </Form.Group>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="fa-spin me-2" />
                Salvando...
              </>
            ) : (
              <>
                <FaPlus className="me-2" />
                Criar Paciente
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
