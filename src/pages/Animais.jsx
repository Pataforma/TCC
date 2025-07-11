import React, { useState, useEffect } from "react"; // Adicione useEffect aqui
import { useSearchParams, useNavigate } from "react-router-dom"; // Esta linha só deve aparecer uma vez
import Header from "../components/Header";
import Footer from "../components/Footer";
import Botao from "../components/Botao";
import logo from "../assets/imgs/logo.png";
import thor from "../assets/imgs/thor.webp";
import luna from "../assets/imgs/luna.avif";
import max from "../assets/imgs/max.webp";
import nina from "../assets/imgs/nina.jpeg";
import simba from "../assets/imgs/simba.jpg";
import rex from "../assets/imgs/rex.jpg";
import racao from "../assets/imgs/racao.webp";
import adestramento from "../assets/imgs/adestramento.webp";
import ansioso from "../assets/imgs/ansioso.jpg";
import higiene from "../assets/imgs/higiene.jpg";
import vacina from "../assets/imgs/vacina.jpg";
import { supabase } from "../utils/supabase";

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

  // Efeito para verificar parâmetros da URL ao carregar
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["perdidos", "adocao", "dicas"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Restante do seu código...
  // Dados de exemplo para filtros
  const cidades = [
    "Feira de Santana",
    "Salvador",
    "Alagoinhas",
    "Santo Antônio de Jesus",
  ];
  const bairros = ["Centro", "Kalilândia", "Serraria Brasil", "Cidade Nova"];
  const portes = ["Pequeno", "Médio", "Grande"];
  const idades = ["Filhote", "Adulto", "Idoso"];
  const categorias = [
    "Alimentação",
    "Higiene",
    "Comportamento",
    "Saúde",
    "Treinamento",
  ];

  // Dados de exemplo para pets perdidos
  const petsPerdidos = [
    {
      id: 1,
      foto: thor,
      nome: "Thor",
      tipo: "Cachorro",
      raca: "SRD",
      cor: "Caramelo",
      idade: "2 anos",
      desaparecido: {
        data: "15/05/2023",
        cidade: "Feira de Santana",
        bairro: "Centro",
        local: "Próximo à Praça da Matriz",
      },
      descricao:
        "Dócil e amigável. Estava usando coleira azul quando desapareceu.",
      contato: {
        nome: "Maria Silva",
        telefone: "(75) 98888-7777",
      },
    },
    {
      id: 2,
      foto: luna,
      nome: "Luna",
      tipo: "Gato",
      raca: "Siamês",
      cor: "Branco e marrom",
      idade: "1 ano",
      desaparecido: {
        data: "22/06/2023",
        cidade: "Salvador",
        bairro: "Pituba",
        local: "Condomínio Parque da Cidade",
      },
      descricao: "Gata tímida e assustada. Tem uma manchinha preta no nariz.",
      contato: {
        nome: "João Costa",
        telefone: "(71) 97777-6666",
      },
    },
    {
      id: 3,
      foto: max,
      nome: "Max",
      tipo: "Cachorro",
      raca: "Golden Retriever",
      cor: "Dourado",
      idade: "3 anos",
      desaparecido: {
        data: "10/07/2023",
        cidade: "Feira de Santana",
        bairro: "Serraria Brasil",
        local: "Perto do Supermercado Bravo",
      },
      descricao:
        "Cachorro grande e brincalhão. Atende pelo nome e está microchipado.",
      contato: {
        nome: "Carlos Oliveira",
        telefone: "(75) 96666-5555",
      },
    },
  ];

  // Dados de exemplo para adoção
  const petsAdocao = [
    {
      id: 1,
      foto: nina,
      nome: "Nina",
      tipo: "Cachorro",
      raca: "SRD",
      sexo: "Fêmea",
      porte: "Médio",
      idade: "Filhote",
      cidade: "Feira de Santana",
      descricao:
        "Nina é uma cachorrinha muito carinhosa e brincalhona. Adora crianças e se dá bem com outros cães.",
      saude: {
        vacinado: true,
        castrado: false,
        vermifugado: true,
      },
      comportamento: {
        sociavel: true,
        tranquilo: true,
        ativo: true,
      },
      contato: {
        responsavel: "ONG Patinhas Felizes",
        telefone: "(75) 98888-1111",
      },
    },
    {
      id: 2,
      foto: simba,
      nome: "Simba",
      tipo: "Gato",
      raca: "SRD",
      sexo: "Macho",
      porte: "Pequeno",
      idade: "Adulto",
      cidade: "Salvador",
      descricao:
        "Gato muito carinhoso e independente. Já está castrado e com todas as vacinas em dia.",
      saude: {
        vacinado: true,
        castrado: true,
        vermifugado: true,
      },
      comportamento: {
        sociavel: true,
        tranquilo: true,
        ativo: false,
      },
      contato: {
        responsavel: "Abrigo Miau Amigo",
        telefone: "(71) 97777-2222",
      },
    },
    {
      id: 3,
      foto: rex,
      nome: "Rex",
      tipo: "Cachorro",
      raca: "Labrador",
      sexo: "Macho",
      porte: "Grande",
      idade: "Adulto",
      cidade: "Feira de Santana",
      descricao:
        "Rex é um cão muito inteligente e obediente. Ótimo cão de guarda e companheiro para a família.",
      saude: {
        vacinado: true,
        castrado: true,
        vermifugado: true,
      },
      comportamento: {
        sociavel: true,
        tranquilo: false,
        ativo: true,
      },
      contato: {
        responsavel: "Fernando Gomes",
        telefone: "(75) 96666-3333",
      },
    },
  ];

  // Dados de exemplo para dicas
  const dicas = [
    {
      id: 1,
      titulo: "Como escolher a ração ideal para seu cão",
      categoria: "Alimentação",
      resumo:
        "Aprenda a selecionar a melhor alimentação conforme idade, porte e necessidades específicas do seu pet.",
      data: "15/03/2023",
      autor: "Dra. Paula Mendes",
      imagem: racao,
    },
    {
      id: 2,
      titulo: "Cuidados essenciais na higiene de felinos",
      categoria: "Higiene",
      resumo:
        "Dicas práticas para manter seu gato limpo e saudável, respeitando seus hábitos naturais.",
      data: "22/04/2023",
      autor: "Dr. Ricardo Sousa",
      imagem: higiene,
    },
    {
      id: 3,
      titulo: "Como acalmar cães ansiosos",
      categoria: "Comportamento",
      resumo:
        "Técnicas e exercícios para ajudar seu cachorro a lidar com o estresse e a ansiedade.",
      data: "10/05/2023",
      autor: "Mariana Costa - Comportamentalista",
      imagem: ansioso,
    },
    {
      id: 4,
      titulo: "Vacinas essenciais para filhotes",
      categoria: "Saúde",
      resumo:
        "Conheça o calendário de vacinas recomendado para cães e gatos nos primeiros meses de vida.",
      data: "05/06/2023",
      autor: "Dr. Felipe Andrade",
      imagem: vacina,
    },
    {
      id: 5,
      titulo: "Adestramento básico em casa",
      categoria: "Treinamento",
      resumo:
        "Comandos simples que você pode ensinar ao seu cão para melhorar a convivência diária.",
      data: "18/07/2023",
      autor: "Carlos Oliveira - Adestrador",
      imagem: adestramento,
    },
  ];

  // Filtragem de pets perdidos
  const perdidosFiltrados = petsPerdidos.filter((pet) => {
    const cidadeMatch =
      !filtroPerdidos.cidade ||
      pet.desaparecido.cidade === filtroPerdidos.cidade;
    const bairroMatch =
      !filtroPerdidos.bairro ||
      pet.desaparecido.bairro === filtroPerdidos.bairro;
    return cidadeMatch && bairroMatch;
  });

  // Filtragem de pets para adoção
  const adocaoFiltrados = petsAdocao.filter((pet) => {
    const porteMatch = !filtroAdocao.porte || pet.porte === filtroAdocao.porte;
    const idadeMatch = !filtroAdocao.idade || pet.idade === filtroAdocao.idade;
    const cidadeMatch =
      !filtroAdocao.cidade || pet.cidade === filtroAdocao.cidade;
    return porteMatch && idadeMatch && cidadeMatch;
  });

  // Filtragem de dicas
  const dicasFiltradas = dicas.filter(
    (dica) => categoriaDicas === "todas" || dica.categoria === categoriaDicas
  );

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
                borderBottom:
                  activeTab === "perdidos"
                    ? "3px solid var(--secondary-color)"
                    : "none",
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
                borderBottom:
                  activeTab === "adocao"
                    ? "3px solid var(--secondary-color)"
                    : "none",
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
                borderBottom:
                  activeTab === "dicas"
                    ? "3px solid var(--secondary-color)"
                    : "none",
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
                                  <span className="badge bg-danger">
                                    Perdido
                                  </span>
                                </div>
                                <p className="card-text mb-1">
                                  <small>
                                    {pet.tipo} • {pet.raca} • {pet.cor}
                                  </small>
                                </p>
                                <p className="card-text mb-2">
                                  <i className="bi bi-geo-alt"></i>{" "}
                                  {pet.desaparecido.cidade},{" "}
                                  {pet.desaparecido.bairro}
                                </p>
                                <p className="card-text">
                                  <small className="text-muted">
                                    Desaparecido em: {pet.desaparecido.data}
                                  </small>
                                </p>
                                <p className="card-text small">
                                  {pet.descricao}
                                </p>
                                <Botao
                                  text="Entrar em Contato"
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
                        <img
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
                            <small className="text-muted">{dica.data}</small>
                            <small className="text-muted">{dica.autor}</small>
                          </div>
                          <Botao
                            text="Ler Artigo"
                            bgColor="var(--secondary-color)"
                            hoverColor="var(--elements-color)"
                            className="w-100 mt-2"
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

      <Footer />
    </>
  );
};

export default Animais;
