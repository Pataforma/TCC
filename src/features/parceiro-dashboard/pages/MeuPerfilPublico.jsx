import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Badge,
  Image,
  Modal,
  Dropdown,
} from "react-bootstrap";
import {
  FaEdit,
  FaSave,
  FaEye,
  FaCamera,
  FaTrash,
  FaPlus,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaStar,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import styles from "./MeuPerfilPublico.module.css";

const MeuPerfilPublico = () => {
  const [perfilData, setPerfilData] = useState({
    // Informações Básicas
    nomeNegocio: "Pet Shop Patinhas Felizes",
    categoriaServico: "pet_shop",
    descricao:
      "Pet shop especializado em banho e tosa, com mais de 10 anos de experiência no mercado. Atendemos cães e gatos com carinho e profissionalismo.",
    endereco: "Rua das Flores, 123 - Centro, Feira de Santana - BA",
    telefone: "(75) 99999-9999",
    email: "contato@patinhasfelizes.com",
    website: "https://www.patinhasfelizes.com",

    // Horário de Funcionamento
    horarioFuncionamento: "Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h",

    // Redes Sociais
    redesSociais: {
      instagram: "@patinhasfelizes",
      facebook: "Pet Shop Patinhas Felizes",
      whatsapp: "(75) 99999-9999",
    },

    // Galeria de Fotos
    fotos: [
      {
        id: 1,
        url: "/src/assets/imgs/petadocao1.jpg",
        descricao: "Fachada do Pet Shop",
        principal: true,
      },
      {
        id: 2,
        url: "/src/assets/imgs/adestramento.webp",
        descricao: "Sala de Banho e Tosa",
        principal: false,
      },
      {
        id: 3,
        url: "/src/assets/imgs/racao.webp",
        descricao: "Área de Produtos",
        principal: false,
      },
    ],

    // Informações Adicionais
    certificacoes:
      "Registro no CRMV, Alvará de Funcionamento, Certificação de Qualidade",
    experiencia:
      "Mais de 10 anos de experiência no mercado pet, especializados em banho e tosa para cães e gatos.",
    formasPagamento: ["pix", "cartao_credito", "cartao_debito", "dinheiro"],
    raioAtendimento: "10km",
    aceitaEmergencias: true,
    atendeFinaisSemana: true,
    atendeFeriados: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const categoriasServico = [
    { value: "pet_shop", label: "Pet Shop" },
    { value: "banho_tosa", label: "Banho e Tosa" },
    { value: "hotel_creche", label: "Hotel e Creche" },
    { value: "adestramento", label: "Adestramento" },
    { value: "pet_sitter", label: "Pet Sitter" },
    { value: "fotografia_pet", label: "Fotografia Pet" },
    { value: "outro", label: "Outro" },
  ];

  const formasPagamentoOptions = [
    { value: "dinheiro", label: "Dinheiro" },
    { value: "pix", label: "PIX" },
    { value: "cartao_credito", label: "Cartão de Crédito" },
    { value: "cartao_debito", label: "Cartão de Débito" },
    { value: "transferencia", label: "Transferência Bancária" },
    { value: "boleto", label: "Boleto" },
  ];

  const handleInputChange = (field, value) => {
    setPerfilData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRedesSociaisChange = (rede, value) => {
    setPerfilData((prev) => ({
      ...prev,
      redesSociais: {
        ...prev.redesSociais,
        [rede]: value,
      },
    }));
  };

  const handleFormasPagamentoChange = (forma) => {
    setPerfilData((prev) => ({
      ...prev,
      formasPagamento: prev.formasPagamento.includes(forma)
        ? prev.formasPagamento.filter((f) => f !== forma)
        : [...prev.formasPagamento, forma],
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          url: e.target.result,
          descricao: "",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addImage = () => {
    if (uploadedImage) {
      const newImage = {
        id: Date.now(),
        url: uploadedImage.url,
        descricao: uploadedImage.descricao,
        principal: perfilData.fotos.length === 0,
      };

      setPerfilData((prev) => ({
        ...prev,
        fotos: [...prev.fotos, newImage],
      }));

      setUploadedImage(null);
      setShowImageModal(false);
    }
  };

  const removeImage = (imageId) => {
    setPerfilData((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((foto) => foto.id !== imageId),
    }));
  };

  const setMainImage = (imageId) => {
    setPerfilData((prev) => ({
      ...prev,
      fotos: prev.fotos.map((foto) => ({
        ...foto,
        principal: foto.id === imageId,
      })),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setMessage({
        type: "success",
        text: "Perfil atualizado com sucesso!",
      });

      setEditMode(false);
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Erro ao salvar perfil. Tente novamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  const previewPerfil = () => {
    window.open("/perfil-publico/parceiro", "_blank");
  };

  return (
    <DashboardLayout
      tipoUsuario="parceiro"
      nomeUsuario="Pet Shop Patinhas Felizes"
    >
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-dark mb-1">Meu Perfil Público</h1>
            <p className="text-muted mb-0">
              Gerencie as informações que aparecem na sua vitrine pública
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={previewPerfil}>
              <FaEye className="me-2" />
              Visualizar Perfil
            </Button>
            {!editMode ? (
              <Button variant="primary" onClick={() => setEditMode(true)}>
                <FaEdit className="me-2" />
                Editar Perfil
              </Button>
            ) : (
              <Button variant="success" onClick={handleSave} disabled={saving}>
                <FaSave className="me-2" />
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            )}
          </div>
        </div>

        {message && (
          <Alert
            variant={message.type}
            dismissible
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        <Row>
          {/* Informações Básicas */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Informações Básicas</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome do Negócio *</Form.Label>
                      <Form.Control
                        type="text"
                        value={perfilData.nomeNegocio}
                        onChange={(e) =>
                          handleInputChange("nomeNegocio", e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Categoria Principal *</Form.Label>
                      <Form.Select
                        value={perfilData.categoriaServico}
                        onChange={(e) =>
                          handleInputChange("categoriaServico", e.target.value)
                        }
                        disabled={!editMode}
                      >
                        {categoriasServico.map((categoria) => (
                          <option key={categoria.value} value={categoria.value}>
                            {categoria.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição do Negócio *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={perfilData.descricao}
                    onChange={(e) =>
                      handleInputChange("descricao", e.target.value)
                    }
                    disabled={!editMode}
                    placeholder="Conte-nos sobre seu negócio, especialidades e diferenciais..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaMapMarkerAlt className="me-2" />
                    Endereço *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={perfilData.endereco}
                    onChange={(e) =>
                      handleInputChange("endereco", e.target.value)
                    }
                    disabled={!editMode}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaPhone className="me-2" />
                        Telefone *
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        value={perfilData.telefone}
                        onChange={(e) =>
                          handleInputChange("telefone", e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FaEnvelope className="me-2" />
                        Email *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        value={perfilData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaGlobe className="me-2" />
                    Website
                  </Form.Label>
                  <Form.Control
                    type="url"
                    value={perfilData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    disabled={!editMode}
                    placeholder="https://www.seudonegocio.com"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Galeria de Fotos */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Galeria de Fotos</h5>
                  {editMode && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowImageModal(true)}
                    >
                      <FaPlus className="me-2" />
                      Adicionar Foto
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  {perfilData.fotos.map((foto) => (
                    <Col md={4} key={foto.id} className="mb-3">
                      <div className={styles.imageCard}>
                        <Image
                          src={foto.url}
                          alt={foto.descricao}
                          className={styles.galleryImage}
                          onError={(e) => {
                            e.target.src = "/src/assets/imgs/placeholder.jpg";
                          }}
                        />
                        {foto.principal && (
                          <Badge bg="primary" className={styles.mainBadge}>
                            Principal
                          </Badge>
                        )}
                        <div className={styles.imageOverlay}>
                          <p className={styles.imageDescription}>
                            {foto.descricao}
                          </p>
                          {editMode && (
                            <div className={styles.imageActions}>
                              {!foto.principal && (
                                <Button
                                  variant="outline-light"
                                  size="sm"
                                  onClick={() => setMainImage(foto.id)}
                                >
                                  Definir Principal
                                </Button>
                              )}
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeImage(foto.id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
                {perfilData.fotos.length === 0 && (
                  <div className="text-center py-4">
                    <FaCamera size={48} className="text-muted mb-3" />
                    <p className="text-muted">Nenhuma foto adicionada</p>
                    {editMode && (
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowImageModal(true)}
                      >
                        <FaPlus className="me-2" />
                        Adicionar Primeira Foto
                      </Button>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Horário de Funcionamento */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">
                  <FaClock className="me-2" />
                  Horário de Funcionamento
                </h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={perfilData.horarioFuncionamento}
                    onChange={(e) =>
                      handleInputChange("horarioFuncionamento", e.target.value)
                    }
                    disabled={!editMode}
                    placeholder="Ex: Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Redes Sociais */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Redes Sociais</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaInstagram className="me-2" />
                    Instagram
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={perfilData.redesSociais.instagram}
                    onChange={(e) =>
                      handleRedesSociaisChange("instagram", e.target.value)
                    }
                    disabled={!editMode}
                    placeholder="@seudonegocio"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaFacebook className="me-2" />
                    Facebook
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={perfilData.redesSociais.facebook}
                    onChange={(e) =>
                      handleRedesSociaisChange("facebook", e.target.value)
                    }
                    disabled={!editMode}
                    placeholder="Nome da página"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaWhatsapp className="me-2" />
                    WhatsApp
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={perfilData.redesSociais.whatsapp}
                    onChange={(e) =>
                      handleRedesSociaisChange("whatsapp", e.target.value)
                    }
                    disabled={!editMode}
                    placeholder="(11) 99999-9999"
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Informações Adicionais */}
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Informações Adicionais</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Certificações</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={perfilData.certificacoes}
                    onChange={(e) =>
                      handleInputChange("certificacoes", e.target.value)
                    }
                    disabled={!editMode}
                    placeholder="Liste suas certificações e registros..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Experiência no Mercado</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={perfilData.experiencia}
                    onChange={(e) =>
                      handleInputChange("experiencia", e.target.value)
                    }
                    disabled={!editMode}
                    placeholder="Conte sobre sua experiência..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Formas de Pagamento</Form.Label>
                  <div className="row">
                    {formasPagamentoOptions.map((forma) => (
                      <Col md={6} key={forma.value}>
                        <Form.Check
                          type="checkbox"
                          id={forma.value}
                          label={forma.label}
                          checked={perfilData.formasPagamento.includes(
                            forma.value
                          )}
                          onChange={() =>
                            handleFormasPagamentoChange(forma.value)
                          }
                          disabled={!editMode}
                        />
                      </Col>
                    ))}
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal para Adicionar Foto */}
        <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Foto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Selecionar Imagem</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Form.Group>
            {uploadedImage && (
              <Form.Group className="mb-3">
                <Form.Label>Descrição da Foto</Form.Label>
                <Form.Control
                  type="text"
                  value={uploadedImage.descricao}
                  onChange={(e) =>
                    setUploadedImage((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }
                  placeholder="Ex: Fachada do estabelecimento"
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowImageModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={addImage}
              disabled={!uploadedImage}
            >
              Adicionar Foto
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MeuPerfilPublico;
