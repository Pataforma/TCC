import React from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaIdentificacao from "./components/parceiro/EtapaIdentificacao";
import EtapaCredibilidade from "./components/parceiro/EtapaCredibilidade";
import EtapaObjetivos from "./components/parceiro/EtapaObjetivos";
import { api, auth } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import styles from "./OnboardingParceiro.module.css";

const OnboardingParceiro = () => {
  const navigate = useNavigate();
  const { user, fetchUserData } = useUser();

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

  const handleComplete = async (formData) => {
    try {
      console.log("Onboarding Parceiro completo:", formData);

      // Verificar autenticação
      if (!auth.isAuthenticated() || !user || !user.id_usuario) {
        throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
      }

      // Atualizar dados pessoais e tipo de usuário
      await api.put("/usuarios/perfil", {
        nome: formData.nomeNegocio || formData.nome || user.nome,
        telefone: formData.telefone || user.telefone,
        tipo_usuario: "parceiro",
        perfil_completo: true,
      });

      // TODO: Criar tabela/endpoint para dados específicos de parceiro se necessário
      // Por enquanto, apenas atualizamos o perfil do usuário

      // Atualizar contexto
      await fetchUserData();

      // Redirecionar para dashboard
      navigate("/dashboard/parceiro", { replace: true });
    } catch (error) {
      console.error("Erro ao salvar dados do parceiro:", error);
      let errorMessage = "Erro ao salvar dados. Tente novamente.";
      
      if (error.message) {
        if (error.message.includes("não autenticado") || error.message.includes("401")) {
          errorMessage = "Sessão expirada. Por favor, faça login novamente.";
          setTimeout(() => navigate("/telalogin"), 2000);
        } else if (error.message.includes("não encontrado") || error.message.includes("404")) {
          errorMessage = "Usuário não encontrado. Por favor, faça login novamente.";
          setTimeout(() => navigate("/telalogin"), 2000);
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
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
