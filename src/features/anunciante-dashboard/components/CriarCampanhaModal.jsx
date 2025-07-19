import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Card,
  Badge,
  Image,
} from "react-bootstrap";
import {
  FaBullhorn,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPaw,
  FaImage,
  FaLink,
  FaDollarSign,
  FaCalendarCheck,
  FaGlobe,
  FaInstagram,
  FaFacebook,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";

const CriarCampanhaModal = ({ show, onHide }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Etapa 1: Objetivo
    objetivo: "",

    // Etapa 2: Segmentação
    estado: "",
    cidade: "",
    especie: "",
    porte: "",
    faixaIdade: "",

    // Etapa 3: Criativo
    titulo: "",
    texto: "",
    midia: null,
    textoBotao: "",
    linkDestino: "",

    // Etapa 3.1: Detalhes do Evento (apenas se for evento)
    linkIngressos: "",
    websiteLocal: "",
    instagram: "",
    facebook: "",

    // Etapa 4: Orçamento e Duração
    tipoOrcamento: "diario",
    orcamento: "",
    dataInicio: "",
    dataFim: "",
  });

  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          midia: {
            file: file,
            preview: e.target.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Dados da campanha:", formData);
    // TODO: Implementar criação da campanha
    onHide();
  };

  const renderStepIndicator = () => (
    <div className="d-flex justify-content-center mb-4">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="d-flex align-items-center">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center ${
              step <= currentStep
                ? "bg-primary text-white"
                : "bg-light text-muted"
            }`}
            style={{ width: "40px", height: "40px" }}
          >
            {step < currentStep ? <FaCheck size={16} /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`mx-2 ${
                step < currentStep ? "text-primary" : "text-muted"
              }`}
            >
              <FaArrowRight size={12} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div>
      <h5 className="mb-4">
        <FaBullhorn className="me-2 text-primary" />
        Qual é o objetivo da sua campanha?
      </h5>
      <Row>
        <Col md={6}>
          <Card
            className={`h-100 cursor-pointer ${
              formData.objetivo === "banner" ? "border-primary" : ""
            }`}
            onClick={() => handleInputChange("objetivo", "banner")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="text-center p-4">
              <FaBullhorn size={48} className="text-primary mb-3" />
              <h6 className="fw-bold">Anúncio de Banner</h6>
              <p className="text-muted mb-0">
                Para visibilidade geral da sua marca ou serviço
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card
            className={`h-100 cursor-pointer ${
              formData.objetivo === "evento" ? "border-primary" : ""
            }`}
            onClick={() => handleInputChange("objetivo", "evento")}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="text-center p-4">
              <FaCalendarAlt size={48} className="text-primary mb-3" />
              <h6 className="fw-bold">Evento Específico</h6>
              <p className="text-muted mb-0">
                Para feiras, workshops, adoções e outros eventos
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h5 className="mb-4">
        <FaMapMarkerAlt className="me-2 text-primary" />
        Para quem você quer anunciar?
      </h5>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Estado *</Form.Label>
            <Form.Select
              value={formData.estado}
              onChange={(e) => handleInputChange("estado", e.target.value)}
            >
              <option value="">Selecione o estado</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="RS">Rio Grande do Sul</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Cidade *</Form.Label>
            <Form.Select
              value={formData.cidade}
              onChange={(e) => handleInputChange("cidade", e.target.value)}
            >
              <option value="">Selecione a cidade</option>
              <option value="sao-paulo">São Paulo</option>
              <option value="rio-de-janeiro">Rio de Janeiro</option>
              <option value="belo-horizonte">Belo Horizonte</option>
              <option value="porto-alegre">Porto Alegre</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div className="mt-4">
        <h6 className="mb-3">
          <FaPaw className="me-2" />
          Segmentação por Pet (Opcional)
        </h6>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Espécie</Form.Label>
              <Form.Select
                value={formData.especie}
                onChange={(e) => handleInputChange("especie", e.target.value)}
              >
                <option value="">Todas as espécies</option>
                <option value="cao">Cães</option>
                <option value="gato">Gatos</option>
                <option value="outros">Outros</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Porte</Form.Label>
              <Form.Select
                value={formData.porte}
                onChange={(e) => handleInputChange("porte", e.target.value)}
              >
                <option value="">Todos os portes</option>
                <option value="pequeno">Pequeno</option>
                <option value="medio">Médio</option>
                <option value="grande">Grande</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Faixa de Idade</Form.Label>
              <Form.Select
                value={formData.faixaIdade}
                onChange={(e) =>
                  handleInputChange("faixaIdade", e.target.value)
                }
              >
                <option value="">Todas as idades</option>
                <option value="filhote">Filhote (0-1 ano)</option>
                <option value="jovem">Jovem (1-3 anos)</option>
                <option value="adulto">Adulto (3-7 anos)</option>
                <option value="senior">Sênior (7+ anos)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h5 className="mb-4">
        <FaImage className="me-2 text-primary" />
        Como será o seu anúncio?
      </h5>
      <Row>
        <Col lg={8}>
          <Form.Group className="mb-3">
            <Form.Label>Título do Anúncio *</Form.Label>
            <Form.Control
              type="text"
              value={formData.titulo}
              onChange={(e) => handleInputChange("titulo", e.target.value)}
              placeholder="Ex: Feira de Adoção - Encontre seu companheiro"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Texto do Anúncio *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.texto}
              onChange={(e) => handleInputChange("texto", e.target.value)}
              placeholder="Descreva seu evento ou promoção de forma atrativa..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mídia (Imagem ou Vídeo) *</Form.Label>
            <Form.Control
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
            <Form.Text className="text-muted">
              Formatos aceitos: JPG, PNG, MP4. Tamanho máximo: 5MB
            </Form.Text>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Texto do Botão *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.textoBotao}
                  onChange={(e) =>
                    handleInputChange("textoBotao", e.target.value)
                  }
                  placeholder="Ex: Saiba Mais"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Link de Destino *</Form.Label>
                <Form.Control
                  type="url"
                  value={formData.linkDestino}
                  onChange={(e) =>
                    handleInputChange("linkDestino", e.target.value)
                  }
                  placeholder="https://..."
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Etapa 3.1: Detalhes do Evento */}
          {formData.objetivo === "evento" && (
            <div className="mt-4 p-4 border rounded bg-light">
              <h6 className="mb-3">
                <FaCalendarCheck className="me-2" />
                Detalhes Adicionais do Evento
              </h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Link para Ingressos</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.linkIngressos}
                      onChange={(e) =>
                        handleInputChange("linkIngressos", e.target.value)
                      }
                      placeholder="https://www.sympla.com.br/..."
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website do Local</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.websiteLocal}
                      onChange={(e) =>
                        handleInputChange("websiteLocal", e.target.value)
                      }
                      placeholder="https://www.petshop.com.br"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.instagram}
                      onChange={(e) =>
                        handleInputChange("instagram", e.target.value)
                      }
                      placeholder="@petshop"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.facebook}
                      onChange={(e) =>
                        handleInputChange("facebook", e.target.value)
                      }
                      placeholder="Nome da página"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}
        </Col>

        <Col lg={4}>
          <Card className="sticky-top">
            <Card.Header>
              <h6 className="mb-0">
                <FaEye className="me-2" />
                Pré-visualização
              </h6>
            </Card.Header>
            <Card.Body>
              {formData.midia?.preview && (
                <div className="mb-3">
                  <Image
                    src={formData.midia.preview}
                    fluid
                    className="rounded"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
              )}
              {formData.titulo && (
                <h6 className="fw-bold mb-2">{formData.titulo}</h6>
              )}
              {formData.texto && (
                <p className="text-muted small mb-3">{formData.texto}</p>
              )}
              {formData.textoBotao && (
                <Button variant="primary" size="sm" className="w-100">
                  {formData.textoBotao}
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h5 className="mb-4">
        <FaDollarSign className="me-2 text-primary" />
        Orçamento e Duração
      </h5>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Orçamento</Form.Label>
            <Form.Select
              value={formData.tipoOrcamento}
              onChange={(e) =>
                handleInputChange("tipoOrcamento", e.target.value)
              }
            >
              <option value="diario">Orçamento Diário</option>
              <option value="total">Orçamento Total</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              {formData.tipoOrcamento === "diario"
                ? "Orçamento Diário (R$)"
                : "Orçamento Total (R$)"}{" "}
              *
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.orcamento}
              onChange={(e) => handleInputChange("orcamento", e.target.value)}
              placeholder="0,00"
              step="0.01"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Data de Início *</Form.Label>
            <Form.Control
              type="date"
              value={formData.dataInicio}
              onChange={(e) => handleInputChange("dataInicio", e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Data de Fim *</Form.Label>
            <Form.Control
              type="date"
              value={formData.dataFim}
              onChange={(e) => handleInputChange("dataFim", e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Resumo da Campanha */}
      <Card className="mt-4">
        <Card.Header>
          <h6 className="mb-0">
            <FaCheck className="me-2 text-success" />
            Resumo da Campanha
          </h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="mb-2">
                <strong>Tipo:</strong>{" "}
                {formData.objetivo === "banner"
                  ? "Anúncio de Banner"
                  : "Evento Específico"}
              </div>
              <div className="mb-2">
                <strong>Localização:</strong> {formData.cidade},{" "}
                {formData.estado}
              </div>
              <div className="mb-2">
                <strong>Orçamento:</strong> R$ {formData.orcamento || "0,00"}{" "}
                {formData.tipoOrcamento === "diario" ? "/dia" : "total"}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-2">
                <strong>Período:</strong>{" "}
                {formData.dataInicio && formData.dataFim
                  ? `${new Date(formData.dataInicio).toLocaleDateString(
                      "pt-BR"
                    )} a ${new Date(formData.dataFim).toLocaleDateString(
                      "pt-BR"
                    )}`
                  : "Não definido"}
              </div>
              <div className="mb-2">
                <strong>Segmentação:</strong> {formData.especie || "Todas"} •{" "}
                {formData.porte || "Todos"} • {formData.faixaIdade || "Todas"}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.objetivo;
      case 2:
        return formData.estado && formData.cidade;
      case 3:
        return (
          formData.titulo &&
          formData.texto &&
          formData.midia &&
          formData.textoBotao &&
          formData.linkDestino
        );
      case 4:
        return formData.orcamento && formData.dataInicio && formData.dataFim;
      default:
        return false;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaBullhorn className="me-2" />
          Criar Nova Campanha
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {renderStepIndicator()}
        {renderCurrentStep()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        {currentStep > 1 && (
          <Button variant="outline-primary" onClick={prevStep}>
            <FaArrowLeft className="me-2" />
            Anterior
          </Button>
        )}
        {currentStep < totalSteps ? (
          <Button variant="primary" onClick={nextStep} disabled={!canProceed()}>
            Próximo
            <FaArrowRight className="ms-2" />
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={!canProceed()}
          >
            <FaCheck className="me-2" />
            Criar Campanha
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CriarCampanhaModal;
