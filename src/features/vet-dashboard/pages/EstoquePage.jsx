import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Badge,
  Alert,
  InputGroup,
  Dropdown,
  Pagination,
  ProgressBar,
  Nav,
  Tab,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaBox,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHistory,
  FaDownload,
  FaUpload,
  FaFilter,
  FaSort,
  FaEye,
  FaCalendarAlt,
  FaMoneyBill,
  FaPercentage,
  FaWarehouse,
  FaChartBar,
  FaTimes,
  FaPills,
  FaSyringe,
  FaStethoscope,
  FaBone,
  FaSoap,
  FaDog,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";
import { api } from "../../../utils/api";

const EstoquePage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [activeTab, setActiveTab] = useState("detalhes");

  // Sistema de modais empilhados
  const [modalStack, setModalStack] = useState([]);
  const sidebarRef = useRef(null);

  // Estado para novo produto
  const [newProduct, setNewProduct] = useState({
    produto: "",
    categoria: "",
    descricao: "",
    precoCusto: "",
    precoVenda: "",
    margemLucro: "",
    estoqueMinimo: "",
    unidade: "",
    fornecedor: "",
    codigoBarras: "",
    lote: {
      numero: "",
      validade: "",
      quantidade: "",
      precoCusto: "",
    },
  });

  // Produtos vindos do banco
  const [produtos, setProdutos] = useState([]);

  // Estado para produtos com estoque baixo
  const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState([]);

  // Categorias disponíveis - baseadas no enum do banco
  const categorias = [
    "medicamentos",
    "vacinas",
    "antibioticos",
    "material_medico",
    "alimentacao",
    "higiene",
    "acessorios",
  ];

  // Labels amigáveis para as categorias
  const categoriasLabels = {
    medicamentos: "Medicamentos",
    vacinas: "Vacinas",
    antibioticos: "Antibióticos",
    material_medico: "Material Médico",
    alimentacao: "Alimentação (Ração)",
    higiene: "Higiene & Limpeza",
    acessorios: "Acessórios & Brinquedos",
  };

  // Categorias que precisam de controle de lote
  const categoriasComLote = [
    "medicamentos",
    "vacinas",
    "antibioticos",
    "alimentacao", // Ração também pode ter lote/validade
  ];

  // Função para verificar se categoria precisa de lote
  const precisaLote = (categoria) => categoriasComLote.includes(categoria);

  // Funções de filtro e busca
  const filteredProducts = produtos.filter((product) => {
    const matchesSearch =
      product.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.descricao &&
        product.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.codigoBarras && product.codigoBarras.includes(searchTerm));

    const matchesCategory =
      filterCategory === "" || product.categoria === filterCategory;
    const matchesStatus =
      filterStatus === "" || product.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Ícones por categoria
  const getCategoryIcon = (categoria) => {
    const icons = {
      medicamentos: FaPills,
      vacinas: FaSyringe,
      antibioticos: FaPills,
      material_medico: FaStethoscope,
      alimentacao: FaBone,
      higiene: FaSoap,
      acessorios: FaDog,
    };
    const Icon = icons[categoria] || FaBox;
    return <Icon size={16} />;
  };

  // Funções de cálculo de preços
  const calcularMargemLucro = (precoCusto, precoVenda) => {
    const custo = parseFloat(precoCusto) || 0;
    const venda = parseFloat(precoVenda) || 0;
    return custo > 0 ? ((venda - custo) / custo) * 100 : 0;
  };

  const calcularPrecoVenda = (precoCusto, margemLucro) => {
    const custo = parseFloat(precoCusto) || 0;
    const margem = parseFloat(margemLucro) || 0;
    return custo > 0 ? custo + custo * (margem / 100) : 0;
  };

  const calcularPrecoCusto = (precoVenda, margemLucro) => {
    const venda = parseFloat(precoVenda) || 0;
    const margem = parseFloat(margemLucro) || 0;
    return margem > 0 ? venda / (1 + margem / 100) : 0;
  };

  // Funções de manipulação de campos
  const handlePrecoCustoChange = (valor) => {
    const precoCusto = valor;
    const precoVenda = newProduct.precoVenda;
    const margemLucro = calcularMargemLucro(precoCusto, precoVenda);

    setNewProduct({
      ...newProduct,
      precoCusto,
      margemLucro: margemLucro.toFixed(1),
    });
  };

  const handlePrecoVendaChange = (valor) => {
    const precoVenda = valor;
    const precoCusto = newProduct.precoCusto;
    const margemLucro = calcularMargemLucro(precoCusto, precoVenda);

    setNewProduct({
      ...newProduct,
      precoVenda,
      margemLucro: margemLucro.toFixed(1),
    });
  };

  const handleMargemLucroChange = (valor) => {
    const margemLucro = valor;
    const precoCusto = newProduct.precoCusto;

    if (precoCusto) {
      const precoVenda = calcularPrecoVenda(precoCusto, margemLucro);
      setNewProduct({
        ...newProduct,
        margemLucro,
        precoVenda: precoVenda.toFixed(2),
      });
    } else {
      setNewProduct({
        ...newProduct,
        margemLucro,
      });
    }
  };

  // Função para limpar campos de lote quando categoria muda
  const handleCategoriaChange = (novaCategoria) => {
    const novoProduct = {
      ...newProduct,
      categoria: novaCategoria,
    };

    // Se a nova categoria não precisa de lote, limpar os campos
    if (!precisaLote(novaCategoria)) {
      novoProduct.lote = {
        numero: "",
        validade: "",
        quantidade: "",
        precoCusto: "",
      };
    }

    setNewProduct(novoProduct);
  };

  // Função para resetar formulário
  const resetNewProduct = () => {
    setNewProduct({
      produto: "",
      categoria: "",
      descricao: "",
      precoCusto: "",
      precoVenda: "",
      margemLucro: "",
      estoqueMinimo: "",
      unidade: "",
      fornecedor: "",
      codigoBarras: "",
      lote: {
        numero: "",
        validade: "",
        quantidade: "",
        precoCusto: "",
      },
    });
  };

  // Funções para gerenciar sidebar
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setSelectedProduct(null);
    setActiveTab("detalhes");
    setModalStack([]);
  };

  // Funções para gerenciar modais empilhados
  const openModal = (type, data = {}) => {
    setModalStack((prev) => {
      // Verificar se já existe um modal do mesmo tipo aberto
      const existingModal = prev.find(modal => modal.type === type);
      if (existingModal) {
        return prev;
      }
      // Limitar a 3 modais empilhados
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, { type, data, id: Date.now() }];
    });
  };

  const closeModal = () => {
    setModalStack((prev) => prev.slice(0, -1));
  };

  // Funções de manipulação
  const handleAddProduct = () => {
    resetNewProduct();
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditProduct({ ...product });
    openModal("editar", { produto: product });
  };

  const handleViewHistory = (product) => {
    setSelectedProduct(product);
    openModal("historico", { produto: product });
  };

  // Fechar sidebar ao clicar no overlay
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (modalStack.length === 0) {
          closeSidebar();
        }
      }
    };

    if (showSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showSidebar, modalStack.length]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.delete(`/produtos/${productId}`);
      // Recarregar produtos para atualizar alertas
      await recarregarProdutos();
    } catch (error) {
      alert("Erro ao excluir produto: " + error.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "disponivel":
        return <Badge bg="success">Disponível</Badge>;
      case "baixo":
        return <Badge bg="warning">Baixo Estoque</Badge>;
      case "esgotado":
        return <Badge bg="danger">Esgotado</Badge>;
      default:
        return <Badge bg="secondary">Indefinido</Badge>;
    }
  };

  const getStockProgress = (atual, minimo) => {
    const percentage = (atual / minimo) * 100;
    if (percentage >= 100) return { variant: "success", percentage: 100 };
    if (percentage >= 50) return { variant: "warning", percentage: percentage };
    return { variant: "danger", percentage: percentage };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const { user } = useUser();

  // Função para recarregar produtos e atualizar alertas
  const recarregarProdutos = async () => {
    try {
      console.log("🔄 Recarregando produtos...");

      if (!user) {
        console.log("❌ recarregarProdutos - Usuário não encontrado");
        return;
      }

      console.log(
        "🔍 recarregarProdutos - Buscando veterinário para usuário:",
        user.id_usuario
      );

      // Buscar produtos via API
      const data = await api.get("/produtos");

      if (!data) {
        console.error("❌ Erro ao buscar produtos: dados vazios");
        return;
      }

      console.log("✅ Produtos encontrados:", data);

      const produtosMapeados = (data || []).map((p) => ({
        id: p.id,
        produto: p.nome_produto,
        categoria: p.categoria,
        descricao: p.descricao,
        precoCusto: Number(p.preco_custo) || 0,
        precoVenda: Number(p.preco_venda) || 0,
        margemLucro: p.preco_custo
          ? (((p.preco_venda - p.preco_custo) / p.preco_custo) * 100).toFixed(1)
          : 0,
        estoqueAtual: p.estoque_atual,
        estoqueMinimo: p.estoque_minimo || 0,
        unidade: p.unidade,
        fornecedor: p.fornecedor_id ? "Fornecedor" : "Sem fornecedor", // Simplificado
        codigoBarras: p.codigo_barras,
        ultimaAtualizacao: p.ultima_atualizacao,
        // Calcular status baseado no estoque
        status:
          p.estoque_atual === 0
            ? "esgotado"
            : p.estoque_atual < (p.estoque_minimo || 0)
              ? "baixo"
              : "disponivel",
        lotes: [], // Por enquanto vazio, pode ser implementado depois
      }));

      setProdutos(produtosMapeados);

      // Calcular produtos com estoque baixo
      const produtosBaixoEstoque = produtosMapeados.filter(
        (p) => p.estoqueAtual < p.estoqueMinimo
      );
      setProdutosEstoqueBaixo(produtosBaixoEstoque);
    } catch (error) {
      console.error("Erro ao recarregar estoque:", error);
      setProdutos([]);
      setProdutosEstoqueBaixo([]);
    }
  };

  useEffect(() => {
    // Log para debug - verificar se o usuário está carregado
    console.log("EstoquePage - Usuário atual:", user);
    console.log("EstoquePage - user.id_usuario:", user?.id_usuario);

    if (user?.id_usuario) {
      recarregarProdutos();
      // Verificar estrutura da tabela
      verificarEstruturaTabela();
    } else {
      console.log("EstoquePage - Usuário ainda não carregado, aguardando...");
    }
  }, [user]);

  // Função para verificar a estrutura da tabela (removida - não é mais necessária com API)
  const verificarEstruturaTabela = async () => {
    // Não é mais necessário verificar estrutura com API
    console.log("Estrutura verificada via API");
  };
  return (
    <DashboardLayout
      tipoUsuario="veterinario"
      nomeUsuario={user?.nome}
      estoqueBaixoCount={produtosEstoqueBaixo.length}
      sidebarBlurred={showSidebar}
    >
      <div className="container-fluid">
        {/* Header Compacto */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "24px" }}>
              <FaWarehouse className="me-2" style={{ color: "#0DB2AC" }} />
              Gestão de Estoque
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              Controle de produtos, lotes e alertas de estoque
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleAddProduct}
            size="sm"
          >
            <FaPlus className="me-2" />
            Novo Produto
          </Button>
        </div>

        {/* Alertas Compactos */}
        {produtosEstoqueBaixo.length > 0 ? (
          <div className="mb-3">
            <Badge
              bg="warning"
              className="d-inline-flex align-items-center gap-2 p-2"
              style={{ fontSize: "13px" }}
            >
              <FaExclamationTriangle />
              <span>
                {produtosEstoqueBaixo.length} produto{produtosEstoqueBaixo.length > 1 ? "s" : ""} com estoque baixo
              </span>
              <Button
                variant="link"
                className="p-0 text-dark"
                style={{ fontSize: "13px", textDecoration: "underline" }}
                onClick={() => {
                  setFilterStatus("baixo");
                  setSearchTerm("");
                  setFilterCategory("");
                }}
              >
                Ver detalhes
              </Button>
            </Badge>
          </div>
        ) : (
          <div className="mb-3">
            <Badge
              bg="success"
              className="d-inline-flex align-items-center gap-2 p-2"
              style={{ fontSize: "13px" }}
            >
              <FaCheckCircle />
              <span>Todos os produtos estão com estoque adequado</span>
            </Badge>
          </div>
        )}

        {/* Filtros e Busca Compactos */}
        <Card className="border mb-3" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
          <Card.Body className="p-3">
            <Row className="g-2">
              <Col md={5}>
                <InputGroup size="sm">
                  <InputGroup.Text className="bg-white border-end-0" style={{ borderColor: "#e9ecef" }}>
                    <FaSearch className="text-muted" style={{ fontSize: "14px" }} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                    style={{ fontSize: "14px", borderColor: "#e9ecef" }}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <Form.Select
                  size="sm"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{ fontSize: "14px", borderColor: "#e9ecef" }}
                >
                  <option value="">Todas as Categorias</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoriasLabels[cat]}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  size="sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ fontSize: "14px", borderColor: "#e9ecef" }}
                >
                  <option value="">Todos os Status</option>
                  <option value="disponivel">Disponível</option>
                  <option value="baixo">Baixo Estoque</option>
                  <option value="esgotado">Esgotado</option>
                </Form.Select>
              </Col>
              <Col md={1}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="w-100"
                  style={{ borderColor: "#e9ecef", color: "#6c757d" }}
                >
                  <FaDownload />
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabela Compacta de Produtos com Scroll Interno */}
        <Card className="border" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
          <Card.Header
            className="bg-white border-0 pb-2"
            style={{ borderBottom: "1px solid #e9ecef" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "15px" }}>
                Produtos em Estoque ({filteredProducts.length})
              </h6>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div
              style={{
                maxHeight: "calc(100vh - 350px)",
                overflowY: "auto",
                overflowX: "hidden"
              }}
            >
              <Table hover className="mb-0" style={{ fontSize: "14px" }}>
                <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 10 }}>
                  <tr>
                    <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Produto</th>
                    <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Categoria</th>
                    <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Estoque</th>
                    <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Preço Custo</th>
                    <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Preço Venda</th>
                    <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Margem</th>
                    <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Status</th>
                    <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockProgress = getStockProgress(
                      product.estoqueAtual,
                      product.estoqueMinimo
                    );

                    return (
                      <tr
                        key={product.id}
                        className="cursor-pointer"
                        onClick={() => handleProductClick(product)}
                        style={{
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f8f9fa";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                      >
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ color: "#6c757d" }}>
                              {getCategoryIcon(product.categoria)}
                            </div>
                            <div>
                              <div className="fw-semibold" style={{ fontSize: "14px" }}>{product.produto}</div>
                              {product.descricao && (
                                <small className="text-muted" style={{ fontSize: "12px" }}>
                                  {product.descricao.length > 40
                                    ? product.descricao.substring(0, 40) + "..."
                                    : product.descricao}
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <Badge
                            bg="light"
                            text="dark"
                            style={{ fontSize: "12px" }}
                          >
                            {categoriasLabels[product.categoria] || product.categoria}
                          </Badge>
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-semibold" style={{ fontSize: "14px" }}>
                                {product.estoqueAtual} {product.unidade}
                              </span>
                              <small className="text-muted" style={{ fontSize: "12px" }}>
                                Min: {product.estoqueMinimo}
                              </small>
                            </div>
                            <ProgressBar
                              variant={stockProgress.variant}
                              now={stockProgress.percentage}
                              style={{ height: "4px", borderRadius: "2px" }}
                            />
                          </div>
                        </td>
                        <td className="align-middle" style={{ padding: "12px", fontSize: "14px" }}>
                          {formatCurrency(product.precoCusto)}
                        </td>
                        <td className="align-middle" style={{ padding: "12px", fontSize: "14px" }}>
                          {formatCurrency(product.precoVenda)}
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <Badge bg="info" style={{ fontSize: "12px" }}>
                            {product.margemLucro}%
                          </Badge>
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          {getStatusBadge(product.status)}
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Ver detalhes"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(product);
                              }}
                              style={{ borderColor: "#e9ecef", color: "#6c757d", padding: "4px 8px" }}
                            >
                              <FaEye size={12} />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Editar"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditProduct(product);
                              }}
                              style={{ borderColor: "#e9ecef", color: "#6c757d", padding: "4px 8px" }}
                            >
                              <FaEdit size={12} />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Histórico"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewHistory(product);
                              }}
                              style={{ borderColor: "#e9ecef", color: "#6c757d", padding: "4px 8px" }}
                            >
                              <FaHistory size={12} />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Excluir"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product.id);
                              }}
                              style={{ borderColor: "#e9ecef", color: "#dc3545", padding: "4px 8px" }}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Modal Adicionar Produto */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPlus className="me-2" />
            Novo Produto
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome do Produto *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.produto}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        produto: e.target.value,
                      })
                    }
                    placeholder="Ex: Amoxicilina 500mg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria *</Form.Label>
                  <Form.Select
                    value={newProduct.categoria}
                    onChange={(e) => handleCategoriaChange(e.target.value)}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoriasLabels[cat]}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newProduct.descricao}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, descricao: e.target.value })
                }
                placeholder="Descrição detalhada do produto"
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Preço de Custo *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={newProduct.precoCusto}
                      onChange={(e) => handlePrecoCustoChange(e.target.value)}
                      placeholder="0,00"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Preço de Venda *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>R$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={newProduct.precoVenda}
                      onChange={(e) => handlePrecoVendaChange(e.target.value)}
                      placeholder="0,00"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Margem de Lucro *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      step="0.1"
                      value={newProduct.margemLucro}
                      onChange={(e) =>
                        handleMargemLucroChange(e.target.value)
                      }
                      placeholder="0.0"
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Alterar este valor recalculará o preço de venda
                    automaticamente
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estoque Mínimo *</Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.estoqueMinimo}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        estoqueMinimo: e.target.value,
                      })
                    }
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unidade</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.unidade}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        unidade: e.target.value,
                      })
                    }
                    placeholder="Ex: Comprimidos, Doses"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fornecedor</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.fornecedor}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        fornecedor: e.target.value,
                      })
                    }
                    placeholder="Nome do fornecedor"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código de Barras</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.codigoBarras}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        codigoBarras: e.target.value,
                      })
                    }
                    placeholder="Código de barras do produto"
                  />
                </Form.Group>
              </Col>
            </Row>

            {precisaLote(newProduct.categoria) && (
              <>
                <hr />
                <h6 className="mb-3">
                  <FaBox className="me-2" />
                  Informações do Lote Inicial
                </h6>
                <Alert variant="info" className="mb-3">
                  <small>
                    <strong>Controle de lote obrigatório</strong> para{" "}
                    {categoriasLabels[newProduct.categoria]}. Produtos como
                    medicamentos, vacinas e antibióticos precisam de
                    rastreabilidade completa por exigência sanitária.
                  </small>
                </Alert>
              </>
            )}
            {precisaLote(newProduct.categoria) && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número do Lote *</Form.Label>
                      <Form.Control
                        type="text"
                        value={newProduct.lote.numero}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            lote: {
                              ...newProduct.lote,
                              numero: e.target.value,
                            },
                          })
                        }
                        placeholder="Ex: LOT001, BATCH202401"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Data de Validade *</Form.Label>
                      <Form.Control
                        type="date"
                        value={newProduct.lote.validade}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            lote: {
                              ...newProduct.lote,
                              validade: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantidade do Lote *</Form.Label>
                      <Form.Control
                        type="number"
                        value={newProduct.lote.quantidade}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            lote: {
                              ...newProduct.lote,
                              quantidade: e.target.value,
                            },
                          })
                        }
                        placeholder="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preço de Custo do Lote</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>R$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={newProduct.lote.precoCusto}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              lote: {
                                ...newProduct.lote,
                                precoCusto: e.target.value,
                              },
                            })
                          }
                          placeholder="0,00"
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Opcional - para controle de custo específico do lote
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              resetNewProduct();
              setShowAddModal(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              let payload; // Declarar payload no início para estar disponível no catch
              try {
                // Validações básicas
                if (!newProduct.produto.trim()) {
                  alert("Nome do produto é obrigatório");
                  return;
                }
                if (!newProduct.categoria) {
                  alert("Categoria é obrigatória");
                  return;
                }
                if (!newProduct.precoCusto || !newProduct.precoVenda) {
                  alert("Preço de custo e venda são obrigatórios");
                  return;
                }
                if (
                  !newProduct.margemLucro ||
                  parseFloat(newProduct.margemLucro) < 0
                ) {
                  alert("Margem de lucro deve ser maior que zero");
                  return;
                }
                if (!newProduct.estoqueMinimo) {
                  alert("Estoque mínimo é obrigatório");
                  return;
                }

                // Validações específicas para produtos com lote
                if (precisaLote(newProduct.categoria)) {
                  if (!newProduct.lote.numero.trim()) {
                    alert(
                      "Número do lote é obrigatório para " +
                      newProduct.categoria
                    );
                    return;
                  }
                  if (!newProduct.lote.validade) {
                    alert(
                      "Data de validade é obrigatória para " +
                      newProduct.categoria
                    );
                    return;
                  }
                  if (
                    !newProduct.lote.quantidade ||
                    Number(newProduct.lote.quantidade) <= 0
                  ) {
                    alert(
                      "Quantidade do lote deve ser maior que zero para " +
                      newProduct.categoria
                    );
                    return;
                  }

                  // Verificar se a data de validade não é passada
                  const hoje = new Date();
                  const dataValidade = new Date(newProduct.lote.validade);
                  if (dataValidade <= hoje) {
                    const confirmar = window.confirm(
                      "A data de validade informada já passou ou é hoje. Deseja continuar mesmo assim?"
                    );
                    if (!confirmar) return;
                  }
                }

                // Calcular estoque atual: se tiver lote, usar quantidade do lote, senão usar 0 ou permitir input
                const estoqueAtual = precisaLote(newProduct.categoria)
                  ? (Number(newProduct.lote.quantidade) || 0)
                  : 0; // Para produtos sem lote, começar com 0 (pode ser ajustado depois)
                const estoqueMin = Number(newProduct.estoqueMinimo) || 0;
                const status =
                  estoqueAtual === 0
                    ? "esgotado"
                    : estoqueAtual < estoqueMin
                      ? "baixo"
                      : "disponivel";

                // Usar o usuário já obtido no topo do componente
                if (!user) {
                  alert("Usuário não encontrado");
                  return;
                }

                // Payload correto para a API
                payload = {
                  nome_produto: newProduct.produto.trim(),
                  categoria: newProduct.categoria,
                  descricao: newProduct.descricao.trim() || null,
                  preco_custo: Number(newProduct.precoCusto) || 0,
                  preco_venda: Number(newProduct.precoVenda) || 0,
                  estoque_minimo: estoqueMin,
                  estoque_atual: estoqueAtual,
                  unidade: newProduct.unidade.trim() || null,
                  codigo_barras: newProduct.codigoBarras.trim() || null,
                };

                // Verificar se há valores undefined ou null
                Object.keys(payload).forEach((key) => {
                  if (payload[key] === undefined) {
                    console.warn(
                      `Campo ${key} tem valor undefined:`,
                      payload[key]
                    );
                  }
                });

                // Log para debug
                console.log(
                  "Payload final:",
                  JSON.stringify(payload, null, 2)
                );
                console.log("Tentando inserir payload:", payload);

                // Inserir produto via API
                const response = await api.post("/produtos", payload);

                console.log("Produto inserido com sucesso!", response);

                // Se houver lote, criar também
                if (precisaLote(newProduct.categoria) && newProduct.lote.numero && newProduct.lote.validade && newProduct.lote.quantidade) {
                  try {
                    // A resposta da API pode vir como { produto: { id: ... } } ou { id: ... }
                    const produtoId = response?.produto?.id || response?.id || response?.produto?.id_produto;
                    if (produtoId) {
                      await api.post(`/lotes/produto/${produtoId}`, {
                        numero_lote: newProduct.lote.numero,
                        validade: newProduct.lote.validade,
                        quantidade: Number(newProduct.lote.quantidade),
                        preco_custo: newProduct.lote.precoCusto ? Number(newProduct.lote.precoCusto) : null,
                      });
                    } else {
                      console.warn("ID do produto não encontrado na resposta:", response);
                    }
                  } catch (loteError) {
                    console.warn("Erro ao criar lote:", loteError);
                    // Não falhar se o lote não for criado
                  }
                }
                resetNewProduct();
                setShowAddModal(false);
                // Recarregar produtos para atualizar alertas
                await recarregarProdutos();
              } catch (e) {
                console.error("Erro completo:", e);
                if (payload) {
                  console.error("Payload enviado:", payload);
                } else {
                  console.error(
                    "Payload não foi definido - erro ocorreu antes da criação"
                  );
                }
                alert(
                  "Erro ao salvar produto: " +
                  (e.message || e.details || "Erro desconhecido")
                );
              }
            }}
          >
            <FaPlus className="me-2" />
            Adicionar Produto
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Editar Produto - Removido, usando sistema de sidebar agora */}
      {/* 
        <Modal
          show={false}
          onHide={() => {}}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaEdit className="me-2" />
              Editar Produto
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editProduct && (
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome do Produto *</Form.Label>
                      <Form.Control
                        type="text"
                        value={editProduct.produto}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            produto: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Categoria *</Form.Label>
                      <Form.Select
                        value={editProduct.categoria}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            categoria: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={editProduct.descricao}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        descricao: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preço de Custo *</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>R$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={editProduct.precoCusto}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              precoCusto: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Preço de Venda *</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>R$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={editProduct.precoVenda}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              precoVenda: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Estoque Mínimo *</Form.Label>
                      <Form.Control
                        type="number"
                        value={editProduct.estoqueMinimo}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            estoqueMinimo: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Unidade</Form.Label>
                      <Form.Control
                        type="text"
                        value={editProduct.unidade}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            unidade: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fornecedor</Form.Label>
                      <Form.Control
                        type="text"
                        value={editProduct.fornecedor}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            fornecedor: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Código de Barras</Form.Label>
                      <Form.Control
                        type="text"
                        value={editProduct.codigoBarras}
                        onChange={(e) =>
                          setEditProduct({
                            ...editProduct,
                            codigoBarras: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  const payload = {
                    nome_produto: editProduct.produto,
                    categoria: editProduct.categoria,
                    descricao: editProduct.descricao || null,
                    preco_custo:
                      editProduct.precoCusto === ""
                        ? null
                        : Number(editProduct.precoCusto),
                    preco_venda:
                      editProduct.precoVenda === ""
                        ? null
                        : Number(editProduct.precoVenda),
                    estoque_minimo:
                      editProduct.estoqueMinimo === ""
                        ? 0
                        : Number(editProduct.estoqueMinimo),
                    unidade: editProduct.unidade || null,
                    codigo_barras: editProduct.codigoBarras || null,
                  };
                  await api.put(`/produtos/${editProduct.id}`, payload);
                  setShowEditModal(false);
                  // Recarregar produtos para atualizar alertas
                  await recarregarProdutos();
                } catch (e) {
                  alert("Erro ao atualizar produto: " + e.message);
                }
              }}
            >
              <FaEdit className="me-2" />
              Salvar Alterações
            </Button>
          </Modal.Footer>
        </Modal>

      {/* Overlay com Background Desfocado */}
      {showSidebar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 1060,
            transition: "opacity 0.3s ease",
          }}
          onClick={() => {
            if (modalStack.length === 0) {
              closeSidebar();
            }
          }}
        />
      )}

      {/* Sidebar Layer Lateral (Esquerda) */}
      {showSidebar && selectedProduct && (
        <div
          ref={sidebarRef}
          style={{
            position: "fixed",
            top: 0,
            width: "550px", // Aumentado para notebook visual
            height: "100vh",
            backgroundColor: "white",
            zIndex: 1070, // Base z-index
            boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
            transform: showSidebar ? "translateX(0)" : "translateX(100%)",
            right: 0,
            transition: "transform 0.3s ease, filter 0.3s ease",
            display: "flex",
            flexDirection: "column",
            filter: modalStack.length > 0 ? "brightness(0.9)" : "none",
          }}
        >
          {/* Header do Sidebar */}
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid #e9ecef",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h5 className="fw-semibold text-dark mb-0" style={{ fontSize: "18px" }}>
              {getCategoryIcon(selectedProduct.categoria)}
              <span className="ms-2">Detalhes do Produto</span>
            </h5>
            <Button
              variant="link"
              onClick={closeSidebar}
              style={{ padding: 0, color: "#6c757d" }}
            >
              <FaTimes size={20} />
            </Button>
          </div>

          {/* Conteúdo do Sidebar com Scroll */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.5rem",
            }}
          >
            {selectedProduct && (
              <div>
                {/* Informações Básicas */}
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded"
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: "#e9ecef",
                        color: "#6c757d",
                      }}
                    >
                      {getCategoryIcon(selectedProduct.categoria)}
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1" style={{ fontSize: "18px" }}>
                        {selectedProduct.produto}
                      </h4>
                      <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                        {categoriasLabels[selectedProduct.categoria] || selectedProduct.categoria}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "12px" }}>Estoque</small>
                      <div className="fw-semibold" style={{ fontSize: "14px" }}>
                        {selectedProduct.estoqueAtual} {selectedProduct.unidade}
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "12px" }}>Mínimo</small>
                      <div className="fw-semibold" style={{ fontSize: "14px" }}>
                        {selectedProduct.estoqueMinimo} {selectedProduct.unidade}
                      </div>
                    </div>
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "12px" }}>Status</small>
                      <div>{getStatusBadge(selectedProduct.status)}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(() => {
                    const stockProgress = getStockProgress(
                      selectedProduct.estoqueAtual,
                      selectedProduct.estoqueMinimo
                    );
                    return (
                      <div className="mb-3">
                        <ProgressBar
                          variant={stockProgress.variant}
                          now={stockProgress.percentage}
                          style={{ height: "8px", borderRadius: "4px" }}
                        />
                      </div>
                    );
                  })()}

                  {/* Informações Financeiras */}
                  <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                    <Card.Body className="p-3">
                      <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>
                        Informações Financeiras
                      </h6>
                      <div className="row g-3">
                        <div className="col-6">
                          <small className="text-muted d-block" style={{ fontSize: "12px" }}>Preço Custo</small>
                          <div className="fw-semibold" style={{ fontSize: "14px" }}>
                            {formatCurrency(selectedProduct.precoCusto)}
                          </div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block" style={{ fontSize: "12px" }}>Preço Venda</small>
                          <div className="fw-semibold" style={{ fontSize: "14px" }}>
                            {formatCurrency(selectedProduct.precoVenda)}
                          </div>
                        </div>
                        <div className="col-12">
                          <small className="text-muted d-block" style={{ fontSize: "12px" }}>Margem de Lucro</small>
                          <Badge bg="info" style={{ fontSize: "14px" }}>
                            {selectedProduct.margemLucro}%
                          </Badge>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {selectedProduct.descricao && (
                    <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                      <Card.Body className="p-3">
                        <h6 className="fw-semibold mb-2" style={{ fontSize: "14px" }}>Descrição</h6>
                        <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                          {selectedProduct.descricao}
                        </p>
                      </Card.Body>
                    </Card>
                  )}
                </div>

                {/* Abas de Informações */}
                <Nav
                  variant="tabs"
                  activeKey={activeTab}
                  onSelect={setActiveTab}
                  className="mb-3"
                  style={{ fontSize: "13px" }}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="detalhes" style={{ fontSize: "13px" }}>Detalhes</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="lotes" style={{ fontSize: "13px" }}>Lotes</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="historico" style={{ fontSize: "13px" }}>Histórico</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane active={activeTab === "detalhes"}>
                    <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                      <Card.Body className="p-3">
                        <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>Informações Detalhadas</h6>
                        <div className="row g-3">
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "12px" }}>Categoria</small>
                            <div className="fw-semibold" style={{ fontSize: "14px" }}>
                              {categoriasLabels[selectedProduct.categoria] || selectedProduct.categoria}
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block" style={{ fontSize: "12px" }}>Unidade</small>
                            <div className="fw-semibold" style={{ fontSize: "14px" }}>
                              {selectedProduct.unidade || "N/A"}
                            </div>
                          </div>
                          {selectedProduct.codigoBarras && (
                            <div className="col-12">
                              <small className="text-muted d-block" style={{ fontSize: "12px" }}>Código de Barras</small>
                              <div className="fw-semibold" style={{ fontSize: "14px" }}>
                                {selectedProduct.codigoBarras}
                              </div>
                            </div>
                          )}
                          {selectedProduct.fornecedor && (
                            <div className="col-12">
                              <small className="text-muted d-block" style={{ fontSize: "12px" }}>Fornecedor</small>
                              <div className="fw-semibold" style={{ fontSize: "14px" }}>
                                {selectedProduct.fornecedor}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane active={activeTab === "lotes"}>
                    <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                      <Card.Body className="p-3">
                        <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>Lotes do Produto</h6>
                        {selectedProduct.lotes && selectedProduct.lotes.length > 0 ? (
                          <Table size="sm" className="mb-0">
                            <thead>
                              <tr>
                                <th style={{ fontSize: "12px" }}>Lote</th>
                                <th style={{ fontSize: "12px" }}>Validade</th>
                                <th style={{ fontSize: "12px" }}>Quantidade</th>
                                <th style={{ fontSize: "12px" }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedProduct.lotes.map((lote) => {
                                const isExpired = new Date(lote.validade) < new Date();
                                const isExpiringSoon =
                                  new Date(lote.validade) <
                                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                                return (
                                  <tr key={lote.id}>
                                    <td style={{ fontSize: "13px" }}>{lote.numero}</td>
                                    <td style={{ fontSize: "13px" }}>
                                      <span className={isExpired ? "text-danger" : isExpiringSoon ? "text-warning" : ""}>
                                        {formatDate(lote.validade)}
                                      </span>
                                    </td>
                                    <td style={{ fontSize: "13px" }}>
                                      {lote.quantidade} {selectedProduct.unidade}
                                    </td>
                                    <td>
                                      {isExpired ? (
                                        <Badge bg="danger" style={{ fontSize: "11px" }}>Expirado</Badge>
                                      ) : isExpiringSoon ? (
                                        <Badge bg="warning" style={{ fontSize: "11px" }}>Expira em breve</Badge>
                                      ) : (
                                        <Badge bg="success" style={{ fontSize: "11px" }}>Válido</Badge>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        ) : (
                          <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                            Nenhum lote registrado.
                          </p>
                        )}
                      </Card.Body>
                    </Card>
                  </Tab.Pane>

                  <Tab.Pane active={activeTab === "historico"}>
                    <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                      <Card.Body className="p-3">
                        <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>Histórico de Movimentações</h6>
                        <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                          Histórico de movimentações será implementado em breve.
                        </p>
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            )}
          </div>

          {/* Footer do Sidebar com Ações */}
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid #e9ecef",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => openModal("editar", { produto: selectedProduct })}
              style={{
                flex: 1,
                borderColor: "#e9ecef",
                color: "#6c757d",
                fontSize: "13px"
              }}
            >
              <FaEdit className="me-2" />
              Editar
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => openModal("lote", { produto: selectedProduct })}
              style={{
                flex: 1,
                borderColor: "#e9ecef",
                color: "#6c757d",
                fontSize: "13px"
              }}
            >
              <FaPlus className="me-2" />
              Adicionar Lote
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => openModal("historico", { produto: selectedProduct })}
              style={{
                borderColor: "#e9ecef",
                color: "#6c757d",
                fontSize: "13px"
              }}
            >
              <FaHistory />
            </Button>
          </div>
        </div>
      )}

      {/* Sistema de Modais Empilhados */}
      {modalStack.map((modal, index) => {
        // Stacking "Notebook" style - modais empurram sidebar para esquerda
        // Newest modals go on top and shift left significantly to show previous content
        // Patient Sidebar is at Right: 0
        const offsetRight = (index + 1) * 500; // 500px shift left per modal
        const zIndex = 1080 + index;
        const isActive = index === modalStack.length - 1;

        return (
          <div
            key={modal.id}
            style={{
              position: "fixed",
              top: 0,
              right: `${offsetRight}px`,
              width: "550px",
              height: "100vh",
              backgroundColor: "white",
              zIndex: zIndex,
              boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
              transform: "translateX(0)",
              transition: "right 0.3s ease, filter 0.3s ease",
              display: "flex",
              flexDirection: "column",
              filter: isActive ? "none" : "brightness(0.9)",
            }}
          >
            {modal.type === "editar" && (
              <>
                <div
                  style={{
                    padding: "1.5rem",
                    borderBottom: "1px solid #e9ecef",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h5 className="fw-semibold text-dark mb-0" style={{ fontSize: "18px" }}>
                    <FaEdit className="me-2" style={{ color: "#0DB2AC" }} />
                    Editar Produto
                  </h5>
                  <Button
                    variant="link"
                    onClick={closeModal}
                    style={{ padding: 0, color: "#6c757d" }}
                  >
                    <FaTimes size={20} />
                  </Button>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
                  {modal.data.produto && (
                    <div>
                      <p className="text-muted" style={{ fontSize: "14px" }}>
                        Formulário de edição será implementado aqui.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {modal.type === "lote" && (
              <>
                <div
                  style={{
                    padding: "1.5rem",
                    borderBottom: "1px solid #e9ecef",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h5 className="fw-semibold text-dark mb-0" style={{ fontSize: "18px" }}>
                    <FaPlus className="me-2" style={{ color: "#0DB2AC" }} />
                    Adicionar Lote
                  </h5>
                  <Button
                    variant="link"
                    onClick={closeModal}
                    style={{ padding: 0, color: "#6c757d" }}
                  >
                    <FaTimes size={20} />
                  </Button>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
                  <p className="text-muted" style={{ fontSize: "14px" }}>
                    Formulário de adicionar lote será implementado aqui.
                  </p>
                </div>
              </>
            )}

            {modal.type === "historico" && (
              <>
                <div
                  style={{
                    padding: "1.5rem",
                    borderBottom: "1px solid #e9ecef",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h5 className="fw-semibold text-dark mb-0" style={{ fontSize: "18px" }}>
                    <FaHistory className="me-2" style={{ color: "#0DB2AC" }} />
                    Histórico de Lotes
                  </h5>
                  <Button
                    variant="link"
                    onClick={closeModal}
                    style={{ padding: 0, color: "#6c757d" }}
                  >
                    <FaTimes size={20} />
                  </Button>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
                  {modal.data.produto && (
                    <div>
                      <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>
                        {modal.data.produto.produto}
                      </h6>
                      {modal.data.produto.lotes && modal.data.produto.lotes.length > 0 ? (
                        <Table size="sm" className="mb-0">
                          <thead>
                            <tr>
                              <th style={{ fontSize: "12px" }}>Lote</th>
                              <th style={{ fontSize: "12px" }}>Validade</th>
                              <th style={{ fontSize: "12px" }}>Quantidade</th>
                              <th style={{ fontSize: "12px" }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modal.data.produto.lotes.map((lote) => {
                              const isExpired = new Date(lote.validade) < new Date();
                              const isExpiringSoon =
                                new Date(lote.validade) <
                                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                              return (
                                <tr key={lote.id}>
                                  <td style={{ fontSize: "13px" }}>{lote.numero}</td>
                                  <td style={{ fontSize: "13px" }}>
                                    <span className={isExpired ? "text-danger" : isExpiringSoon ? "text-warning" : ""}>
                                      {formatDate(lote.validade)}
                                    </span>
                                  </td>
                                  <td style={{ fontSize: "13px" }}>
                                    {lote.quantidade} {modal.data.produto.unidade}
                                  </td>
                                  <td>
                                    {isExpired ? (
                                      <Badge bg="danger" style={{ fontSize: "11px" }}>Expirado</Badge>
                                    ) : isExpiringSoon ? (
                                      <Badge bg="warning" style={{ fontSize: "11px" }}>Expira em breve</Badge>
                                    ) : (
                                      <Badge bg="success" style={{ fontSize: "11px" }}>Válido</Badge>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      ) : (
                        <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                          Nenhum lote registrado.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </DashboardLayout>
  );
};

export default EstoquePage;
