import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FormularioPergunta from "../components/FormularioPergunta";
import RespostaCard from "../components/RespostaCard";

// Dados mockados
const perguntasData = [
  {
    id: 1,
    pergunta:
      "Meu cachorro está com coceira excessiva e perdendo pelo. O que pode ser?",
    respostas: [
      {
        id: 1,
        veterinario: {
          nome: "Dra. Karin Telles",
          especialidade: "Dermatologista Veterinária",
          cidade: "São Paulo, SP",
          foto: "src/assets/imgs/vetjuliana.jpeg",
        },
        resposta:
          "A coceira excessiva e queda de pelo podem indicar dermatite alérgica, sarna ou problemas hormonais. Recomendo uma consulta para exame clínico e possíveis exames laboratoriais. Enquanto isso, evite banhos frequentes e mantenha o ambiente limpo.",
        data: "2024-01-15",
        isMelhorResposta: true,
      },
      {
        id: 2,
        veterinario: {
          nome: "Dr. André Silva",
          especialidade: "Clínico Geral",
          cidade: "Campinas, SP",
          foto: "src/assets/imgs/vetandre.jpeg",
        },
        resposta:
          "Pode ser alergia alimentar ou ambiental. Tente trocar a ração por uma hipoalergênica e observe se melhora. Se persistir, procure um veterinário.",
        data: "2024-01-14",
        isMelhorResposta: false,
      },
    ],
    totalRespostas: 2,
  },
  {
    id: 2,
    pergunta: "Gato não está comendo há 2 dias. Devo me preocupar?",
    respostas: [
      {
        id: 3,
        veterinario: {
          nome: "Dra. Mariana Costa",
          especialidade: "Clínica Geral",
          cidade: "Rio de Janeiro, RJ",
          foto: "src/assets/imgs/vetmariana.jpeg",
        },
        resposta:
          "Sim, deve se preocupar. Gatos que ficam mais de 24h sem comer podem desenvolver lipidose hepática. Procure um veterinário urgentemente para avaliação e possíveis exames.",
        data: "2024-01-13",
        isMelhorResposta: true,
      },
    ],
    totalRespostas: 1,
  },
  {
    id: 3,
    pergunta: "Qual a melhor idade para castrar meu cachorro?",
    respostas: [
      {
        id: 4,
        veterinario: {
          nome: "Dr. Rafael Santos",
          especialidade: "Cirurgião Veterinário",
          cidade: "Belo Horizonte, MG",
          foto: "src/assets/imgs/vetrafaell.jpeg",
        },
        resposta:
          "A castração é recomendada entre 6-12 meses de idade. Para fêmeas, antes do primeiro cio. Para machos, quando atingem maturidade sexual. Consulte seu veterinário para o momento ideal.",
        data: "2024-01-12",
        isMelhorResposta: true,
      },
    ],
    totalRespostas: 1,
  },
];

export default function DuvidasPage() {
  const [showModal, setShowModal] = useState(false);

  const handleNovaPergunta = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="container-fluid text-white py-5 mt-5 position-relative duvidas-bg">
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-5 fw-bold">
            Tire suas dúvidas sobre a saúde do seu pet
          </h1>
          <p className="lead">
            Pergunte gratuitamente e receba respostas de veterinários
            especializados
          </p>
          <button
            className="btn btn-warning btn-lg px-4 py-2 mt-3"
            onClick={handleNovaPergunta}
          >
            Faça sua pergunta gratuitamente
          </button>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-elements fw-bold">Como funciona?</h2>
            <div
              className="mx-auto"
              style={{
                width: "50px",
                height: "4px",
                backgroundColor: "var(--secondary-color)",
              }}
            ></div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-3 col-sm-6 text-center">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div
                  className="rounded-circle bg-main d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-question text-white fs-3"></i>
                </div>
                <h4 className="text-elements">1. Pergunte</h4>
                <p>
                  Escreva sua dúvida sobre a saúde do seu pet de forma clara e
                  detalhada.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 text-center">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div
                  className="rounded-circle bg-main d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-paper-plane text-white fs-3"></i>
                </div>
                <h4 className="text-elements">2. Envie</h4>
                <p>
                  Sua pergunta será enviada para moderação e depois publicada na
                  plataforma.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 text-center">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div
                  className="rounded-circle bg-main d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-clock text-white fs-3"></i>
                </div>
                <h4 className="text-elements">3. Aguarde</h4>
                <p>
                  Veterinários especializados responderão sua pergunta em até 48
                  horas.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 text-center">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div
                  className="rounded-circle bg-main d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-book-open text-white fs-3"></i>
                </div>
                <h4 className="text-elements">4. Leia</h4>
                <p>
                  Receba respostas qualificadas e orientações para cuidar melhor
                  do seu pet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perguntas e Respostas */}
      <section className="container-fluid bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="text-elements fw-bold">
                Últimas Dúvidas Respondidas
              </h2>
              <div
                className="mx-auto"
                style={{
                  width: "50px",
                  height: "4px",
                  backgroundColor: "var(--secondary-color)",
                }}
              ></div>
            </div>
          </div>

          <div className="row g-4">
            {perguntasData.map((pergunta) => (
              <div key={pergunta.id} className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h4 className="text-elements mb-3">{pergunta.pergunta}</h4>

                    {/* Melhor resposta */}
                    {pergunta.respostas.find((r) => r.isMelhorResposta) && (
                      <RespostaCard
                        resposta={pergunta.respostas.find(
                          (r) => r.isMelhorResposta
                        )}
                        isMelhorResposta={true}
                      />
                    )}

                    {/* Link para mais respostas */}
                    {pergunta.totalRespostas > 1 && (
                      <div className="mt-3">
                        <a
                          href="#"
                          className="text-decoration-none text-elements"
                        >
                          Ver mais {pergunta.totalRespostas - 1} resposta
                          {pergunta.totalRespostas > 2 ? "s" : ""}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="container-fluid py-5 bg-main text-white text-center">
        <div className="container py-3">
          <h2 className="fw-bold mb-4">Ainda tem dúvidas?</h2>
          <p className="lead mb-4">
            Faça sua pergunta agora e receba orientações de veterinários
            especializados
          </p>
          <button
            className="btn btn-warning btn-lg px-4 py-2 me-3"
            onClick={handleNovaPergunta}
          >
            Fazer Pergunta
          </button>
          <a
            href="/veterinarios"
            className="btn btn-outline-light btn-lg px-4 py-2"
          >
            Encontrar Veterinário
          </a>
        </div>
      </section>

      {/* Modal de Nova Pergunta */}
      {showModal && <FormularioPergunta onClose={handleCloseModal} />}

      <Footer />
    </>
  );
}
