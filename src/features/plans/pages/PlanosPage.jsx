import React from "react";
import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";
import PlanCard from "../components/PlanCard";
import styles from "./PlanosPage.module.css";

// Estrutura de dados modular - fácil de modificar e expandir
const plansData = [
  {
    name: "Básico",
    price: "R$ 29,90",
    billingCycle: "/mês",
    description: "Ideal para profissionais autônomos que estão começando.",
    ctaText: "Começar com o Básico",
    isFeatured: false,
    features: [
      { text: "Agenda de Consultas", available: true },
      { text: "Gestão de Pacientes e Prontuários", available: true },
      { text: "Chat com o Tutor", available: true },
      { text: "Emissão de Receitas Simples", available: true },
      { text: "Módulo Financeiro Completo", available: false },
      { text: "Módulo de Estoque Avançado", available: false },
      { text: "Telemedicina", available: false },
      { text: "Perfil Público e Marketing", available: false },
    ],
  },
  {
    name: "Avançado",
    price: "R$ 79,90",
    billingCycle: "/mês",
    description:
      "Para clínicas e veterinários que buscam máxima eficiência e gestão.",
    ctaText: "Fazer Upgrade Agora",
    isFeatured: true,
    features: [
      { text: "Agenda de Consultas", available: true },
      { text: "Gestão de Pacientes e Prontuários", available: true },
      { text: "Chat com o Tutor", available: true },
      { text: "Emissão de Receitas com Assinatura Digital", available: true },
      { text: "Módulo Financeiro Completo", available: true },
      { text: "Módulo de Estoque Avançado", available: true },
      { text: "Telemedicina", available: true },
      { text: "Perfil Público e Marketing", available: true },
    ],
  },
];

export default function PlanosPage() {
  const handlePlanSelection = (planName) => {
    console.log(`Iniciando upgrade para o plano ${planName}`);
    // Aqui você pode adicionar lógica de redirecionamento ou modal
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="container-fluid text-white py-5 position-relative planos-bg">
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-5 fw-bold">Escolha o plano ideal para você</h1>
          <p className="lead">
            Descubra qual plano se adapta melhor às necessidades da sua clínica
            veterinária
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="text-elements fw-bold">Nossos Planos</h2>
            <div
              className="mx-auto"
              style={{
                width: "50px",
                height: "4px",
                backgroundColor: "var(--secondary-color)",
              }}
            ></div>
            <p className="mt-3">
              Oferecemos soluções flexíveis para profissionais autônomos e
              clínicas veterinárias
            </p>
          </div>
        </div>

        <div className={styles.plansGrid}>
          {plansData.map((plan) => (
            <PlanCard
              key={plan.name}
              planData={plan}
              onSelect={() => handlePlanSelection(plan.name)}
            />
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="container-fluid py-5 bg-main text-white text-center">
        <div className="container py-3">
          <h2
            className="fw-bold mb-4"
            style={{
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
              fontSize: "2.5rem",
            }}
          >
            Precisa de um plano personalizado?
          </h2>
          <p className="lead mb-4">
            Entre em contato conosco e descubra como podemos criar uma solução
            sob medida para sua clínica
          </p>
          <a href="/contato" className="btn btn-warning btn-lg px-4 py-2 me-3">
            Fale Conosco
          </a>
          <a href="/produto" className="btn btn-outline-light btn-lg px-4 py-2">
            Conheça Nosso Produto
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
