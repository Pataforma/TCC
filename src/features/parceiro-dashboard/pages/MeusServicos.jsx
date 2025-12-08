import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Badge,
  Alert,
  Dropdown,
  Image,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEllipsisV,
  FaClock,
  FaDollarSign,
  FaStar,
  FaCheck,
  FaTimes,
  FaImage,
  FaUpload,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatusBadge from "../../../components/ui/StatusBadge";
import styles from "./MeusServicos.module.css";

const MeusServicos = () => {
  const [servicos, setServicos] = useState([
    {
      id: 1,
      nome: "Banho e Tosa Completo",
      descricao:
        "Banho, tosa higiênica, corte das unhas e limpeza dos ouvidos. Inclui hidratação e perfume.",
      preco: 80.0,
      duracao: 120, // em minutos
      categoria: "banho_tosa",
      status: "ativo",
      destaque: true,
      imagem: "/src/assets/imgs/adestramento.webp",
      visualizacoes: 156,
      avaliacoes: 4.8,
      totalAvaliacoes: 23,
    },
    {
      id: 2,
      nome: "Consulta Veterinária",
      descricao:
        "Consulta com veterinário especializado. Exame físico completo e orientações sobre saúde do pet.",
      preco: 120.0,
      duracao: 60,
      categoria: "consulta",
      status: "ativo",
      destaque: false,
      imagem: "/src/assets/imgs/vacina.webp",
      visualizacoes: 89,
      avaliacoes: 4.9,
      totalAvaliacoes: 15,
    },
    {
      id: 3,
      nome: "Vacinação",
      descricao:
        "Aplicação de vacinas essenciais (V10, Antirrábica, etc.) com acompanhamento veterinário.",
      preco: 45.0,
      duracao: 30,
      categoria: "vacina",
      status: "ativo",
      destaque: true,
      imagem: "/src/assets/imgs/vacina.jpg",
      visualizacoes: 67,
      avaliacoes: 4.7,
      totalAvaliacoes: 12,
    },
    {
      id: 4,
      nome: "Hospedagem Diária",
      descricao:
        "Hospedagem para cães e gatos com alimentação, passeios e cuidados básicos incluídos.",
      preco: 60.0,
      duracao: 1440, // 24 horas
      categoria: "hospedagem",
      status: "inativo",
      destaque: false,
      imagem: "/src/assets/imgs/cachorro.png",
      visualizacoes: 34,
      avaliacoes: 4.6,
      totalAvaliacoes: 8,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingServico, setEditingServico] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    duracao: "",
    categoria: "",
    status: "ativo",
    destaque: false,
    imagem: "",
  });
  const [errors, setErrors] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState(null);

  const categorias = [
    { value: "banho_tosa", label: "Banho e Tosa" },
    { value: "consulta", label: "Consulta Veterinária" },
    { value: "vacina", label: "Vacinação" },
    { value: "hospedagem", label: "Hospedagem" },
    { value: "adestramento", label: "Adestramento" },
    { value: "pet_sitter", label: "Pet Sitter" },
    { value: "fotografia", label: "Fotografia Pet" },
    { value: "outro", label: "Outro" },
  ];

  const statusOptions = [
    { value: "ativo", label: "Ativo", color: "success" },
    { value: "inativo", label: "Inativo", color: "secondary" },
    { value: "rascunho", label: "Rascunho", color: "warning" },
  ];

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome do serviço é obrigatório";
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    } else if (formData.descricao.length < 20) {
      newErrors.descricao = "Descrição deve ter pelo menos 20 caracteres";
    }

    if (!formData.preco || formData.preco <= 0) {
      newErrors.preco = "Preço deve ser maior que zero";
    }

    if (!formData.duracao || formData.duracao <= 0) {
      newErrors.duracao = "Duração deve ser maior que zero";
    }

    if (!formData.categoria) {
      newErrors.categoria = "Categoria é obrigatória";
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setFormData((prev) => ({
          ...prev,
          imagem: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (servico = null) => {
    if (servico) {
      setEditingServico(servico);
      setFormData({
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco,
        duracao: servico.duracao,
        categoria: servico.categoria,
        status: servico.status,
        destaque: servico.destaque,
        imagem: servico.imagem,
      });
      setUploadedImage(servico.imagem);
    } else {
      setEditingServico(null);
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        duracao: "",
        categoria: "",
        status: "ativo",
        destaque: false,
        imagem: "",
      });
      setUploadedImage(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      if (editingServico) {
        // Editar serviço existente
        setServicos((prev) =>
          prev.map((servico) =>
            servico.id === editingServico.id
              ? {
                  ...servico,
                  ...formData,
                  imagem: uploadedImage || servico.imagem,
                }
              : servico
          )
        );
        setMessage({
          type: "success",
          text: "Serviço atualizado com sucesso!",
        });
      } else {
        // Adicionar novo serviço
        const newServico = {
          id: Date.now(),
          ...formData,
          imagem: uploadedImage || "/src/assets/imgs/placeholder.jpg",
          visualizacoes: 0,
          avaliacoes: 0,
          totalAvaliacoes: 0,
        };
        setServicos((prev) => [...prev, newServico]);
        setMessage({
          type: "success",
          text: "Serviço adicionado com sucesso!",
        });
      }

      setShowModal(false);
      setEditingServico(null);
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        duracao: "",
        categoria: "",
        status: "ativo",
        destaque: false,
        imagem: "",
      });
      setUploadedImage(null);
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Erro ao salvar serviço. Tente novamente.",
      });
    }
  };

  const deleteServico = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      setServicos((prev) => prev.filter((servico) => servico.id !== id));
      setMessage({
        type: "success",
        text: "Serviço excluído com sucesso!",
      });
    }
  };

  const toggleStatus = (id) => {
    setServicos((prev) =>
      prev.map((servico) =>
        servico.id === id
          ? {
              ...servico,
              status: servico.status === "ativo" ? "inativo" : "ativo",
            }
          : servico
      )
    );
  };

  const toggleDestaque = (id) => {
    setServicos((prev) =>
      prev.map((servico) =>
        servico.id === id
          ? { ...servico, destaque: !servico.destaque }
          : servico
      )
    );
  };

  const formatarDuracao = (minutos) => {
    if (minutos < 60) {
      return `${minutos} min`;
    } else if (minutos < 1440) {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
    } else {
      const dias = Math.floor(minutos / 1440);
      return `${dias} dia${dias > 1 ? "s" : ""}`;
    }
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);
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
            <h1 className="fw-bold text-dark mb-1">Meus Serviços</h1>
            <p className="text-muted mb-0">
              Gerencie o catálogo de serviços oferecidos pelo seu negócio
            </p>
          </div>
          <Button variant="primary" onClick={() => openModal()}>
            <FaPlus className="me-2" />
            Adicionar Serviço
          </Button>
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

        {/* Estatísticas Rápidas */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-primary">{servicos.length}</h3>
                <small className="text-muted">Total de Serviços</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-success">
                  {servicos.filter((s) => s.status === "ativo").length}
                </h3>
                <small className="text-muted">Serviços Ativos</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-warning">
                  {servicos.filter((s) => s.destaque).length}
                </h3>
                <small className="text-muted">Em Destaque</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-info">
                  {servicos
                    .reduce((sum, s) => sum + s.visualizacoes, 0)
                    .toLocaleString()}
                </h3>
                <small className="text-muted">Visualizações Totais</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabela de Serviços */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-0">
            <h5 className="mb-0">Lista de Serviços</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Serviço</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Duração</th>
                    <th>Status</th>
                    <th>Visualizações</th>
                    <th>Avaliação</th>
                    <th width="100">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {servicos.map((servico) => (
                    <tr key={servico.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className={styles.serviceImage}>
                            <Image
                              src={servico.imagem}
                              alt={servico.nome}
                              className="rounded"
                              onError={(e) => {
                                e.target.src =
                                  "/src/assets/imgs/placeholder.jpg";
                              }}
                            />
                          </div>
                          <div className="ms-3">
                            <div className="fw-semibold">{servico.nome}</div>
                            <small className="text-muted">
                              {servico.descricao.substring(0, 50)}...
                            </small>
                            {servico.destaque && (
                              <Badge bg="warning" className="ms-2">
                                Destaque
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted">
                          {
                            categorias.find(
                              (c) => c.value === servico.categoria
                            )?.label
                          }
                        </span>
                      </td>
                      <td>
                        <span className="fw-medium">
                          {formatarPreco(servico.preco)}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted">
                          {formatarDuracao(servico.duracao)}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={servico.status} />
                      </td>
                      <td>
                        <span className="fw-medium">
                          {servico.visualizacoes.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaStar className="text-warning me-1" size={12} />
                          <span className="fw-medium">
                            {servico.avaliacoes}
                          </span>
                          <small className="text-muted ms-1">
                            ({servico.totalAvaliacoes})
                          </small>
                        </div>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            size="sm"
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => openModal(servico)}>
                              <FaEdit className="me-2" />
                              Editar
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => toggleStatus(servico.id)}
                            >
                              {servico.status === "ativo" ? (
                                <>
                                  <FaTimes className="me-2" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <FaCheck className="me-2" />
                                  Ativar
                                </>
                              )}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => toggleDestaque(servico.id)}
                            >
                              {servico.destaque ? (
                                <>
                                  <FaTimes className="me-2" />
                                  Remover Destaque
                                </>
                              ) : (
                                <>
                                  <FaStar className="me-2" />
                                  Destacar
                                </>
                              )}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() => deleteServico(servico.id)}
                              className="text-danger"
                            >
                              <FaTrash className="me-2" />
                              Excluir
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Modal para Adicionar/Editar Serviço */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingServico ? "Editar Serviço" : "Adicionar Novo Serviço"}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome do Serviço *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.nome}
                      onChange={(e) =>
                        handleInputChange("nome", e.target.value)
                      }
                      isInvalid={!!errors.nome}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nome}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Descrição *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={formData.descricao}
                      onChange={(e) =>
                        handleInputChange("descricao", e.target.value)
                      }
                      isInvalid={!!errors.descricao}
                      placeholder="Descreva detalhadamente o serviço oferecido..."
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.descricao}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaDollarSign className="me-2" />
                          Preço (R$) *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.preco}
                          onChange={(e) =>
                            handleInputChange(
                              "preco",
                              parseFloat(e.target.value)
                            )
                          }
                          isInvalid={!!errors.preco}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.preco}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaClock className="me-2" />
                          Duração (minutos) *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={formData.duracao}
                          onChange={(e) =>
                            handleInputChange(
                              "duracao",
                              parseInt(e.target.value)
                            )
                          }
                          isInvalid={!!errors.duracao}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.duracao}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Categoria *</Form.Label>
                        <Form.Select
                          value={formData.categoria}
                          onChange={(e) =>
                            handleInputChange("categoria", e.target.value)
                          }
                          isInvalid={!!errors.categoria}
                        >
                          <option value="">Selecione uma categoria</option>
                          {categorias.map((categoria) => (
                            <option
                              key={categoria.value}
                              value={categoria.value}
                            >
                              {categoria.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.categoria}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={formData.status}
                          onChange={(e) =>
                            handleInputChange("status", e.target.value)
                          }
                        >
                          {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="destaque"
                      label="Destacar este serviço"
                      checked={formData.destaque}
                      onChange={(e) =>
                        handleInputChange("destaque", e.target.checked)
                      }
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaImage className="me-2" />
                      Imagem do Serviço
                    </Form.Label>
                    <div className={styles.imageUploadArea}>
                      {uploadedImage ? (
                        <div className={styles.imagePreview}>
                          <Image
                            src={uploadedImage}
                            alt="Preview"
                            className="w-100 rounded"
                          />
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className={styles.removeImage}
                            onClick={() => {
                              setUploadedImage(null);
                              setFormData((prev) => ({ ...prev, imagem: "" }));
                            }}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      ) : (
                        <div className={styles.uploadPlaceholder}>
                          <FaUpload size={32} className="text-muted mb-2" />
                          <p className="text-muted mb-2">
                            Clique para selecionar uma imagem
                          </p>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="d-none"
                            id="imageUpload"
                          />
                          <Form.Label
                            htmlFor="imageUpload"
                            className="btn btn-outline-primary btn-sm"
                          >
                            Selecionar Imagem
                          </Form.Label>
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={Object.keys(errors).length > 0}
              >
                {editingServico ? "Atualizar Serviço" : "Adicionar Serviço"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MeusServicos;
