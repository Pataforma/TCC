import React, { useState, useEffect } from "react";
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
} from "react-bootstrap";
import { supabase } from "../../../utils/supabase";
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

  const { user } = useUser();

  const formatCurrency = React.useCallback((value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }, []);

  // Função para buscar dados financeiros reais do banco
  const carregarDadosFinanceiros = React.useCallback(async () => {
    try {
      console.log("🔄 carregarDadosFinanceiros iniciado");
      setLoading(true);

      if (!user) {
        setLoading(false);
        return;
      }

      // Buscar ID do veterinário
      const { data: vetData, error: vetError } = await supabase
        .from("veterinarios")
        .select("id_veterinarios")
        .eq("id_usuario", user.id_usuario)
        .single();

      if (vetError || !vetData) {
        console.error("❌ Erro ao buscar veterinário:", vetError);
        setLoading(false);
        return;
      }

      const veterinarioId = vetData.id_veterinarios;

      // Buscar transações (receitas e despesas)
      const { data: transacoes, error: transacoesError } = await supabase
        .from("transacoes")
        .select("*")
        .eq("veterinario_id", veterinarioId)
        .order("data", { ascending: false });

      if (transacoesError) {
        console.error("❌ Erro ao buscar transações:", transacoesError);
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

      // Buscar serviços
      const { data: servicosData, error: servicosError } = await supabase
        .from("servicos_veterinario")
        .select("*")
        .eq("veterinario_id", veterinarioId)
        .eq("status", "ativo")
        .order("preco", { ascending: false });

      if (servicosError) {
        console.error("❌ Erro ao buscar serviços:", servicosError);
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
  }, [user?.id_usuario]);

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

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Dashboard Financeiro</h2>
            <p className="text-muted mb-0">
              Visão completa da saúde financeira do seu negócio
            </p>
          </div>
        </div>

        {/* KPIs Principais */}
        <Row className="mb-4">
          {loading ? (
            <Col lg={12} className="text-center">
              <div className="p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="mt-2 text-muted">
                  Carregando dados financeiros...
                </p>
              </div>
            </Col>
          ) : (
            <>
              <Col lg={3} md={6} className="mb-3">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-2">
                      <div className="text-primary me-2">
                        <FaDollarSign size={20} />
                      </div>
                      <h6 className="text-muted mb-0 fw-semibold">
                        Faturamento Bruto
                      </h6>
                    </div>
                    <h3 className="fw-bold mb-2">
                      {formatCurrency(kpis.faturamentoBruto)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6} className="mb-3">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-2">
                      <div className="text-danger me-2">
                        <FaChartLine size={20} />
                      </div>
                      <h6 className="text-muted mb-0 fw-semibold">
                        Custos Totais
                      </h6>
                    </div>
                    <h3 className="fw-bold mb-2">
                      {formatCurrency(kpis.custosTotais)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6} className="mb-3">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-2">
                      <div className="text-success me-2">
                        <FaChartBar size={20} />
                      </div>
                      <h6 className="text-muted mb-0 fw-semibold">
                        Lucro Líquido
                      </h6>
                    </div>
                    <h3 className="fw-bold mb-2">
                      {formatCurrency(kpis.lucroLiquido)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={3} md={6} className="mb-3">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-2">
                      <div className="text-info me-2">
                        <FaUser size={20} />
                      </div>
                      <h6 className="text-muted mb-0 fw-semibold">
                        Ticket Médio
                      </h6>
                    </div>
                    <h3 className="fw-bold mb-2">
                      {formatCurrency(kpis.ticketMedio)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
            </>
          )}
        </Row>

        {/* Tabs de Navegação */}
        <Tabs
          activeKey={activeTab}
          onSelect={React.useCallback((k) => setActiveTab(k), [])}
          className="mb-4"
        >
          <Tab eventKey="overview" title="Visão Geral">
            <Row>
              {/* Gráfico Histórico */}
              <Col lg={8} className="mb-4">
                <Card className="h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaChartLine className="me-2" />
                      Evolução Financeira (Últimos 6 Meses)
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {historicalData.length > 0 ? (
                      <div
                        className="position-relative"
                        style={{ height: 300 }}
                      >
                        {/* Linhas de grade */}
                        {[0, 25, 50, 75, 100].map((percent) => (
                          <div
                            key={percent}
                            className="position-absolute border-bottom"
                            style={{
                              top: `${percent}%`,
                              left: 0,
                              right: 0,
                              borderColor: "#e9ecef",
                              zIndex: 1,
                            }}
                          />
                        ))}

                        {/* Gráfico de barras simples */}
                        <div className="d-flex align-items-end justify-content-between h-100 px-3">
                          {historicalData.map((item, index) => {
                            const maxValue = Math.max(
                              ...historicalData.map((d) =>
                                Math.max(d.faturamento, d.lucro)
                              )
                            );
                            const barWidth =
                              (100 / historicalData.length) * 0.8;

                            return (
                              <div
                                key={index}
                                className="d-flex flex-column align-items-center"
                                style={{ width: `${barWidth}%` }}
                              >
                                {/* Barra de faturamento */}
                                <div
                                  className="mb-1"
                                  style={{
                                    width: "100%",
                                    height: `${
                                      (item.faturamento / maxValue) * 100
                                    }%`,
                                    backgroundColor: "#0d6efd",
                                    borderRadius: "4px 4px 0 0",
                                    minHeight: "4px",
                                  }}
                                  title={`Faturamento: ${formatCurrency(
                                    item.faturamento
                                  )}`}
                                />
                                {/* Barra de lucro */}
                                <div
                                  className="mb-1"
                                  style={{
                                    width: "100%",
                                    height: `${(item.lucro / maxValue) * 100}%`,
                                    backgroundColor: "#fd7e14",
                                    borderRadius: "4px 4px 0 0",
                                    minHeight: "4px",
                                  }}
                                  title={`Lucro: ${formatCurrency(item.lucro)}`}
                                />
                                <small
                                  className="text-muted mt-2"
                                  style={{ fontSize: "11px" }}
                                >
                                  {item.mes}
                                </small>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <FaChartLine className="text-muted mb-3" size={48} />
                        <p className="text-muted mb-0">
                          Nenhum dado histórico disponível
                        </p>
                        <small className="text-muted">
                          Os dados aparecerão conforme as transações forem
                          registradas
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Análises Rápidas */}
              <Col lg={4} className="mb-4">
                <Row>
                  <Col className="mb-3">
                    <Card className="h-100">
                      <Card.Header>
                        <h6 className="mb-0">
                          <FaChartPie className="me-2" />
                          Serviços Mais Rentáveis
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {console.log(
                          "🔍 Renderizando Serviços Rentáveis - loading:",
                          loading,
                          "dados:",
                          servicosRentaveis
                        )}
                        {servicosRentaveis.length > 0 ? (
                          servicosRentaveis.map((servico, index) => (
                            <div
                              key={index}
                              className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded bg-light"
                            >
                              <div className="flex-grow-1">
                                <div className="fw-bold text-dark mb-1">
                                  {servico.servico}
                                </div>
                                <div className="d-flex align-items-center">
                                  <div
                                    className="progress me-3"
                                    style={{ width: "80px", height: "8px" }}
                                  >
                                    <div
                                      className="progress-bar bg-success"
                                      style={{
                                        width: `${servico.percentual}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <Badge bg="success" className="px-2 py-1">
                                    {servico.percentual}%
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-end">
                                <div className="fw-bold text-success fs-6">
                                  {formatCurrency(servico.valor)}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center p-3">
                            <FaChartPie className="text-muted mb-2" size={24} />
                            <p className="text-muted mb-0 small">
                              Nenhum serviço disponível
                            </p>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              {/* Análise de Custos */}
              <Col lg={6} className="mb-4">
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaChartBar className="me-2" />
                      Análise de Custos por Categoria
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {console.log(
                      "🔍 Renderizando Análise de Custos - loading:",
                      loading,
                      "dados:",
                      analiseCustos
                    )}
                    {analiseCustos.length > 0 ? (
                      analiseCustos.map((custo, index) => (
                        <div
                          key={index}
                          className="d-flex justify-content-between align-items-center mb-4 p-3 border rounded bg-light"
                        >
                          <div className="flex-grow-1 me-4">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-bold text-dark text-capitalize">
                                {custo.categoria.replace("_", " ")}
                              </span>
                              <Badge
                                bg="primary"
                                className="px-3 py-2"
                                style={{ fontSize: "14px" }}
                              >
                                {custo.percentual}%
                              </Badge>
                            </div>
                            <div
                              className="progress"
                              style={{ height: "12px", borderRadius: "6px" }}
                            >
                              <div
                                className="progress-bar bg-gradient"
                                style={{
                                  width: `${custo.percentual}%`,
                                  background: `linear-gradient(90deg, #007bff, #0056b3)`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold text-primary fs-5">
                              {formatCurrency(custo.valor)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-3">
                        <FaChartBar className="text-muted mb-2" size={24} />
                        <p className="text-muted mb-0 small">
                          Nenhuma despesa registrada
                        </p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Projeção de Fluxo de Caixa */}
              <Col lg={6} className="mb-4">
                <Card>
                  <Card.Header>
                    <h6 className="mb-0">
                      <FaCalendarAlt className="me-2" />
                      Projeção do Próximo Mês
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    {
                      <div className="row text-center">
                        <div className="col-6 mb-4">
                          <div className="p-3 border rounded bg-light">
                            <div className="text-success fw-bold fs-3 mb-2">
                              {formatCurrency(kpis.faturamentoBruto * 1.1)}
                            </div>
                            <small className="text-muted fw-semibold">
                              Faturamento Projetado
                            </small>
                          </div>
                        </div>
                        <div className="col-6 mb-4">
                          <div className="p-3 border rounded bg-light">
                            <div className="text-danger fw-bold fs-3 mb-2">
                              {formatCurrency(kpis.custosTotais * 1.05)}
                            </div>
                            <small className="text-muted fw-semibold">
                              Custos Projetados
                            </small>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="p-4 border rounded bg-primary text-white">
                            <div className="fw-bold fs-2 mb-2">
                              {formatCurrency(
                                kpis.faturamentoBruto * 1.1 -
                                  kpis.custosTotais * 1.05
                              )}
                            </div>
                            <small className="fw-semibold">
                              Lucro Projetado
                            </small>
                          </div>
                        </div>
                      </div>
                    }
                    <div className="mt-3 p-3 bg-light rounded">
                      <small className="text-muted">
                        <strong>Baseado em:</strong> Histórico dos últimos 6
                        meses, sazonalidade e custos fixos cadastrados.
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Lançamentos Automáticos */}
            <Row>
              <Col lg={12} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <div className="d-flex align-items-center">
                      <FaChartLine className="me-2 text-primary" />
                      <h6 className="mb-0">Lançamentos Automáticos</h6>
                    </div>
                    <small className="text-muted">
                      O sistema registra automaticamente as transações
                      financeiras
                    </small>
                  </Card.Header>
                  <Card.Body>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="d-flex align-items-start gap-3 p-4 border rounded bg-light shadow-sm">
                          <div className="text-success mt-1">
                            <FaCalendarAlt size={24} />
                          </div>
                          <div className="flex-grow-1">
                            <h6
                              className="mb-2 fw-bold text-dark"
                              style={{ fontSize: "16px" }}
                            >
                              Consultas Finalizadas
                            </h6>
                            <p
                              className="text-muted mb-0"
                              style={{ fontSize: "14px", lineHeight: "1.5" }}
                            >
                              Valor da consulta lançado automaticamente como
                              receita
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-start gap-3 p-4 border rounded bg-light shadow-sm">
                          <div className="text-success mt-1">
                            <FaBox size={24} />
                          </div>
                          <div className="flex-grow-1">
                            <h6
                              className="mb-2 fw-bold text-dark"
                              style={{ fontSize: "16px" }}
                            >
                              Vendas de Produtos
                            </h6>
                            <p
                              className="text-muted mb-0"
                              style={{ fontSize: "14px", lineHeight: "1.5" }}
                            >
                              Receita e custo registrados automaticamente no
                              estoque
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="receitas" title="Receitas">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaDollarSign className="me-2" />
                  Detalhamento de Receitas
                </h5>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={React.useCallback(() => {
                      const csvContent =
                        receitas.length > 0
                          ? "Data,Cliente,Paciente,Descrição,Valor,Status\n" +
                            receitas
                              .map(
                                (r) =>
                                  `${new Date(r.data).toLocaleDateString(
                                    "pt-BR"
                                  )},"${r.cliente || ""}","${
                                    r.paciente || ""
                                  }","${r.descricao || ""}",${r.valor},"${
                                    r.status || "Pendente"
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
                    <FaDownload className="me-2" />
                    Exportar CSV
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      // TODO: Implementar modal para adicionar receita
                      alert(
                        "Funcionalidade de adicionar receita será implementada em breve!"
                      );
                    }}
                  >
                    <FaPlus className="me-2" />
                    Nova Receita
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {receitas.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Paciente</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receitas.map((receita) => (
                        <tr key={receita.id}>
                          <td>
                            {new Date(receita.data).toLocaleDateString("pt-BR")}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaUser className="me-2 text-muted" />
                              {receita.cliente || "N/A"}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaPaw className="me-2 text-muted" />
                              {receita.paciente || "N/A"}
                            </div>
                          </td>
                          <td>{receita.descricao || "N/A"}</td>
                          <td className="fw-bold text-success">
                            {formatCurrency(receita.valor)}
                          </td>
                          <td>
                            <Badge
                              bg={
                                receita.status === "Recebido"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {receita.status || "Pendente"}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 me-2"
                            >
                              <FaEye />
                            </Button>
                            <Button variant="link" size="sm" className="p-0">
                              <FaEdit />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center p-5">
                    <FaDollarSign className="text-muted mb-3" size={48} />
                    <h6 className="text-muted">Nenhuma receita registrada</h6>
                    <p className="text-muted small">
                      As receitas aparecerão aqui conforme forem registradas no
                      sistema
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="despesas" title="Despesas">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaChartLine className="me-2" />
                  Detalhamento de Despesas
                </h5>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      const csvContent =
                        despesas.length > 0
                          ? "Data,Descrição,Categoria,Fornecedor,Valor\n" +
                            despesas
                              .map(
                                (d) =>
                                  `${new Date(d.data).toLocaleDateString(
                                    "pt-BR"
                                  )},"${d.descricao || ""}","${
                                    d.categoria || ""
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
                    <FaDownload className="me-2" />
                    Exportar CSV
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      // TODO: Implementar modal para adicionar despesa
                      alert(
                        "Funcionalidade de adicionar despesa será implementada em breve!"
                      );
                    }}
                  >
                    <FaPlus className="me-2" />
                    Nova Despesa
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {despesas.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Fornecedor</th>
                        <th>Valor</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {despesas.map((despesa) => (
                        <tr key={despesa.id}>
                          <td>
                            {new Date(despesa.data).toLocaleDateString("pt-BR")}
                          </td>
                          <td>{despesa.descricao || "N/A"}</td>
                          <td>
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
                            >
                              {despesa.categoria || "Outros"}
                            </Badge>
                          </td>
                          <td>{despesa.fornecedor || "N/A"}</td>
                          <td className="fw-bold text-danger">
                            {formatCurrency(despesa.valor)}
                          </td>
                          <td>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 me-2"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 me-2"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 text-danger"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Tem certeza que deseja excluir esta despesa?"
                                  )
                                ) {
                                  // TODO: Implementar exclusão
                                  alert(
                                    "Funcionalidade de exclusão será implementada em breve!"
                                  );
                                }
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center p-5">
                    <FaChartLine className="text-muted mb-3" size={48} />
                    <h6 className="text-muted">Nenhuma despesa registrada</h6>
                    <p className="text-muted small">
                      As despesas aparecerão aqui conforme forem registradas no
                      sistema
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="servicos" title="Meus Serviços">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCog className="me-2" />
                  Gestão de Serviços
                </h5>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      const csvContent =
                        servicos.length > 0
                          ? "Nome,Categoria,Preço,Status,Descrição\n" +
                            servicos
                              .map(
                                (s) =>
                                  `"${s.nome_servico || ""}","${
                                    s.categoria || ""
                                  }",${s.preco},"${s.status || "ativo"}","${
                                    s.descricao || ""
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
                    <FaDownload className="me-2" />
                    Exportar CSV
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      // TODO: Implementar modal para adicionar serviço
                      alert(
                        "Funcionalidade de adicionar serviço será implementada em breve!"
                      );
                    }}
                  >
                    <FaPlus className="me-2" />
                    Novo Serviço
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {servicos.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicos.map((servico) => (
                        <tr key={servico.id}>
                          <td className="fw-semibold">
                            {servico.nome_servico || "N/A"}
                          </td>
                          <td>
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
                            >
                              {servico.categoria || "Outros"}
                            </Badge>
                          </td>
                          <td className="fw-bold text-primary">
                            {formatCurrency(servico.preco)}
                          </td>
                          <td>
                            <Badge
                              bg={
                                servico.status === "ativo"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {servico.status === "ativo" ? "Ativo" : "Inativo"}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implementar edição
                                  alert(
                                    "Funcionalidade de edição será implementada em breve!"
                                  );
                                }}
                              >
                                <FaEdit size={12} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Tem certeza que deseja excluir este serviço?"
                                    )
                                  ) {
                                    // TODO: Implementar exclusão
                                    alert(
                                      "Funcionalidade de exclusão será implementada em breve!"
                                    );
                                  }
                                }}
                              >
                                <FaTrash size={12} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center p-5">
                    <FaCog className="text-muted mb-3" size={48} />
                    <h6 className="text-muted">Nenhum serviço cadastrado</h6>
                    <p className="text-muted small">
                      Cadastre seus serviços para começar a gerenciar preços e
                      categorias
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinanceiroPage;
