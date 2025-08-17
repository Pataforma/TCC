import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { supabase } from "../../../utils/supabase";
import { FaSave, FaTimes } from "react-icons/fa";

export default function ModalEditarPaciente({ show, onHide, paciente, onPacienteAtualizado }) {
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

      const { error } = await supabase
        .from("pets")
        .update(payload)
        .eq("id", paciente.id);

      if (error) throw error;

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

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Paciente</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Espécie</Form.Label>
                <Form.Select
                  name="especie"
                  value={formData.especie}
                  onChange={handleChange}
                  required
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
                <Form.Label>Raça</Form.Label>
                <Form.Control
                  type="text"
                  name="raca"
                  value={formData.raca}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  name="data_nascimento"
                  value={formData.data_nascimento}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Peso (kg)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Sexo</Form.Label>
                <Form.Select name="sexo" value={formData.sexo} onChange={handleChange}>
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
                <Form.Label>Cor</Form.Label>
                <Form.Control
                  type="text"
                  name="cor"
                  value={formData.cor}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Microchip</Form.Label>
                <Form.Control
                  type="text"
                  name="microchip"
                  value={formData.microchip}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="pendente">Pendente</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            <FaTimes className="me-2" /> Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              <FaSave className="me-2" />
            )}
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}


