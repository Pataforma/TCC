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
import { supabase } from "../../../utils/supabase";

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

  // Categorias disponíveis
  const categorias = [
    "Antibióticos",
    "Vacinas",
    "Alimentação",
    "Material Médico",
    "Medicamentos",
    "Higiene",
    "Acessórios",
  ];

  // Funções de filtro e busca
  const filteredProducts = produtos.filter((product) => {
    const matchesSearch =
      product.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigoBarras.includes(searchTerm);

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

  // Funções de manipulação
  const handleAddProduct = () => {
    // Calcular margem de lucro automaticamente
    const custo = parseFloat(newProduct.precoCusto) || 0;
    const venda = parseFloat(newProduct.precoVenda) || 0;
    const margem = custo > 0 ? ((venda - custo) / custo) * 100 : 0;

    setNewProduct({
      ...newProduct,
      margemLucro: margem.toFixed(1),
    });

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
      const { error } = await supabase.from('estoque_produtos').delete().eq('id', productId);
      if (error) throw error;
      // Remover localmente
      setProdutos((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      alert('Erro ao excluir produto: ' + error.message);
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
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const { data, error } = await supabase
          .from('estoque_produtos')
          .select('*')
          .order('produto');
        if (error) throw error;
        // Mapear para o formato esperado pela UI existente
        setProdutos(
          (data || []).map((p) => ({
            id: p.id,
            produto: p.produto,
            categoria: p.categoria,
            descricao: p.descricao,
            precoCusto: Number(p.preco_custo) || 0,
            precoVenda: Number(p.preco_venda) || 0,
            margemLucro: p.preco_custo ? (((p.preco_venda - p.preco_custo) / p.preco_custo) * 100).toFixed(1) : 0,
            estoqueAtual: p.estoque_atual,
            estoqueMinimo: p.estoque_minimo,
            unidade: p.unidade,
            fornecedor: p.fornecedor,
            codigoBarras: p.codigo_barras,
            status: p.status,
            ultimaAtualizacao: p.ultima_atualizacao,
            lotes: Array.isArray(p.lotes) ? p.lotes : [],
          }))
        );
      } catch (error) {
        console.error('Erro ao carregar estoque:', error);
        setProdutos([]);
      }
    };
    carregarProdutos();
  }, []);
  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
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

        {/* Alertas de Estoque Baixo */}
        <Row className="mb-4">
          <Col>
            <Alert variant="warning" className="d-flex align-items-center">
              <FaExclamationTriangle className="me-2" />
              <div>
                <strong>Atenção:</strong> 2 produtos com estoque baixo.{" "}
                <Button variant="link" className="p-0 ms-1">
                  Ver detalhes
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>

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
                  {cat}
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
                              {product.categoria}
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
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
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
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            precoCusto: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            precoVenda: e.target.value,
                          })
                        }
                        placeholder="0,00"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Margem de Lucro</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={newProduct.margemLucro}
                        readOnly
                        className="bg-light"
                      />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
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

              <hr />

              <h6 className="mb-3">Informações do Lote Inicial</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Número do Lote</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.lote.numero}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          lote: { ...newProduct.lote, numero: e.target.value },
                        })
                      }
                      placeholder="Ex: LOT001"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data de Validade</Form.Label>
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
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantidade</Form.Label>
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
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={async () => {
              try {
                const estoqueAtual = Number(newProduct.lote.quantidade) || 0;
                const estoqueMin = Number(newProduct.estoqueMinimo) || 0;
                const status = estoqueAtual === 0 ? 'esgotado' : (estoqueAtual < estoqueMin ? 'baixo' : 'disponivel');
                const payload = {
                  produto: newProduct.produto,
                  categoria: newProduct.categoria,
                  descricao: newProduct.descricao || null,
                  preco_custo: newProduct.precoCusto === '' ? null : Number(newProduct.precoCusto),
                  preco_venda: newProduct.precoVenda === '' ? null : Number(newProduct.precoVenda),
                  estoque_minimo: estoqueMin,
                  unidade: newProduct.unidade || null,
                  fornecedor: newProduct.fornecedor || null,
                  codigo_barras: newProduct.codigoBarras || null,
                  estoque_atual: estoqueAtual,
                  status,
                  ultima_atualizacao: new Date().toISOString(),
                };
                const { data, error } = await supabase.from('estoque_produtos').insert(payload).select('id').single();
                if (error) throw error;
                setShowAddModal(false);
                // Atualiza lista
                setProdutos((prev) => [
                  ...prev,
                  {
                    id: data.id,
                    produto: payload.produto,
                    categoria: payload.categoria,
                    descricao: payload.descricao,
                    precoCusto: payload.preco_custo,
                    precoVenda: payload.preco_venda,
                    margemLucro: payload.preco_custo ? (((payload.preco_venda - payload.preco_custo) / payload.preco_custo) * 100).toFixed(1) : 0,
                    estoqueAtual: payload.estoque_atual,
                    estoqueMinimo: payload.estoque_minimo,
                    unidade: payload.unidade,
                    fornecedor: payload.fornecedor,
                    codigoBarras: payload.codigo_barras,
                    status: payload.status,
                    ultimaAtualizacao: payload.ultima_atualizacao,
                    lotes: [],
                  },
                ]);
              } catch (e) {
                alert('Erro ao salvar produto: ' + e.message);
              }
            }}>
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
                        onChange={(e) => setEditProduct({ ...editProduct, produto: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Categoria *</Form.Label>
                      <Form.Select
                        value={editProduct.categoria}
                        onChange={(e) => setEditProduct({ ...editProduct, categoria: e.target.value })}
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
                    onChange={(e) => setEditProduct({ ...editProduct, descricao: e.target.value })}
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
                          onChange={(e) => setEditProduct({ ...editProduct, precoCusto: e.target.value })}
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
                          onChange={(e) => setEditProduct({ ...editProduct, precoVenda: e.target.value })}
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
                        onChange={(e) => setEditProduct({ ...editProduct, estoqueMinimo: e.target.value })}
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
                        onChange={(e) => setEditProduct({ ...editProduct, unidade: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fornecedor</Form.Label>
                      <Form.Control
                        type="text"
                        value={editProduct.fornecedor}
                        onChange={(e) => setEditProduct({ ...editProduct, fornecedor: e.target.value })}
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
                        onChange={(e) => setEditProduct({ ...editProduct, codigoBarras: e.target.value })}
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
            <Button variant="primary" onClick={async () => {
              try {
                const payload = {
                  produto: editProduct.produto,
                  categoria: editProduct.categoria,
                  descricao: editProduct.descricao || null,
                  preco_custo: editProduct.precoCusto === '' ? null : Number(editProduct.precoCusto),
                  preco_venda: editProduct.precoVenda === '' ? null : Number(editProduct.precoVenda),
                  estoque_minimo: editProduct.estoqueMinimo === '' ? 0 : Number(editProduct.estoqueMinimo),
                  unidade: editProduct.unidade || null,
                  fornecedor: editProduct.fornecedor || null,
                  codigo_barras: editProduct.codigoBarras || null,
                  ultima_atualizacao: new Date().toISOString(),
                };
                const { error } = await supabase
                  .from('estoque_produtos')
                  .update(payload)
                  .eq('id', editProduct.id);
                if (error) throw error;
                setProdutos((prev) => prev.map((p) => p.id === editProduct.id ? {
                  ...p,
                  ...editProduct,
                  ultimaAtualizacao: payload.ultima_atualizacao,
                  margemLucro: payload.preco_custo ? (((payload.preco_venda - payload.preco_custo) / payload.preco_custo) * 100).toFixed(1) : 0,
                } : p));
                setShowEditModal(false);
              } catch (e) {
                alert('Erro ao atualizar produto: ' + e.message);
              }
            }}>
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
