import React from "react";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaIdentificacao from "../../components/onboarding/parceiro/EtapaIdentificacao";
import EtapaCredibilidade from "../../components/onboarding/parceiro/EtapaCredibilidade";
import EtapaObjetivos from "../../components/onboarding/parceiro/EtapaObjetivos";
import styles from "./OnboardingParceiro.module.css";

const OnboardingParceiro = () => {
  const steps = [
    {
      id: "identificacao",
      title: "Identificação da Organização",
      component: EtapaIdentificacao,
    },
    {
      id: "credibilidade",
      title: "Credibilidade e Contato",
      component: EtapaCredibilidade,
    },
    {
      id: "objetivos",
      title: "Seus Objetivos na Pataforma",
      component: EtapaObjetivos,
    },
  ];

  const handleComplete = (data) => {
    console.log("Onboarding Parceiro completo:", data);
    // Aqui você pode salvar os dados no backend
    // Por enquanto, vamos apenas redirecionar para o dashboard
    window.location.href = "/dashboard/parceiro";
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <OnboardingWizard
          title="Bem-vindo à Pataforma!"
          subtitle="Vamos configurar o perfil da sua organização para conectar com mais pessoas"
          steps={steps}
          onComplete={handleComplete}
          profileType="parceiro"
        />
      </div>
    </div>
  );
};

export default OnboardingParceiro;
