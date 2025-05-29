import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Botao from "../components/Botao";
import logo from "../assets/imgs/logo.png";
import alimentador from "../assets/imgs/alimentador.png";
import Icon from "@mdi/react";
import { mdiBadgeAccount, mdiBatteryHigh, mdiCellphoneCheck, mdiCellphoneCog, mdiCellphoneNfc, mdiFoodForkDrink, mdiLightningBolt, mdiScale, mdiScaleBalance, mdiScaleOff, mdiScaleUnbalanced } from "@mdi/js";

const Produto = () => {
  const [faqOpen, setFaqOpen] = useState({});
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  // Dados de exemplo para FAQ
  const faqItems = [
    {
      id: 1,
      pergunta: "Qual é a capacidade máxima do alimentador?",
      resposta:
        "O alimentador comporta até 5kg de ração seca, o que é suficiente para aproximadamente 2-3 semanas de uso para um cão de porte médio.",
    },
    {
      id: 2,
      pergunta: "É possível programar horários específicos de alimentação?",
      resposta:
        "Sim, é possível programar até 5 horários diferentes de alimentação por dia, com porções customizadas para cada horário.",
    },
    {
      id: 3,
      pergunta: "O alimentador funciona sem internet?",
      resposta:
        "Sim. O alimentador mantém sua programação mesmo sem conexão com a internet, porém algumas funcionalidades como controle remoto e notificações dependem de conectividade.",
    },
    {
      id: 4,
      pergunta: "O que acontece se acabar a energia elétrica?",
      resposta:
        "O alimentador possui bateria de backup que dura até 48 horas, garantindo que o pet não fique sem comida em caso de queda de energia.",
    },
    {
      id: 5,
      pergunta: "Qual é o prazo de entrega após a compra?",
      resposta:
        "O prazo de entrega é de 15 a 20 dias úteis após a confirmação do pagamento, pois nossos produtos são fabricados sob demanda.",
    },
    {
      id: 6,
      pergunta: "Qual é o período de garantia?",
      resposta:
        "Oferecemos 12 meses de garantia contra defeitos de fabricação, além dos direitos legais de garantia.",
    },
  ];

  // Manipuladores de eventos
  const toggleFaq = (id) => {
    setFaqOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui iria o código para enviar o formulário
    alert("Formulário enviado com sucesso! Em breve entraremos em contato.");
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      mensagem: "",
    });
  };

  return (
    <>
      <Header />

      {/* Hero Section / Pitch */}
      <section className="container-fluid bg-main text-white py-5 mt-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold">
                Alimentador Inteligente PetFeed
              </h1>
              <p className="lead my-4">
                Revolucione a forma de alimentar seu pet com tecnologia de ponta
                que garante precisão, praticidade e o melhor cuidado para seu
                amigo de quatro patas.
              </p>
              <Botao
                text="Garanta o seu"
                bgColor="var(--secondary-color)"
                hoverColor="var(--elements-color)"
                className="me-2 px-4 py-2 fw-bold"
              />
              {/* <Button 
                text="Garanta o seu" 
                bgColor="white" 
                hoverColor="#f8f9fa" 
                textColor="var(--main-color)"
                className="px-4 py-2 fw-bold"
              /> */}
            </div>
            <div className="col-md-6 text-center">
              <img
                src={alimentador}
                alt="Alimentador Inteligente"
                className="img-fluid bg-transparent"
                style={{ maxWidth: "50%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Produto em uso */}
      <section className="container py-5">
        <div className="row">
          <div className="col-md-6 order-md-2">
            <h2 className="text-elements fw-bold mb-4">
              Pensado para o conforto do seu pet
            </h2>
            <p className="mb-4">
              O Alimentador Inteligente PetFeed foi desenvolvido após anos de
              pesquisa sobre os hábitos alimentares de cães e gatos, criando uma
              solução que respeita o ritmo natural de alimentação dos animais
              enquanto oferece praticidade aos tutores.
            </p>
            <p>
              Com design moderno e intuitivo, o PetFeed se encaixa perfeitamente
              na decoração da sua casa, enquanto proporciona uma experiência de
              alimentação ideal para seu pet.
            </p>
          </div>
          <div className="col-md-6 order-md-1 text-center mb-4 mb-md-0">
            <img
              src={logo}
              alt="Produto em uso"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "90%" }}
            />
          </div>
        </div>
      </section>

      {/* Descrição técnica */}
      <section className="container-fluid py-5 bg-light">
        <div className="container">
          <h2 className="text-elements fw-bold mb-5 text-center">
            Especificações Técnicas
          </h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="bg-main rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <Icon path={mdiScale} size={1.2} color="white" />
                    </div>
                    <h5 className="ms-3 mb-0 text-elements">Capacidade</h5>
                  </div>
                  <ul className="ps-3">
                    <li>Reservatório de 5kg de ração</li>
                    <li>Compartimento à vácuo</li>
                    <li>Proteção contra umidade</li>
                    <li>Bandeja removível e lavável</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="bg-main rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <Icon path={mdiCellphoneNfc} size={1.2} color="white" />
                    </div>
                    <h5 className="ms-3 mb-0 text-elements">Conectividade</h5>
                  </div>
                  <ul className="ps-3">
                    <li>Wi-Fi 2.4GHz integrado</li>
                    <li>Bluetooth 5.0</li>
                    <li>NFC para identificação do pet</li>
                    <li>Backup offline para funcionamento sem internet</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="bg-main rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <Icon path={mdiLightningBolt} size={1.2} color="white" />
                    </div>
                    <h5 className="ms-3 mb-0 text-elements">Energia</h5>
                  </div>
                  <ul className="ps-3">
                    <li>Conexão elétrica 110V/220V</li>
                    <li>Bateria de backup de 48 horas</li>
                    <li>Consumo de energia eficiente</li>
                    <li>Indicador de nível de bateria</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="container py-5">
        <h2 className="text-elements fw-bold mb-5 text-center">
          Benefícios Exclusivos
        </h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div
                      className="bg-main rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <Icon path={mdiCellphoneCog} size={1.2} color="white" />
                    </div>
                  <h4 className="ms-3 mb-0 text-elements">
                    Controle via Chatbot
                  </h4>
                </div>
                <p className="card-text">
                  Nosso chatbot inteligente permite que você controle o
                  alimentador por comandos de voz ou mensagens de texto. Basta
                  dizer "Alimente o Rex agora" ou "Quanto de ração ainda resta?"
                  e nosso assistente virtual cuidará do resto.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div
                      className="bg-main rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <Icon path={mdiScaleBalance} size={1.2} color="white" />
                    </div>
                  <h4 className="ms-3 mb-0 text-elements">Medição por Peso</h4>
                </div>
                <p className="card-text">
                  Diferente de outros alimentadores que medem por volume, nosso
                  sistema utiliza células de carga de alta precisão para
                  garantir que seu pet receba exatamente a quantidade de ração
                  recomendada pelo veterinário, evitando subnutrição ou
                  obesidade.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div
                      className="bg-main rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <Icon path={mdiCellphoneCheck} size={1.2} color="white" />
                    </div>
                  <h4 className="ms-3 mb-0 text-elements">Registro via NFC</h4>
                </div>
                <p className="card-text">
                  A tecnologia NFC permite identificar qual pet está se
                  alimentando, ideal para casas com múltiplos animais. Cada pet
                  tem sua própria tag que, ao se aproximar do alimentador,
                  libera a porção específica programada para suas necessidades.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div
                      className="bg-main rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <Icon path={mdiBadgeAccount} size={1.2} color="white" />
                    </div>
                  <h4 className="ms-3 mb-0 text-elements">
                    Integração com Perfil
                  </h4>
                </div>
                <p className="card-text">
                  Todos os dados de alimentação são automaticamente registrados
                  no perfil do seu pet na Pataforma, criando um histórico
                  alimentar que pode ser compartilhado com veterinários para um
                  acompanhamento mais preciso da saúde do animal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demonstração */}
      <section className="container-fluid py-5 bg-light">
        <div className="container text-center">
          <h2 className="text-elements fw-bold mb-3">Veja o PetFeed em Ação</h2>
          <p className="mb-5">
            Em breve disponibilizaremos vídeos demonstrativos do produto
          </p>
          <div
            className="bg-white border rounded shadow-sm mx-auto d-flex align-items-center justify-content-center"
            style={{ height: "400px", maxWidth: "800px" }}
          >
            <div className="text-center">
              <i
                className="bi bi-play-circle text-elements"
                style={{ fontSize: "80px" }}
              ></i>
              <p className="mt-3 text-muted">
                Demonstração do produto estará disponível em breve
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-5">
        <h2 className="text-elements fw-bold mb-5 text-center">
          Perguntas Frequentes
        </h2>
        <div className="accordion" id="faqAccordion">
          {faqItems.map((item) => (
            <div
              className="accordion-item border-0 mb-3 shadow-sm rounded"
              key={item.id}
            >
              <h3 className="accordion-header" id={`heading${item.id}`}>
                <button
                  className={`accordion-button ${
                    faqOpen[item.id] ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  style={{
                    backgroundColor: faqOpen[item.id]
                      ? "var(--main-color)"
                      : "white",
                    color: faqOpen[item.id] ? "white" : "inherit",
                  }}
                >
                  {item.pergunta}
                </button>
              </h3>
              <div
                className={`accordion-collapse collapse ${
                  faqOpen[item.id] ? "show" : ""
                }`}
                id={`collapse${item.id}`}
              >
                <div className="accordion-body">{item.resposta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulário de Interesse */}
      <section className="container-fluid py-5 bg-main text-white">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2 className="fw-bold mb-4">Garanta seu PetFeed</h2>
              <p className="mb-4">
                O Alimentador Inteligente PetFeed é produzido sob encomenda,
                garantindo qualidade e atenção aos detalhes. Preencha o
                formulário ao lado para demonstrar interesse e entraremos em
                contato com mais informações sobre disponibilidade, preços e
                formas de pagamento.
              </p>
              <div className="mb-4">
                <h5 className="fw-bold">Garantia e Suporte</h5>
                <p>
                  Oferecemos 12 meses de garantia completa contra defeitos de
                  fabricação, além de suporte técnico especializado para ajudar
                  na instalação e solução de dúvidas.
                </p>
              </div>
              <div>
                <h5 className="fw-bold">Envio e Entrega</h5>
                <p>
                  O prazo de produção e entrega é de aproximadamente 15-20 dias
                  úteis, com frete calculado conforme a região. Todos os
                  produtos são testados individualmente antes do envio.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow">
                <div className="card-body p-4">
                  <h3 className="text-elements fw-bold mb-4">
                    Formulário de Interesse
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="nome" className="form-label">
                        Nome completo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="telefone" className="form-label">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="mensagem" className="form-label">
                        Mensagem (opcional)
                      </label>
                      <textarea
                        className="form-control"
                        id="mensagem"
                        name="mensagem"
                        rows="3"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <Botao
                      text="Tenho Interesse"
                      bgColor="var(--secondary-color)"
                      hoverColor="var(--elements-color)"
                      textColor="white"
                      className="w-100 py-2"
                      onClick={handleSubmit}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Produto;
