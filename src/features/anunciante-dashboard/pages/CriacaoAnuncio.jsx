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
} from "react-icons/fa";
import Botao from "../../../components/ui/Botao";
import FormInput from "../../../components/ui/FormInput";
import styles from "./CriacaoAnuncio.module.css";

const CriacaoAnuncio = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    // Informações Essenciais
    nomeEvento: data?.nomeEvento || "",
    categoriaEvento: data?.categoriaEvento || "",
    tituloAnuncio: data?.tituloAnuncio || "",
    textoAnuncio: data?.textoAnuncio || "",
    textoBotao: data?.textoBotao || "Saiba Mais",
    linkDestino: data?.linkDestino || "",
    midia: data?.midia || null,

    // Logística do Evento
    local: data?.local || "",
    dataInicio: data?.dataInicio || "",
    horaInicio: data?.horaInicio || "",
    dataFim: data?.dataFim || "",
    horaFim: data?.horaFim || "",
    capacidadeMaxima: data?.capacidadeMaxima || "",

    // Acesso e Ingressos
    formaAcesso: data?.formaAcesso || "gratuito",
    custoIngresso: data?.custoIngresso || "",
    linkIngressos: data?.linkIngressos || "",
    forneceCertificado: data?.forneceCertificado || false,

    // Detalhes para o Tutor
    petFriendly: data?.petFriendly || "nao",
    regrasPets: data?.regrasPets || "",
    preRequisitos: data?.preRequisitos || "",

    // Divulgação
    websiteLocal: data?.websiteLocal || "",
    linkInstagram: data?.linkInstagram || "",
    linkFacebook: data?.linkFacebook || "",
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [activeSection, setActiveSection] = useState("essenciais");
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

    // Informações Essenciais
    if (!formData.nomeEvento.trim()) {
      newErrors.nomeEvento = "Nome do evento é obrigatório";
    }

    if (!formData.categoriaEvento) {
      newErrors.categoriaEvento = "Categoria do evento é obrigatória";
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

    // Logística do Evento
    if (!formData.local.trim()) {
      newErrors.local = "Local do evento é obrigatório";
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = "Data de início é obrigatória";
    }

    if (!formData.horaInicio) {
      newErrors.horaInicio = "Horário de início é obrigatório";
    }

    if (!formData.dataFim) {
      newErrors.dataFim = "Data de fim é obrigatória";
    }

    if (!formData.horaFim) {
      newErrors.horaFim = "Horário de fim é obrigatório";
    }

    // Validação de datas
    if (formData.dataInicio && formData.dataFim) {
      const inicio = new Date(`${formData.dataInicio} ${formData.horaInicio}`);
      const fim = new Date(`${formData.dataFim} ${formData.horaFim}`);

      if (fim <= inicio) {
        newErrors.dataFim = "Data/hora de fim deve ser posterior ao início";
      }
    }

    // Acesso e Ingressos
    if (formData.formaAcesso === "pago" && !formData.custoIngresso) {
      newErrors.custoIngresso =
        "Custo do ingresso é obrigatório para eventos pagos";
    }

    if (formData.formaAcesso === "pago" && formData.custoIngresso) {
      const custo = parseFloat(formData.custoIngresso);
      if (isNaN(custo) || custo <= 0) {
        newErrors.custoIngresso =
          "Custo deve ser um valor válido maior que zero";
      }
    }

    if (formData.linkIngressos && !isValidUrl(formData.linkIngressos)) {
      newErrors.linkIngressos = "URL de ingressos inválida";
    }

    // Detalhes para o Tutor
    if (formData.petFriendly === "sim" && !formData.regrasPets.trim()) {
      newErrors.regrasPets =
        "Regras para pets são obrigatórias para eventos pet-friendly";
    }

    if (
      formData.regrasPets &&
      formData.regrasPets.length > LIMITES.regrasPets
    ) {
      newErrors.regrasPets = `Máximo de ${LIMITES.regrasPets} caracteres`;
    }

    if (
      formData.preRequisitos &&
      formData.preRequisitos.length > LIMITES.preRequisitos
    ) {
      newErrors.preRequisitos = `Máximo de ${LIMITES.preRequisitos} caracteres`;
    }

    // Divulgação
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

  // Validar URL
  const isValidUrl = (string) => {
    if (!string) return true; // URLs opcionais
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
      formData.categoriaEvento &&
      formData.tituloAnuncio.trim() &&
      formData.textoAnuncio.trim() &&
      formData.textoBotao.trim() &&
      formData.linkDestino.trim() &&
      isValidUrl(formData.linkDestino) &&
      formData.local.trim() &&
      formData.dataInicio &&
      formData.horaInicio &&
      formData.dataFim &&
      formData.horaFim &&
      Object.keys(errors).length === 0
    );
  };

  // Formatar data para exibição
  const formatDate = (date, time) => {
    if (!date || !time) return "Não definido";
    const dateObj = new Date(`${date} ${time}`);
    return dateObj.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Renderizar seção
  const renderSection = (sectionKey, title, icon, children) => (
    <div
      className={`${styles.section} ${
        activeSection === sectionKey ? styles.activeSection : ""
      }`}
      onClick={() => setActiveSection(sectionKey)}
    >
      <div className={styles.sectionHeader}>
        <h6 className="mb-0">
          {icon} {title}
        </h6>
        <Badge bg={activeSection === sectionKey ? "primary" : "secondary"}>
          {activeSection === sectionKey ? "Ativo" : "Inativo"}
        </Badge>
      </div>
      {activeSection === sectionKey && (
        <div className={styles.sectionContent}>{children}</div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold text-dark mb-1">
              Criação de Evento Completo
            </h2>
            <p className="text-muted mb-0">
              Configure todos os detalhes do seu evento
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
                {/* Seção: Informações Essenciais */}
                {renderSection(
                  "essenciais",
                  "Informações Essenciais",
                  <FaInfoCircle className="me-2" />,
                  <>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        Nome do Evento *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.nomeEvento}
                        onChange={(e) =>
                          handleInputChange("nomeEvento", e.target.value)
                        }
                        placeholder="Ex: Feira de Adoção - Cães e Gatos"
                        isInvalid={!!errors.nomeEvento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nomeEvento}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        Categoria do Evento *
                      </Form.Label>
                      <Form.Select
                        value={formData.categoriaEvento}
                        onChange={(e) =>
                          handleInputChange("categoriaEvento", e.target.value)
                        }
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
                        placeholder="Ex: Feira de Adoção - Encontre seu Melhor Amigo!"
                        maxLength={LIMITES.tituloAnuncio}
                        isInvalid={!!errors.tituloAnuncio}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.tituloAnuncio}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        Descrição Completa *
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
                        placeholder="Descreva detalhadamente o evento, incluindo atividades, benefícios e informações importantes..."
                        maxLength={LIMITES.textoAnuncio}
                        isInvalid={!!errors.textoAnuncio}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.textoAnuncio}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaUpload className="me-2" />
                        Banner do Evento
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
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer"
                          >
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
                          <small className="text-muted">
                            Fazendo upload...
                          </small>
                        </div>
                      )}

                      {errors.midia && (
                        <Alert variant="danger" className="mt-2 py-2">
                          {errors.midia}
                        </Alert>
                      )}
                    </Form.Group>

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
                        placeholder="Ex: Inscrever-se, Participar, Saiba Mais"
                        maxLength={LIMITES.textoBotao}
                        isInvalid={!!errors.textoBotao}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.textoBotao}
                      </Form.Control.Feedback>
                    </Form.Group>

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
                        placeholder="https://exemplo.com/evento"
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
                  </>
                )}

                {/* Seção: Logística do Evento */}
                {renderSection(
                  "logistica",
                  "Logística do Evento",
                  <FaMapMarkerAlt className="me-2" />,
                  <>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaMapMarkerAlt className="me-2" />
                        Local do Evento *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.local}
                        onChange={(e) =>
                          handleInputChange("local", e.target.value)
                        }
                        placeholder="Ex: Parque da Cidade - Av. Principal, 123"
                        isInvalid={!!errors.local}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.local}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            <FaCalendarAlt className="me-2" />
                            Data de Início *
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={formData.dataInicio}
                            onChange={(e) =>
                              handleInputChange("dataInicio", e.target.value)
                            }
                            isInvalid={!!errors.dataInicio}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.dataInicio}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            Horário de Início *
                          </Form.Label>
                          <Form.Control
                            type="time"
                            value={formData.horaInicio}
                            onChange={(e) =>
                              handleInputChange("horaInicio", e.target.value)
                            }
                            isInvalid={!!errors.horaInicio}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.horaInicio}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            Data de Fim *
                          </Form.Label>
                          <Form.Control
                            type="date"
                            value={formData.dataFim}
                            onChange={(e) =>
                              handleInputChange("dataFim", e.target.value)
                            }
                            isInvalid={!!errors.dataFim}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.dataFim}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            Horário de Fim *
                          </Form.Label>
                          <Form.Control
                            type="time"
                            value={formData.horaFim}
                            onChange={(e) =>
                              handleInputChange("horaFim", e.target.value)
                            }
                            isInvalid={!!errors.horaFim}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.horaFim}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaUsers className="me-2" />
                        Capacidade Máxima (Opcional)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.capacidadeMaxima}
                        onChange={(e) =>
                          handleInputChange("capacidadeMaxima", e.target.value)
                        }
                        placeholder="Ex: 100 pessoas"
                        min="1"
                      />
                      <Form.Text className="text-muted">
                        Deixe em branco se não houver limite
                      </Form.Text>
                    </Form.Group>
                  </>
                )}

                {/* Seção: Acesso e Ingressos */}
                {renderSection(
                  "acesso",
                  "Acesso e Ingressos",
                  <FaTicketAlt className="me-2" />,
                  <>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaTicketAlt className="me-2" />
                        Forma de Acesso *
                      </Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          id="gratuito"
                          name="formaAcesso"
                          value="gratuito"
                          checked={formData.formaAcesso === "gratuito"}
                          onChange={(e) =>
                            handleInputChange("formaAcesso", e.target.value)
                          }
                          label="Gratuito"
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="pago"
                          name="formaAcesso"
                          value="pago"
                          checked={formData.formaAcesso === "pago"}
                          onChange={(e) =>
                            handleInputChange("formaAcesso", e.target.value)
                          }
                          label="Pago"
                        />
                      </div>
                    </Form.Group>

                    {formData.formaAcesso === "pago" && (
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">
                          Custo do Ingresso (R$) *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.custoIngresso}
                          onChange={(e) =>
                            handleInputChange("custoIngresso", e.target.value)
                          }
                          placeholder="0,00"
                          isInvalid={!!errors.custoIngresso}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.custoIngresso}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        Link para Ingressos/Inscrição
                      </Form.Label>
                      <Form.Control
                        type="url"
                        value={formData.linkIngressos}
                        onChange={(e) =>
                          handleInputChange("linkIngressos", e.target.value)
                        }
                        placeholder="https://sympla.com.br/evento"
                        isInvalid={!!errors.linkIngressos}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.linkIngressos}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Link para plataforma externa (Sympla, Eventbrite, etc.)
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        id="forneceCertificado"
                        checked={formData.forneceCertificado}
                        onChange={(e) =>
                          handleInputChange(
                            "forneceCertificado",
                            e.target.checked
                          )
                        }
                        label={
                          <span>
                            <FaCertificate className="me-2" />
                            Fornece Certificado?
                          </span>
                        }
                      />
                    </Form.Group>
                  </>
                )}

                {/* Seção: Detalhes para o Tutor */}
                {renderSection(
                  "tutor",
                  "Detalhes para o Tutor",
                  <FaPaw className="me-2" />,
                  <>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaPaw className="me-2" />
                        Evento é "Pet-Friendly"? *
                      </Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          id="petFriendlySim"
                          name="petFriendly"
                          value="sim"
                          checked={formData.petFriendly === "sim"}
                          onChange={(e) =>
                            handleInputChange("petFriendly", e.target.value)
                          }
                          label="Sim"
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="petFriendlyNao"
                          name="petFriendly"
                          value="nao"
                          checked={formData.petFriendly === "nao"}
                          onChange={(e) =>
                            handleInputChange("petFriendly", e.target.value)
                          }
                          label="Não"
                        />
                      </div>
                    </Form.Group>

                    {formData.petFriendly === "sim" && (
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">
                          Regras para Pets *
                          <span className="text-muted ms-2">
                            ({getCharRemaining("regrasPets")} restantes)
                          </span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={formData.regrasPets}
                          onChange={(e) =>
                            handleInputChange("regrasPets", e.target.value)
                          }
                          placeholder="Ex: Cães devem estar com coleira e guia. Gatos devem estar em caixa de transporte. Necessário carteira de vacinação atualizada."
                          maxLength={LIMITES.regrasPets}
                          isInvalid={!!errors.regrasPets}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.regrasPets}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        Pré-requisitos para Participantes
                        <span className="text-muted ms-2">
                          ({getCharRemaining("preRequisitos")} restantes)
                        </span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.preRequisitos}
                        onChange={(e) =>
                          handleInputChange("preRequisitos", e.target.value)
                        }
                        placeholder="Ex: Necessário levar carteira de vacinação do pet, documento de identificação, etc."
                        maxLength={LIMITES.preRequisitos}
                        isInvalid={!!errors.preRequisitos}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.preRequisitos}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}

                {/* Seção: Divulgação */}
                {renderSection(
                  "divulgacao",
                  "Divulgação",
                  <FaGlobe className="me-2" />,
                  <>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaGlobe className="me-2" />
                        Website do Local/Organizador
                      </Form.Label>
                      <Form.Control
                        type="url"
                        value={formData.websiteLocal}
                        onChange={(e) =>
                          handleInputChange("websiteLocal", e.target.value)
                        }
                        placeholder="https://www.exemplo.com"
                        isInvalid={!!errors.websiteLocal}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.websiteLocal}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaInstagram className="me-2" />
                        Link do Instagram
                      </Form.Label>
                      <Form.Control
                        type="url"
                        value={formData.linkInstagram}
                        onChange={(e) =>
                          handleInputChange("linkInstagram", e.target.value)
                        }
                        placeholder="https://instagram.com/exemplo"
                        isInvalid={!!errors.linkInstagram}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.linkInstagram}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <FaFacebook className="me-2" />
                        Link do Facebook
                      </Form.Label>
                      <Form.Control
                        type="url"
                        value={formData.linkFacebook}
                        onChange={(e) =>
                          handleInputChange("linkFacebook", e.target.value)
                        }
                        placeholder="https://facebook.com/exemplo"
                        isInvalid={!!errors.linkFacebook}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.linkFacebook}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}
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
                Pré-visualização do Evento
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
                        <p className="mb-0">Banner do evento aparecerá aqui</p>
                      </div>
                    </div>
                  )}

                  {/* Conteúdo */}
                  <div className="preview-content">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="preview-title fw-bold mb-0">
                        {formData.tituloAnuncio || "Título do Evento"}
                      </h5>
                      {formData.categoriaEvento && (
                        <Badge bg="primary">{formData.categoriaEvento}</Badge>
                      )}
                    </div>

                    <p className="preview-text text-muted mb-3">
                      {formData.textoAnuncio ||
                        "Descrição do evento aparecerá aqui..."}
                    </p>

                    {/* Informações do Evento */}
                    <div className="preview-event-info mb-3">
                      {formData.local && (
                        <div className="d-flex align-items-center mb-2">
                          <FaMapMarkerAlt className="text-muted me-2" />
                          <small className="text-muted">{formData.local}</small>
                        </div>
                      )}

                      {formData.dataInicio && formData.horaInicio && (
                        <div className="d-flex align-items-center mb-2">
                          <FaCalendarAlt className="text-muted me-2" />
                          <small className="text-muted">
                            {formatDate(
                              formData.dataInicio,
                              formData.horaInicio
                            )}
                          </small>
                        </div>
                      )}

                      {formData.formaAcesso && (
                        <div className="d-flex align-items-center mb-2">
                          <FaTicketAlt className="text-muted me-2" />
                          <small className="text-muted">
                            {formData.formaAcesso === "gratuito"
                              ? "Gratuito"
                              : `R$ ${formData.custoIngresso || "0,00"}`}
                          </small>
                        </div>
                      )}

                      {formData.petFriendly && (
                        <div className="d-flex align-items-center mb-2">
                          <FaPaw className="text-muted me-2" />
                          <small className="text-muted">
                            {formData.petFriendly === "sim"
                              ? "Pet-Friendly"
                              : "Não Pet-Friendly"}
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
