import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import Botao from "../components/ui/Botao";
import { api } from "../utils/api";
import { FaSpinner, FaSearch, FaTimes } from "react-icons/fa";

const Veterinarios = () => {
  const navigate = useNavigate();
  const [viewProfile, setViewProfile] = useState(null);
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtros, setFiltros] = useState({
    cidade: "",
    especialidades: [], // Array para múltiplas especialidades
  });

  // Carregar veterinários do backend
  useEffect(() => {
    carregarVeterinarios();
  }, [filtros, termoBusca]);

  const carregarVeterinarios = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtros.cidade) params.append("cidade", filtros.cidade);
      if (filtros.especialidades.length > 0) {
        params.append("especialidades", filtros.especialidades.join(","));
      }
      if (termoBusca.trim()) {
        params.append("termo", termoBusca.trim());
      }

      const url = `/veterinarios/publicos${params.toString() ? `?${params.toString()}` : ""}`;
      const data = await api.get(url);
      setVeterinarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar veterinários:", error);
      setVeterinarios([]);
    } finally {
      setLoading(false);
    }
  };

  const [especialidades, setEspecialidades] = useState([]);
  const [cidades, setCidades] = useState([]);

  // Carregar especialidades do backend
  useEffect(() => {
    const carregarEspecialidades = async () => {
      try {
        const data = await api.get("/especialidades");
        setEspecialidades(Array.isArray(data) ? data.map(e => e.nome) : []);
      } catch (error) {
        console.error("Erro ao carregar especialidades:", error);
        // Fallback: extrair dos veterinários
        const especialidadesFallback = Array.from(
          new Set(
            veterinarios
              .flatMap((v) => (v.especialidades ? v.especialidades.split(",") : []))
              .map((e) => e.trim())
              .filter((e) => e)
          )
        ).sort();
        setEspecialidades(especialidadesFallback);
      }
    };
    carregarEspecialidades();
  }, []);

  // Extrair cidades únicas dos veterinários
  useEffect(() => {
    const cidadesUnicas = Array.from(
      new Set(
        veterinarios
          .map((v) => v.cidade_clinica)
          .filter((c) => c)
      )
    ).sort();
    setCidades(cidadesUnicas);
  }, [veterinarios]);

  // Os filtros já são aplicados no backend, então usamos diretamente os veterinários retornados
  const veterinariosFiltrados = veterinarios;

  // Manipuladores de eventos
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      [name]: value,
    }));
  };

  const handleEspecialidadeToggle = (especialidade) => {
    setFiltros((prevFiltros) => {
      const especialidades = [...prevFiltros.especialidades];
      const index = especialidades.indexOf(especialidade);
      
      if (index > -1) {
        especialidades.splice(index, 1);
      } else {
        especialidades.push(especialidade);
      }
      
      return {
        ...prevFiltros,
        especialidades,
      };
    });
  };

  const handleLimparFiltros = () => {
    setFiltros({
      cidade: "",
      especialidades: [],
    });
    setTermoBusca("");
  };

  const handleVerPerfil = (id) => {
    setViewProfile(id);
    window.scrollTo(0, 0);
  };

  const handleVoltar = () => {
    setViewProfile(null);
  };

  return (
    <>
      <Header />
      {/* 
      <section className="container-fluid veterinarios-bg text-white py-5 mt-5 position-relative">
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1 }}></div>
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-5 fw-bold">Veterinários</h1>
          <p className="lead">
            Encontre os melhores profissionais para cuidar do seu pet
          </p>
        </div>
      </section> */}

      {viewProfile === null && (
        <section className="container-fluid veterinarios-bg text-white py-5 mt-5 position-relative">
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: 1 }}
          ></div>
          <div
            className="container py-4 position-relative"
            style={{ zIndex: 2 }}
          >
            <h1 className="display-5 fw-bold">Veterinários</h1>
            <p className="lead">
              Encontre os melhores profissionais para cuidar do seu pet
            </p>
          </div>
        </section>
      )}

      <div className="container py-5">
        {viewProfile === null ? (
          <div className="row">
            {/* Barra de Pesquisa */}
            <div className="col-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por nome, CRMV, especialidade, cidade..."
                      value={termoBusca}
                      onChange={(e) => setTermoBusca(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          carregarVeterinarios();
                        }
                      }}
                    />
                    {termoBusca && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setTermoBusca("")}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros Laterais */}
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="text-elements mb-4 fw-bold">Filtros</h5>

                  <div className="mb-3">
                    <label htmlFor="cidade" className="form-label fw-semibold">
                      Cidade
                    </label>
                    <select
                      className="form-select"
                      id="cidade"
                      name="cidade"
                      value={filtros.cidade}
                      onChange={handleFiltroChange}
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
                    <label className="form-label fw-semibold">
                      Especialidades (múltipla seleção)
                    </label>
                    <div
                      className="border rounded p-2"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      {especialidades.length > 0 ? (
                        especialidades.map((esp, index) => (
                          <div key={index} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`esp-${index}`}
                              checked={filtros.especialidades.includes(esp)}
                              onChange={() => handleEspecialidadeToggle(esp)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`esp-${index}`}
                            >
                              {esp}
                            </label>
                          </div>
                        ))
                      ) : (
                        <small className="text-muted">
                          Nenhuma especialidade disponível
                        </small>
                      )}
                    </div>
                    {filtros.especialidades.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">
                          {filtros.especialidades.length} especialidade(s) selecionada(s)
                        </small>
                      </div>
                    )}
                  </div>

                  <Botao
                    text="Limpar Filtros"
                    bgColor="var(--secondary-color)"
                    hoverColor="var(--elements-color)"
                    onClick={handleLimparFiltros}
                    className="w-100 mt-3"
                  />
                </div>
              </div>
            </div>

            {/* Lista de Veterinários */}
            <div className="col-md-9">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>{veterinariosFiltrados.length} Veterinários encontrados</h4>
              </div>

              <div className="row g-4">
                {loading ? (
                  <div className="col-12 text-center py-5">
                    <FaSpinner className="spinner-border text-primary mb-3" size={48} />
                    <p className="text-muted">Carregando veterinários...</p>
                  </div>
                ) : veterinariosFiltrados.length > 0 ? (
                  veterinariosFiltrados.map((vet) => (
                    <div key={vet.id_veterinarios} className="col-md-6 col-lg-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="text-center pt-4">
                          {vet.foto_url ? (
                            <img
                              src={vet.foto_url}
                              alt={vet.nome_clinica || vet.nome_usuario}
                              className="rounded-circle"
                              style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                              style={{
                                width: "120px",
                                height: "120px",
                                fontSize: "48px",
                              }}
                            >
                              {(vet.nome_clinica || vet.nome_usuario || "V")[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="card-body text-center">
                          <h5 className="text-elements">
                            {vet.nome_clinica || vet.nome_usuario || "Veterinário"}
                          </h5>
                          {vet.crmv && (
                            <p className="text-muted mb-2 small">
                              <strong>CRMV:</strong> {vet.crmv}
                            </p>
                          )}
                          {vet.especialidades && (
                            <div className="mb-2">
                              {vet.especialidades.split(",").map((esp, idx) => (
                                <span
                                  key={idx}
                                  className="badge bg-primary me-1 mb-1"
                                >
                                  {esp.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          {vet.cidade_clinica && (
                            <p className="mb-3">
                              <i className="bi bi-geo-alt"></i> {vet.cidade_clinica}
                              {vet.estado_clinica && `, ${vet.estado_clinica}`}
                            </p>
                          )}
                          <div className="mb-3">
                            <small className="text-muted">
                              {vet.posts_count || 0} posts • {vet.seguidores_count || 0} seguidores
                            </small>
                          </div>
                          <div className="d-flex flex-column gap-2">
                            <Botao
                              text="Ver Perfil"
                              bgColor="var(--main-color)"
                              hoverColor="var(--bg-button)"
                              onClick={() => handleVerPerfil(vet.id_veterinarios)}
                            />
                            <Botao
                              text="Rede Social"
                              bgColor="var(--elements-color)"
                              hoverColor="var(--main-color)"
                              onClick={() => navigate(`/rede-social/veterinario/${vet.id_veterinarios}`)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <p className="text-muted">
                      Nenhum veterinário encontrado com os filtros selecionados.
                    </p>
                    <Botao
                      text="Limpar Filtros"
                      bgColor="var(--secondary-color)"
                      hoverColor="var(--elements-color)"
                      onClick={handleLimparFiltros}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Perfil do Veterinário */
          <div>
            <Botao
              text="← Voltar para a lista"
              bgColor="var(--secondary-color)"
              hoverColor="var(--elements-color)"
              onClick={handleVoltar}
              className="mb-4"
            />

            {(() => {
              const vet = veterinarios.find((v) => v.id_veterinarios === viewProfile);

              if (!vet) {
                return (
                  <div className="text-center py-5">
                    <p className="text-muted">Veterinário não encontrado</p>
                  </div>
                );
              }

              return (
                <div className="row">
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-body text-center">
                        {vet.foto_url ? (
                          <img
                            src={vet.foto_url}
                            alt={vet.nome_clinica || vet.nome_usuario}
                            className="rounded-circle mb-3"
                            style={{
                              width: "180px",
                              height: "180px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                            style={{
                              width: "180px",
                              height: "180px",
                              fontSize: "72px",
                            }}
                          >
                            {(vet.nome_clinica || vet.nome_usuario || "V")[0].toUpperCase()}
                          </div>
                        )}

                        <h3 className="text-elements">
                          {vet.nome_clinica || vet.nome_usuario || "Veterinário"}
                        </h3>
                        {vet.crmv && <p className="text-muted">CRMV: {vet.crmv}</p>}
                        {vet.especialidades && (
                          <p className="text-muted">{vet.especialidades.split(",")[0].trim()}</p>
                        )}
                        {vet.cidade_clinica && (
                          <p>
                            <i className="bi bi-geo-alt"></i> {vet.cidade_clinica}
                            {vet.estado_clinica && `, ${vet.estado_clinica}`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h5 className="text-elements mb-3">Contato</h5>
                        {vet.telefone_clinica && (
                          <p>
                            <i className="bi bi-telephone"></i> {vet.telefone_clinica}
                          </p>
                        )}
                        {vet.email && (
                          <p>
                            <i className="bi bi-envelope"></i> {vet.email}
                          </p>
                        )}
                        {vet.endereco_clinica && (
                          <p>
                            <i className="bi bi-geo"></i> {vet.endereco_clinica}
                          </p>
                        )}
                        <div className="mt-3">
                          <Botao
                            text="Ver Rede Social"
                            bgColor="var(--elements-color)"
                            hoverColor="var(--main-color)"
                            className="w-100"
                            onClick={() => navigate(`/rede-social/veterinario/${vet.id_veterinarios}`)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    {vet.bio && (
                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                          <h5 className="text-elements mb-3">Biografia</h5>
                          <p>{vet.bio}</p>
                        </div>
                      </div>
                    )}

                    {vet.especialidades && (
                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                          <h5 className="text-elements mb-3">Especialidades</h5>
                          <div className="d-flex flex-wrap">
                            {vet.especialidades.split(",").map((esp, idx) => (
                              <span
                                key={idx}
                                className="badge bg-main text-white me-2 mb-2 p-2"
                              >
                                {esp.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="text-elements mb-0">Estatísticas</h5>
                        </div>
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="fw-bold text-primary fs-4">
                              {vet.posts_count || 0}
                            </div>
                            <small className="text-muted">Posts</small>
                          </div>
                          <div className="col-4">
                            <div className="fw-bold text-success fs-4">
                              {vet.seguidores_count || 0}
                            </div>
                            <small className="text-muted">Seguidores</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Veterinarios;
