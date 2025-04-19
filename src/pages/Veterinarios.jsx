import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import logo from "../assets/imgs/logo.png";
import vetmariana from "../assets/imgs/vetmariana.jpeg";
import vetandre from "../assets/imgs/vetandre.jpeg";
import vetrafaell from "../assets/imgs/vetrafaell.jpeg";
import vetjuliana from "../assets/imgs/vetjuliana.jpeg";

const Veterinarios = () => {
  const [viewProfile, setViewProfile] = useState(null); 
  const [filtros, setFiltros] = useState({
    cidade: "",
    especialidade: "",
    atendimento: ""
  });

  // Dados de exemplo para os filtros
  const cidades = ["Feira de Santana", "Salvador", "Alagoinhas", "Santo Antônio de Jesus"];
  const especialidades = ["Clínico Geral", "Ortopedia", "Dermatologia", "Odontologia", "Cardiologia"];
  const tiposAtendimento = ["Presencial", "Domicílio", "Telemedicina"];

  // Dados de exemplo para os veterinários
  const veterinarios = [
    {
      id: 1,
      nome: "Dra. Mariana Santos",
      foto: vetmariana,
      especialidade: "Clínico Geral",
      cidade: "Feira de Santana",
      atendimento: ["Presencial", "Telemedicina"],
      bio: "Formada pela UFBA com mais de 10 anos de experiência em clínica de pequenos animais. Especialista em geriatria e medicina preventiva.",
      contato: {
        telefone: "(75) 99999-9999",
        email: "mariana.santos@vet.com",
        endereco: "Av. Getúlio Vargas, 123 - Centro",
      },
      avaliacoes: [
        { autor: "João Silva", nota: 5, comentario: "Excelente profissional, meu pet adorou!" },
        { autor: "Ana Oliveira", nota: 4, comentario: "Muito atenciosa e cuidadosa." }
      ]
    },
    {
      id: 2,
      nome: "Dr. Rafael Mendes",
      foto: vetrafaell,
      especialidade: "Ortopedia",
      cidade: "Salvador",
      atendimento: ["Presencial", "Domicílio"],
      bio: "Especialista em ortopedia e cirurgia de pequenos animais com foco em reabilitação. Pós-graduado pela USP e membro da Sociedade Brasileira de Ortopedia Veterinária.",
      contato: {
        telefone: "(71) 98888-8888",
        email: "rafael.mendes@vet.com",
        endereco: "Rua da Graça, 456 - Graça",
      },
      avaliacoes: [
        { autor: "Carlos Eduardo", nota: 5, comentario: "Realizou uma cirurgia complexa no meu cachorro com grande sucesso!" },
        { autor: "Patricia Lemos", nota: 5, comentario: "Muito dedicado e profissional, recomendo!" }
      ]
    },
    {
      id: 3,
      nome: "Dra. Juliana Costa",
      foto: vetjuliana,
      especialidade: "Dermatologia",
      cidade: "Feira de Santana",
      atendimento: ["Presencial", "Telemedicina"],
      bio: "Especialista em dermatologia veterinária com ênfase em tratamentos inovadores para alergias cutâneas. Palestrante internacional e pesquisadora na área.",
      contato: {
        telefone: "(75) 97777-7777",
        email: "juliana.costa@vet.com",
        endereco: "Rua Conselheiro Franco, 789 - Kalilândia"
      },
      avaliacoes: [
        { autor: "Marcia Alves", nota: 4, comentario: "Resolveu o problema de alergia do meu gato que sofria há anos." },
        { autor: "Roberto Pires", nota: 5, comentario: "Profissional excepcional, diagnóstico preciso." }
      ]
    },
    {
      id: 4,
      nome: "Dr. André Peixoto",
      foto: vetandre,
      especialidade: "Odontologia",
      cidade: "Salvador",
      atendimento: ["Presencial"],
      bio: "Referência em odontologia veterinária no estado da Bahia. Especialista em tratamentos dentários complexos e cirurgias odontológicas para pets.",
      contato: {
        telefone: "(71) 96666-6666",
        email: "andre.peixoto@vet.com",
        endereco: "Av. Tancredo Neves, 1011 - Caminho das Árvores"
      },
      avaliacoes: [
        { autor: "Marcelo Santana", nota: 5, comentario: "Tratamento odontológico perfeito, meu pet está muito melhor!" },
        { autor: "Laura Góes", nota: 4, comentario: "Excelente profissional, muito detalhista." }
      ]
    }
  ];

  // Filtragem de veterinários
  const veterinariosFiltrados = veterinarios.filter(vet => {
    const cidadeMatch = !filtros.cidade || vet.cidade === filtros.cidade;
    const especialidadeMatch = !filtros.especialidade || vet.especialidade === filtros.especialidade;
    const atendimentoMatch = !filtros.atendimento || vet.atendimento.includes(filtros.atendimento);

    return cidadeMatch && especialidadeMatch && atendimentoMatch;
  });

  // Manipuladores de eventos
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [name]: value
    }));
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

      <section className="container-fluid veterinarios-bg text-white py-5 mt-5 position-relative">
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1 }}></div>
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-5 fw-bold">Veterinários</h1>
          <p className="lead">
            Encontre os melhores profissionais para cuidar do seu pet
          </p>
        </div>
      </section>


      <div className="container py-5">
        {viewProfile === null ? (
          <div className="row">
            {/* Filtros Laterais */}
            <div className="col-md-3 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="text-elements mb-4 fw-bold">Filtros</h5>

                  <div className="mb-3">
                    <label htmlFor="cidade" className="form-label fw-semibold">Cidade</label>
                    <select
                      className="form-select"
                      id="cidade"
                      name="cidade"
                      value={filtros.cidade}
                      onChange={handleFiltroChange}
                    >
                      <option value="">Todas as cidades</option>
                      {cidades.map((cidade, index) => (
                        <option key={index} value={cidade}>{cidade}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="especialidade" className="form-label fw-semibold">Especialidade</label>
                    <select
                      className="form-select"
                      id="especialidade"
                      name="especialidade"
                      value={filtros.especialidade}
                      onChange={handleFiltroChange}
                    >
                      <option value="">Todas as especialidades</option>
                      {especialidades.map((esp, index) => (
                        <option key={index} value={esp}>{esp}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="atendimento" className="form-label fw-semibold">Tipo de Atendimento</label>
                    <select
                      className="form-select"
                      id="atendimento"
                      name="atendimento"
                      value={filtros.atendimento}
                      onChange={handleFiltroChange}
                    >
                      <option value="">Todos os tipos</option>
                      {tiposAtendimento.map((tipo, index) => (
                        <option key={index} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  <Button
                    text="Limpar Filtros"
                    bgColor="var(--secondary-color)"
                    hoverColor="var(--elements-color)"
                    onClick={() => setFiltros({ cidade: "", especialidade: "", atendimento: "" })}
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
                {veterinariosFiltrados.length > 0 ? (
                  veterinariosFiltrados.map(vet => (
                    <div key={vet.id} className="col-md-6 col-lg-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="text-center pt-4">
                          <img
                            src={vet.foto}
                            alt={vet.nome}
                            className="rounded-circle"
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                          />
                        </div>
                        <div className="card-body text-center">
                          <h5 className="text-elements">{vet.nome}</h5>
                          <p className="text-muted mb-1">{vet.especialidade}</p>
                          <p className="mb-3"><i className="bi bi-geo-alt"></i> {vet.cidade}</p>
                          <p className="mb-3">
                            <small>
                              {vet.atendimento.map((tipo, index) => (
                                <span key={index} className="badge bg-light text-dark me-1">{tipo}</span>
                              ))}
                            </small>
                          </p>
                          <Button
                            text="Ver Perfil"
                            bgColor="var(--main-color)"
                            hoverColor="var(--bg-button)"
                            onClick={() => handleVerPerfil(vet.id)}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <p className="text-muted">Nenhum veterinário encontrado com os filtros selecionados.</p>
                    <Button
                      text="Limpar Filtros"
                      bgColor="var(--secondary-color)"
                      hoverColor="var(--elements-color)"
                      onClick={() => setFiltros({ cidade: "", especialidade: "", atendimento: "" })}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Perfil do Veterinário */
          <div>
            <Button
              text="← Voltar para a lista"
              bgColor="var(--secondary-color)"
              hoverColor="var(--elements-color)"
              onClick={handleVoltar}
              className="mb-4"
            />

            {(() => {
              const vet = veterinarios.find(v => v.id === viewProfile);

              return (
                <div className="row">
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-body text-center">
                        <img
                          src={logo}
                          alt={vet.nome}
                          className="rounded-circle mb-3"
                          style={{ width: "180px", height: "180px", objectFit: "cover" }}
                        />
                        <h3 className="text-elements">{vet.nome}</h3>
                        <p className="text-muted">{vet.especialidade}</p>
                        <p><i className="bi bi-geo-alt"></i> {vet.cidade}</p>
                        <div className="d-flex justify-content-center">
                          {vet.atendimento.map((tipo, index) => (
                            <span key={index} className="badge bg-light text-dark me-1">{tipo}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h5 className="text-elements mb-3">Contato</h5>
                        <p><i className="bi bi-telephone"></i> {vet.contato.telefone}</p>
                        <p><i className="bi bi-envelope"></i> {vet.contato.email}</p>
                        <p><i className="bi bi-geo"></i> {vet.contato.endereco}</p>
                        <Button
                          text="Agendar Consulta"
                          bgColor="var(--main-color)"
                          hoverColor="var(--bg-button)"
                          className="w-100 mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-body">
                        <h5 className="text-elements mb-3">Biografia</h5>
                        <p>{vet.bio}</p>
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm mb-4">
                      <div className="card-body">
                        <h5 className="text-elements mb-3">Especialidades</h5>
                        <div className="d-flex flex-wrap">
                          <span className="badge bg-main text-white me-2 mb-2 p-2">{vet.especialidade}</span>
                          <span className="badge bg-main text-white me-2 mb-2 p-2">Medicina Preventiva</span>
                          <span className="badge bg-main text-white me-2 mb-2 p-2">Cuidados Gerais</span>
                        </div>
                      </div>
                    </div>

                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="text-elements mb-0">Avaliações</h5>
                          <span className="badge bg-success">
                            {Math.round(vet.avaliacoes.reduce((acc, aval) => acc + aval.nota, 0) / vet.avaliacoes.length * 10) / 10}
                            /5
                          </span>
                        </div>

                        {vet.avaliacoes.map((aval, index) => (
                          <div key={index} className="mb-3 pb-3 border-bottom">
                            <div className="d-flex justify-content-between">
                              <p className="fw-semibold mb-1">{aval.autor}</p>
                              <div>
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className={`bi bi-star${i < aval.nota ? '-fill' : ''} text-warning`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                            <p className="mb-0">{aval.comentario}</p>
                          </div>
                        ))}

                        <Button
                          text="Ver todas as avaliações"
                          bgColor="var(--secondary-color)"
                          hoverColor="var(--elements-color)"
                          className="w-100 mt-2"
                        />
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
