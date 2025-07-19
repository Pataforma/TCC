import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Row,
  Col,
  Badge,
  Alert,
  Form,
  Dropdown,
  Modal,
} from "react-bootstrap";
import {
  FaDollarSign,
  FaChartLine,
  FaDownload,
  FaEye,
  FaEllipsisV,
  FaCalendarAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatCard from "../../../components/ui/StatCard";
import SimpleChart from "../../../components/Dashboard/SimpleChart";
import styles from "./FinanceiroPage.module.css";

const FinanceiroPage = () => {
  const [financeiroData, setFinanceiroData] = useState({
    kpis: {
      receitaTotal: 15420.5,
      receitaMes: 3240.8,
      receitaSemana: 890.3,
      transacoesMes: 45,
      ticketMedio: 72.02,
      crescimento: 12.5,
    },
    graficoReceita: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      data: [2800, 3200, 2900, 3500, 3100, 3240],
    },
    transacoes: [
      {
        id: 1,
        cliente: "Maria Silva",
        servico: "Banho e Tosa Completo",
        valor: 80.0,
        data: "2024-01-15T10:30:00",
        status: "pago",
        formaPagamento: "pix",
        comissao: 8.0,
      },
      {
        id: 2,
        cliente: "João Santos",
        servico: "Consulta Veterinária",
        valor: 120.0,
        data: "2024-01-14T14:20:00",
        status: "pago",
        formaPagamento: "cartao_credito",
        comissao: 12.0,
      },
      {
        id: 3,
        cliente: "Ana Costa",
        servico: "Vacinação",
        valor: 45.0,
        data: "2024-01-13T09:15:00",
        status: "pendente",
        formaPagamento: "dinheiro",
        comissao: 4.5,
      },
      {
        id: 4,
        cliente: "Pedro Oliveira",
        servico: "Banho e Tosa Completo",
        valor: 80.0,
        data: "2024-01-12T16:45:00",
        status: "cancelado",
        formaPagamento: "pix",
        comissao: 0.0,
      },
      {
        id: 5,
        cliente: "Carla Ferreira",
        servico: "Hospedagem Diária",
        valor: 60.0,
        data: "2024-01-11T08:00:00",
        status: "pago",
        formaPagamento: "cartao_debito",
        comissao: 6.0,
      },
    ],
    servicosMaisVendidos: [
      { nome: "Banho e Tosa", vendas: 23, receita: 1840.0 },
      { nome: "Consulta Veterinária", vendas: 12, receita: 1440.0 },
      { nome: "Vacinação", vendas: 8, receita: 360.0 },
      { nome: "Hospedagem", vendas: 5, receita: 300.0 },
    ],
  });

  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [filterPeriodo, setFilterPeriodo] = useState("mes");
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [novaTransacao, setNovaTransacao] = useState({
    tipo: "entrada",
    descricao: "",
    valor: "",
    categoria: "",
    data: new Date().toISOString().split("T")[0],
    formaPagamento: "dinheiro",
    observacoes: "",
  });

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status) => {
    const variants = {
      pago: { bg: "success", text: "Pago" },
      pendente: { bg: "warning", text: "Pendente" },
      cancelado: { bg: "danger", text: "Cancelado" },
    };
    return <Badge bg={variants[status]?.bg}>{variants[status]?.text}</Badge>;
  };

  const getFormaPagamentoIcon = (forma) => {
    const icons = {
      pix: "💳",
      cartao_credito: "💳",
      cartao_debito: "💳",
      dinheiro: "💰",
      transferencia: "🏦",
    };
    return icons[forma] || "💳";
  };

  const filteredTransacoes = financeiroData.transacoes.filter((transacao) => {
    const statusMatch =
      filterStatus === "todos" || transacao.status === filterStatus;
    const tipoMatch =
      filterTipo === "todos" ||
      transacao.tipo === filterTipo ||
      (!transacao.tipo && filterTipo === "entrada");
    return statusMatch && tipoMatch;
  });

  const exportarRelatorio = (tipo) => {
    // Simular exportação
    setMessage({
      type: "success",
      text: `Relatório ${tipo} exportado com sucesso!`,
    });
  };

  const handleNovaTransacao = () => {
    if (
      !novaTransacao.descricao ||
      !novaTransacao.valor ||
      !novaTransacao.categoria
    ) {
      setMessage({
        type: "danger",
        text: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const novaTransacaoCompleta = {
      id: Date.now(),
      cliente:
        novaTransacao.tipo === "entrada" ? "Transação Manual" : "Despesa",
      servico: novaTransacao.descricao,
      valor: parseFloat(novaTransacao.valor),
      data: novaTransacao.data + "T12:00:00",
      status: "pago",
      formaPagamento: novaTransacao.formaPagamento,
      comissao: 0,
      tipo: novaTransacao.tipo,
      categoria: novaTransacao.categoria,
      observacoes: novaTransacao.observacoes,
    };

    setFinanceiroData((prev) => ({
      ...prev,
      transacoes: [novaTransacaoCompleta, ...prev.transacoes],
      kpis: {
        ...prev.kpis,
        receitaTotal:
          prev.kpis.receitaTotal +
          (novaTransacao.tipo === "entrada"
            ? parseFloat(novaTransacao.valor)
            : -parseFloat(novaTransacao.valor)),
        receitaMes:
          prev.kpis.receitaMes +
          (novaTransacao.tipo === "entrada"
            ? parseFloat(novaTransacao.valor)
            : -parseFloat(novaTransacao.valor)),
        transacoesMes: prev.kpis.transacoesMes + 1,
      },
    }));

    setMessage({
      type: "success",
      text: `${
        novaTransacao.tipo === "entrada" ? "Entrada" : "Saída"
      } registrada com sucesso!`,
    });

    setNovaTransacao({
      tipo: "entrada",
      descricao: "",
      valor: "",
      categoria: "",
      data: new Date().toISOString().split("T")[0],
      formaPagamento: "dinheiro",
      observacoes: "",
    });

    setShowModal(false);
  };

  const resetarFormulario = () => {
    setNovaTransacao({
      tipo: "entrada",
      descricao: "",
      valor: "",
      categoria: "",
      data: new Date().toISOString().split("T")[0],
      formaPagamento: "dinheiro",
      observacoes: "",
    });
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
            <h1 className="fw-bold text-dark mb-1">Financeiro</h1>
            <p className="text-muted mb-0">
              Acompanhe sua receita e transações financeiras
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              <FaPlus className="me-2" />
              Nova Transação
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" size="sm">
                <FaDownload className="me-2" />
                Exportar
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => exportarRelatorio("PDF")}>
                  Exportar PDF
                </Dropdown.Item>
                <Dropdown.Item onClick={() => exportarRelatorio("Excel")}>
                  Exportar Excel
                </Dropdown.Item>
                <Dropdown.Item onClick={() => exportarRelatorio("CSV")}>
                  Exportar CSV
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="primary" size="sm">
              <FaCalendarAlt className="me-2" />
              Últimos 30 dias
            </Button>
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

        {/* KPIs Financeiros */}
        <Row className="mb-4">
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Receita Total"
              value={financeiroData.kpis.receitaTotal}
              color="primary"
              icon={FaDollarSign}
              subtitle="Histórico completo"
              formatCurrency={true}
            />
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Receita do Mês"
              value={financeiroData.kpis.receitaMes}
              color="success"
              icon={FaChartLine}
              subtitle={`+${financeiroData.kpis.crescimento}% vs mês anterior`}
              formatCurrency={true}
            />
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Receita da Semana"
              value={financeiroData.kpis.receitaSemana}
              color="info"
              icon={FaMoneyBillWave}
              subtitle="Últimos 7 dias"
              formatCurrency={true}
            />
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Transações"
              value={financeiroData.kpis.transacoesMes}
              color="warning"
              icon={FaCreditCard}
              subtitle="Este mês"
            />
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Ticket Médio"
              value={financeiroData.kpis.ticketMedio}
              color="secondary"
              icon={FaDollarSign}
              subtitle="Por transação"
              formatCurrency={true}
            />
          </Col>
          <Col lg={2} md={4} sm={6} className="mb-3">
            <StatCard
              title="Crescimento"
              value={financeiroData.kpis.crescimento}
              color="success"
              icon={FaArrowUp}
              subtitle="vs mês anterior"
              suffix="%"
            />
          </Col>
        </Row>

        <Row>
          {/* Gráfico de Receita */}
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <FaChartLine className="me-2" />
                    Evolução da Receita
                  </h5>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm">
                      7 dias
                    </Button>
                    <Button variant="primary" size="sm">
                      30 dias
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      90 dias
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <SimpleChart
                  data={financeiroData.graficoReceita.data}
                  labels={financeiroData.graficoReceita.labels}
                  title="Receita Mensal"
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Serviços Mais Vendidos */}
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">
                  <FaDollarSign className="me-2" />
                  Serviços Mais Vendidos
                </h5>
              </Card.Header>
              <Card.Body>
                <div className={styles.servicosList}>
                  {financeiroData.servicosMaisVendidos.map((servico, index) => (
                    <div key={index} className={styles.servicoItem}>
                      <div className={styles.servicoInfo}>
                        <h6 className="mb-1">{servico.nome}</h6>
                        <small className="text-muted">
                          {servico.vendas} vendas
                        </small>
                      </div>
                      <div className={styles.servicoReceita}>
                        <span className="fw-bold text-success">
                          {formatarMoeda(servico.receita)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Filtros */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <FaFilter className="me-2" />
                    Tipo de Transação
                  </Form.Label>
                  <Form.Select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                  >
                    <option value="todos">Todas as Transações</option>
                    <option value="entrada">Apenas Entradas</option>
                    <option value="saida">Apenas Saídas</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status da Transação</Form.Label>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="pago">Pagas</option>
                    <option value="pendente">Pendentes</option>
                    <option value="cancelado">Canceladas</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Período</Form.Label>
                  <Form.Select
                    value={filterPeriodo}
                    onChange={(e) => setFilterPeriodo(e.target.value)}
                  >
                    <option value="mes">Último Mês</option>
                    <option value="semana">Última Semana</option>
                    <option value="trimestre">Último Trimestre</option>
                    <option value="ano">Último Ano</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <div className="text-muted">
                  {filteredTransacoes.length} de{" "}
                  {financeiroData.transacoes.length} transações
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Tabela de Transações */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-0">
            <h5 className="mb-0">Histórico de Transações</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Pagamento</th>
                    <th>Categoria</th>
                    <th width="80">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransacoes.map((transacao) => (
                    <tr key={transacao.id}>
                      <td>
                        <Badge
                          bg={
                            transacao.tipo === "entrada" || !transacao.tipo
                              ? "success"
                              : "danger"
                          }
                          className="text-uppercase"
                        >
                          {transacao.tipo === "entrada" || !transacao.tipo
                            ? "Entrada"
                            : "Saída"}
                        </Badge>
                      </td>
                      <td>
                        <div className="fw-semibold">{transacao.cliente}</div>
                        <small className="text-muted">
                          {transacao.servico}
                        </small>
                      </td>
                      <td>
                        <span
                          className={`fw-medium ${
                            transacao.tipo === "saida"
                              ? "text-danger"
                              : "text-success"
                          }`}
                        >
                          {transacao.tipo === "saida" ? "-" : "+"}
                          {formatarMoeda(transacao.valor)}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted">
                          {formatarData(transacao.data)}
                        </span>
                      </td>
                      <td>{getStatusBadge(transacao.status)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="me-2">
                            {getFormaPagamentoIcon(transacao.formaPagamento)}
                          </span>
                          <span className="text-capitalize">
                            {transacao.formaPagamento.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted text-capitalize">
                          {transacao.categoria
                            ? transacao.categoria.replace("_", " ")
                            : "N/A"}
                        </span>
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
                            <Dropdown.Item>
                              <FaEye className="me-2" />
                              Ver Detalhes
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <FaDownload className="me-2" />
                              Baixar Comprovante
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

        {/* Resumo Financeiro */}
        <Row className="mt-4">
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Resumo do Período</h5>
              </Card.Header>
              <Card.Body>
                <div className="row">
                  <div className="col-4">
                    <div className="text-center">
                      <h4 className="fw-bold text-success">
                        {formatarMoeda(
                          filteredTransacoes
                            .filter((t) => t.tipo === "entrada" || !t.tipo)
                            .reduce((sum, t) => sum + t.valor, 0)
                        )}
                      </h4>
                      <small className="text-muted">Entradas</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center">
                      <h4 className="fw-bold text-danger">
                        {formatarMoeda(
                          filteredTransacoes
                            .filter((t) => t.tipo === "saida")
                            .reduce((sum, t) => sum + t.valor, 0)
                        )}
                      </h4>
                      <small className="text-muted">Saídas</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center">
                      <h4 className="fw-bold text-primary">
                        {formatarMoeda(
                          filteredTransacoes.reduce((sum, t) => {
                            const valor =
                              t.tipo === "saida" ? -t.valor : t.valor;
                            return sum + valor;
                          }, 0)
                        )}
                      </h4>
                      <small className="text-muted">Saldo</small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Dicas Financeiras</h5>
              </Card.Header>
              <Card.Body>
                <div className={styles.tipsList}>
                  <div className={styles.tipItem}>
                    <FaArrowUp className="text-success me-2" />
                    <span>
                      Responder avaliações pode aumentar suas vendas em até 15%
                    </span>
                  </div>
                  <div className={styles.tipItem}>
                    <FaChartLine className="text-info me-2" />
                    <span>
                      Oferecer descontos em pacotes pode aumentar o ticket médio
                    </span>
                  </div>
                  <div className={styles.tipItem}>
                    <FaDollarSign className="text-warning me-2" />
                    <span>
                      Diversificar formas de pagamento pode aumentar conversões
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal Nova Transação */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <FaPlus className="me-2" />
              Nova Transação
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Transação *</Form.Label>
                  <div className="d-flex gap-2">
                    <Button
                      variant={
                        novaTransacao.tipo === "entrada"
                          ? "success"
                          : "outline-success"
                      }
                      size="sm"
                      onClick={() =>
                        setNovaTransacao((prev) => ({
                          ...prev,
                          tipo: "entrada",
                        }))
                      }
                    >
                      <FaPlus className="me-2" />
                      Entrada
                    </Button>
                    <Button
                      variant={
                        novaTransacao.tipo === "saida"
                          ? "danger"
                          : "outline-danger"
                      }
                      size="sm"
                      onClick={() =>
                        setNovaTransacao((prev) => ({ ...prev, tipo: "saida" }))
                      }
                    >
                      <FaMinus className="me-2" />
                      Saída
                    </Button>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data *</Form.Label>
                  <Form.Control
                    type="date"
                    value={novaTransacao.data}
                    onChange={(e) =>
                      setNovaTransacao((prev) => ({
                        ...prev,
                        data: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Descrição *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Venda de ração, Pagamento de fornecedor, etc."
                    value={novaTransacao.descricao}
                    onChange={(e) =>
                      setNovaTransacao((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Valor (R$) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={novaTransacao.valor}
                    onChange={(e) =>
                      setNovaTransacao((prev) => ({
                        ...prev,
                        valor: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria *</Form.Label>
                  <Form.Select
                    value={novaTransacao.categoria}
                    onChange={(e) =>
                      setNovaTransacao((prev) => ({
                        ...prev,
                        categoria: e.target.value,
                      }))
                    }
                  >
                    <option value="">Selecione uma categoria</option>
                    {novaTransacao.tipo === "entrada" ? (
                      <>
                        <option value="venda_servico">Venda de Serviço</option>
                        <option value="venda_produto">Venda de Produto</option>
                        <option value="pagamento_cliente">
                          Pagamento de Cliente
                        </option>
                        <option value="reembolso">Reembolso</option>
                        <option value="outros_ganhos">Outros Ganhos</option>
                      </>
                    ) : (
                      <>
                        <option value="fornecedores">Fornecedores</option>
                        <option value="funcionarios">Funcionários</option>
                        <option value="aluguel">Aluguel</option>
                        <option value="utilitarios">Utilitários</option>
                        <option value="manutencao">Manutenção</option>
                        <option value="marketing">Marketing</option>
                        <option value="impostos">Impostos</option>
                        <option value="outras_despesas">Outras Despesas</option>
                      </>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Forma de Pagamento</Form.Label>
                  <Form.Select
                    value={novaTransacao.formaPagamento}
                    onChange={(e) =>
                      setNovaTransacao((prev) => ({
                        ...prev,
                        formaPagamento: e.target.value,
                      }))
                    }
                  >
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="transferencia">Transferência</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Observações adicionais sobre a transação..."
                value={novaTransacao.observacoes}
                onChange={(e) =>
                  setNovaTransacao((prev) => ({
                    ...prev,
                    observacoes: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="outline-secondary" onClick={resetarFormulario}>
              Limpar
            </Button>
            <Button variant="primary" onClick={handleNovaTransacao}>
              <FaPlus className="me-2" />
              Registrar Transação
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default FinanceiroPage;
