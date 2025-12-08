import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";
import Botao from "../../../components/ui/Botao";
import OptimizedImage from "../../../components/ui/OptimizedImage";
import { supabase } from "../../../utils/supabase";
import { api } from "../../../utils/api";

const Animais = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perdidos");
  const [filtroPerdidos, setFiltroPerdidos] = useState({
    cidade: "",
    bairro: "",
  });
  const [filtroAdocao, setFiltroAdocao] = useState({
    porte: "",
    idade: "",
    cidade: "",
  });
  const [categoriaDicas, setCategoriaDicas] = useState("todas");
  
  // Estados para dados reais da API
  const [petsPerdidos, setPetsPerdidos] = useState([]);
  const [petsAdocao, setPetsAdocao] = useState([]);
  const [dicas, setDicas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cidades, setCidades] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [showModalArtigo, setShowModalArtigo] = useState(false);
  
  const portes = ["Pequeno", "Médio", "Grande"];
  const idades = ["Filhote", "Adulto", "Idoso"];
  const categorias = [
    "Alimentação",
    "Higiene",
    "Comportamento",
    "Saúde",
    "Treinamento",
  ];

  // Efeito para verificar parâmetros da URL ao carregar
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["perdidos", "adocao", "dicas"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Carregar dados da API
  useEffect(() => {
    carregarDados();
  }, [activeTab, filtroPerdidos, filtroAdocao, categoriaDicas]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      if (activeTab === "perdidos") {
        const params = new URLSearchParams();
        if (filtroPerdidos.cidade) params.append("cidade", filtroPerdidos.cidade);
        if (filtroPerdidos.bairro) params.append("bairro", filtroPerdidos.bairro);
        
        const url = `/animais-perdidos${params.toString() ? `?${params.toString()}` : ""}`;
        const data = await api.get(url);
        setPetsPerdidos(Array.isArray(data) ? data : []);
        
        // Extrair cidades e bairros únicos
        const cidadesUnicas = Array.from(new Set(data.map(p => p.cidade).filter(Boolean))).sort();
        const bairrosUnicos = Array.from(new Set(data.map(p => p.bairro).filter(Boolean))).sort();
        setCidades(cidadesUnicas);
        setBairros(bairrosUnicos);
      } else if (activeTab === "adocao") {
        const params = new URLSearchParams();
        if (filtroAdocao.porte) params.append("porte", filtroAdocao.porte);
        if (filtroAdocao.idade) params.append("idade", filtroAdocao.idade);
        if (filtroAdocao.cidade) params.append("cidade", filtroAdocao.cidade);
        
        const url = `/animais-adocao${params.toString() ? `?${params.toString()}` : ""}`;
        const data = await api.get(url);
        setPetsAdocao(Array.isArray(data) ? data : []);
      } else if (activeTab === "dicas") {
        const params = new URLSearchParams();
        params.append("tipo_post", "blog");
        if (categoriaDicas !== "todas") params.append("categoria", categoriaDicas);
        
        const url = `/marketing/posts/feed/publico?${params.toString()}`;
        const data = await api.get(url);
        setDicas(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dados já vêm filtrados da API
  const perdidosFiltrados = petsPerdidos;
  const adocaoFiltrados = petsAdocao;
  const dicasFiltradas = dicas;

  // Manipuladores de eventos
  const handleFiltroPerdidosChange = (e) => {
    const { name, value } = e.target;
    setFiltroPerdidos((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiltroAdocaoChange = (e) => {
    const { name, value } = e.target;
    setFiltroAdocao((prev) => ({ ...prev, [name]: value }));
  };

  // Função para registrar pet perdido
  const handleRegistrarPetPerdido = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/telalogin");
    } else {
      navigate("/tutor/pet-perdido");
    }
  };

  // Função para cadastrar pet para adoção
  const handleCadastrarPetAdocao = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/telalogin");
    } else {
      navigate("/adocao/cadastro");
    }
  };

  return (
    <>
      <Header />
      <section className="container-fluid animais-bg text-white py-5 mt-5 position-relative">
        {/* Conteúdo com z-index acima do overlay */}
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-5 fw-bold">Animais</h1>
          <p className="lead">
            Encontre pets perdidos, adote um amigo ou aprenda mais sobre
            cuidados com animais
          </p>
        </div>
      </section>

      <div className="container mt-3">
        <button
          className="btn btn-link text-dark"
          onClick={() => window.history.back()}
          style={{ textDecoration: "none" }}
        >
          <i className="bi bi-arrow-left-circle fs-4"></i>
        </button>
      </div>

      <div className="container py-5">
        {/* Abas de navegação */}
        <ul className="nav nav-tabs mb-4" id="animaisTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${
                activeTab === "perdidos"
                  ? "active text-elements fw-semibold"
                  : "text-dark"
              }`}
              onClick={() => setActiveTab("perdidos")}
              style={{
                opacity: activeTab === "perdidos" ? 1 : 0.7,
              }}
            >
              Pets Perdidos
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${
                activeTab === "adocao"
                  ? "active text-elements fw-semibold"
                  : "text-dark"
              }`}
              onClick={() => setActiveTab("adocao")}
              style={{
                opacity: activeTab === "adocao" ? 1 : 0.7,
              }}
            >
              Adoção
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${
                activeTab === "dicas"
                  ? "active text-elements fw-semibold"
                  : "text-dark"
              }`}
              onClick={() => setActiveTab("dicas")}
              style={{
                opacity: activeTab === "dicas" ? 1 : 0.7,
              }}
            >
              Dicas e Cuidados
            </button>
          </li>
        </ul>

        {/* Conteúdo das abas */}
        <div className="tab-content" id="animaisTabsContent">
          {/* Pets Perdidos */}
          {activeTab === "perdidos" && (
            <div className="row">
              {/* Filtros */}
              <div className="col-md-3 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="text-elements mb-4 fw-bold">
                      Filtrar Pets Perdidos
                    </h5>

                    <div className="mb-3">
                      <label
                        htmlFor="perdidosCidade"
                        className="form-label fw-semibold"
                      >
                        Cidade
                      </label>
                      <select
                        className="form-select"
                        id="perdidosCidade"
                        name="cidade"
                        value={filtroPerdidos.cidade}
                        onChange={handleFiltroPerdidosChange}
                      >
                        <option value="">Todas as cidades</option>
                        {cidades.map((cidade, index) => (
                          <option key={index} value={cidade}>
                            {cidade}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="perdidosBairro"
                        className="form-label fw-semibold"
                      >
                        Bairro
                      </label>
                      <select
                        className="form-select"
                        id="perdidosBairro"
                        name="bairro"
                        value={filtroPerdidos.bairro}
                        onChange={handleFiltroPerdidosChange}
                      >
                        <option value="">Todos os bairros</option>
                        {bairros.map((bairro, index) => (
                          <option key={index} value={bairro}>
                            {bairro}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Botao
                      text="Limpar Filtros"
                      bgColor="var(--secondary-color)"
                      hoverColor="var(--elements-color)"
                      onClick={() =>
                        setFiltroPerdidos({ cidade: "", bairro: "" })
                      }
                      className="w-100 mt-3"
                    />

                    <div className="mt-4">
                      <Botao
                        text="Registrar Pet Perdido"
                        bgColor="var(--main-color)"
                        hoverColor="var(--bg-button)"
                        className="w-100"
                        onClick={handleRegistrarPetPerdido}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Pets Perdidos */}
              <div className="col-md-9">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>{perdidosFiltrados.length} Pets Perdidos</h4>
                </div>

                <div className="row g-4">
                  {perdidosFiltrados.length > 0 ? (
                    perdidosFiltrados.map((pet) => (
                      <div key={pet.id} className="col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="row g-0">
                            <div className="col-md-4">
                              <OptimizedImage
                                src={pet.foto_url || "/src/assets/imgs/logo.png"}
                                alt={pet.nome}
                                className="img-fluid rounded-start h-100"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <h5 className="card-title text-elements">
                                    {pet.nome}
                                  </h5>
                                  <span className={`badge ${pet.status === 'encontrado' ? 'bg-success' : 'bg-danger'}`}>
                                    {pet.status === 'encontrado' ? 'Encontrado' : 'Perdido'}
                                  </span>
                                </div>
                                <p className="card-text mb-1">
                                  <small>
                                    {pet.tipo} • {pet.raca || 'SRD'} • {pet.cor || 'Não informado'}
                                  </small>
                                </p>
                                <p className="card-text mb-2">
                                  <i className="bi bi-geo-alt"></i>{" "}
                                  {pet.cidade}{pet.bairro ? `, ${pet.bairro}` : ''}
                                </p>
                                {pet.data_desaparecimento && (
                                  <p className="card-text">
                                    <small className="text-muted">
                                      Desaparecido em: {new Date(pet.data_desaparecimento).toLocaleDateString('pt-BR')}
                                    </small>
                                  </p>
                                )}
                                {pet.descricao && (
                                  <p className="card-text small">
                                    {pet.descricao}
                                  </p>
                                )}
                                <div className="mt-2">
                                  <p className="small mb-1"><strong>Contato:</strong> {pet.contato_nome}</p>
                                  <p className="small mb-1"><strong>Telefone:</strong> {pet.contato_telefone}</p>
                                  {pet.contato_email && (
                                    <p className="small mb-1"><strong>Email:</strong> {pet.contato_email}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-5">
                      <p className="text-muted">
                        Nenhum pet perdido encontrado com os filtros
                        selecionados.
                      </p>
                      <Botao
                        text="Limpar Filtros"
                        bgColor="var(--secondary-color)"
                        hoverColor="var(--elements-color)"
                        onClick={() =>
                          setFiltroPerdidos({ cidade: "", bairro: "" })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Adoção */}
          {activeTab === "adocao" && (
            <div className="row">
              {/* Filtros */}
              <div className="col-md-3 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="text-elements mb-4 fw-bold">
                      Filtrar Pets para Adoção
                    </h5>

                    <div className="mb-3">
                      <label
                        htmlFor="adocaoPorte"
                        className="form-label fw-semibold"
                      >
                        Porte
                      </label>
                      <select
                        className="form-select"
                        id="adocaoPorte"
                        name="porte"
                        value={filtroAdocao.porte}
                        onChange={handleFiltroAdocaoChange}
                      >
                        <option value="">Todos os portes</option>
                        {portes.map((porte, index) => (
                          <option key={index} value={porte}>
                            {porte}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="adocaoIdade"
                        className="form-label fw-semibold"
                      >
                        Idade
                      </label>
                      <select
                        className="form-select"
                        id="adocaoIdade"
                        name="idade"
                        value={filtroAdocao.idade}
                        onChange={handleFiltroAdocaoChange}
                      >
                        <option value="">Todas as idades</option>
                        {idades.map((idade, index) => (
                          <option key={index} value={idade}>
                            {idade}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="adocaoCidade"
                        className="form-label fw-semibold"
                      >
                        Cidade
                      </label>
                      <select
                        className="form-select"
                        id="adocaoCidade"
                        name="cidade"
                        value={filtroAdocao.cidade}
                        onChange={handleFiltroAdocaoChange}
                      >
                        <option value="">Todas as cidades</option>
                        {cidades.map((cidade, index) => (
                          <option key={index} value={cidade}>
                            {cidade}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Botao
                      text="Limpar Filtros"
                      bgColor="var(--secondary-color)"
                      hoverColor="var(--elements-color)"
                      onClick={() =>
                        setFiltroAdocao({ porte: "", idade: "", cidade: "" })
                      }
                      className="w-100 mt-3"
                    />

                    <div className="mt-4">
                      <Botao
                        text="Cadastrar Pet para Adoção"
                        bgColor="var(--main-color)"
                        hoverColor="var(--bg-button)"
                        className="w-100"
                        onClick={handleCadastrarPetAdocao}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Pets para Adoção */}
              <div className="col-md-9">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4>{adocaoFiltrados.length} Pets para Adoção</h4>
                </div>

                <div className="row g-4">
                  {adocaoFiltrados.length > 0 ? (
                    adocaoFiltrados.map((pet) => (
                      <div key={pet.id} className="col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="row g-0">
                            <div className="col-md-4">
                              <img
                                src={pet.foto}
                                alt={pet.nome}
                                className="img-fluid rounded-start h-100"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <h5 className="card-title text-elements">
                                    {pet.nome}
                                  </h5>
                                  <span className="badge bg-success">
                                    Adoção
                                  </span>
                                </div>
                                <p className="card-text mb-1">
                                  <small>
                                    {pet.tipo} • {pet.raca} • {pet.sexo}
                                  </small>
                                </p>
                                <p className="card-text mb-1">
                                  <small className="text-muted">
                                    {pet.porte} • {pet.idade}
                                  </small>
                                </p>
                                <p className="card-text mb-2">
                                  <i className="bi bi-geo-alt"></i> {pet.cidade}
                                </p>

                                <div className="mb-2">
                                  <span
                                    className={`badge me-1 ${
                                      pet.saude.vacinado
                                        ? "bg-info"
                                        : "bg-light text-dark"
                                    }`}
                                  >
                                    {pet.saude.vacinado
                                      ? "Vacinado"
                                      : "Não vacinado"}
                                  </span>
                                  <span
                                    className={`badge me-1 ${
                                      pet.saude.castrado
                                        ? "bg-info"
                                        : "bg-light text-dark"
                                    }`}
                                  >
                                    {pet.saude.castrado
                                      ? "Castrado"
                                      : "Não castrado"}
                                  </span>
                                </div>

                                <div className="mb-2">
                                  {pet.comportamento.sociavel && (
                                    <span className="badge bg-light text-dark me-1">
                                      Sociável
                                    </span>
                                  )}
                                  {pet.comportamento.tranquilo && (
                                    <span className="badge bg-light text-dark me-1">
                                      Tranquilo
                                    </span>
                                  )}
                                  {pet.comportamento.ativo && (
                                    <span className="badge bg-light text-dark me-1">
                                      Ativo
                                    </span>
                                  )}
                                </div>

                                <Botao
                                  text="Quero Adotar"
                                  bgColor="var(--main-color)"
                                  hoverColor="var(--bg-button)"
                                  className="w-100 mt-2"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12 text-center py-5">
                      <p className="text-muted">
                        Nenhum pet para adoção encontrado com os filtros
                        selecionados.
                      </p>
                      <Botao
                        text="Limpar Filtros"
                        bgColor="var(--secondary-color)"
                        hoverColor="var(--elements-color)"
                        onClick={() =>
                          setFiltroAdocao({ porte: "", idade: "", cidade: "" })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dicas e Cuidados */}
          {activeTab === "dicas" && (
            <div className="row">
              {/* Categorias */}
              <div className="col-12 mb-4">
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <button
                    className="btn m-1"
                    onClick={() => setCategoriaDicas("todas")}
                    style={{
                      backgroundColor:
                        categoriaDicas === "todas"
                          ? "var(--main-color)"
                          : "white",
                      color:
                        categoriaDicas === "todas"
                          ? "white"
                          : "var(--main-color)",
                      border: "1px solid var(--main-color)",
                      opacity: categoriaDicas === "todas" ? 1 : 0.8,
                      transition: "all 0.3s ease",
                    }}
                  >
                    Todas
                  </button>
                  {categorias.map((cat, index) => (
                    <button
                      key={index}
                      className="btn m-1"
                      onClick={() => setCategoriaDicas(cat)}
                      style={{
                        backgroundColor:
                          categoriaDicas === cat
                            ? "var(--main-color)"
                            : "white",
                        color:
                          categoriaDicas === cat
                            ? "white"
                            : "var(--main-color)",
                        border: "1px solid var(--main-color)",
                        opacity: categoriaDicas === cat ? 1 : 0.8,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Artigos */}
              <div className="col-12">
                <div className="row g-4">
                  {dicasFiltradas.map((dica) => (
                    <div key={dica.id} className="col-md-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <OptimizedImage
                          src={dica.imagem}
                          alt={dica.titulo}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                          <span className="badge bg-main text-white mb-2">
                            {dica.categoria}
                          </span>
                          <h5 className="card-title text-elements">
                            {dica.titulo}
                          </h5>
                          <p className="card-text">{dica.resumo}</p>
                        </div>
                        <div className="card-footer bg-white border-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {dica.data ? new Date(dica.data).toLocaleDateString('pt-BR') : ''}
                            </small>
                            <small className="text-muted">
                              {dica.veterinario_nome || dica.nome_clinica || "Veterinário"}
                            </small>
                          </div>
                          <Botao
                            text="Ler Artigo"
                            bgColor="var(--secondary-color)"
                            hoverColor="var(--elements-color)"
                            className="w-100 mt-2"
                            onClick={() => {
                              setArtigoSelecionado(dica);
                              setShowModalArtigo(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Artigo */}
      <Modal
        show={showModalArtigo}
        onHide={() => {
          setShowModalArtigo(false);
          setArtigoSelecionado(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{artigoSelecionado?.titulo || "Artigo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {artigoSelecionado && (
            <>
              {artigoSelecionado.imagem && (
                <img
                  src={artigoSelecionado.imagem}
                  alt={artigoSelecionado.titulo}
                  className="img-fluid rounded mb-3"
                  style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                />
              )}
              {artigoSelecionado.categoria && (
                <span className="badge bg-main text-white mb-3">
                  {artigoSelecionado.categoria}
                </span>
              )}
              <div className="mb-3">
                <small className="text-muted">
                  Por {artigoSelecionado.veterinario_nome || artigoSelecionado.nome_clinica || "Veterinário"} • {artigoSelecionado.data ? new Date(artigoSelecionado.data).toLocaleDateString('pt-BR') : ''}
                </small>
              </div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>
                {artigoSelecionado.conteudo || artigoSelecionado.titulo}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Botao
            text="Fechar"
            bgColor="var(--secondary-color)"
            hoverColor="var(--elements-color)"
            onClick={() => {
              setShowModalArtigo(false);
              setArtigoSelecionado(null);
            }}
          />
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default Animais;
