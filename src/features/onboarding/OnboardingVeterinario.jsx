import React from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaInformacoesPessoais from "./components/EtapaInformacoesPessoais";
import EtapaInformacoesProfissionais from "./components/EtapaInformacoesProfissionais";
import EtapaConfiguracaoPlano from "./components/EtapaConfiguracaoPlano";
import EtapaConclusao from "./components/EtapaConclusao";

const steps = [
  {
    label: "Dados Pessoais",
    component: EtapaInformacoesPessoais,
  },
  {
    label: "Dados Profissionais",
    component: EtapaInformacoesProfissionais,
  },
  {
    label: "Escolha do Plano",
    component: EtapaConfiguracaoPlano,
  },
  {
    label: "Conclusão",
    component: EtapaConclusao,
  },
];

export default function OnboardingVeterinario() {
  const navigate = useNavigate();

  const handleComplete = async (formData) => {
    try {
      // TODO: Salvar dados do onboarding no backend
      console.log("Completando onboarding veterinário:", formData);

      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirecionar para dashboard
      navigate("/dashboard/veterinario");
    } catch (error) {
      console.error("Erro ao completar onboarding:", error);
      throw error;
    }
  };

  return (
    <OnboardingWizard
      steps={steps}
      onComplete={handleComplete}
      title="Configuração do Perfil Veterinário"
      subtitle="Complete as etapas para configurar seu perfil profissional"
    />
  );
}
