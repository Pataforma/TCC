import React from "react";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaIdentificacao from "./components/parceiro/EtapaIdentificacao";
import EtapaCredibilidade from "./components/parceiro/EtapaCredibilidade";
import EtapaObjetivos from "./components/parceiro/EtapaObjetivos";
import styles from "./OnboardingParceiro.module.css";

const OnboardingParceiro = () => {
  console.log("OnboardingParceiro está sendo renderizado");

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

  // Componente de teste simples
  const TestComponent = () => (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Teste - Etapa Identificação</h2>
      <p>Se você está vendo isso, o componente está funcionando!</p>
      <div style={{ marginTop: "2rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Nome da ONG:
        </label>
        <input
          type="text"
          placeholder="Digite o nome da sua organização"
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "2px solid #e0e0e0",
            borderRadius: "6px",
            marginBottom: "1rem",
          }}
        />
        <button
          style={{
            padding: "0.75rem 2rem",
            background: "#0DB2AC",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );

  const testSteps = [
    {
      id: "test",
      title: "Teste",
      component: TestComponent,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <OnboardingWizard
          title="Bem-vindo à Pataforma!"
          subtitle="Vamos configurar o perfil da sua organização para conectar com mais pessoas"
          steps={testSteps}
          onComplete={handleComplete}
          profileType="parceiro"
        />
      </div>
    </div>
  );
};

export default OnboardingParceiro;
