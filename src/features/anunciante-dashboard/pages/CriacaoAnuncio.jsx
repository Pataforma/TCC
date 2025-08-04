import React, { useState, useRef } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  ProgressBar,
  Badge,
  Modal,
} from "react-bootstrap";
import {
  FaUpload,
  FaEye,
  FaEdit,
  FaImage,
  FaVideo,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaTicketAlt,
  FaPaw,
  FaGlobe,
  FaInstagram,
  FaFacebook,
  FaCertificate,
  FaInfoCircle,
  FaCheck,
  FaExclamationTriangle,
  FaSave,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Botao from "../../../components/ui/Botao";
import FormInput from "../../../components/ui/FormInput";
import styles from "./CriacaoAnuncio.module.css";

const CriacaoAnuncio = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Informações Essenciais
    nomeEvento: "",
    categoriaEvento: "",
    tituloAnuncio: "",
    textoAnuncio: "",
    textoBotao: "Saiba Mais",
    linkDestino: "",
    midia: null,

    // Logística do Evento
    local: "",
    dataInicio: "",
    horaInicio: "",
    dataFim: "",
    horaFim: "",
    capacidadeMaxima: "",

    // Acesso e Ingressos
    formaAcesso: "gratuito",
    custoIngresso: "",
    linkIngressos: "",
    forneceCertificado: false,

    // Detalhes para o Tutor
    petFriendly: "nao",
    regrasPets: "",
    preRequisitos: "",

    // Divulgação
    websiteLocal: "",
    linkInstagram: "",
    linkFacebook: "",
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState("essenciais");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Limites de caracteres
  const LIMITES = {
    tituloAnuncio: 50,
    textoAnuncio: 150,
    textoBotao: 20,
    regrasPets: 300,
    preRequisitos: 200,
  };

  // Categorias de eventos
  const CATEGORIAS_EVENTO = [
    "Feira de Adoção",
    "Workshop",
    "Palestra",
    "Cãominhada",
    "Evento Beneficente",
    "Exposição",
    "Treinamento",
    "Vacinação em Massa",
    "Feira de Produtos",
    "Outro",
  ];

  // Validação dos campos
  const validateForm = () => {
    const newErrors = {};

    // Validação das informações essenciais
    if (!formData.nomeEvento.trim()) {
      newErrors.nomeEvento = "Nome do evento é obrigatório";
    }
    if (!formData.categoriaEvento) {
      newErrors.categoriaEvento = "Categoria é obrigatória";
    }
    if (!formData.tituloAnuncio.trim()) {
      newErrors.tituloAnuncio = "Título do anúncio é obrigatório";
    }
    if (!formData.textoAnuncio.trim()) {
      newErrors.textoAnuncio = "Texto do anúncio é obrigatório";
    }
    if (!formData.linkDestino.trim()) {
      newErrors.linkDestino = "Link de destino é obrigatório";
    } else if (!isValidUrl(formData.linkDestino)) {
      newErrors.linkDestino = "URL inválida";
    }

    // Validação da logística
    if (!formData.local.trim()) {
      newErrors.local = "Local é obrigatório";
    }
    if (!formData.dataInicio) {
      newErrors.dataInicio = "Data de início é obrigatória";
    }
    if (!formData.horaInicio) {
      newErrors.horaInicio = "Hora de início é obrigatória";
    }

    // Validação de datas
    if (formData.dataInicio && formData.dataFim) {
      const inicio = new Date(`${formData.dataInicio} ${formData.horaInicio}`);
      const fim = new Date(`${formData.dataFim} ${formData.horaFim}`);
      if (fim <= inicio) {
        newErrors.dataFim = "Data/hora de fim deve ser posterior ao início";
      }
    }

    // Validação de acesso e ingressos
    if (formData.formaAcesso === "pago" && !formData.custoIngresso) {
      newErrors.custoIngresso = "Custo é obrigatório para eventos pagos";
    }
    if (formData.formaAcesso === "pago" && !formData.linkIngressos.trim()) {
      newErrors.linkIngressos = "Link de ingressos é obrigatório para eventos pagos";
    }

    // Validação de URLs
    if (formData.linkIngressos && !isValidUrl(formData.linkIngressos)) {
      newErrors.linkIngressos = "URL de ingressos inválida";
    }
    if (formData.websiteLocal && !isValidUrl(formData.websiteLocal)) {
      newErrors.websiteLocal = "URL do website inválida";
    }
    if (formData.linkInstagram && !isValidUrl(formData.linkInstagram)) {
      newErrors.linkInstagram = "URL do Instagram inválida";
    }
    if (formData.linkFacebook && !isValidUrl(formData.linkFacebook)) {
      newErrors.linkFacebook = "URL do Facebook inválida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getCharCount = (field) => {
    return formData[field]?.length || 0;
  };

  const getCharRemaining = (field) => {
    return LIMITES[field] - getCharCount(field);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
    if (!validTypes.includes(file.type)) {
      alert("Por favor, selecione apenas imagens (JPG, PNG, WebP) ou vídeos (MP4)");
      return;
    }

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("O arquivo deve ter no máximo 10MB");
      return;
    }

    setIsUploading(true);

    // Simular upload
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        midia: {
          file,
          url: URL.createObjectURL(file),
          type: file.type.startsWith("image/") ? "image" : "video",
        },
      }));
      setIsUploading(false);
    }, 1000);
  };

  const removeMidia = () => {
    setFormData((prev) => ({
      ...prev,
      midia: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simular envio para API
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessModal(true);
      }, 2000);
    }
  };

  const handleSaveDraft = () => {
    // Salvar como rascunho
    console.log("Salvando rascunho:", formData);
    alert("Rascunho salvo com sucesso!");
  };

  const handleCancel = () => {
    if (Object.keys(formData).some(key => formData[key] !== "" && formData[key] !== null)) {
      setShowCancelModal(true);
    } else {
      navigate("/dashboard/anunciante");
    }
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate("/dashboard/anunciante");
  };

  const handleSuccess = () => {
    setShowSuccessModal(false);
    navigate("/dashboard/anunciante/meus-eventos");
  };

  const isFormValid = () => {
    return (
      formData.nomeEvento.trim() &&
      formData.categoriaEvento &&
      formData.tituloAnuncio.trim() &&
      formData.textoAnuncio.trim() &&
      formData.linkDestino.trim() &&
      formData.local.trim() &&
      formData.dataInicio &&
      formData.horaInicio
    );
  };

  const formatDate = (date, time) => {
    if (!date || !time) return "";
    const [year, month, day] = date.split("-");
    const [hour, minute] = time.split(":");
    return `${day}/${month}/${year} às ${hour}:${minute}`;
  };

  const renderSection = (sectionKey, title, icon, children) => (
    <Card
      key={sectionKey}
      className={`mb-4 ${activeSection === sectionKey ? "border-primary" : ""}`}
    >
      <Card.Header
        className={`cursor-pointer ${activeSection === sectionKey ? "bg-primary text-white" : ""}`}
        onClick={() => setActiveSection(sectionKey)}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            {icon}
            <h6 className="mb-0 ms-2">{title}</h6>
          </div>
          <div className="d-flex align-items-center">
            {activeSection === sectionKey && (
              <Badge bg="light" text="primary" className="me-2">
                Ativo
              </Badge>
            )}
            <small className="text-muted">
              {Object.keys(errors).filter(key => key.startsWith(sectionKey)).length} erro(s)
            </small>
          </div>
        </div>
      </Card.Header>
      <Card.Body className={activeSection === sectionKey ? "" : "d-none"}>
        {children}
      </Card.Body>
    </Card>
  );

  const getProgressPercentage = () => {
    const totalFields = 15; // Total de campos obrigatórios
    const filledFields = Object.values(formData).filter(value => 
      value !== "" && value !== null && value !== false
    ).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  return (
    <DashboardLayout tipoUsuario="anunciante" nomeUsuario="Pet Shop Amigo Fiel">
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Criar Novo Evento</h2>
            <p className="text-muted mb-0">
              Crie e configure seu evento para alcançar mais pessoas
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleSaveDraft}
            >
              <FaSave className="me-2" />
              Salvar Rascunho
            </Button>
          </div>
        </div>

        {/* Barra de Progresso */}
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0">Progresso do Formulário</h6>
              <span className="text-muted">{getProgressPercentage()}% completo</span>
            </div>
            <ProgressBar 
              now={getProgressPercentage()} 
              variant={getProgressPercentage() === 100 ? "success" : "primary"}
              className="mb-2 stock-progress-bar"
            />
            <small className="text-muted">
              Preencha todos os campos obrigatórios para criar seu evento
            </small>
          </Card.Body>
        </Card>

        <Row>
          {/* Formulário */}
          <Col lg={8}>
            <Form onSubmit={handleSubmit}>
              {/* Seção: Informações Essenciais */}
              {renderSection(
                "essenciais",
                "Informações Essenciais",
                <FaInfoCircle className="text-primary" />,
                <div className="row">
                  <Col md={12} className="mb-3">
                    <FormInput
                      label="Nome do Evento *"
                      type="text"
                      value={formData.nomeEvento}
                      onChange={(e) => handleInputChange("nomeEvento", e.target.value)}
                      error={errors.nomeEvento}
                      placeholder="Ex: Feira de Adoção Pet Feliz"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Categoria do Evento *</Form.Label>
                      <Form.Select
                        value={formData.categoriaEvento}
                        onChange={(e) => handleInputChange("categoriaEvento", e.target.value)}
                        isInvalid={!!errors.categoriaEvento}
                      >
                        <option value="">Selecione uma categoria</option>
                        {CATEGORIAS_EVENTO.map((categoria) => (
                          <option key={categoria} value={categoria}>
                            {categoria}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.categoriaEvento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <FormInput
                      label="Título do Anúncio *"
                      type="text"
                      value={formData.tituloAnuncio}
                      onChange={(e) => handleInputChange("tituloAnuncio", e.target.value)}
                      error={errors.tituloAnuncio}
                      placeholder="Título que aparecerá no anúncio"
                      maxLength={LIMITES.tituloAnuncio}
                      helpText={`${getCharCount("tituloAnuncio")}/${LIMITES.tituloAnuncio} caracteres`}
                    />
                  </Col>
                  <Col md={12} className="mb-3">
                    <FormInput
                      label="Texto do Anúncio *"
                      type="textarea"
                      value={formData.textoAnuncio}
                      onChange={(e) => handleInputChange("textoAnuncio", e.target.value)}
                      error={errors.textoAnuncio}
                      placeholder="Descrição breve e atrativa do evento"
                      maxLength={LIMITES.textoAnuncio}
                      helpText={`${getCharCount("textoAnuncio")}/${LIMITES.textoAnuncio} caracteres`}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <FormInput
                      label="Texto do Botão"
                      type="text"
                      value={formData.textoBotao}
                      onChange={(e) => handleInputChange("textoBotao", e.target.value)}
                      placeholder="Ex: Participar, Saiba Mais"
                      maxLength={LIMITES.textoBotao}
                      helpText={`${getCharCount("textoBotao")}/${LIMITES.textoBotao} caracteres`}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <FormInput
                      label="Link de Destino *"
                      type="url"
                      value={formData.linkDestino}
                      onChange={(e) => handleInputChange("linkDestino", e.target.value)}
                      error={errors.linkDestino}
                      placeholder="https://exemplo.com/evento"
                    />
                  </Col>
                </div>
              )}

              {/* Seção: Mídia */}
              {renderSection(
                "midia",
                "Mídia (Banner/Imagem)",
                <FaImage className="text-primary" />,
                <div>
                  <div className="mb-3">
                    <Form.Label>Upload de Mídia</Form.Label>
                    <div className="border-2 border-dashed border-secondary rounded p-4 text-center">
                      {formData.midia ? (
                        <div>
                          {formData.midia.type === "image" ? (
                            <img
                              src={formData.midia.url}
                              alt="Preview"
                              className="img-fluid rounded mb-3"
                              style={{ maxHeight: "200px" }}
                            />
                          ) : (
                            <video
                              src={formData.midia.url}
                              controls
                              className="img-fluid rounded mb-3"
                              style={{ maxHeight: "200px" }}
                            />
                          )}
                          <div className="d-flex justify-content-center gap-2">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={removeMidia}
                            >
                              <FaTimes className="me-1" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <FaUpload size={48} className="text-muted mb-3" />
                          <p className="text-muted mb-3">
                            Arraste e solte uma imagem ou vídeo aqui, ou clique para selecionar
                          </p>
                          <Button
                            variant="outline-primary"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                          >
                            {isUploading ? "Enviando..." : "Selecionar Arquivo"}
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/mp4"
                            onChange={handleFileUpload}
                            style={{ display: "none" }}
                          />
                        </div>
                      )}
                    </div>
                    <Form.Text className="text-muted">
                      Formatos aceitos: JPG, PNG, WebP, MP4. Máximo 10MB.
                    </Form.Text>
                  </div>
                </div>
              )}

              {/* Seção: Logística do Evento */}
              {renderSection(
                "logistica",
                "Logística do Evento",
                <FaCalendarAlt className="text-primary" />,
                <div className="row">
                  <Col md={12} className="mb-3">
                    <FormInput
                      label="Local do Evento *"
                      type="text"
                      value={formData.local}
                      onChange={(e) => handleInputChange("local", e.target.value)}
                      error={errors.local}
                      placeholder="Endereço completo do evento"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <FormInput
                      label="Data de Início *"
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => handleInputChange("dataInicio", e.target.value)}
                      error={errors.dataInicio}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <FormInput
                      label="Hora de Início *"
                      type="time"
                      value={formData.horaInicio}
                      onChange={(e) => handleInputChange("horaInicio", e.target.value)}
                      error={errors.horaInicio}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <FormInput
                      label="Data de Fim"
                      type="date"
                      value={formData.dataFim}
                      onChange={(e) => handleInputChange("dataFim", e.target.value)}
                      error={errors.dataFim}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <FormInput
                      label="Hora de Fim"
                      type="time"
                      value={formData.horaFim}
                      onChange={(e) => handleInputChange("horaFim", e.target.value)}
                      error={errors.horaFim}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <FormInput
                      label="Capacidade Máxima"
                      type="number"
                      value={formData.capacidadeMaxima}
                      onChange={(e) => handleInputChange("capacidadeMaxima", e.target.value)}
                      placeholder="Número de participantes"
                    />
                  </Col>
                </div>
              )}

              {/* Seção: Acesso e Ingressos */}
              {renderSection(
                "acesso",
                "Acesso e Ingressos",
                <FaTicketAlt className="text-primary" />,
                <div className="row">
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Forma de Acesso</Form.Label>
                      <Form.Select
                        value={formData.formaAcesso}
                        onChange={(e) => handleInputChange("formaAcesso", e.target.value)}
                      >
                        <option value="gratuito">Gratuito</option>
                        <option value="pago">Pago</option>
                        <option value="inscricao">Inscrição Obrigatória</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {formData.formaAcesso === "pago" && (
                    <Col md={6} className="mb-3">
                      <FormInput
                        label="Custo do Ingresso *"
                        type="number"
                        value={formData.custoIngresso}
                        onChange={(e) => handleInputChange("custoIngresso", e.target.value)}
                        error={errors.custoIngresso}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </Col>
                  )}
                  {formData.formaAcesso !== "gratuito" && (
                    <Col md={12} className="mb-3">
                      <FormInput
                        label="Link de Ingressos/Inscrição"
                        type="url"
                        value={formData.linkIngressos}
                        onChange={(e) => handleInputChange("linkIngressos", e.target.value)}
                        error={errors.linkIngressos}
                        placeholder="https://sympla.com.br/evento"
                      />
                    </Col>
                  )}
                  <Col md={6} className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Fornece Certificado"
                      checked={formData.forneceCertificado}
                      onChange={(e) => handleInputChange("forneceCertificado", e.target.checked)}
                    />
                  </Col>
                </div>
              )}

              {/* Seção: Detalhes para o Tutor */}
              {renderSection(
                "tutor",
                "Detalhes para o Tutor",
                <FaPaw className="text-primary" />,
                <div className="row">
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Pet-Friendly</Form.Label>
                      <Form.Select
                        value={formData.petFriendly}
                        onChange={(e) => handleInputChange("petFriendly", e.target.value)}
                      >
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                        <option value="parcial">Parcialmente</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {formData.petFriendly !== "nao" && (
                    <Col md={12} className="mb-3">
                      <FormInput
                        label="Regras para Pets"
                        type="textarea"
                        value={formData.regrasPets}
                        onChange={(e) => handleInputChange("regrasPets", e.target.value)}
                        placeholder="Ex: Cães devem estar na coleira, carteira de vacinação obrigatória"
                        maxLength={LIMITES.regrasPets}
                        helpText={`${getCharCount("regrasPets")}/${LIMITES.regrasPets} caracteres`}
                      />
                    </Col>
                  )}
                  <Col md={12} className="mb-3">
                    <FormInput
                      label="Pré-requisitos"
                      type="textarea"
                      value={formData.preRequisitos}
                      onChange={(e) => handleInputChange("preRequisitos", e.target.value)}
                      placeholder="Ex: Trazer documento de identificação, idade mínima"
                      maxLength={LIMITES.preRequisitos}
                      helpText={`${getCharCount("preRequisitos")}/${LIMITES.preRequisitos} caracteres`}
                    />
                  </Col>
                </div>
              )}

              {/* Seção: Divulgação */}
              {renderSection(
                "divulgacao",
                "Divulgação",
                <FaGlobe className="text-primary" />,
                <div className="row">
                  <Col md={12} className="mb-3">
                    <FormInput
                      label="Website do Local"
                      type="url"
                      value={formData.websiteLocal}
                      onChange={(e) => handleInputChange("websiteLocal", e.target.value)}
                      error={errors.websiteLocal}
                      placeholder="https://www.local.com.br"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <FormInput
                      label="Instagram"
                      type="url"
                      value={formData.linkInstagram}
                      onChange={(e) => handleInputChange("linkInstagram", e.target.value)}
                      error={errors.linkInstagram}
                      placeholder="https://instagram.com/local"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <FormInput
                      label="Facebook"
                      type="url"
                      value={formData.linkFacebook}
                      onChange={(e) => handleInputChange("linkFacebook", e.target.value)}
                      error={errors.linkFacebook}
                      placeholder="https://facebook.com/local"
                    />
                  </Col>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-primary"
                    onClick={handleSaveDraft}
                  >
                    <FaSave className="me-2" />
                    Salvar Rascunho
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Criando Evento...
                      </>
                    ) : (
                      <>
                        <FaPlus className="me-2" />
                        Criar Evento
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          </Col>

          {/* Preview */}
          <Col lg={4}>
            <Card className="sticky-top" style={{ top: "2rem" }}>
              <Card.Header>
                <h6 className="mb-0">
                  <FaEye className="me-2" />
                  Preview do Anúncio
                </h6>
              </Card.Header>
              <Card.Body>
                {/* Banner/Imagem */}
                {formData.midia && (
                  <div className="mb-3">
                    {formData.midia.type === "image" ? (
                      <img
                        src={formData.midia.url}
                        alt="Banner"
                        className="img-fluid rounded"
                      />
                    ) : (
                      <video
                        src={formData.midia.url}
                        controls
                        className="img-fluid rounded"
                      />
                    )}
                  </div>
                )}

                {/* Informações Básicas */}
                <div className="preview-content">
                  <h6 className="fw-bold mb-2">
                    {formData.tituloAnuncio || "Título do Anúncio"}
                  </h6>
                  <p className="text-muted small mb-3">
                    {formData.textoAnuncio || "Descrição do evento aparecerá aqui"}
                  </p>

                  {/* Informações do Evento */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaCalendarAlt className="text-primary me-2" />
                      <small className="text-muted">
                        {formatDate(formData.dataInicio, formData.horaInicio) || "Data não definida"}
                      </small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaMapMarkerAlt className="text-primary me-2" />
                      <small className="text-muted">
                        {formData.local || "Local não definido"}
                      </small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaUsers className="text-primary me-2" />
                      <small className="text-muted">
                        {formData.capacidadeMaxima
                          ? `${formData.capacidadeMaxima} pessoas`
                          : "Capacidade ilimitada"}
                      </small>
                    </div>
                    {formData.petFriendly !== "nao" && (
                      <div className="d-flex align-items-center mb-2">
                        <FaPaw className="text-primary me-2" />
                        <small className="text-muted">
                          {formData.petFriendly === "sim"
                            ? "Pet-Friendly"
                            : "Parcialmente Pet-Friendly"}
                        </small>
                      </div>
                    )}
                  </div>

                  <Botao
                    text={formData.textoBotao || "Participar"}
                    bgColor="var(--main-color)"
                    hoverColor="var(--bg-button)"
                    onClick={() => {}}
                    className="w-100"
                  />
                </div>

                {/* Informações Detalhadas */}
                <div className="preview-info">
                  <h6 className="fw-semibold mb-3">Informações Detalhadas</h6>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <small className="text-muted d-block">
                        Nome do Evento
                      </small>
                      <span className="fw-medium">
                        {formData.nomeEvento || "Não definido"}
                      </span>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted d-block">Categoria</small>
                      <span className="fw-medium">
                        {formData.categoriaEvento || "Não definida"}
                      </span>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted d-block">Local</small>
                      <span className="fw-medium text-truncate d-block">
                        {formData.local || "Não definido"}
                      </span>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted d-block">Capacidade</small>
                      <span className="fw-medium">
                        {formData.capacidadeMaxima
                          ? `${formData.capacidadeMaxima} pessoas`
                          : "Ilimitada"}
                      </span>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted d-block">Certificado</small>
                      <span className="fw-medium">
                        {formData.forneceCertificado ? "Sim" : "Não"}
                      </span>
                    </div>
                    <div className="col-6 mb-2">
                      <small className="text-muted d-block">
                        Link de Destino
                      </small>
                      <span className="fw-medium text-truncate d-block">
                        {formData.linkDestino || "Não definido"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal de Sucesso */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheck className="me-2 text-success" />
            Evento Criado com Sucesso!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FaCheck size={48} className="text-success mb-3" />
            <h5>Parabéns!</h5>
            <p>Seu evento foi criado e está pronto para ser publicado.</p>
            <Alert variant="info">
              <FaInfoCircle className="me-2" />
              O evento será revisado pela nossa equipe antes de ser publicado.
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSuccess}>
            <FaEye className="me-2" />
            Ver Meus Eventos
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmação de Cancelamento */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="me-2 text-warning" />
            Confirmar Cancelamento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja cancelar a criação do evento?</p>
          <Alert variant="warning">
            <FaExclamationTriangle className="me-2" />
            <strong>Atenção:</strong> Todos os dados preenchidos serão perdidos.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Continuar Editando
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            <FaTimes className="me-2" />
            Cancelar Criação
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default CriacaoAnuncio;
