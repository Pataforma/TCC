import React, { useState, useEffect } from "react";
import PlanCard from "/src/features/plans/components/PlanCard";
import styles from "./EtapaConfiguracaoPlano.module.css";

// Dados dos planos (mesmo da página de planos)
const plansData = [
  {
    name: "Básico",
    price: "R$ 29,90",
    billingCycle: "/mês",
    description: "Ideal para profissionais autônomos que estão começando.",
    ctaText: "Escolher Plano Básico",
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
    ctaText: "Escolher Plano Avançado",
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

export default function EtapaConfiguracaoPlano({ data, onUpdate, onNext }) {
  const [selectedPlan, setSelectedPlan] = useState(data.selectedPlan || null);

  useEffect(() => {
    onUpdate({ selectedPlan });
  }, [selectedPlan]);

  const handlePlanSelection = (planName) => {
    setSelectedPlan(planName);
  };

  const handleNext = () => {
    if (selectedPlan) {
      onNext();
    } else {
      alert("Por favor, selecione um plano para continuar.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Escolha seu Plano</h2>
        <p>Selecione o plano que melhor atende às suas necessidades</p>
      </div>

      <div className={styles.plansSection}>
        <div className={styles.plansGrid}>
          {plansData.map((plan) => (
            <div
              key={plan.name}
              className={`${styles.planWrapper} ${
                selectedPlan === plan.name ? styles.selected : ""
              }`}
              onClick={() => handlePlanSelection(plan.name)}
            >
              <PlanCard
                planData={plan}
                onSelect={() => handlePlanSelection(plan.name)}
              />
              {selectedPlan === plan.name && (
                <div className={styles.selectedBadge}>
                  <i className="fas fa-check-circle"></i> Selecionado
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <div className={styles.selectionInfo}>
          <div className={styles.infoCard}>
            <h4>Plano Selecionado: {selectedPlan}</h4>
            <p>
              Você pode alterar seu plano a qualquer momento nas configurações
              da sua conta.
            </p>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button
          className={styles.btnNext}
          onClick={handleNext}
          disabled={!selectedPlan}
        >
          Continuar <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
