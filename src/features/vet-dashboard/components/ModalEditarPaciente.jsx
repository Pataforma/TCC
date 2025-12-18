import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { api } from "../../../utils/api";
import { FaSave, FaTimes } from "react-icons/fa";

export default function ModalEditarPaciente({ show, onHide, paciente, onPacienteAtualizado, embedded = false }) {
  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    raca: "",
    data_nascimento: "",
    peso: "",
    sexo: "",
    cor: "",
    microchip: "",
    observacoes: "",
    status: "ativo",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const especies = ["Cão", "Gato", "Ave", "Réptil", "Peixe", "Outro"];
  const sexos = ["Macho", "Fêmea"];

  useEffect(() => {
    if (show && paciente) {
      setFormData({
        nome: paciente.nome || "",
        especie: paciente.especie || "",
        raca: paciente.raca || "",
        data_nascimento: paciente.data_nascimento ? paciente.data_nascimento.split("T")[0] : "",
        peso: paciente.peso ?? "",
        sexo: paciente.sexo || "",
        cor: paciente.cor || "",
        microchip: paciente.microchip || "",
        observacoes: paciente.observacoes || "",
        status: paciente.status || "ativo",
      });
      setError("");
      setSuccess("");
    }
  }, [show, paciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paciente?.id) return;
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        nome: formData.nome.trim(),
        especie: formData.especie || null,
        raca: formData.raca || null,
        data_nascimento: formData.data_nascimento || null,
        peso: formData.peso === "" ? null : Number(formData.peso),
        sexo: formData.sexo || null,
        cor: formData.cor || null,
        microchip: formData.microchip || null,
        observacoes: formData.observacoes || null,
        status: formData.status || "ativo",
      };

      await api.put(`/pacientes/${paciente.id}`, payload);

      setSuccess("Paciente atualizado com sucesso!");
      if (onPacienteAtualizado) onPacienteAtualizado();

      setTimeout(() => {
        onHide();
      }, 800);
    } catch (err) {
      setError("Erro ao atualizar paciente: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {success && <Alert variant="success" className="mb-3">{success}</Alert>}

      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label style={{ fontSize: "13px" }}>Nome</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              size="sm"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label style={{ fontSize: "13px" }}>Espécie</Form.Label>
            <Form.Select
              name="especie"
              value={formData.especie}
              onChange={handleChange}
              required
              size="sm"
            >
              <option value="">Selecione...</option>
              {especies.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label style={{ fontSize: "13px" }}>Raça</Form.Label>
            <Form.Control
              type="text"
              name="raca"
              value={formData.raca}
              onChange={handleChange}
              size="sm"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label style={{ fontSize: "13px" }}>Data de Nascimento</Form.Label>
            <Form.Control
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento}
              onChange={handleChange}
              size="sm"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label style={{ fontSize: "13px" }}>Peso (kg)</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              min="0"
              name="peso"
              value={formData.peso}
              onChange={handleChange}
              size="sm"
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label style={{ fontSize: "13px" }}>Sexo</Form.Label>
            <Form.Select name="sexo" value={formData.sexo} onChange={handleChange} size="sm">
              <option value="">Selecione...</option>
              {sexos.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label style={{ fontSize: "13px" }}>Cor</Form.Label>
            <Form.Control
              type="text"
              name="cor"
              value={formData.cor}
              onChange={handleChange}
              size="sm"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label style={{ fontSize: "13px" }}>Microchip</Form.Label>
            <Form.Control
              type="text"
              name="microchip"
              value={formData.microchip}
              onChange={handleChange}
              size="sm"
            />
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group>
            <Form.Label style={{ fontSize: "13px" }}>Observações</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              size="sm"
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label style={{ fontSize: "13px" }}>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange} size="sm">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="pendente">Pendente</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex gap-2 mt-4">
        <Button 
          variant="outline-secondary" 
          onClick={onHide} 
          disabled={loading}
          size="sm"
          style={{ flex: 1, borderColor: "#e9ecef", color: "#6c757d" }}
        >
          <FaTimes className="me-2" /> Cancelar
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading}
          size="sm"
          style={{ flex: 1 }}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2" />
          ) : (
            <FaSave className="me-2" />
          )}
          Salvar
        </Button>
      </div>
    </Form>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formContent}
      </Modal.Body>
    </Modal>
  );
}


