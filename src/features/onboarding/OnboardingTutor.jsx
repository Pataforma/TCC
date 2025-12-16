import React from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaInformacoesBasicas from "./components/tutor/EtapaInformacoesBasicas";
import EtapaPets from "./components/tutor/EtapaPets";
import { api, auth } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";
import styles from "./OnboardingTutor.module.css";

const OnboardingTutor = () => {
  const navigate = useNavigate();
  const { user, fetchUserData } = useUser();

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

  const handleComplete = async (formData) => {
    try {
      console.log("DEBUG: Iniciando processo de onboarding tutor");
      console.log("DEBUG: Dados do formulário:", formData);

      // Verificar autenticação
      if (!auth.isAuthenticated() || !user || !user.id_usuario) {
        throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
      }

      const userId = user.id_usuario;

      // PASSO 1: Atualizar dados pessoais e tipo de usuário
      console.log("DEBUG: PASSO 1 - Atualizando dados pessoais...");
      
      await api.put("/usuarios/perfil", {
        nome: formData.nomeCompleto || formData.nome || user.nome,
        telefone: formData.telefone || user.telefone,
        tipo_usuario: "tutor",
        perfil_completo: false,
      });

      console.log("DEBUG: PASSO 1 concluído - Dados pessoais atualizados");

      // PASSO 2: Validação dos campos obrigatórios
      console.log("DEBUG: PASSO 2 - Validando campos obrigatórios...");
      
      if (!formData.nomeCompleto && !formData.nome && !user.nome) {
        throw new Error("Nome é obrigatório");
      }

      console.log("DEBUG: Todos os campos obrigatórios estão preenchidos");

      // PASSO 3: Criar/atualizar dados do tutor
      console.log("DEBUG: PASSO 3 - Salvando dados do tutor...");
      
      await api.post("/tutores/me", {
        nome: formData.nomeCompleto || formData.nome || user.nome,
        telefone: formData.telefone || user.telefone,
        email: user.email,
      });

      console.log("DEBUG: PASSO 3 concluído - Dados do tutor salvos");

      // PASSO 4: Marcar perfil_completo = true
      console.log("DEBUG: PASSO 4 - Finalizando perfil...");
      
      await api.put("/usuarios/perfil", {
        tipo_usuario: "tutor",
        perfil_completo: true,
      });

      console.log("DEBUG: PASSO 4 concluído - Perfil marcado como completo");

      // PASSO 5: Criar pets se houver
      if (formData.pets && Array.isArray(formData.pets) && formData.pets.length > 0) {
        console.log("DEBUG: PASSO 5 - Criando pets...");
        for (const pet of formData.pets) {
          try {
            await api.post("/pets", {
              nome: pet.nome,
              raca: pet.raca || null,
              idade: pet.idade ? parseInt(pet.idade) : null,
              peso: pet.peso ? parseFloat(pet.peso) : null,
              foto_url: pet.fotoPerfil || null,
            });
          } catch (error) {
            console.warn("Erro ao criar pet:", error);
            // Continua mesmo se houver erro ao criar pet
          }
        }
        console.log("DEBUG: PASSO 5 concluído - Pets criados");
      }

      // Atualizar contexto do usuário
      try {
        await fetchUserData();
      } catch (e) {
        console.warn("DEBUG: Falha ao atualizar contexto após onboarding:", e);
      }

      console.log("DEBUG: Onboarding tutor concluído com sucesso!");
      console.log("DEBUG: Redirecionando para dashboard...");

      // Redirecionar para dashboard
      navigate("/dashboard/tutor/perfil", { replace: true });

      return true;
    } catch (error) {
      console.error("Erro ao salvar dados do tutor:", error);
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
