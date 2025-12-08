import React from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaInformacoesEmpresa from "./components/anunciante/EtapaInformacoesEmpresa";
import EtapaServicosLocalizacao from "./components/anunciante/EtapaServicosLocalizacao";
import EtapaContato from "./components/anunciante/EtapaContato";
import { api, auth } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import styles from "./OnboardingAnunciante.module.css";

const OnboardingAnunciante = () => {
  const navigate = useNavigate();
  const { user, fetchUserData } = useUser();

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

  const handleComplete = async (formData) => {
    try {
      console.log("Onboarding Anunciante completo:", formData);

      // Verificar autenticação
      if (!auth.isAuthenticated() || !user || !user.id_usuario) {
        throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
      }

      // Atualizar dados pessoais e tipo de usuário
      await api.put("/usuarios/perfil", {
        nome: formData.nomeEmpresa || formData.nome || user.nome,
        telefone: formData.telefone || formData.telefoneContato || user.telefone,
        tipo_usuario: "anunciante",
        perfil_completo: true,
      });

      // TODO: Criar tabela/endpoint para dados específicos de anunciante se necessário
      // Por enquanto, apenas atualizamos o perfil do usuário

      // Atualizar contexto
      await fetchUserData();

      // Redirecionar para dashboard
      navigate("/dashboard/anunciante", { replace: true });
    } catch (error) {
      console.error("Erro ao salvar dados do anunciante:", error);
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
