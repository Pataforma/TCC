import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const AnimalModal = ({ show, onHide, animal, onSave }) => {
  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    raca: "",
    idade: "",
    porte: "",
    sexo: "",
    descricao: "",
    historia: "",
    status: "disponivel",
    saude: {
      vacinado: false,
      castrado: false,
      vermifugado: false,
      observacoes: "",
    },
  });

  useEffect(() => {
    if (animal) {
      setFormData(animal);
    } else {
      setFormData({
        nome: "",
        especie: "",
        raca: "",
        idade: "",
        porte: "",
        sexo: "",
        descricao: "",
        historia: "",
        status: "disponivel",
        saude: {
          vacinado: false,
          castrado: false,
          vermifugado: false,
          observacoes: "",
        },
      });
    }
  }, [animal]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaudeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      saude: {
        ...prev.saude,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {animal ? "Editar Animal" : "Adicionar Novo Animal"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Espécie *</Form.Label>
                <Form.Select
                  value={formData.especie}
                  onChange={(e) => handleChange("especie", e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Cão">Cão</option>
                  <option value="Gato">Gato</option>
                  <option value="Outros">Outros</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Raça</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.raca}
                  onChange={(e) => handleChange("raca", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Idade</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.idade}
                  onChange={(e) => handleChange("idade", e.target.value)}
                  placeholder="Ex: 2 anos"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Porte</Form.Label>
                <Form.Select
                  value={formData.porte}
                  onChange={(e) => handleChange("porte", e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sexo</Form.Label>
                <Form.Select
                  value={formData.sexo}
                  onChange={(e) => handleChange("sexo", e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              placeholder="Descreva o temperamento e características do animal..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>História</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.historia}
              onChange={(e) => handleChange("historia", e.target.value)}
              placeholder="Conte a história do animal..."
            />
          </Form.Group>

          <h6>Informações de Saúde</h6>
          <Row>
            <Col md={4}>
              <Form.Check
                type="checkbox"
                label="Vacinado"
                checked={formData.saude.vacinado}
                onChange={(e) =>
                  handleSaudeChange("vacinado", e.target.checked)
                }
              />
            </Col>
            <Col md={4}>
              <Form.Check
                type="checkbox"
                label="Castrado"
                checked={formData.saude.castrado}
                onChange={(e) =>
                  handleSaudeChange("castrado", e.target.checked)
                }
              />
            </Col>
            <Col md={4}>
              <Form.Check
                type="checkbox"
                label="Vermifugado"
                checked={formData.saude.vermifugado}
                onChange={(e) =>
                  handleSaudeChange("vermifugado", e.target.checked)
                }
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Observações de Saúde</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData.saude.observacoes}
              onChange={(e) => handleSaudeChange("observacoes", e.target.value)}
              placeholder="Observações sobre a saúde do animal..."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {animal ? "Salvar Alterações" : "Adicionar Animal"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnimalModal;
