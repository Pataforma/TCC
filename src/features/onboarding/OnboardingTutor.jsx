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
      console.log("Onboarding Tutor completo:", formData);

      // Verificar autenticação
      if (!auth.isAuthenticated() || !user || !user.id_usuario) {
        throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
      }

      // Atualizar dados pessoais e tipo de usuário
      await api.put("/usuarios/perfil", {
        nome: formData.nomeCompleto || formData.nome || user.nome,
        telefone: formData.telefone || user.telefone,
        tipo_usuario: "tutor",
        perfil_completo: true,
      });

      // Se houver pets no formData, criar eles
      if (formData.pets && Array.isArray(formData.pets) && formData.pets.length > 0) {
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
      }

      // Atualizar contexto
      await fetchUserData();

      // Redirecionar para dashboard
      navigate("/dashboard/tutor/perfil", { replace: true });
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
