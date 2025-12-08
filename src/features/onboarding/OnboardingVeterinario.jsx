import React from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaInformacoesPessoais from "./components/EtapaInformacoesPessoais";
import EtapaInformacoesProfissionais from "./components/EtapaInformacoesProfissionais";
import EtapaConfiguracaoPlano from "./components/EtapaConfiguracaoPlano";
import EtapaConclusao from "./components/EtapaConclusao";
import { api, auth } from "../../utils/api";
import { useUser } from "../../contexts/UserContext";

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
  const { user, fetchUserData } = useUser();

  const handleComplete = async (formData) => {
    try {
      console.log("DEBUG: Iniciando processo de onboarding veterinário");
      console.log("DEBUG: Dados do formulário:", formData);

      // Verificar autenticação
      if (!auth.isAuthenticated() || !user || !user.id_usuario) {
        throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
      }

      const userId = user.id_usuario;

      // PASSO 1: Atualizar dados pessoais e tipo de usuário
      console.log("DEBUG: PASSO 1 - Atualizando dados pessoais...");
      
      await api.put("/usuarios/perfil", {
        nome: formData.nomeCompleto,
        telefone: formData.telefone,
        tipo_usuario: "veterinario",
        perfil_completo: false,
      });

      console.log("DEBUG: PASSO 1 concluído - Dados pessoais atualizados");

      // PASSO 2: Validação dos campos obrigatórios
      console.log("DEBUG: PASSO 2 - Validando campos obrigatórios...");
      
      if (!formData.crmv) {
        throw new Error("CRMV é obrigatório");
      }

      if (formData.vincularClinica) {
        const camposClinica = ['nomeClinica', 'endereco', 'cidade', 'estado', 'cep'];
        const camposVazios = camposClinica.filter(campo => !formData[campo] || formData[campo].trim() === '');
        
        if (camposVazios.length > 0) {
          throw new Error(`Campos obrigatórios da clínica não preenchidos: ${camposVazios.join(", ")}`);
        }
      }

      console.log("DEBUG: Todos os campos obrigatórios estão preenchidos");

      // PASSO 3: Criar/atualizar dados do veterinário
      console.log("DEBUG: PASSO 3 - Salvando dados profissionais...");
      
      const especialidades = formData.especialidades || [];
      const especialidade = Array.isArray(especialidades) 
        ? especialidades.join(", ") 
        : especialidades;

      await api.post("/veterinarios/me", {
        crmv: formData.crmv,
        especialidade: especialidade,
      });

      console.log("DEBUG: PASSO 3 concluído - Dados profissionais salvos");

      // PASSO 4: Marcar perfil_completo = true (precisa passar tipo_usuario também para atualizar usuario_tipos)
      console.log("DEBUG: PASSO 4 - Finalizando perfil...");
      
      await api.put("/usuarios/perfil", {
        tipo_usuario: "veterinario",
        perfil_completo: true,
      });

      console.log("DEBUG: PASSO 4 concluído - Perfil marcado como completo");

      // Atualizar contexto do usuário
      try {
        await fetchUserData();
      } catch (e) {
        console.warn("DEBUG: Falha ao atualizar contexto após onboarding:", e);
      }

      console.log("DEBUG: Onboarding veterinário concluído com sucesso!");
      console.log("DEBUG: Redirecionando para dashboard...");

      // Redirecionar para dashboard
      navigate("/dashboard/veterinario/perfil", { replace: true });

      return true;
    } catch (error) {
      console.error("DEBUG: Erro ao completar onboarding:", error);
      console.error("DEBUG: Stack trace:", error.stack);
      console.error("DEBUG: Mensagem:", error.message);

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
      return false;
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
