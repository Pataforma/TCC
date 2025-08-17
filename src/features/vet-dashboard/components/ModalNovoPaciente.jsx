import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { supabase } from "../../../utils/supabase";
import { FaPlus, FaSpinner } from "react-icons/fa";

export default function ModalNovoPaciente({ show, onHide, onPacienteCriado }) {
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: tutores, error } = await supabase
        .from("tutor")
        .select("*")
        .order("nome");

      if (error) {
        console.error("Erro ao carregar tutores:", error);
        return;
      }

      setTutoresExistentes(tutores || []);
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleTutorChange = (e) => {
    const tutorId = e.target.value;
    if (tutorId === "novo") {
      setModoNovoTutor(true);
      setTutorSelecionado(null);
    } else {
      setModoNovoTutor(false);
      const tutor = tutoresExistentes.find(
        (t) => t.id_tutor === parseInt(tutorId)
      );
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
      if (!formData.tutorTelefone.trim())
        novosErros.tutorTelefone = "Telefone do tutor é obrigatório";
      if (!formData.tutorCpf.trim())
        novosErros.tutorCpf = "CPF do tutor é obrigatório";
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Usuário não autenticado");
      }

      let tutorId = tutorSelecionado?.id_tutor;

      // Se for um novo tutor, criar primeiro
      if (modoNovoTutor) {
        const { data: novoTutor, error: tutorError } = await supabase
          .from("tutor")
          .insert([
            {
              nome: formData.tutorNome,
              email: formData.tutorEmail || null,
              telefone: formData.tutorTelefone,
              cpf: formData.tutorCpf,
              endereco: formData.tutorEndereco || null,
              cidade: formData.tutorCidade || null,
              estado: formData.tutorEstado || null,
              cep: formData.tutorCep || null,
            },
          ])
          .select()
          .single();

        if (tutorError) {
          throw new Error("Erro ao criar tutor: " + tutorError.message);
        }

        tutorId = novoTutor.id_tutor;
      }

      // Criar o paciente
      const { data: novoPaciente, error: pacienteError } = await supabase
        .from("pets")
        .insert([
          {
            nome: formData.nome,
            especie: formData.especie,
            raca: formData.raca || null,
            data_nascimento: formData.dataNascimento || null,
            peso: formData.peso ? parseFloat(formData.peso) : null,
            sexo: formData.sexo,
            cor: formData.cor || null,
            microchip: formData.microchip || null,
            observacoes: formData.observacoes || null,
            usuario_id: tutorId, // pets usa usuario_id (que é o tutor)
            veterinario_id: session.user.id,
          },
        ])
        .select()
        .single();

      if (pacienteError) {
        throw new Error("Erro ao criar paciente: " + pacienteError.message);
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
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.tutorTelefone}
                    </Form.Control.Feedback>
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
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.tutorCpf}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="tutorEmail"
                      value={formData.tutorEmail}
                      onChange={handleInputChange}
                      placeholder="email@exemplo.com"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            {modoNovoTutor && (
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control
                      type="text"
                      name="tutorEndereco"
                      value={formData.tutorEndereco}
                      onChange={handleInputChange}
                      placeholder="Rua, número, bairro"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>CEP</Form.Label>
                    <Form.Control
                      type="text"
                      name="tutorCep"
                      value={formData.tutorCep}
                      onChange={handleInputChange}
                      placeholder="00000-000"
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
                    >
                      <option value="">Selecione...</option>
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
