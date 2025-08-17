import React from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "../../components/OnboardingWizard";
import EtapaInformacoesPessoais from "./components/EtapaInformacoesPessoais";
import EtapaInformacoesProfissionais from "./components/EtapaInformacoesProfissionais";
import EtapaConfiguracaoPlano from "./components/EtapaConfiguracaoPlano";
import EtapaConclusao from "./components/EtapaConclusao";
import { supabase } from "../../utils/supabase";

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

  const handleComplete = async (formData) => {
    try {
      console.log("DEBUG: Iniciando processo de onboarding veterinário");
      console.log(
        "DEBUG: Dados do formulário recebidos:",
        JSON.stringify(formData, null, 2)
      );
      console.log("DEBUG: Verificando tipos de dados do formulário:");
      Object.entries(formData).forEach(([key, value]) => {
        console.log(`  ${key}: ${value} (tipo: ${typeof value})`);
      });

      // Obter sessão atual
      console.log("DEBUG: Obtendo sessão atual do Supabase...");
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("DEBUG: Erro ao obter sessão:", sessionError);
        throw new Error("Erro ao obter sessão: " + sessionError.message);
      }

      if (!session) {
        console.error("DEBUG: Nenhuma sessão encontrada");
        throw new Error("Usuário não autenticado");
      }

      console.log("DEBUG: Sessão obtida com sucesso");
      console.log("DEBUG: Dados da sessão:", {
        userId: session.user.id,
        userEmail: session.user.email,
        userRole: session.user.role,
      });

      const userEmail = session.user.email;
      const userId = session.user.id;

      // PASSO 1: Atualizar dados pessoais e tipo de usuário na tabela 'usuario'
      console.log("DEBUG: PASSO 1 - Atualizando tabela usuario...");
      console.log("DEBUG: Dados para atualização na tabela usuario:", {
        nome: formData.nomeCompleto,
        telefone: formData.telefone,
        tipo_usuario: "veterinario",
        status: "ativo",
      });

      const { error: updateUserError } = await supabase
        .from("usuario")
        .update({
          nome: formData.nomeCompleto,
          telefone: formData.telefone,
          tipo_usuario: "veterinario",
          status: "ativo",
        })
        .eq("email", userEmail);

      if (updateUserError) {
        console.error(
          "DEBUG: Erro ao atualizar usuário na tabela usuario:",
          updateUserError
        );
        console.error("DEBUG: Código do erro:", updateUserError.code);
        console.error("DEBUG: Mensagem do erro:", updateUserError.message);
        throw new Error(
          "Erro ao salvar dados pessoais: " + updateUserError.message
        );
      }

      console.log(
        "DEBUG: PASSO 1 concluído com sucesso - Usuário atualizado na tabela usuario"
      );

      // PASSO 2: Inserir dados específicos do veterinário na tabela 'veterinarios'
      console.log(
        "DEBUG: PASSO 2 - Preparando dados para tabela veterinarios..."
      );

      // Validação dos campos obrigatórios
      console.log("DEBUG: Validando campos obrigatórios...");
      const camposObrigatorios = {
        crmv: formData.crmv,
        nomeClinica: formData.nomeClinica,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
      };

      const camposVazios = Object.entries(camposObrigatorios)
        .filter(([key, value]) => !value || value.trim() === "")
        .map(([key]) => key);

      if (camposVazios.length > 0) {
        console.error("DEBUG: Campos obrigatórios vazios:", camposVazios);
        throw new Error(
          `Campos obrigatórios não preenchidos: ${camposVazios.join(", ")}`
        );
      }

      console.log("DEBUG: Todos os campos obrigatórios estão preenchidos");

      const veterinarioData = {
        id_usuario: userId,
        crmv: formData.crmv,
        especialidades: formData.especialidades || [],
        nome_clinica: formData.nomeClinica,
        endereco_clinica: formData.endereco,
        cidade_clinica: formData.cidade,
        estado_clinica: formData.estado,
        cep_clinica: formData.cep,
        telefone_clinica: formData.telefone,
        plano: formData.selectedPlan || "basico",
        status: "ativo",
        data_cadastro: new Date().toISOString(),
      };

      // DEBUG: Logar o objeto de dados enviado para a tabela veterinarios
      console.log(
        "DEBUG: Objeto de dados enviado para a tabela veterinarios:",
        JSON.stringify(veterinarioData, null, 2)
      );
      console.log("DEBUG: Tipo de dados de cada campo:");
      Object.entries(veterinarioData).forEach(([key, value]) => {
        console.log(`  ${key}: ${value} (tipo: ${typeof value})`);
      });

      // Verificar se já existe registro para este veterinário
      console.log(
        "DEBUG: Verificando se já existe registro para userId:",
        userId
      );
      const { data: existingVet, error: checkError } = await supabase
        .from("veterinarios")
        .select("id_veterinarios")
        .eq("id_usuario", userId)
        .maybeSingle();

      if (checkError) {
        console.error(
          "DEBUG: Erro ao verificar veterinário existente:",
          checkError
        );
        throw new Error(
          "Erro ao verificar dados profissionais: " + checkError.message
        );
      }

      console.log("DEBUG: Registro existente encontrado:", existingVet);

      if (existingVet) {
        // Atualizar registro existente
        console.log(
          "DEBUG: Atualizando registro existente na tabela veterinarios..."
        );
        const { error: updateVetError } = await supabase
          .from("veterinarios")
          .update(veterinarioData)
          .eq("id_usuario", userId);

        if (updateVetError) {
          console.error(
            "DEBUG: Erro detalhado retornado pelo Supabase (UPDATE):",
            updateVetError
          );
          console.error("DEBUG: Código do erro:", updateVetError.code);
          console.error("DEBUG: Mensagem do erro:", updateVetError.message);
          console.error("DEBUG: Detalhes do erro:", updateVetError.details);
          console.error("DEBUG: Hint do erro:", updateVetError.hint);
          throw new Error(
            "Erro ao atualizar dados profissionais: " + updateVetError.message
          );
        }
        console.log("DEBUG: Registro atualizado com sucesso!");
      } else {
        // Criar novo registro
        console.log("DEBUG: Criando novo registro na tabela veterinarios...");
        const { error: insertVetError } = await supabase
          .from("veterinarios")
          .insert(veterinarioData);

        if (insertVetError) {
          console.error(
            "DEBUG: Erro detalhado retornado pelo Supabase (INSERT):",
            insertVetError
          );
          console.error("DEBUG: Código do erro:", insertVetError.code);
          console.error("DEBUG: Mensagem do erro:", insertVetError.message);
          console.error("DEBUG: Detalhes do erro:", insertVetError.details);
          console.error("DEBUG: Hint do erro:", insertVetError.hint);
          throw new Error(
            "Erro ao salvar dados profissionais: " + insertVetError.message
          );
        }
        console.log("DEBUG: Registro criado com sucesso!");
      }

      console.log("DEBUG: Onboarding veterinário concluído com sucesso!");
      console.log("DEBUG: Todos os dados foram salvos corretamente");
      console.log("DEBUG: Redirecionando para dashboard...");

      console.log("DEBUG: Redirecionando para dashboard...");

      // Redirecionar para dashboard
      navigate("/dashboard/veterinario", { replace: true });

      // Retornar true para indicar sucesso
      return true;
    } catch (error) {
      console.error("DEBUG: Erro geral ao completar onboarding:", error);
      console.error("DEBUG: Stack trace completo:", error.stack);
      console.error("DEBUG: Nome do erro:", error.name);
      console.error("DEBUG: Mensagem do erro:", error.message);

      // Se for um erro do Supabase, logar detalhes adicionais
      if (error.code) {
        console.error("DEBUG: Código do erro Supabase:", error.code);
        console.error("DEBUG: Detalhes do erro Supabase:", error.details);
        console.error("DEBUG: Hint do erro Supabase:", error.hint);
      }

      // Não fazer throw do erro para evitar que o OnboardingWizard continue executando
      // Apenas mostrar o alert e deixar o usuário tentar novamente
      alert("Erro ao salvar dados: " + error.message);

      // Retornar false para indicar falha
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
