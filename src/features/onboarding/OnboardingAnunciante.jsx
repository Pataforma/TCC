import React from "react";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaInformacoesEmpresa from "./components/anunciante/EtapaInformacoesEmpresa";
import EtapaServicosLocalizacao from "./components/anunciante/EtapaServicosLocalizacao";
import EtapaContato from "./components/anunciante/EtapaContato";
import styles from "./OnboardingAnunciante.module.css";

const OnboardingAnunciante = () => {
  const steps = [
    {
      id: "informacoes-empresa",
      title: "Informações da Empresa",
      component: EtapaInformacoesEmpresa,
    },
    {
      id: "servicos-localizacao",
      title: "Serviços e Localização",
      component: EtapaServicosLocalizacao,
    },
    {
      id: "contato",
      title: "Informações de Contato",
      component: EtapaContato,
    },
  ];

  const handleComplete = (data) => {
    console.log("Onboarding Anunciante completo:", data);
    // Aqui você pode salvar os dados no backend
    // Por enquanto, vamos apenas redirecionar para o dashboard
    window.location.href = "/dashboard/anunciante";
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <OnboardingWizard
          title="Bem-vindo à Pataforma!"
          subtitle="Vamos configurar seu perfil de anunciante para que você possa criar eventos incríveis"
          steps={steps}
          onComplete={handleComplete}
          profileType="anunciante"
        />
      </div>
    </div>
  );
};

export default OnboardingAnunciante;
