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
  FaDollarSign,
  FaStar,
  FaCheck,
  FaTimes,
  FaImage,
  FaUpload,
  FaBox,
  FaTag,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatusBadge from "../../../components/ui/StatusBadge";
import styles from "./MeusProdutos.module.css";

const MeusProdutos = () => {
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: "Ração Premium para Cães Adultos",
      descricao:
        "Ração de alta qualidade para cães adultos, rica em proteínas e vitaminas essenciais.",
      preco: 89.9,
      marca: "PetFood Premium",
      categoria: "racao",
      status: "ativo",
      destaque: true,
      estoque: 25,
      imagem: "/src/assets/imgs/racao.webp",
      visualizacoes: 234,
      vendas: 12,
      avaliacoes: 4.7,
      totalAvaliacoes: 18,
    },
    {
      id: 2,
      nome: "Shampoo para Cães e Gatos",
      descricao:
        "Shampoo hipoalergênico com pH neutro, ideal para pets com pele sensível.",
      preco: 45.5,
      marca: "PetCare",
      categoria: "higiene",
      status: "ativo",
      destaque: false,
      estoque: 15,
      imagem: "/src/assets/imgs/higiene.jpg",
      visualizacoes: 156,
      vendas: 8,
      avaliacoes: 4.5,
      totalAvaliacoes: 12,
    },
    {
      id: 3,
      nome: "Brinquedo Interativo para Gatos",
      descricao:
        "Brinquedo com laser e penas para estimular o instinto de caça dos gatos.",
      preco: 32.9,
      marca: "PetToys",
      categoria: "brinquedos",
      status: "ativo",
      destaque: true,
      estoque: 8,
      imagem: "/src/assets/imgs/cachorro.png",
      visualizacoes: 98,
      vendas: 5,
      avaliacoes: 4.8,
      totalAvaliacoes: 9,
    },
    {
      id: 4,
      nome: "Coleira Ajustável com Identificação",
      descricao:
        "Coleira de nylon resistente com placa de identificação personalizada.",
      preco: 28.0,
      marca: "PetAccessories",
      categoria: "acessorios",
      status: "inativo",
      destaque: false,
      estoque: 0,
      imagem: "/src/assets/imgs/perdido.png",
      visualizacoes: 67,
      vendas: 3,
      avaliacoes: 4.6,
      totalAvaliacoes: 7,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    marca: "",
    categoria: "",
    status: "ativo",
    destaque: false,
    estoque: "",
    imagem: "",
  });
  const [errors, setErrors] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [message, setMessage] = useState(null);

  const categorias = [
    { value: "racao", label: "Ração" },
    { value: "higiene", label: "Higiene" },
    { value: "brinquedos", label: "Brinquedos" },
    { value: "acessorios", label: "Acessórios" },
    { value: "medicamentos", label: "Medicamentos" },
    { value: "camas", label: "Camas e Casinhas" },
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
      newErrors.nome = "Nome do produto é obrigatório";
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    } else if (formData.descricao.length < 20) {
      newErrors.descricao = "Descrição deve ter pelo menos 20 caracteres";
    }

    if (!formData.preco || formData.preco <= 0) {
      newErrors.preco = "Preço deve ser maior que zero";
    }

    if (!formData.marca.trim()) {
      newErrors.marca = "Marca é obrigatória";
    }

    if (!formData.categoria) {
      newErrors.categoria = "Categoria é obrigatória";
    }

    if (formData.estoque < 0) {
      newErrors.estoque = "Estoque não pode ser negativo";
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

  const openModal = (produto = null) => {
    if (produto) {
      setEditingProduto(produto);
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        marca: produto.marca,
        categoria: produto.categoria,
        status: produto.status,
        destaque: produto.destaque,
        estoque: produto.estoque,
        imagem: produto.imagem,
      });
      setUploadedImage(produto.imagem);
    } else {
      setEditingProduto(null);
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        marca: "",
        categoria: "",
        status: "ativo",
        destaque: false,
        estoque: "",
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
      if (editingProduto) {
        // Editar produto existente
        setProdutos((prev) =>
          prev.map((produto) =>
            produto.id === editingProduto.id
              ? {
                  ...produto,
                  ...formData,
                  imagem: uploadedImage || produto.imagem,
                }
              : produto
          )
        );
        setMessage({
          type: "success",
          text: "Produto atualizado com sucesso!",
        });
      } else {
        // Adicionar novo produto
        const newProduto = {
          id: Date.now(),
          ...formData,
          imagem: uploadedImage || "/src/assets/imgs/placeholder.jpg",
          visualizacoes: 0,
          vendas: 0,
          avaliacoes: 0,
          totalAvaliacoes: 0,
        };
        setProdutos((prev) => [...prev, newProduto]);
        setMessage({
          type: "success",
          text: "Produto adicionado com sucesso!",
        });
      }

      setShowModal(false);
      setEditingProduto(null);
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        marca: "",
        categoria: "",
        status: "ativo",
        destaque: false,
        estoque: "",
        imagem: "",
      });
      setUploadedImage(null);
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Erro ao salvar produto. Tente novamente.",
      });
    }
  };

  const deleteProduto = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos((prev) => prev.filter((produto) => produto.id !== id));
      setMessage({
        type: "success",
        text: "Produto excluído com sucesso!",
      });
    }
  };

  const toggleStatus = (id) => {
    setProdutos((prev) =>
      prev.map((produto) =>
        produto.id === id
          ? {
              ...produto,
              status: produto.status === "ativo" ? "inativo" : "ativo",
            }
          : produto
      )
    );
  };

  const toggleDestaque = (id) => {
    setProdutos((prev) =>
      prev.map((produto) =>
        produto.id === id
          ? { ...produto, destaque: !produto.destaque }
          : produto
      )
    );
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);
  };

  const getEstoqueStatus = (estoque) => {
    if (estoque === 0) return { color: "danger", text: "Sem Estoque" };
    if (estoque <= 5) return { color: "warning", text: "Estoque Baixo" };
    return { color: "success", text: "Em Estoque" };
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
            <h1 className="fw-bold text-dark mb-1">Meus Produtos</h1>
            <p className="text-muted mb-0">
              Gerencie o catálogo de produtos do seu negócio
            </p>
          </div>
          <Button variant="primary" onClick={() => openModal()}>
            <FaPlus className="me-2" />
            Adicionar Produto
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
                <h3 className="fw-bold text-primary">{produtos.length}</h3>
                <small className="text-muted">Total de Produtos</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-success">
                  {produtos.filter((p) => p.status === "ativo").length}
                </h3>
                <small className="text-muted">Produtos Ativos</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-warning">
                  {produtos.filter((p) => p.destaque).length}
                </h3>
                <small className="text-muted">Em Destaque</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <h3 className="fw-bold text-info">
                  {produtos.reduce((sum, p) => sum + p.vendas, 0)}
                </h3>
                <small className="text-muted">Vendas Totais</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabela de Produtos */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-0">
            <h5 className="mb-0">Lista de Produtos</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Produto</th>
                    <th>Marca</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Status</th>
                    <th>Vendas</th>
                    <th>Avaliação</th>
                    <th width="100">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => {
                    const estoqueStatus = getEstoqueStatus(produto.estoque);

                    return (
                      <tr key={produto.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className={styles.productImage}>
                              <Image
                                src={produto.imagem}
                                alt={produto.nome}
                                className="rounded"
                                onError={(e) => {
                                  e.target.src =
                                    "/src/assets/imgs/placeholder.jpg";
                                }}
                              />
                            </div>
                            <div className="ms-3">
                              <div className="fw-semibold">{produto.nome}</div>
                              <small className="text-muted">
                                {produto.descricao.substring(0, 50)}...
                              </small>
                              {produto.destaque && (
                                <Badge bg="warning" className="ms-2">
                                  Destaque
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">{produto.marca}</span>
                        </td>
                        <td>
                          <span className="text-muted">
                            {
                              categorias.find(
                                (c) => c.value === produto.categoria
                              )?.label
                            }
                          </span>
                        </td>
                        <td>
                          <span className="fw-medium">
                            {formatarPreco(produto.preco)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="fw-medium me-2">
                              {produto.estoque}
                            </span>
                            <Badge bg={estoqueStatus.color} size="sm">
                              {estoqueStatus.text}
                            </Badge>
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={produto.status} />
                        </td>
                        <td>
                          <span className="fw-medium">{produto.vendas}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaStar className="text-warning me-1" size={12} />
                            <span className="fw-medium">
                              {produto.avaliacoes}
                            </span>
                            <small className="text-muted ms-1">
                              ({produto.totalAvaliacoes})
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
                              <Dropdown.Item onClick={() => openModal(produto)}>
                                <FaEdit className="me-2" />
                                Editar
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => toggleStatus(produto.id)}
                              >
                                {produto.status === "ativo" ? (
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
                                onClick={() => toggleDestaque(produto.id)}
                              >
                                {produto.destaque ? (
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
                                onClick={() => deleteProduto(produto.id)}
                                className="text-danger"
                              >
                                <FaTrash className="me-2" />
                                Excluir
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Modal para Adicionar/Editar Produto */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingProduto ? "Editar Produto" : "Adicionar Novo Produto"}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome do Produto *</Form.Label>
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
                      placeholder="Descreva detalhadamente o produto..."
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
                          <FaBox className="me-2" />
                          Estoque *
                        </Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={formData.estoque}
                          onChange={(e) =>
                            handleInputChange(
                              "estoque",
                              parseInt(e.target.value)
                            )
                          }
                          isInvalid={!!errors.estoque}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.estoque}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FaTag className="me-2" />
                          Marca *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.marca}
                          onChange={(e) =>
                            handleInputChange("marca", e.target.value)
                          }
                          isInvalid={!!errors.marca}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.marca}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
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
                  </Row>

                  <Row>
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
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>&nbsp;</Form.Label>
                        <div className="pt-2">
                          <Form.Check
                            type="checkbox"
                            id="destaque"
                            label="Destacar este produto"
                            checked={formData.destaque}
                            onChange={(e) =>
                              handleInputChange("destaque", e.target.checked)
                            }
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaImage className="me-2" />
                      Imagem do Produto
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
                {editingProduto ? "Atualizar Produto" : "Adicionar Produto"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MeusProdutos;
