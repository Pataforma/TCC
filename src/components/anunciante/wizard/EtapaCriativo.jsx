import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaImage, FaEdit, FaEye, FaUpload } from "react-icons/fa";

const EtapaCriativo = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    titulo: data?.titulo || "",
    descricao: data?.descricao || "",
    imagem: data?.imagem || null,
    callToAction: data?.callToAction || "Saiba Mais",
    urlDestino: data?.urlDestino || "",
    cores: data?.cores || {
      primaria: "#0DB2AC",
      secundaria: "#FABA32",
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const callToActionOptions = [
    "Saiba Mais",
    "Agende Agora",
    "Entre em Contato",
    "Comprar Agora",
    "Cadastre-se",
    "Baixar App",
    "Ver Ofertas",
    "Fazer Doação",
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          imagem: "Por favor, selecione apenas arquivos de imagem",
        }));
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          imagem: "A imagem deve ter no máximo 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData((prev) => ({
          ...prev,
          imagem: file,
        }));
        setErrors((prev) => ({
          ...prev,
          imagem: "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      cores: {
        ...prev.cores,
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "O título é obrigatório";
    } else if (formData.titulo.length > 50) {
      newErrors.titulo = "O título deve ter no máximo 50 caracteres";
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = "A descrição é obrigatória";
    } else if (formData.descricao.length > 200) {
      newErrors.descricao = "A descrição deve ter no máximo 200 caracteres";
    }

    if (!formData.urlDestino.trim()) {
      newErrors.urlDestino = "A URL de destino é obrigatória";
    } else if (!isValidUrl(formData.urlDestino)) {
      newErrors.urlDestino = "Por favor, insira uma URL válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <div className="mb-3">
            <FaImage size={48} className="text-primary" />
          </div>
          <h4 className="fw-bold">Criativo do Anúncio</h4>
          <p className="text-muted">
            Crie o conteúdo visual e textual do seu anúncio
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          {/* Título e Descrição */}
          <div className="mb-4">
            <h6 className="mb-3">
              <FaEdit className="me-2 text-primary" />
              Conteúdo do Anúncio
            </h6>
            <Form.Group className="mb-3">
              <Form.Label>Título do Anúncio</Form.Label>
              <Form.Control
                type="text"
                value={formData.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                placeholder="Digite um título atrativo para seu anúncio"
                maxLength={50}
                isInvalid={!!errors.titulo}
              />
              <Form.Control.Feedback type="invalid">
                {errors.titulo}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {formData.titulo.length}/50 caracteres
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                placeholder="Descreva seu produto, serviço ou oferta de forma clara e atrativa"
                maxLength={200}
                isInvalid={!!errors.descricao}
              />
              <Form.Control.Feedback type="invalid">
                {errors.descricao}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {formData.descricao.length}/200 caracteres
              </Form.Text>
            </Form.Group>
          </div>

          {/* Imagem */}
          <div className="mb-4">
            <h6 className="mb-3">
              <FaImage className="me-2 text-primary" />
              Imagem do Anúncio
            </h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload da Imagem</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    isInvalid={!!errors.imagem}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.imagem}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Formatos aceitos: JPG, PNG, GIF. Máximo 5MB.
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                {imagePreview && (
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </div>

          {/* Call to Action e URL */}
          <div className="mb-4">
            <h6 className="mb-3">
              <FaEye className="me-2 text-primary" />
              Ação e Destino
            </h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Call to Action</Form.Label>
                  <Form.Select
                    value={formData.callToAction}
                    onChange={(e) =>
                      handleChange("callToAction", e.target.value)
                    }
                  >
                    {callToActionOptions.map((cta) => (
                      <option key={cta} value={cta}>
                        {cta}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL de Destino</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.urlDestino}
                    onChange={(e) => handleChange("urlDestino", e.target.value)}
                    placeholder="https://www.seusite.com"
                    isInvalid={!!errors.urlDestino}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.urlDestino}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Cores */}
          <div className="mb-4">
            <h6 className="mb-3">
              <FaEdit className="me-2 text-primary" />
              Cores do Anúncio
            </h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cor Primária</Form.Label>
                  <Form.Control
                    type="color"
                    value={formData.cores.primaria}
                    onChange={(e) =>
                      handleColorChange("primaria", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cor Secundária</Form.Label>
                  <Form.Control
                    type="color"
                    value={formData.cores.secundaria}
                    onChange={(e) =>
                      handleColorChange("secundaria", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Preview */}
          {formData.titulo && (
            <div className="mb-4 p-3 border rounded">
              <h6 className="mb-3">Preview do Anúncio</h6>
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: formData.cores.primaria,
                  color: "white",
                }}
              >
                <h5 className="mb-2">{formData.titulo}</h5>
                <p className="mb-3">{formData.descricao}</p>
                <Button
                  variant="light"
                  size="sm"
                  style={{
                    backgroundColor: formData.cores.secundaria,
                    border: "none",
                  }}
                >
                  {formData.callToAction}
                </Button>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={onBack}>
              Voltar
            </Button>
            <Button variant="primary" type="submit">
              Finalizar Campanha
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EtapaCriativo;
