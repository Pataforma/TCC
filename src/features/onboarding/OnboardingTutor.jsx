import React from "react";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaInformacoesBasicas from "./components/tutor/EtapaInformacoesBasicas";
import EtapaPets from "./components/tutor/EtapaPets";
import styles from "./OnboardingTutor.module.css";

const OnboardingTutor = () => {
  const steps = [
    {
      id: "informacoes-basicas",
      title: "Suas Informações Básicas",
      component: EtapaInformacoesBasicas,
    },
    {
      id: "pets",
      title: "Vamos conhecer seu(s) companheiro(s)!",
      component: EtapaPets,
    },
  ];

  const handleComplete = (data) => {
    console.log("Onboarding Tutor completo:", data);
    // Aqui você pode salvar os dados no backend
    // Por enquanto, vamos apenas redirecionar para o dashboard
    window.location.href = "/dashboard/tutor";
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <OnboardingWizard
          title="Bem-vindo à Pataforma!"
          subtitle="Vamos configurar seu perfil de tutor para que você possa aproveitar ao máximo nossa plataforma"
          steps={steps}
          onComplete={handleComplete}
          profileType="tutor"
        />
      </div>
    </div>
  );
};

export default OnboardingTutor;
