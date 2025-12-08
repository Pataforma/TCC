import React, { useEffect, useState } from "react";
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
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";
import { api } from "../../../utils/api";

const EstoquePage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editProduct, setEditProduct] = useState(null);

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

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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

  // Funções de manipulação
  const handleAddProduct = () => {
    resetNewProduct();
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditProduct({ ...product });
    setShowEditModal(true);
  };

  const handleViewHistory = (product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  };

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
    >
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  <FaWarehouse className="me-2" />
                  Gestão de Estoque
                </h2>
                <p className="text-muted mb-0">
                  Controle de produtos, lotes e alertas de estoque
                </p>
              </div>
              <Button variant="primary" onClick={handleAddProduct}>
                <FaPlus className="me-2" />
                Novo Produto
              </Button>
            </div>
          </Col>
        </Row>

        {/* Alertas de Estoque */}
        {produtosEstoqueBaixo.length > 0 ? (
          <Row className="mb-4">
            <Col>
              <Alert variant="warning" className="d-flex align-items-center">
                <FaExclamationTriangle className="me-2" />
                <div>
                  <strong>Atenção:</strong> {produtosEstoqueBaixo.length}{" "}
                  produto{produtosEstoqueBaixo.length > 1 ? "s" : ""} com
                  estoque baixo.{" "}
                  <Button
                    variant="link"
                    className="p-0 ms-1"
                    onClick={() => {
                      setFilterStatus("baixo");
                      setSearchTerm("");
                      setFilterCategory("");
                    }}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </Alert>
            </Col>
          </Row>
        ) : (
          <Row className="mb-4">
            <Col>
              <Alert variant="success" className="d-flex align-items-center">
                <FaCheckCircle className="me-2" />
                <div>
                  <strong>Ótimo!</strong> Todos os produtos estão com estoque
                  adequado.
                </div>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Filtros e Busca */}
        <Row className="mb-4">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="disponivel">Disponível</option>
              <option value="baixo">Baixo Estoque</option>
              <option value="esgotado">Esgotado</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button variant="outline-secondary" className="w-100">
              <FaDownload className="me-2" />
              Exportar
            </Button>
          </Col>
        </Row>

        {/* Tabela de Produtos */}
        <Row>
          <Col>
            <Card>
              <Card.Header className="bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Produtos em Estoque</h5>
                  <small className="text-muted">
                    {filteredProducts.length} produtos encontrados
                  </small>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Produto</th>
                      <th>Categoria</th>
                      <th>Estoque</th>
                      <th>Preço Custo</th>
                      <th>Preço Venda</th>
                      <th>Margem</th>
                      <th>Status</th>
                      <th>Última Atualização</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((product) => {
                      const stockProgress = getStockProgress(
                        product.estoqueAtual,
                        product.estoqueMinimo
                      );

                      return (
                        <tr key={product.id}>
                          <td>
                            <div>
                              <strong>{product.produto}</strong>
                              <br />
                              <small className="text-muted">
                                {product.descricao}
                              </small>
                            </div>
                          </td>
                          <td>
                            <Badge bg="light" text="dark">
                              {categoriasLabels[product.categoria] ||
                                product.categoria}
                            </Badge>
                          </td>
                          <td>
                            <div>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="fw-semibold">
                                  {product.estoqueAtual} {product.unidade}
                                </span>
                                <small className="text-muted">
                                  Min: {product.estoqueMinimo}
                                </small>
                              </div>
                              <ProgressBar
                                variant={stockProgress.variant}
                                now={stockProgress.percentage}
                                style={{ height: "6px" }}
                                className="stock-progress-bar"
                              />
                            </div>
                          </td>
                          <td>{formatCurrency(product.precoCusto)}</td>
                          <td>{formatCurrency(product.precoVenda)}</td>
                          <td>
                            <Badge bg="info">{product.margemLucro}%</Badge>
                          </td>
                          <td>{getStatusBadge(product.status)}</td>
                          <td>
                            <small>
                              {formatDate(product.ultimaAtualizacao)}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                title="Editar"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleViewHistory(product)}
                                title="Histórico"
                              >
                                <FaHistory />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                title="Excluir"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <Pagination>
                  <Pagination.First
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Pagination.Item>
                    )
                  )}

                  <Pagination.Next
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </Col>
        </Row>

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

        {/* Modal Editar Produto */}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
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

        {/* Modal Histórico de Lotes */}
        <Modal
          show={showHistoryModal}
          onHide={() => setShowHistoryModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaHistory className="me-2" />
              Histórico de Lotes - {selectedProduct?.produto}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProduct && (
              <div>
                <div className="mb-4">
                  <h6>Informações do Produto</h6>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Produto:</strong> {selectedProduct.produto}
                      </p>
                      <p>
                        <strong>Categoria:</strong> {selectedProduct.categoria}
                      </p>
                      <p>
                        <strong>Fornecedor:</strong>{" "}
                        {selectedProduct.fornecedor}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Estoque Atual:</strong>{" "}
                        {selectedProduct.estoqueAtual} {selectedProduct.unidade}
                      </p>
                      <p>
                        <strong>Estoque Mínimo:</strong>{" "}
                        {selectedProduct.estoqueMinimo}{" "}
                        {selectedProduct.unidade}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusBadge(selectedProduct.status)}
                      </p>
                    </Col>
                  </Row>
                </div>

                <Table responsive>
                  <thead>
                    <tr>
                      <th>Lote</th>
                      <th>Validade</th>
                      <th>Quantidade</th>
                      <th>Preço Custo</th>
                      <th>Data Entrada</th>
                      <th>Status</th>
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
                          <td>
                            <strong>{lote.numero}</strong>
                          </td>
                          <td>
                            <span
                              className={
                                isExpired
                                  ? "text-danger"
                                  : isExpiringSoon
                                  ? "text-warning"
                                  : ""
                              }
                            >
                              {formatDate(lote.validade)}
                            </span>
                          </td>
                          <td>
                            {lote.quantidade} {selectedProduct.unidade}
                          </td>
                          <td>{formatCurrency(lote.precoCusto)}</td>
                          <td>{formatDate(lote.dataEntrada)}</td>
                          <td>
                            {isExpired ? (
                              <Badge bg="danger">Expirado</Badge>
                            ) : isExpiringSoon ? (
                              <Badge bg="warning">Expira em breve</Badge>
                            ) : (
                              <Badge bg="success">Válido</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowHistoryModal(false)}
            >
              Fechar
            </Button>
            <Button variant="outline-primary">
              <FaDownload className="me-2" />
              Exportar Histórico
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default EstoquePage;
