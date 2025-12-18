import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Table,
  Tabs,
  Tab,
  Form,
  Modal,
  InputGroup,
  ProgressBar,
} from "react-bootstrap";
import { api } from "../../../utils/api";
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaPlus,
  FaDownload,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaUser,
  FaPaw,
  FaBox,
  FaBullhorn,
  FaCog,
  FaTimes,
  FaCopy,
  FaMoneyBill,
  FaReceipt,
  FaSearch,
  FaExchangeAlt,
  FaWallet,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";

const FinanceiroPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    faturamentoBruto: 0,
    custosTotais: 0,
    lucroLiquido: 0,
    ticketMedio: 0,
  });

  // Estados para dados reais do banco
  const [historicalData, setHistoricalData] = useState([]);
  const [servicosRentaveis, setServicosRentaveis] = useState([]);
  const [analiseCustos, setAnaliseCustos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [servicos, setServicos] = useState([]);

  // Estados para sidebar
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedTransacao, setSelectedTransacao] = useState(null);
  const sidebarRef = useRef(null);

  // Estados para modais
  const [showReceitaModal, setShowReceitaModal] = useState(false);
  const [showDespesaModal, setShowDespesaModal] = useState(false);
  const [showServicoModal, setShowServicoModal] = useState(false);
  const [editingReceita, setEditingReceita] = useState(null);
  const [editingDespesa, setEditingDespesa] = useState(null);
  const [editingServico, setEditingServico] = useState(null);
  const [saving, setSaving] = useState(false);

  // Estados para formulários
  const [receitaForm, setReceitaForm] = useState({
    valor: "",
    data: new Date().toISOString().split("T")[0],
    descricao: "",
    cliente: "",
    paciente: "",
    status: "pendente",
    forma_pagamento: "",
    nota_fiscal: "",
    observacoes: "",
  });
  const [despesaForm, setDespesaForm] = useState({
    valor: "",
    data: new Date().toISOString().split("T")[0],
    descricao: "",
    categoria: "",
    fornecedor: "",
  });
  const [servicoForm, setServicoForm] = useState({
    nome_servico: "",
    categoria: "",
    preco: "",
    descricao: "",
    duracao: 30,
    status: "ativo",
  });

  const { user } = useUser();

  const formatCurrency = React.useCallback((value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }, []);

  // Funções para gerenciar sidebar
  const handleTransacaoClick = (transacao) => {
    setSelectedTransacao(transacao);
    setShowSidebar(true);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setSelectedTransacao(null);
  };

  // Fechar sidebar ao clicar no overlay
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
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
  }, [showSidebar]);

  // Calcular tendências (comparar com período anterior)
  const calcularTendencia = (valorAtual, valorAnterior) => {
    if (!valorAnterior || valorAnterior === 0) return { percentual: 0, positiva: true };
    const percentual = ((valorAtual - valorAnterior) / valorAnterior) * 100;
    return { percentual: Math.abs(percentual), positiva: percentual >= 0 };
  };

  // Obter transações recentes (últimas 5)
  const transacoesRecentes = React.useMemo(() => {
    const todas = [...receitas.map(r => ({ ...r, tipo: 'receita' })), ...despesas.map(d => ({ ...d, tipo: 'despesa' }))];
    return todas
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 5);
  }, [receitas, despesas]);

  // Função para buscar dados financeiros reais do banco
  const carregarDadosFinanceiros = React.useCallback(async () => {
    try {
      console.log("🔄 carregarDadosFinanceiros iniciado");
      setLoading(true);

      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar transações (receitas e despesas) via API
      let transacoes = [];
      try {
        const transacoesData = await api.get("/transacoes");
        transacoes = Array.isArray(transacoesData) ? transacoesData : [];
      } catch (error) {
        console.error("❌ Erro ao buscar transações:", error);
        transacoes = [];
      }

      if (transacoes.length === 0) {
        console.log("ℹ️ Nenhuma transação encontrada");
        setReceitas([]);
        setDespesas([]);
        setKpis({
          faturamentoBruto: 0,
          custosTotais: 0,
          lucroLiquido: 0,
          ticketMedio: 0,
        });
        setHistoricalData([]);
      } else {
        // Separar receitas e despesas
        const receitasData = transacoes.filter((t) => t.tipo === "receita");
        const despesasData = transacoes.filter((t) => t.tipo === "despesa");

        setReceitas(receitasData);
        setDespesas(despesasData);

        // Calcular KPIs
        const totalReceitas = receitasData.reduce(
          (sum, t) => sum + Number(t.valor),
          0
        );
        const totalDespesas = despesasData.reduce(
          (sum, t) => sum + Number(t.valor),
          0
        );
        const lucroLiquido = totalReceitas - totalDespesas;
        const ticketMedio =
          receitasData.length > 0 ? totalReceitas / receitasData.length : 0;

        const kpisData = {
          faturamentoBruto: totalReceitas,
          custosTotais: totalDespesas,
          lucroLiquido: lucroLiquido,
          ticketMedio: ticketMedio,
        };

        setKpis(kpisData);

        // Calcular dados históricos (últimos 6 meses)
        const dadosHistoricos = [];
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
        const hoje = new Date();

        for (let i = 5; i >= 0; i--) {
          const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
          const mesStr = meses[mes.getMonth()];

          // Filtrar transações do mês
          const transacoesMes = transacoes.filter((t) => {
            const dataTransacao = new Date(t.data);
            return (
              dataTransacao.getMonth() === mes.getMonth() &&
              dataTransacao.getFullYear() === mes.getFullYear()
            );
          });

          const faturamentoMes = transacoesMes
            .filter((t) => t.tipo === "receita")
            .reduce((sum, t) => sum + Number(t.valor), 0);

          const despesasMes = transacoesMes
            .filter((t) => t.tipo === "despesa")
            .reduce((sum, t) => sum + Number(t.valor), 0);

          dadosHistoricos.push({
            mes: mesStr,
            faturamento: faturamentoMes,
            lucro: faturamentoMes - despesasMes,
          });
        }

        setHistoricalData(dadosHistoricos);

        // Calcular análise de custos por categoria
        const custosPorCategoria = {};
        despesasData.forEach((despesa) => {
          const categoria = despesa.categoria || "Outros";
          if (!custosPorCategoria[categoria]) {
            custosPorCategoria[categoria] = 0;
          }
          custosPorCategoria[categoria] += Number(despesa.valor);
        });

        const totalCustos = Object.values(custosPorCategoria).reduce(
          (sum, valor) => sum + valor,
          0
        );
        const analiseCustosData = Object.entries(custosPorCategoria).map(
          ([categoria, valor]) => ({
            categoria: categoria,
            percentual:
              totalCustos > 0 ? Math.round((valor / totalCustos) * 100) : 0,
            valor: valor,
          })
        );

        console.log("📊 Análise de custos calculada:", analiseCustosData);
        setAnaliseCustos(analiseCustosData);
      }

      // Buscar serviços via API
      let servicosData = [];
      try {
        const servicosResponse = await api.get("/servicos?status=ativo");
        servicosData = Array.isArray(servicosResponse) ? servicosResponse : [];
      } catch (error) {
        console.error("❌ Erro ao buscar serviços:", error);
        servicosData = [];
      }

      if (servicosData.length === 0) {
        console.log("ℹ️ Nenhum serviço encontrado");
        setServicos([]);
        setServicosRentaveis([]);
      } else {
        setServicos(servicosData);

        // Calcular serviços mais rentáveis (baseado no preço)
        const servicosOrdenados = [...servicosData].sort(
          (a, b) => Number(b.preco) - Number(a.preco)
        );
        const topServicos = servicosOrdenados.slice(0, 4);

        const totalPrecoServicos = topServicos.reduce(
          (sum, s) => sum + Number(s.preco),
          0
        );
        const servicosRentaveisData = topServicos.map((servico) => ({
          servico: servico.nome_servico,
          percentual:
            totalPrecoServicos > 0
              ? Math.round((Number(servico.preco) / totalPrecoServicos) * 100)
              : 0,
          valor: Number(servico.preco),
        }));

        console.log("💰 Serviços rentáveis calculados:", servicosRentaveisData);
        setServicosRentaveis(servicosRentaveisData);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar dados financeiros:", error);
    } finally {
      console.log("✅ carregarDadosFinanceiros finalizado - setLoading(false)");
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log("🔄 useEffect executado - user?.id_usuario:", user?.id_usuario);
    if (user?.id_usuario) {
      console.log("🚀 Iniciando carregamento de dados...");
      carregarDadosFinanceiros();
    }
  }, [user?.id_usuario, carregarDadosFinanceiros]);

  // Funções para Receitas
  const handleNovaReceita = () => {
    setEditingReceita(null);
    setReceitaForm({
      valor: "",
      data: new Date().toISOString().split("T")[0],
      descricao: "",
      cliente: "",
      paciente: "",
      status: "pendente",
      forma_pagamento: "",
      nota_fiscal: "",
      observacoes: "",
    });
    setShowReceitaModal(true);
  };

  const handleEditarReceita = (receita) => {
    setEditingReceita(receita);
    setReceitaForm({
      valor: receita.valor.toString(),
      data: receita.data.split("T")[0],
      descricao: receita.descricao || "",
      cliente: receita.cliente || "",
      paciente: receita.paciente || "",
      status: receita.status || "pendente",
      forma_pagamento: receita.forma_pagamento || "",
      nota_fiscal: receita.nota_fiscal || "",
      observacoes: receita.observacoes || "",
    });
    setShowReceitaModal(true);
  };

  const handleSalvarReceita = async () => {
    try {
      setSaving(true);
      const data = {
        tipo: "receita",
        valor: parseFloat(receitaForm.valor),
        data: receitaForm.data,
        descricao: receitaForm.descricao || null,
        cliente: receitaForm.cliente || null,
        paciente: receitaForm.paciente || null,
        status: receitaForm.status,
        forma_pagamento: receitaForm.forma_pagamento || null,
        nota_fiscal: receitaForm.nota_fiscal || null,
        observacoes: receitaForm.observacoes || null,
      };

      if (editingReceita) {
        await api.put(`/transacoes/${editingReceita.id}`, data);
      } else {
        await api.post("/transacoes", data);
      }

      setShowReceitaModal(false);
      await carregarDadosFinanceiros();
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      alert("Erro ao salvar receita: " + (error.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const handleExcluirReceita = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta receita?")) return;

    try {
      await api.delete(`/transacoes/${id}`);
      await carregarDadosFinanceiros();
    } catch (error) {
      console.error("Erro ao excluir receita:", error);
      alert("Erro ao excluir receita: " + (error.message || "Erro desconhecido"));
    }
  };

  // Funções para Despesas
  const handleNovaDespesa = () => {
    setEditingDespesa(null);
    setDespesaForm({
      valor: "",
      data: new Date().toISOString().split("T")[0],
      descricao: "",
      categoria: "",
      fornecedor: "",
    });
    setShowDespesaModal(true);
  };

  const handleEditarDespesa = (despesa) => {
    setEditingDespesa(despesa);
    setDespesaForm({
      valor: despesa.valor.toString(),
      data: despesa.data.split("T")[0],
      descricao: despesa.descricao || "",
      categoria: despesa.categoria || "",
      fornecedor: despesa.fornecedor || "",
    });
    setShowDespesaModal(true);
  };

  const handleSalvarDespesa = async () => {
    try {
      setSaving(true);
      const data = {
        tipo: "despesa",
        valor: parseFloat(despesaForm.valor),
        data: despesaForm.data,
        descricao: despesaForm.descricao || null,
        categoria: despesaForm.categoria || null,
        fornecedor: despesaForm.fornecedor || null,
      };

      if (editingDespesa) {
        await api.put(`/transacoes/${editingDespesa.id}`, data);
      } else {
        await api.post("/transacoes", data);
      }

      setShowDespesaModal(false);
      await carregarDadosFinanceiros();
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      alert("Erro ao salvar despesa: " + (error.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const handleExcluirDespesa = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta despesa?")) return;

    try {
      await api.delete(`/transacoes/${id}`);
      await carregarDadosFinanceiros();
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
      alert("Erro ao excluir despesa: " + (error.message || "Erro desconhecido"));
    }
  };

  // Funções para Serviços
  const handleNovoServico = () => {
    setEditingServico(null);
    setServicoForm({
      nome_servico: "",
      categoria: "",
      preco: "",
      descricao: "",
      duracao: 30,
      status: "ativo",
    });
    setShowServicoModal(true);
  };

  const handleEditarServico = (servico) => {
    setEditingServico(servico);
    setServicoForm({
      nome_servico: servico.nome_servico || "",
      categoria: servico.categoria || "",
      preco: servico.preco.toString(),
      descricao: servico.descricao || "",
      duracao: servico.duracao || 30,
      status: servico.status || "ativo",
    });
    setShowServicoModal(true);
  };

  const handleSalvarServico = async () => {
    try {
      setSaving(true);
      const data = {
        nome_servico: servicoForm.nome_servico,
        categoria: servicoForm.categoria,
        preco: parseFloat(servicoForm.preco),
        descricao: servicoForm.descricao || null,
        duracao: parseInt(servicoForm.duracao),
        status: servicoForm.status,
      };

      if (editingServico) {
        await api.put(`/servicos/${editingServico.id}`, data);
      } else {
        await api.post("/servicos", data);
      }

      setShowServicoModal(false);
      await carregarDadosFinanceiros();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("Erro ao salvar serviço: " + (error.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const handleExcluirServico = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      await api.delete(`/servicos/${id}`);
      await carregarDadosFinanceiros();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      alert("Erro ao excluir serviço: " + (error.message || "Erro desconhecido"));
    }
  };

  if (!user) {
    return (
      <DashboardLayout tipoUsuario="veterinario" nomeUsuario="Carregando...">
        <div className="container-fluid">
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-3">Carregando dados do usuário...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- Helper Components for New Layout ---

  const SplineAreaChart = ({ data, height = 200, color = "#0DB2AC" }) => {
    // Simple implementation of a smooth area chart using SVG path
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.value));
    const normalizedData = data.map((d, i) => ({
      x: i * (100 / (data.length - 1)),
      y: 100 - (d.value / maxVal) * 80 // Leave some padding
    }));

    // Generate Path
    let pathD = `M ${normalizedData[0].x} ${normalizedData[0].y}`;
    for (let i = 0; i < normalizedData.length - 1; i++) {
      const x0 = i > 0 ? normalizedData[i - 1].x : normalizedData[0].x;
      const y0 = i > 0 ? normalizedData[i - 1].y : normalizedData[0].y;
      const x1 = normalizedData[i].x;
      const y1 = normalizedData[i].y;
      const x2 = normalizedData[i + 1].x;
      const y2 = normalizedData[i + 1].y;
      const x3 = i !== normalizedData.length - 2 ? normalizedData[i + 2].x : x2;
      const y3 = i !== normalizedData.length - 2 ? normalizedData[i + 2].y : y2;

      const cp1x = x1 + (x2 - x0) / 6;
      const cp1y = y1 + (y2 - y0) / 6;
      const cp2x = x2 - (x3 - x1) / 6;
      const cp2y = y2 - (y3 - y1) / 6;

      pathD += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x2} ${y2}`;
    }

    return (
      <div style={{ width: "100%", height: height, position: "relative", overflow: "hidden" }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${pathD} L 100 100 L 0 100 Z`} fill={`url(#gradient-${color})`} stroke="none" />
          <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  };

  const DonutChart = ({ data, size = 180 }) => {
    // Create conic gradient from data
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let currentAngle = 0;
    const gradientParts = data.map(item => {
      const angle = (item.value / total) * 360;
      const start = currentAngle;
      const end = currentAngle + angle;
      currentAngle = end;
      return `${item.color} ${start}deg ${end}deg`;
    });

    const gradient = `conic-gradient(${gradientParts.join(", ")})`;

    return (
      <div
        className="d-flex align-items-center justify-content-center position-relative"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: gradient,
          margin: "0 auto"
        }}
      >
        <div
          style={{
            width: size * 0.75,
            height: size * 0.75,
            borderRadius: "50%",
            background: "white"
          }}
        />
      </div>
    );
  };

  return (
    <DashboardLayout
      tipoUsuario="veterinario"
      nomeUsuario={user?.nome}
      sidebarBlurred={showSidebar}
    >
      <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        {/* Header Styles Refined */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark mb-0" style={{ fontSize: "24px" }}>
            Financeiro
          </h2>
          <div className="d-flex gap-2">
            <div className="bg-white rounded-pill px-3 py-2 border d-flex align-items-center" style={{ width: 300 }}>
              <FaSearch className="text-muted me-2" />
              <input
                type="text"
                placeholder="Search placeholder"
                className="border-0 bg-transparent w-100"
                style={{ outline: "none", fontSize: "14px" }}
              />
            </div>
            <Button variant="light" className="rounded-circle border d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              <FaBullhorn className="text-muted" />
            </Button>
            <div className="d-flex align-items-center gap-2 ms-3">
              <div>
                <div className="fw-bold text-end" style={{ fontSize: "14px" }}>{user?.nome}</div>
                <div className="text-muted text-end" style={{ fontSize: "12px" }}>Veterinário</div>
              </div>
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                <FaUser />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <Tabs
          activeKey={activeTab}
          onSelect={React.useCallback((k) => setActiveTab(k), [])}
          className="mb-3"
          style={{ fontSize: "14px" }}
        >
          <Tab eventKey="overview" title="Visão Geral">
            <Row className="g-4">
              {/* Main Content Column */}
              <Col lg={9}>
                {/* Stats Cards Row */}
                <Row className="g-4 mb-4">
                  {[
                    { label: "Income", value: kpis.faturamentoBruto, diff: "+1.78%", icon: FaDollarSign, color: "#e8f5e9", iconColor: "#2e7d32", trend: "up" },
                    { label: "Expense", value: kpis.custosTotais, diff: "-1.26%", icon: FaExchangeAlt, color: "#ffebee", iconColor: "#c62828", trend: "down" },
                    { label: "Savings", value: kpis.lucroLiquido, diff: "+1.5%", icon: FaWallet, color: "#e3f2fd", iconColor: "#1565c0", trend: "up" },
                    { label: "Investment", value: 1600, diff: "+3.85%", icon: FaChartLine, color: "#f3e5f5", iconColor: "#7b1fa2", trend: "up" }
                  ].map((stat, idx) => (
                    <Col md={3} key={idx}>
                      <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
                        <Card.Body>
                          <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: 40, height: 40, backgroundColor: stat.color, color: stat.iconColor }}>
                              <stat.icon />
                            </div>
                            <span className="text-muted fw-semibold" style={{ fontSize: "14px" }}>{stat.label}</span>
                            <div className="ms-auto">
                              <Badge bg={stat.trend === "up" ? "success" : "danger"} className="rounded-pill bg-opacity-10 text-dark fw-normal">
                                <span style={{ color: stat.trend === "up" ? "#2e7d32" : "#c62828" }}>
                                  {stat.diff} {stat.trend === "up" ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                                </span>
                              </Badge>
                            </div>
                          </div>
                          <h3 className="fw-bold mb-1">{formatCurrency(stat.value)}</h3>
                          <small className="text-muted" style={{ fontSize: "12px" }}>
                            {stat.value > 0 ? "+" + formatCurrency(stat.value * 0.05) : formatCurrency(0)} than last week
                          </small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

            {/* Cashflow Chart */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold mb-1">Cashflow</h5>
                    <h2 className="fw-bold mb-0">{formatCurrency(kpis.lucroLiquido)}</h2>
                  </div>
                  <div className="d-flex gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4caf50" }}></span>
                      <small>Income</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#212121" }}></span>
                      <small>Expense</small>
                    </div>
                    <Form.Select size="sm" className="border-0 bg-light rounded-pill px-3" style={{ width: 120 }}>
                      <option>Last 7 Days</option>
                    </Form.Select>
                  </div>
                </div>

                {/* Chart Area */}
                <div style={{ height: 300, position: "relative" }}>
                  {/* Background Lines */}
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                      position: "absolute", top: `${i * 33}%`, width: "100%", height: 1, background: "#f5f5f5"
                    }} />
                  ))}

                  {/* Render Chart */}
                  <SplineAreaChart
                    data={historicalData.length > 0 ? historicalData.map(d => ({ value: d.faturamento })) : [{ value: 50 }, { value: 80 }, { value: 45 }, { value: 90 }, { value: 60 }, { value: 75 }]}
                    height={300}
                    color="#4caf50" // Green
                  />
                  <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
                    <SplineAreaChart
                      data={historicalData.length > 0 ? historicalData.map(d => ({ value: d.faturamento - d.lucro })) : [{ value: 30 }, { value: 40 }, { value: 20 }, { value: 50 }, { value: 40 }, { value: 30 }]}
                      height={300}
                      color="#212121" // Black
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3 text-muted" style={{ fontSize: "12px" }}>
                  {historicalData.length > 0
                    ? historicalData.map((d, i) => <span key={i}>{d.mes}</span>)
                    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <span key={d}>{d}</span>)}
                </div>
              </Card.Body>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
              <Card.Header className="bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Transactions</h5>
                <div className="d-flex gap-2">
                  <Form.Select size="sm" className="border-0 bg-light rounded-pill px-3">
                    <option>This Month</option>
                  </Form.Select>
                  <Button
                    variant="primary"
                    onClick={handleNovaReceita}
                    className="rounded-pill d-flex align-items-center gap-2"
                    style={{ fontSize: "13px" }}
                  >
                    <FaPlus size={10} /> Receita
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleNovaDespesa}
                    className="rounded-pill d-flex align-items-center gap-2"
                    style={{ fontSize: "13px" }}
                  >
                    <FaPlus size={10} /> Despesa
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <Table borderless hover responsive>
                  <thead className="text-muted" style={{ fontSize: "12px", borderBottom: "1px solid #f0f0f0" }}>
                    <tr>
                      <th className="fw-normal pb-3">Transaction Name</th>
                      <th className="fw-normal pb-3">Date & Time</th>
                      <th className="fw-normal pb-3">Amount</th>
                      <th className="fw-normal pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacoesRecentes.length > 0 ? transacoesRecentes.map((t) => (
                      <tr key={t.id} style={{ cursor: "pointer" }} onClick={() => handleTransacaoClick(t)}>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: 36, height: 36, backgroundColor: t.tipo === 'receita' ? "#e8f5e9" : "#ffebee" }}>
                              {t.tipo === 'receita' ? <FaDollarSign color="#2e7d32" /> : <FaBox color="#c62828" />}
                            </div>
                            <div>
                              <div className="fw-semibold" style={{ fontSize: "14px" }}>
                                {t.descricao || (t.tipo === 'receita' ? 'Receita recebida' : 'Despesa paga')}
                              </div>
                              <small className="text-muted" style={{ fontSize: "12px" }}>
                                {t.categoria || (t.tipo === 'receita' ? 'Venda' : 'Pagamento')}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 align-middle text-muted" style={{ fontSize: "13px" }}>
                          {new Date(t.data).toLocaleDateString()}
                          <br />
                          <small style={{ fontSize: "11px" }}>{new Date(t.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                        </td>
                        <td className="py-3 align-middle fw-bold" style={{ fontSize: "14px", color: t.tipo === 'receita' ? "#2e7d32" : "#c62828" }}>
                          {t.tipo === 'receita' ? "+" : "-"}{formatCurrency(Number(t.valor))}
                        </td>
                        <td className="py-3 align-middle">
                          <Badge bg={t.status === 'pago' || t.status === 'confirmado' ? "success" : "warning"}
                            className="rounded-pill fw-normal px-3" style={{ fontSize: "11px" }}>
                            {t.status || "Completed"}
                          </Badge>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          Nenhuma transação recente encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Serviços Rentáveis Compactos */}
          <Col lg={6}>
            <Card className="border" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
              <Card.Header
                className="bg-white border-0 pb-2"
                style={{ borderBottom: "1px solid #e9ecef" }}
              >
                <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "15px" }}>
                  <FaChartPie className="me-2" style={{ color: "#0DB2AC" }} />
                  Serviços Mais Rentáveis
                </h6>
              </Card.Header>
              <Card.Body className="p-3">
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    overflowX: "hidden"
                  }}
                >
                  {servicosRentaveis.length > 0 ? (
                    <div className="d-flex flex-column gap-2">
                      {servicosRentaveis.map((servico, index) => (
                        <div
                          key={index}
                          className="p-2 border rounded"
                          style={{ backgroundColor: "#f8f9fa", borderColor: "#e9ecef" }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>
                              {servico.servico}
                            </span>
                            <Badge bg="success" style={{ fontSize: "11px" }}>
                              {servico.percentual}%
                            </Badge>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <ProgressBar
                              variant="success"
                              now={servico.percentual}
                              style={{ height: "6px", flex: 1, borderRadius: 3 }}
                            />
                            <span className="fw-semibold" style={{ fontSize: "13px", color: "#28a745", minWidth: "80px", textAlign: "right" }}>
                              {formatCurrency(servico.valor)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-3">
                      <FaChartPie className="text-muted mb-2" size={24} />
                      <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                        Nenhum serviço disponível
                      </p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Serviços Rentáveis Compactos */}
          <Col lg={3}>
            <Card className="border" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
              <Card.Header
                className="bg-white border-0 pb-2"
                style={{ borderBottom: "1px solid #e9ecef" }}
              >
                <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "15px" }}>
                  <FaChartPie className="me-2" style={{ color: "#0DB2AC" }} />
                  Serviços Mais Rentáveis
                </h6>
              </Card.Header>
              <Card.Body className="p-3">
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    overflowX: "hidden"
                  }}
                >
                  {servicosRentaveis.length > 0 ? (
                    <div className="d-flex flex-column gap-2">
                      {servicosRentaveis.map((servico, index) => (
                        <div
                          key={index}
                          className="p-2 border rounded"
                          style={{ backgroundColor: "#f8f9fa", borderColor: "#e9ecef" }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold text-dark" style={{ fontSize: "13px" }}>
                              {servico.servico}
                            </span>
                            <Badge bg="success" style={{ fontSize: "11px" }}>
                              {servico.percentual}%
                            </Badge>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <ProgressBar
                              variant="success"
                              now={servico.percentual}
                              style={{ height: "6px", flex: 1, borderRadius: 3 }}
                            />
                            <span className="fw-semibold" style={{ fontSize: "13px", color: "#28a745", minWidth: "80px", textAlign: "right" }}>
                              {formatCurrency(servico.valor)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-3">
                      <FaChartPie className="text-muted mb-2" size={24} />
                      <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                        Nenhum serviço disponível
                      </p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
          </Tab>

          <Tab eventKey="receitas" title="Receitas">
        <Card className="border" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
          <Card.Header
            className="bg-white border-0 pb-2"
            style={{ borderBottom: "1px solid #e9ecef" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "15px" }}>
                <FaDollarSign className="me-2" style={{ color: "#0DB2AC" }} />
                Detalhamento de Receitas ({receitas.length})
              </h6>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  style={{ borderColor: "#e9ecef", color: "#6c757d", fontSize: "13px" }}
                  onClick={React.useCallback(() => {
                    const csvContent =
                      receitas.length > 0
                        ? "Data,Cliente,Paciente,Descrição,Valor,Status\n" +
                        receitas
                          .map(
                            (r) =>
                              `${new Date(r.data).toLocaleDateString(
                                "pt-BR"
                              )},"${r.cliente || ""}","${r.paciente || ""
                              }","${r.descricao || ""}",${r.valor},"${r.status || "Pendente"
                              }"`
                          )
                          .join("\n")
                        : "Data,Cliente,Paciente,Descrição,Valor,Status";
                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "receitas.csv";
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }, [receitas])}
                >
                  <FaDownload className="me-1" />
                  Exportar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNovaReceita}
                  style={{ fontSize: "13px" }}
                >
                  <FaPlus className="me-1" />
                  Nova Receita
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {receitas.length > 0 ? (
              <div
                style={{
                  maxHeight: "calc(100vh - 400px)",
                  overflowY: "auto",
                  overflowX: "hidden"
                }}
              >
                <Table hover className="mb-0" style={{ fontSize: "14px" }}>
                  <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 10 }}>
                    <tr>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Data</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Cliente</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Paciente</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Descrição</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Valor</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Pagamento</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Status</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receitas.map((receita) => (
                      <tr
                        key={receita.id}
                        className="cursor-pointer"
                        onClick={() => handleTransacaoClick({ ...receita, tipo: "receita" })}
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
                        <td className="align-middle" style={{ padding: "12px", fontSize: "13px" }}>
                          {new Date(receita.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-muted" size={12} />
                            <span style={{ fontSize: "13px" }}>{receita.cliente || "N/A"}</span>
                          </div>
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <div className="d-flex align-items-center">
                            <FaPaw className="me-2 text-muted" size={12} />
                            <span style={{ fontSize: "13px" }}>{receita.paciente || "N/A"}</span>
                          </div>
                        </td>
                        <td className="align-middle" style={{ padding: "12px", fontSize: "13px" }}>
                          {receita.descricao || "N/A"}
                        </td>
                        <td className="align-middle fw-bold text-success" style={{ padding: "12px", fontSize: "14px" }}>
                          {formatCurrency(receita.valor)}
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          {receita.forma_pagamento ? (
                            <Badge bg="info" style={{ fontSize: "11px" }}>
                              {receita.forma_pagamento
                                .replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>
                          ) : (
                            <span className="text-muted" style={{ fontSize: "12px" }}>-</span>
                          )}
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <Badge
                            bg={
                              receita.status === "Recebido"
                                ? "success"
                                : receita.status === "Cancelado"
                                  ? "danger"
                                  : "warning"
                            }
                            style={{ fontSize: "11px" }}
                          >
                            {receita.status || "Pendente"}
                          </Badge>
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Ver detalhes"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTransacaoClick({ ...receita, tipo: "receita" });
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
                                handleEditarReceita(receita);
                              }}
                              style={{ borderColor: "#e9ecef", color: "#6c757d", padding: "4px 8px" }}
                            >
                              <FaEdit size={12} />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Excluir"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExcluirReceita(receita.id);
                              }}
                              style={{ borderColor: "#e9ecef", color: "#dc3545", padding: "4px 8px" }}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-5">
                <FaDollarSign className="text-muted mb-3" size={48} />
                <h6 className="text-muted">Nenhuma receita registrada</h6>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  As receitas aparecerão aqui conforme forem registradas no
                  sistema
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Tab>

      <Tab eventKey="despesas" title="Despesas">
        <Card className="border" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
          <Card.Header
            className="bg-white border-0 pb-2"
            style={{ borderBottom: "1px solid #e9ecef" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "15px" }}>
                <FaChartLine className="me-2" style={{ color: "#0DB2AC" }} />
                Detalhamento de Despesas ({despesas.length})
              </h6>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  style={{ borderColor: "#e9ecef", color: "#6c757d", fontSize: "13px" }}
                  onClick={() => {
                    const csvContent =
                      despesas.length > 0
                        ? "Data,Descrição,Categoria,Fornecedor,Valor\n" +
                        despesas
                          .map(
                            (d) =>
                              `${new Date(d.data).toLocaleDateString(
                                "pt-BR"
                              )},"${d.descricao || ""}","${d.categoria || ""
                              }","${d.fornecedor || ""}",${d.valor}`
                          )
                          .join("\n")
                        : "Data,Descrição,Categoria,Fornecedor,Valor";
                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "despesas.csv";
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  <FaDownload className="me-1" />
                  Exportar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNovaDespesa}
                  style={{ fontSize: "13px" }}
                >
                  <FaPlus className="me-1" />
                  Nova Despesa
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {despesas.length > 0 ? (
              <div
                style={{
                  maxHeight: "calc(100vh - 400px)",
                  overflowY: "auto",
                  overflowX: "hidden"
                }}
              >
                <Table hover className="mb-0" style={{ fontSize: "14px" }}>
                  <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 10 }}>
                    <tr>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Data</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Descrição</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Categoria</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Fornecedor</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Valor</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {despesas.map((despesa) => (
                      <tr
                        key={despesa.id}
                        className="cursor-pointer"
                        onClick={() => handleTransacaoClick({ ...despesa, tipo: "despesa" })}
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
                        <td className="align-middle" style={{ padding: "12px", fontSize: "13px" }}>
                          {new Date(despesa.data).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="align-middle" style={{ padding: "12px", fontSize: "13px" }}>
                          {despesa.descricao || "N/A"}
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <Badge
                            bg={
                              despesa.categoria === "custo_fixo"
                                ? "secondary"
                                : despesa.categoria === "insumo"
                                  ? "info"
                                  : despesa.categoria === "marketing"
                                    ? "primary"
                                    : "secondary"
                            }
                            style={{ fontSize: "11px" }}
                          >
                            {despesa.categoria || "Outros"}
                          </Badge>
                        </td>
                        <td className="align-middle" style={{ padding: "12px", fontSize: "13px" }}>
                          {despesa.fornecedor || "N/A"}
                        </td>
                        <td className="align-middle fw-bold text-danger" style={{ padding: "12px", fontSize: "14px" }}>
                          {formatCurrency(despesa.valor)}
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Ver detalhes"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTransacaoClick({ ...despesa, tipo: "despesa" });
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
                                handleEditarDespesa(despesa);
                              }}
                              style={{ borderColor: "#e9ecef", color: "#6c757d", padding: "4px 8px" }}
                            >
                              <FaEdit size={12} />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              title="Excluir"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExcluirDespesa(despesa.id);
                              }}
                              style={{ borderColor: "#e9ecef", color: "#dc3545", padding: "4px 8px" }}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-5">
                <FaChartLine className="text-muted mb-3" size={48} />
                <h6 className="text-muted">Nenhuma despesa registrada</h6>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  As despesas aparecerão aqui conforme forem registradas no
                  sistema
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Tab>

      <Tab eventKey="servicos" title="Meus Serviços">
        <Card className="border" style={{ borderRadius: 8, borderColor: "#e9ecef" }}>
          <Card.Header
            className="bg-white border-0 pb-2"
            style={{ borderBottom: "1px solid #e9ecef" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fw-semibold text-dark mb-0" style={{ fontSize: "15px" }}>
                <FaCog className="me-2" style={{ color: "#0DB2AC" }} />
                Gestão de Serviços ({servicos.length})
              </h6>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  style={{ borderColor: "#e9ecef", color: "#6c757d", fontSize: "13px" }}
                  onClick={() => {
                    const csvContent =
                      servicos.length > 0
                        ? "Nome,Categoria,Preço,Status,Descrição\n" +
                        servicos
                          .map(
                            (s) =>
                              `"${s.nome_servico || ""}","${s.categoria || ""
                              }",${s.preco},"${s.status || "ativo"}","${s.descricao || ""
                              }"`
                          )
                          .join("\n")
                        : "Nome,Categoria,Preço,Status,Descrição";
                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "servicos.csv";
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  <FaDownload className="me-1" />
                  Exportar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNovoServico}
                  style={{ fontSize: "13px" }}
                >
                  <FaPlus className="me-1" />
                  Novo Serviço
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {servicos.length > 0 ? (
              <div
                style={{
                  maxHeight: "calc(100vh - 400px)",
                  overflowY: "auto",
                  overflowX: "hidden"
                }}
              >
                <Table hover className="mb-0" style={{ fontSize: "14px" }}>
                  <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 10 }}>
                    <tr>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Nome</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Categoria</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Preço</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Status</th>
                      <th className="border-0" style={{ fontSize: "13px", fontWeight: 600, padding: "12px" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos.map((servico) => (
                      <tr
                        key={servico.id}
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
                        <td className="align-middle fw-semibold" style={{ padding: "12px", fontSize: "14px" }}>
                          {servico.nome_servico || "N/A"}
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <Badge
                            bg={
                              servico.categoria === "Consultas"
                                ? "primary"
                                : servico.categoria === "Vacinas"
                                  ? "success"
                                  : servico.categoria === "Exames"
                                    ? "info"
                                    : servico.categoria === "Cirurgias"
                                      ? "warning"
                                      : servico.categoria === "Emergências"
                                        ? "danger"
                                        : "secondary"
                            }
                            style={{ fontSize: "11px" }}
                          >
                            {servico.categoria || "Outros"}
                          </Badge>
                        </td>
                        <td className="align-middle fw-bold" style={{ padding: "12px", fontSize: "14px", color: "#0DB2AC" }}>
                          {formatCurrency(servico.preco)}
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <Badge
                            bg={
                              servico.status === "ativo"
                                ? "success"
                                : "secondary"
                            }
                            style={{ fontSize: "11px" }}
                          >
                            {servico.status === "ativo" ? "Ativo" : "Inativo"}
                          </Badge>
                        </td>
                        <td className="align-middle" style={{ padding: "12px" }}>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleEditarServico(servico)}
                              title="Editar serviço"
                              style={{ borderColor: "#e9ecef", color: "#6c757d", padding: "4px 8px" }}
                            >
                              <FaEdit size={12} />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleExcluirServico(servico.id)}
                              title="Excluir serviço"
                              style={{ borderColor: "#e9ecef", color: "#dc3545", padding: "4px 8px" }}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-5">
                <FaCog className="text-muted mb-3" size={48} />
                <h6 className="text-muted">Nenhum serviço cadastrado</h6>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  Cadastre seus serviços para começar a gerenciar preços e
                  categorias
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Tab>
    </Tabs>

      {/* Modal de Receita */}
      <Modal
    show={showReceitaModal}
    onHide={() => setShowReceitaModal(false)}
    size="lg"
  >
    <Modal.Header closeButton>
      <Modal.Title>
        {editingReceita ? "Editar Receita" : "Nova Receita"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Valor *</Form.Label>
              <InputGroup>
                <InputGroup.Text>R$</InputGroup.Text>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={receitaForm.valor}
                  onChange={(e) =>
                    setReceitaForm({ ...receitaForm, valor: e.target.value })
                  }
                  required
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Data *</Form.Label>
              <Form.Control
                type="date"
                value={receitaForm.data}
                onChange={(e) =>
                  setReceitaForm({ ...receitaForm, data: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={receitaForm.descricao}
            onChange={(e) =>
              setReceitaForm({ ...receitaForm, descricao: e.target.value })
            }
            placeholder="Descreva a receita..."
          />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                type="text"
                value={receitaForm.cliente}
                onChange={(e) =>
                  setReceitaForm({ ...receitaForm, cliente: e.target.value })
                }
                placeholder="Nome do cliente"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Paciente</Form.Label>
              <Form.Control
                type="text"
                value={receitaForm.paciente}
                onChange={(e) =>
                  setReceitaForm({ ...receitaForm, paciente: e.target.value })
                }
                placeholder="Nome do paciente"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Forma de Pagamento</Form.Label>
              <Form.Select
                value={receitaForm.forma_pagamento}
                onChange={(e) =>
                  setReceitaForm({
                    ...receitaForm,
                    forma_pagamento: e.target.value,
                  })
                }
              >
                <option value="">Selecione...</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao_debito">Cartão Débito</option>
                <option value="cartao_credito">Cartão Crédito</option>
                <option value="transferencia">Transferência</option>
                <option value="cheque">Cheque</option>
                <option value="outros">Outros</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={receitaForm.status}
                onChange={(e) =>
                  setReceitaForm({ ...receitaForm, status: e.target.value })
                }
              >
                <option value="pendente">Pendente</option>
                <option value="Recebido">Recebido</option>
                <option value="Cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nota Fiscal</Form.Label>
              <Form.Control
                type="text"
                value={receitaForm.nota_fiscal}
                onChange={(e) =>
                  setReceitaForm({
                    ...receitaForm,
                    nota_fiscal: e.target.value,
                  })
                }
                placeholder="Número da nota fiscal"
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Observações</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={receitaForm.observacoes}
            onChange={(e) =>
              setReceitaForm({ ...receitaForm, observacoes: e.target.value })
            }
            placeholder="Observações adicionais sobre a receita..."
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="secondary"
        onClick={() => setShowReceitaModal(false)}
        disabled={saving}
      >
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={handleSalvarReceita}
        disabled={saving || !receitaForm.valor || !receitaForm.data}
      >
        {saving ? "Salvando..." : "Salvar"}
      </Button>
    </Modal.Footer>
  </Modal>

      {/* Modal de Despesa */}
      <Modal
    show={showDespesaModal}
    onHide={() => setShowDespesaModal(false)}
    size="lg"
  >
    <Modal.Header closeButton>
      <Modal.Title>
        {editingDespesa ? "Editar Despesa" : "Nova Despesa"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Valor *</Form.Label>
              <InputGroup>
                <InputGroup.Text>R$</InputGroup.Text>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={despesaForm.valor}
                  onChange={(e) =>
                    setDespesaForm({ ...despesaForm, valor: e.target.value })
                  }
                  required
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Data *</Form.Label>
              <Form.Control
                type="date"
                value={despesaForm.data}
                onChange={(e) =>
                  setDespesaForm({ ...despesaForm, data: e.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={despesaForm.descricao}
            onChange={(e) =>
              setDespesaForm({ ...despesaForm, descricao: e.target.value })
            }
            placeholder="Descreva a despesa..."
          />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                value={despesaForm.categoria}
                onChange={(e) =>
                  setDespesaForm({ ...despesaForm, categoria: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                <option value="custo_fixo">Custo Fixo</option>
                <option value="insumo">Insumo</option>
                <option value="marketing">Marketing</option>
                <option value="equipamento">Equipamento</option>
                <option value="manutencao">Manutenção</option>
                <option value="outros">Outros</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fornecedor</Form.Label>
              <Form.Control
                type="text"
                value={despesaForm.fornecedor}
                onChange={(e) =>
                  setDespesaForm({ ...despesaForm, fornecedor: e.target.value })
                }
                placeholder="Nome do fornecedor"
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="secondary"
        onClick={() => setShowDespesaModal(false)}
        disabled={saving}
      >
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={handleSalvarDespesa}
        disabled={saving || !despesaForm.valor || !despesaForm.data}
      >
        {saving ? "Salvando..." : "Salvar"}
      </Button>
    </Modal.Footer>
  </Modal>

      {/* Modal de Serviço */}
      <Modal
    show={showServicoModal}
    onHide={() => setShowServicoModal(false)}
    size="lg"
  >
    <Modal.Header closeButton>
      <Modal.Title>
        {editingServico ? "Editar Serviço" : "Novo Serviço"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Serviço *</Form.Label>
              <Form.Control
                type="text"
                value={servicoForm.nome_servico}
                onChange={(e) =>
                  setServicoForm({
                    ...servicoForm,
                    nome_servico: e.target.value,
                  })
                }
                placeholder="Ex: Consulta de rotina"
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Categoria *</Form.Label>
              <Form.Select
                value={servicoForm.categoria}
                onChange={(e) =>
                  setServicoForm({ ...servicoForm, categoria: e.target.value })
                }
                required
              >
                <option value="">Selecione...</option>
                <option value="Consultas">Consultas</option>
                <option value="Vacinas">Vacinas</option>
                <option value="Exames">Exames</option>
                <option value="Cirurgias">Cirurgias</option>
                <option value="Emergências">Emergências</option>
                <option value="Outros">Outros</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Preço *</Form.Label>
              <InputGroup>
                <InputGroup.Text>R$</InputGroup.Text>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={servicoForm.preco}
                  onChange={(e) =>
                    setServicoForm({ ...servicoForm, preco: e.target.value })
                  }
                  required
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Duração (min)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={servicoForm.duracao}
                onChange={(e) =>
                  setServicoForm({
                    ...servicoForm,
                    duracao: parseInt(e.target.value) || 30,
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={servicoForm.status}
                onChange={(e) =>
                  setServicoForm({ ...servicoForm, status: e.target.value })
                }
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={servicoForm.descricao}
            onChange={(e) =>
              setServicoForm({ ...servicoForm, descricao: e.target.value })
            }
            placeholder="Descreva o serviço..."
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="secondary"
        onClick={() => setShowServicoModal(false)}
        disabled={saving}
      >
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={handleSalvarServico}
        disabled={
          saving ||
          !servicoForm.nome_servico ||
          !servicoForm.categoria ||
          !servicoForm.preco
        }
      >
        {saving ? "Salvando..." : "Salvar"}
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
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Layer Lateral (Direita) */}
      {showSidebar && selectedTransacao && (
      <div
        ref={sidebarRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "550px",
          height: "100vh",
          backgroundColor: "white",
          zIndex: 1070,
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
          transform: showSidebar ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          display: "flex",
          flexDirection: "column",
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
            {selectedTransacao.tipo === "receita" ? (
              <FaDollarSign className="me-2" style={{ color: "#28a745" }} />
            ) : (
              <FaChartLine className="me-2" style={{ color: "#dc3545" }} />
            )}
            Detalhes da {selectedTransacao.tipo === "receita" ? "Receita" : "Despesa"}
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
          {selectedTransacao && (
            <div>
              {/* Informações Básicas */}
              <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h4
                        className="fw-bold mb-1"
                        style={{
                          fontSize: "20px",
                          color: selectedTransacao.tipo === "receita" ? "#28a745" : "#dc3545"
                        }}
                      >
                        {selectedTransacao.tipo === "receita" ? "+" : "-"}
                        {formatCurrency(selectedTransacao.valor)}
                      </h4>
                      <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                        {new Date(selectedTransacao.data).toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                    <Badge
                      bg={
                        selectedTransacao.status === "Recebido" || selectedTransacao.status === "pago"
                          ? "success"
                          : selectedTransacao.status === "Cancelado"
                            ? "danger"
                            : "warning"
                      }
                      style={{ fontSize: "13px" }}
                    >
                      {selectedTransacao.status || "Pendente"}
                    </Badge>
                  </div>

                  {selectedTransacao.descricao && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Descrição</small>
                      <p className="mb-0" style={{ fontSize: "14px" }}>
                        {selectedTransacao.descricao}
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Informações Específicas */}
              {selectedTransacao.tipo === "receita" ? (
                <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                  <Card.Body className="p-3">
                    <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>
                      Informações da Receita
                    </h6>
                    <div className="row g-3">
                      {selectedTransacao.cliente && (
                        <div className="col-12">
                          <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Cliente</small>
                          <div className="d-flex align-items-center gap-2">
                            <FaUser className="text-muted" size={14} />
                            <span className="fw-semibold" style={{ fontSize: "14px" }}>
                              {selectedTransacao.cliente}
                            </span>
                          </div>
                        </div>
                      )}
                      {selectedTransacao.paciente && (
                        <div className="col-12">
                          <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Paciente</small>
                          <div className="d-flex align-items-center gap-2">
                            <FaPaw className="text-muted" size={14} />
                            <span className="fw-semibold" style={{ fontSize: "14px" }}>
                              {selectedTransacao.paciente}
                            </span>
                          </div>
                        </div>
                      )}
                      {selectedTransacao.forma_pagamento && (
                        <div className="col-12">
                          <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Forma de Pagamento</small>
                          <Badge bg="info" style={{ fontSize: "13px" }}>
                            {selectedTransacao.forma_pagamento
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                      )}
                      {selectedTransacao.nota_fiscal && (
                        <div className="col-12">
                          <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Nota Fiscal</small>
                          <span className="fw-semibold" style={{ fontSize: "14px" }}>
                            {selectedTransacao.nota_fiscal}
                          </span>
                        </div>
                      )}
                      {selectedTransacao.observacoes && (
                        <div className="col-12">
                          <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Observações</small>
                          <p className="mb-0" style={{ fontSize: "13px" }}>
                            {selectedTransacao.observacoes}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                  <Card.Body className="p-3">
                    <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>
                      Informações da Despesa
                    </h6>
                    <div className="row g-3">
                      {selectedTransacao.categoria && (
                        <div className="col-12">
                          <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Categoria</small>
                          <Badge
                            bg={
                              selectedTransacao.categoria === "custo_fixo"
                                ? "secondary"
                                : selectedTransacao.categoria === "insumo"
                                  ? "info"
                                  : selectedTransacao.categoria === "marketing"
                                    ? "primary"
                                    : "secondary"
                            }
                            style={{ fontSize: "13px" }}
                          >
                            {selectedTransacao.categoria.replace("_", " ")}
                          </Badge>
                        </div>
                      )}
                      {selectedTransacao.fornecedor && (
                        <div className="col-12">
                          <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Fornecedor</small>
                          <span className="fw-semibold" style={{ fontSize: "14px" }}>
                            {selectedTransacao.fornecedor}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Informações Adicionais */}
              <Card className="border mb-3" style={{ borderColor: "#e9ecef", borderRadius: 8 }}>
                <Card.Body className="p-3">
                  <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>
                    Informações Adicionais
                  </h6>
                  <div className="row g-3">
                    <div className="col-6">
                      <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Data</small>
                      <span className="fw-semibold" style={{ fontSize: "14px" }}>
                        {new Date(selectedTransacao.data).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Tipo</small>
                      <Badge
                        bg={selectedTransacao.tipo === "receita" ? "success" : "danger"}
                        style={{ fontSize: "13px" }}
                      >
                        {selectedTransacao.tipo === "receita" ? "Receita" : "Despesa"}
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
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
            onClick={() => {
              if (selectedTransacao.tipo === "receita") {
                handleEditarReceita(selectedTransacao);
              } else {
                handleEditarDespesa(selectedTransacao);
              }
              closeSidebar();
            }}
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
            onClick={() => {
              if (selectedTransacao.tipo === "receita") {
                const novaReceita = { ...selectedTransacao };
                delete novaReceita.id;
                setReceitaForm({
                  valor: novaReceita.valor.toString(),
                  data: novaReceita.data.split("T")[0],
                  descricao: novaReceita.descricao || "",
                  cliente: novaReceita.cliente || "",
                  paciente: novaReceita.paciente || "",
                  status: "pendente",
                  forma_pagamento: novaReceita.forma_pagamento || "",
                  nota_fiscal: "",
                  observacoes: novaReceita.observacoes || "",
                });
                setEditingReceita(null);
                setShowReceitaModal(true);
              } else {
                const novaDespesa = { ...selectedTransacao };
                delete novaDespesa.id;
                setDespesaForm({
                  valor: novaDespesa.valor.toString(),
                  data: novaDespesa.data.split("T")[0],
                  descricao: novaDespesa.descricao || "",
                  categoria: novaDespesa.categoria || "",
                  fornecedor: novaDespesa.fornecedor || "",
                });
                setEditingDespesa(null);
                setShowDespesaModal(true);
              }
              closeSidebar();
            }}
            style={{
              borderColor: "#e9ecef",
              color: "#6c757d",
              fontSize: "13px"
            }}
          >
            <FaCopy />
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              if (selectedTransacao.tipo === "receita") {
                handleExcluirReceita(selectedTransacao.id);
              } else {
                handleExcluirDespesa(selectedTransacao.id);
              }
              closeSidebar();
            }}
            style={{
              borderColor: "#e9ecef",
              color: "#dc3545",
              fontSize: "13px"
            }}
          >
            <FaTrash />
          </Button>
        </div>
      </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default FinanceiroPage;
