import React, { useState, useEffect } from "react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import Botao from "../components/ui/Botao";
import logo from "../assets/imgs/logo.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Agenda = () => {
  const [date, setDate] = useState(new Date());
  const [filtros, setFiltros] = useState({
    cidade: "",
    tipoEvento: "",
  });
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [eventosVisiveis, setEventosVisiveis] = useState([]);

  // Dados de exemplo para filtros
  const cidades = [
    "Feira de Santana",
    "Salvador",
    "Alagoinhas",
    "Santo Antônio de Jesus",
  ];
  const tiposEvento = [
    "Vacinação",
    "Feira de Adoção",
    "Evento de ONG",
    "Palestra",
    "Live",
  ];

  // Dados de exemplo para eventos
  const eventos = [
    {
      id: 1,
      titulo: "Campanha de Vacinação Antirrábica",
      tipo: "Vacinação",
      data: new Date(2023, 8, 15), // 15 de Setembro de 2023
      cidade: "Feira de Santana",
      local: "Praça da Matriz, Centro",
      horario: "08:00 - 17:00",
      descricao:
        "Campanha anual de vacinação antirrábica para cães e gatos. Traga seu pet com coleira e guia.",
      organizador: "Secretaria Municipal de Saúde",
      contato: {
        telefone: "(75) 3622-8500",
        email: "vacinacao@feiradesantana.ba.gov.br",
      },
      imagem: logo,
    },
    {
      id: 2,
      titulo: "Feira de Adoção Patinhas Felizes",
      tipo: "Feira de Adoção",
      data: new Date(2023, 8, 20), // 20 de Setembro de 2023
      cidade: "Salvador",
      local: "Shopping Barra, Av. Centenário",
      horario: "10:00 - 18:00",
      descricao:
        "Venha conhecer e adotar um novo amigo. Todos os animais são castrados, vacinados e vermifugados.",
      organizador: "ONG Patinhas Felizes",
      contato: {
        telefone: "(71) 99999-8888",
        email: "contato@patinhasfelizes.org",
      },
      imagem: logo,
    },
    {
      id: 3,
      titulo: "Rifa Solidária para Abrigo Animal",
      tipo: "Evento de ONG",
      data: new Date(2023, 8, 25), // 25 de Setembro de 2023
      cidade: "Feira de Santana",
      local: "Online",
      horario: "09:00 - 21:00",
      descricao:
        "Rifa virtual com prêmios doados por empresas locais. Toda a renda será revertida para a compra de ração e medicamentos.",
      organizador: "Amor Animal ONG",
      contato: {
        telefone: "(75) 98888-7777",
        email: "amoranimal@ong.org",
      },
      imagem: logo,
    },
    {
      id: 4,
      titulo: "Palestra: Cuidados com Pets Idosos",
      tipo: "Palestra",
      data: new Date(2023, 9, 5), // 5 de Outubro de 2023
      cidade: "Salvador",
      local: "Universidade Federal da Bahia, Auditório Central",
      horario: "18:30 - 20:30",
      descricao:
        "Palestra com veterinários especialistas em geriatria animal, abordando cuidados necessários para pets na terceira idade.",
      organizador: "Faculdade de Medicina Veterinária - UFBA",
      contato: {
        telefone: "(71) 3283-6700",
        email: "eventos.vet@ufba.br",
      },
      imagem: logo,
    },
    {
      id: 5,
      titulo: "Live: Comportamento Felino",
      tipo: "Live",
      data: new Date(2023, 9, 12), // 12 de Outubro de 2023
      cidade: "Online",
      local: "Instagram @pataforma",
      horario: "19:00 - 20:00",
      descricao:
        "Live com comportamentalista felino, discutindo como entender melhor a linguagem dos gatos e evitar problemas comportamentais.",
      organizador: "Pataforma",
      contato: {
        telefone: "(75) 97777-6666",
        email: "contato@pataforma.com.br",
      },
      imagem: logo,
    },
    {
      id: 6,
      titulo: "Vacinação V8/V10 com Preço Social",
      tipo: "Vacinação",
      data: new Date(2023, 9, 18), // 18 de Outubro de 2023
      cidade: "Alagoinhas",
      local: "Clínica Vida Animal, Av. Principal, 123",
      horario: "08:00 - 16:00",
      descricao:
        "Campanha de vacinação V8 e V10 com preço social. Necessário agendamento prévio.",
      organizador: "Clínica Vida Animal",
      contato: {
        telefone: "(75) 3422-9999",
        email: "agendamento@vidaanimal.vet.br",
      },
      imagem: logo,
    },
  ];

  // Função para encontrar data com eventos
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const eventosNoDia = eventos.filter(
        (evento) =>
          evento.data.getDate() === date.getDate() &&
          evento.data.getMonth() === date.getMonth() &&
          evento.data.getFullYear() === date.getFullYear()
      );

      if (eventosNoDia.length > 0) {
        return "bg-main text-white rounded";
      }
    }
  };

  // Carregar eventos do dia selecionado e aplicar filtros
  useEffect(() => {
    let eventosFiltrados = eventos.filter(
      (evento) =>
        evento.data.getDate() === date.getDate() &&
        evento.data.getMonth() === date.getMonth() &&
        evento.data.getFullYear() === date.getFullYear()
    );

    if (filtros.cidade) {
      eventosFiltrados = eventosFiltrados.filter(
        (evento) =>
          evento.cidade === filtros.cidade || evento.cidade === "Online"
      );
    }

    if (filtros.tipoEvento) {
      eventosFiltrados = eventosFiltrados.filter(
        (evento) => evento.tipo === filtros.tipoEvento
      );
    }

    setEventosVisiveis(eventosFiltrados);
    setEventoSelecionado(null);
  }, [date, filtros]);

  // Manipuladores de eventos
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipacao = (evento) => {
    alert(`Você demonstrou interesse em participar do evento: ${evento.titulo}. 
Os organizadores entrarão em contato em breve!`);
  };

  return (
    <>
      <Header />

      <section className="container-fluid agenda-bg text-white py-5 mt-5 position-relative">
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-5 fw-bold">Agenda de Eventos</h1>
          <p className="lead">
            Acompanhe as campanhas, eventos e atividades para você e seu pet
          </p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row">
          {/* Calendário e Filtros */}
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="text-elements fw-bold mb-3">Calendário</h5>
                <div className="calendar-container">
                  <Calendar
                    onChange={setDate}
                    value={date}
                    tileClassName={tileClassName}
                    className="w-100 border-0"
                  />
                  <p className="mt-3 text-center">
                    <small className="text-muted">
                      Dias marcados em{" "}
                      <span className="text-elements fw-bold">verde</span>{" "}
                      possuem eventos
                    </small>
                  </p>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="text-elements fw-bold mb-3">Filtros</h5>

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
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="tipoEvento"
                    className="form-label fw-semibold"
                  >
                    Tipo de Evento
                  </label>
                  <select
                    className="form-select"
                    id="tipoEvento"
                    name="tipoEvento"
                    value={filtros.tipoEvento}
                    onChange={handleFiltroChange}
                  >
                    <option value="">Todos os tipos</option>
                    {tiposEvento.map((tipo, index) => (
                      <option key={index} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <Botao
                  text="Limpar Filtros"
                  bgColor="var(--secondary-color)"
                  hoverColor="var(--elements-color)"
                  onClick={() => setFiltros({ cidade: "", tipoEvento: "" })}
                  className="w-100 mt-3"
                />
              </div>
            </div>
          </div>

          {/* Lista de Eventos */}
          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>
                {eventosVisiveis.length > 0
                  ? `Eventos em ${date.toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}`
                  : "Nenhum evento na data selecionada"}
              </h4>
            </div>

            {eventoSelecionado ? (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3 className="text-elements">
                      {eventoSelecionado.titulo}
                    </h3>
                    <span className="badge bg-main text-white">
                      {eventoSelecionado.tipo}
                    </span>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <img
                        src={eventoSelecionado.imagem}
                        alt={eventoSelecionado.titulo}
                        className="img-fluid rounded"
                      />
                    </div>
                    <div className="col-md-8">
                      <p className="mb-1">
                        <i className="bi bi-calendar-event me-2"></i>
                        <strong>Data:</strong>{" "}
                        {eventoSelecionado.data.toLocaleDateString("pt-BR")}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-clock me-2"></i>
                        <strong>Horário:</strong> {eventoSelecionado.horario}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-geo-alt me-2"></i>
                        <strong>Local:</strong> {eventoSelecionado.local},{" "}
                        {eventoSelecionado.cidade}
                      </p>
                      <p className="mb-1">
                        <i className="bi bi-building me-2"></i>
                        <strong>Organizador:</strong>{" "}
                        {eventoSelecionado.organizador}
                      </p>
                      <p className="mb-3">
                        <i className="bi bi-file-text me-2"></i>
                        <strong>Descrição:</strong>{" "}
                        {eventoSelecionado.descricao}
                      </p>

                      <div className="card bg-light border-0 mb-3">
                        <div className="card-body py-2">
                          <h6>Contato</h6>
                          <p className="mb-1 small">
                            <i className="bi bi-telephone me-2"></i>
                            {eventoSelecionado.contato.telefone}
                          </p>
                          <p className="mb-0 small">
                            <i className="bi bi-envelope me-2"></i>
                            {eventoSelecionado.contato.email}
                          </p>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between">
                        <Botao
                          text="Voltar"
                          bgColor="var(--secondary-color)"
                          hoverColor="var(--elements-color)"
                          onClick={() => setEventoSelecionado(null)}
                        />
                        <Botao
                          text="Quero Participar"
                          bgColor="var(--main-color)"
                          hoverColor="var(--bg-button)"
                          onClick={() => handleParticipacao(eventoSelecionado)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {eventosVisiveis.length > 0 ? (
                  <div className="row g-4">
                    {eventosVisiveis.map((evento) => (
                      <div key={evento.id} className="col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="card-title text-elements">
                                {evento.titulo}
                              </h5>
                              <span className="badge bg-main text-white">
                                {evento.tipo}
                              </span>
                            </div>
                            <p className="card-text mb-1 small">
                              <i className="bi bi-calendar-event me-1"></i>{" "}
                              {evento.data.toLocaleDateString("pt-BR")}
                            </p>
                            <p className="card-text mb-1 small">
                              <i className="bi bi-clock me-1"></i>{" "}
                              {evento.horario}
                            </p>
                            <p className="card-text mb-2 small">
                              <i className="bi bi-geo-alt me-1"></i>{" "}
                              {evento.local}, {evento.cidade}
                            </p>
                            <p className="card-text small text-truncate mb-3">
                              {evento.descricao}
                            </p>
                            <Botao
                              text="Ver Detalhes"
                              bgColor="var(--main-color)"
                              hoverColor="var(--bg-button)"
                              onClick={() => setEventoSelecionado(evento)}
                              className="w-100"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i
                      className="bi bi-calendar-x text-muted"
                      style={{ fontSize: "60px" }}
                    ></i>
                    <p className="mt-3 text-muted">
                      Não há eventos para esta data com os filtros selecionados.
                    </p>
                    <p className="text-muted small">
                      Experimente selecionar outra data ou alterar os filtros.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Próximos Eventos Destacados */}
      <section className="container-fluid py-5 bg-light">
        <div className="container">
          <h2 className="text-elements fw-bold mb-4 text-center">
            Próximos Eventos Destacados
          </h2>
          <div className="row g-4">
            {eventos.slice(0, 3).map((evento) => (
              <div key={evento.id} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <img
                    src={evento.imagem}
                    alt={evento.titulo}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <span className="badge bg-main text-white mb-2">
                      {evento.tipo}
                    </span>
                    <h5 className="card-title text-elements">
                      {evento.titulo}
                    </h5>
                    <p className="card-text small mb-1">
                      <i className="bi bi-calendar-event me-1"></i>{" "}
                      {evento.data.toLocaleDateString("pt-BR")}
                    </p>
                    <p className="card-text small mb-2">
                      <i className="bi bi-geo-alt me-1"></i> {evento.cidade}
                    </p>
                    <Botao
                      text="Ver Detalhes"
                      bgColor="var(--secondary-color)"
                      hoverColor="var(--elements-color)"
                      onClick={() => {
                        setDate(evento.data);
                        setEventoSelecionado(evento);
                      }}
                      className="w-100 mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cadastre seu Evento */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <h2 className="text-elements fw-bold mb-3">
              Tem um evento para anunciar?
            </h2>
            <p className="mb-4">
              ONGs, clínicas veterinárias e organizadores de eventos para pets
              podem cadastrar suas atividades gratuitamente na nossa plataforma.
              Basta preencher o formulário e entraremos em contato para validar
              as informações.
            </p>
            <div className="d-flex">
              <Botao
                text="Cadastrar Evento"
                bgColor="var(--main-color)"
                hoverColor="var(--bg-button)"
                className="px-4 py-2 fw-bold me-3"
              />
              <Botao
                text="Saiba Mais"
                bgColor="white"
                hoverColor="#f8f9fa"
                textColor="var(--main-color)"
                className="px-4 py-2 fw-bold"
                style={{ border: "1px solid var(--main-color)" }}
              />
            </div>
          </div>
          <div className="col-md-6 text-center">
            <img
              src={logo}
              alt="Cadastre seu evento"
              className="img-fluid rounded shadow-sm"
              style={{ maxWidth: "80%" }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Agenda;
