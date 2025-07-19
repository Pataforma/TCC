import React from "react";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaIdentificacao from "./components/parceiro/EtapaIdentificacao";
import EtapaCredibilidade from "./components/parceiro/EtapaCredibilidade";
import EtapaObjetivos from "./components/parceiro/EtapaObjetivos";
import styles from "./OnboardingParceiro.module.css";

const OnboardingParceiro = () => {
  const steps = [
    {
      id: "identificacao",
      title: "Identificação do Negócio",
      component: EtapaIdentificacao,
    },
    {
      id: "credibilidade",
      title: "Contato e Localização",
      component: EtapaCredibilidade,
    },
    {
      id: "objetivos",
      title: "Configuração do Perfil",
      component: EtapaObjetivos,
    },
  ];

  const handleComplete = async (data) => {
    console.log("Onboarding Parceiro Serviço completo:", data);

    try {
      // Aqui você pode salvar os dados no backend
      // Por enquanto, vamos apenas redirecionar para o dashboard
      window.location.href = "/dashboard/parceiro";
    } catch (error) {
      console.error("Erro ao salvar dados do parceiro:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <OnboardingWizard
          title="Bem-vindo à Pataforma!"
          subtitle="Vamos configurar o perfil do seu negócio para conectar com mais clientes"
          steps={steps}
          onComplete={handleComplete}
          profileType="parceiro"
        />
      </div>
    </div>
  );
};

export default OnboardingParceiro;
