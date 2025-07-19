import React, { useState, useRef } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import {
  FaUpload,
  FaEye,
  FaEdit,
  FaImage,
  FaVideo,
  FaTimes,
} from "react-icons/fa";
import Botao from "../../../components/ui/Botao";
import FormInput from "../../../components/ui/FormInput";
import styles from "./CriacaoAnuncio.module.css";

const CriacaoAnuncio = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    nomeEvento: data?.nomeEvento || "",
    tituloAnuncio: data?.tituloAnuncio || "",
    textoAnuncio: data?.textoAnuncio || "",
    textoBotao: data?.textoBotao || "Saiba Mais",
    linkDestino: data?.linkDestino || "",
    midia: data?.midia || null,
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Limites de caracteres
  const LIMITES = {
    tituloAnuncio: 50,
    textoAnuncio: 150,
    textoBotao: 20,
  };

  // Validação dos campos
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nomeEvento.trim()) {
      newErrors.nomeEvento = "Nome do evento é obrigatório";
    }

    if (!formData.tituloAnuncio.trim()) {
      newErrors.tituloAnuncio = "Título do anúncio é obrigatório";
    } else if (formData.tituloAnuncio.length > LIMITES.tituloAnuncio) {
      newErrors.tituloAnuncio = `Máximo de ${LIMITES.tituloAnuncio} caracteres`;
    }

    if (!formData.textoAnuncio.trim()) {
      newErrors.textoAnuncio = "Texto do anúncio é obrigatório";
    } else if (formData.textoAnuncio.length > LIMITES.textoAnuncio) {
      newErrors.textoAnuncio = `Máximo de ${LIMITES.textoAnuncio} caracteres`;
    }

    if (!formData.textoBotao.trim()) {
      newErrors.textoBotao = "Texto do botão é obrigatório";
    } else if (formData.textoBotao.length > LIMITES.textoBotao) {
      newErrors.textoBotao = `Máximo de ${LIMITES.textoBotao} caracteres`;
    }

    if (!formData.linkDestino.trim()) {
      newErrors.linkDestino = "Link de destino é obrigatório";
    } else if (!isValidUrl(formData.linkDestino)) {
      newErrors.linkDestino = "URL inválida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Calcular caracteres restantes
  const getCharCount = (field) => {
    return formData[field] ? formData[field].length : 0;
  };

  const getCharRemaining = (field) => {
    return LIMITES[field] - getCharCount(field);
  };

  // Manipular mudanças nos campos
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro quando usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Upload de arquivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
    ];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        midia:
          "Formato de arquivo não suportado. Use JPG, PNG, WebP, MP4 ou WebM.",
      }));
      return;
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        midia: "Arquivo muito grande. Máximo 10MB.",
      }));
      return;
    }

    setIsUploading(true);

    // Simular upload
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          midia: {
            file,
            url: e.target.result,
            type: file.type.startsWith("image/") ? "image" : "video",
          },
        }));
        setIsUploading(false);
        setErrors((prev) => ({ ...prev, midia: null }));
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  // Remover mídia
  const removeMidia = () => {
    setFormData((prev) => ({ ...prev, midia: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submeter formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  // Verificar se formulário está válido
  const isFormValid = () => {
    return (
      formData.nomeEvento.trim() &&
      formData.tituloAnuncio.trim() &&
      formData.textoAnuncio.trim() &&
      formData.textoBotao.trim() &&
      formData.linkDestino.trim() &&
      isValidUrl(formData.linkDestino) &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold text-dark mb-1">
              Criação de Anúncio/Evento
            </h2>
            <p className="text-muted mb-0">
              Defina o conteúdo visual e textual do seu anúncio
            </p>
          </div>
          <div className={styles.progressInfo}>
            <span className="badge bg-primary me-2">Etapa 3 de 5</span>
            <ProgressBar now={60} className={styles.progress} />
          </div>
        </div>
      </div>

      <Row>
        {/* Coluna Esquerda - Formulário */}
        <Col lg={6} className="mb-4">
          <Card className={styles.formCard}>
            <Card.Header className={styles.cardHeader}>
              <h5 className="mb-0">
                <FaEdit className="me-2 text-primary" />
                Formulário de Criação
              </h5>
            </Card.Header>
            <Card.Body className={styles.cardBody}>
              <Form onSubmit={handleSubmit}>
                {/* Nome do Evento/Campanha */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Nome do Evento/Campanha *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nomeEvento}
                    onChange={(e) =>
                      handleInputChange("nomeEvento", e.target.value)
                    }
                    placeholder="Ex: Campanha de Verão - Ração Premium"
                    isInvalid={!!errors.nomeEvento}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nomeEvento}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Título do Anúncio */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Título do Anúncio *
                    <span className="text-muted ms-2">
                      ({getCharRemaining("tituloAnuncio")} restantes)
                    </span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.tituloAnuncio}
                    onChange={(e) =>
                      handleInputChange("tituloAnuncio", e.target.value)
                    }
                    placeholder="Ex: Seu Pet Merece o Melhor!"
                    maxLength={LIMITES.tituloAnuncio}
                    isInvalid={!!errors.tituloAnuncio}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.tituloAnuncio}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Texto do Anúncio */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Texto do Anúncio *
                    <span className="text-muted ms-2">
                      ({getCharRemaining("textoAnuncio")} restantes)
                    </span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={formData.textoAnuncio}
                    onChange={(e) =>
                      handleInputChange("textoAnuncio", e.target.value)
                    }
                    placeholder="Ex: Conheça nossa nova linha de rações naturais. Nutrição completa para cães e gatos de todas as idades."
                    maxLength={LIMITES.textoAnuncio}
                    isInvalid={!!errors.textoAnuncio}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.textoAnuncio}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Upload de Mídia */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <FaUpload className="me-2" />
                    Upload de Mídia
                  </Form.Label>

                  {!formData.midia ? (
                    <div className="border-2 border-dashed border-secondary rounded p-4 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="d-none"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="mb-3">
                          <FaImage size={48} className="text-muted" />
                        </div>
                        <p className="mb-2">
                          <strong>Clique para fazer upload</strong>
                        </p>
                        <p className="text-muted small mb-0">
                          JPG, PNG, WebP, MP4 ou WebM (máx. 10MB)
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="position-relative">
                      {formData.midia.type === "image" ? (
                        <img
                          src={formData.midia.url}
                          alt="Preview"
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px" }}
                        />
                      ) : (
                        <video
                          src={formData.midia.url}
                          controls
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px" }}
                        />
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2"
                        onClick={removeMidia}
                      >
                        <FaTimes />
                      </Button>
                    </div>
                  )}

                  {isUploading && (
                    <div className="mt-3">
                      <ProgressBar animated now={100} />
                      <small className="text-muted">Fazendo upload...</small>
                    </div>
                  )}

                  {errors.midia && (
                    <Alert variant="danger" className="mt-2 py-2">
                      {errors.midia}
                    </Alert>
                  )}
                </Form.Group>

                {/* Texto do Botão */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Texto do Botão (Call to Action) *
                    <span className="text-muted ms-2">
                      ({getCharRemaining("textoBotao")} restantes)
                    </span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.textoBotao}
                    onChange={(e) =>
                      handleInputChange("textoBotao", e.target.value)
                    }
                    placeholder="Ex: Saiba Mais, Compre Agora, Agende uma Visita"
                    maxLength={LIMITES.textoBotao}
                    isInvalid={!!errors.textoBotao}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.textoBotao}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Link de Destino */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Link de Destino *
                  </Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.linkDestino}
                    onChange={(e) =>
                      handleInputChange("linkDestino", e.target.value)
                    }
                    placeholder="https://exemplo.com"
                    isInvalid={!!errors.linkDestino}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.linkDestino}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    URL para onde o usuário será redirecionado ao clicar no
                    anúncio
                  </Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Coluna Direita - Pré-visualização */}
        <Col lg={6} className="mb-4">
          <Card className={styles.formCard}>
            <Card.Header className={styles.cardHeader}>
              <h5 className="mb-0">
                <FaEye className="me-2 text-primary" />
                Pré-visualização do Anúncio
              </h5>
            </Card.Header>
            <Card.Body className={styles.cardBody}>
              <div className="preview-container">
                {/* Card de Pré-visualização */}
                <div className="preview-card border rounded p-3 mb-3">
                  {/* Mídia */}
                  {formData.midia ? (
                    <div className="preview-media mb-3">
                      {formData.midia.type === "image" ? (
                        <img
                          src={formData.midia.url}
                          alt="Preview"
                          className="img-fluid rounded w-100"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      ) : (
                        <video
                          src={formData.midia.url}
                          className="img-fluid rounded w-100"
                          style={{ height: "200px", objectFit: "cover" }}
                          muted
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      className="preview-media-placeholder mb-3 bg-light rounded d-flex align-items-center justify-content-center"
                      style={{ height: "200px" }}
                    >
                      <div className="text-center text-muted">
                        <FaImage size={48} className="mb-2" />
                        <p className="mb-0">Imagem ou vídeo aparecerá aqui</p>
                      </div>
                    </div>
                  )}

                  {/* Conteúdo */}
                  <div className="preview-content">
                    <h5 className="preview-title fw-bold mb-2">
                      {formData.tituloAnuncio || "Título do Anúncio"}
                    </h5>
                    <p className="preview-text text-muted mb-3">
                      {formData.textoAnuncio ||
                        "Texto descritivo do anúncio aparecerá aqui..."}
                    </p>
                    <Botao
                      text={formData.textoBotao || "Saiba Mais"}
                      bgColor="var(--main-color)"
                      hoverColor="var(--bg-button)"
                      onClick={() => {}}
                      className="w-100"
                    />
                  </div>
                </div>

                {/* Informações do Anúncio */}
                <div className="preview-info">
                  <h6 className="fw-semibold mb-3">Informações do Anúncio</h6>
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted d-block">
                        Nome da Campanha
                      </small>
                      <span className="fw-medium">
                        {formData.nomeEvento || "Não definido"}
                      </span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">
                        Link de Destino
                      </small>
                      <span className="fw-medium text-truncate d-block">
                        {formData.linkDestino || "Não definido"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Botões de Navegação */}
      <Row>
        <Col-12>
          <div className={styles.navigationButtons}>
            <Button
              variant="outline-secondary"
              onClick={onBack}
              className={styles.navButton}
            >
              ← Voltar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={styles.navButton}
            >
              Continuar →
            </Button>
          </div>
        </Col-12>
      </Row>
    </div>
  );
};

export default CriacaoAnuncio;
