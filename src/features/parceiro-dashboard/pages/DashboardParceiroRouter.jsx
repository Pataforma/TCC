import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import { useUser } from "../../../contexts/UserContext";
import Loader from "../../../components/ui/Loader";
import ErrorDisplay from "../../../components/ui/ErrorDisplay";
import DashboardParceiroCausa from "./DashboardParceiroCausa";
import DashboardParceiroServico from "./DashboardParceiroServico";
import MeuPerfilPublico from "./MeuPerfilPublico";
import MeusServicos from "./MeusServicos";
import MeusProdutos from "./MeusProdutos";
import GestaoAvaliacoes from "./GestaoAvaliacoes";
import FinanceiroPage from "./FinanceiroPage";

const DashboardParceiroRouter = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Aguardar o carregamento do usuário
        if (userLoading) {
          return;
        }

        if (!user) {
          setError("Usuário não autenticado");
          setLoading(false);
          return;
        }

        // Primeiro, tentar buscar o perfil do parceiro no Supabase
        const { data, error } = await supabase
          .from("parceiros")
          .select("*")
          .eq("user_id", user.id_usuario || user.id)
          .single();

        if (error) {
          console.log("Tabela parceiros não encontrada ou erro:", error);

          // Se a tabela não existe ou não há dados, criar um perfil básico
          const basicProfile = {
            id: user.id_usuario || user.id,
            user_id: user.id_usuario || user.id,
            nome: user.nome || user.email?.split("@")[0] || "Parceiro",
            categoria: "parceiro_servico", // Default para Prestador de Serviço
            email: user.email,
            status: "ativo",
            created_at: new Date().toISOString(),
            // Dados básicos para demonstração
            descricao: "Prestador de serviços da Pataforma",
            telefone: user.telefone || "",
            website: "",
            endereco: "",
            cnpj: "",
            nomeNegocio: "Pet Shop Patinhas Felizes",
            categoriaServico: "pet_shop",
          };

          console.log("Criando perfil básico:", basicProfile);
          setProfile(basicProfile);
          setLoading(false);
          return;
        }

        if (!data) {
          // Se não há dados, criar um perfil básico
          const basicProfile = {
            id: user.id_usuario || user.id,
            user_id: user.id_usuario || user.id,
            nome: user.nome || user.email?.split("@")[0] || "Parceiro",
            categoria: "parceiro_servico", // Default para Prestador de Serviço
            email: user.email,
            status: "ativo",
            created_at: new Date().toISOString(),
            descricao: "Prestador de serviços da Pataforma",
            telefone: user.telefone || "",
            website: "",
            endereco: "",
            cnpj: "",
            nomeNegocio: "Pet Shop Patinhas Felizes",
            categoriaServico: "pet_shop",
          };

          console.log("Criando perfil básico (sem dados):", basicProfile);
          setProfile(basicProfile);
          setLoading(false);
          return;
        }

        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro inesperado:", err);

        // Em caso de erro, criar um perfil básico
        const basicProfile = {
          id: user?.id_usuario || user?.id || "temp",
          user_id: user?.id_usuario || user?.id || "temp",
          nome: user?.nome || user?.email?.split("@")[0] || "Parceiro",
          categoria: "parceiro_servico",
          email: user?.email || "",
          status: "ativo",
          created_at: new Date().toISOString(),
          descricao: "Prestador de serviços da Pataforma",
          telefone: user?.telefone || "",
          website: "",
          endereco: "",
          cnpj: "",
          nomeNegocio: "Pet Shop Patinhas Felizes",
          categoriaServico: "pet_shop",
        };

        console.log("Criando perfil básico (erro):", basicProfile);
        setProfile(basicProfile);
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, userLoading]);

  // Renderizar loading
  if (loading || userLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Loader />
      </div>
    );
  }

  // Renderizar erro
  if (error) {
    return (
      <ErrorDisplay
        title="Erro ao Carregar Dashboard"
        message={error}
        type="danger"
        showRetry={true}
        showConfig={true}
      />
    );
  }

  // Renderização condicional baseada na categoria do parceiro
  if (profile.categoria === "parceiro_causa") {
    return <DashboardParceiroCausa />;
  } else if (profile.categoria === "parceiro_servico") {
    return (
      <Routes>
        <Route path="/" element={<DashboardParceiroServico />} />
        <Route path="/perfil" element={<MeuPerfilPublico />} />
        <Route path="/servicos" element={<MeusServicos />} />
        <Route path="/produtos" element={<MeusProdutos />} />
        <Route path="/avaliacoes" element={<GestaoAvaliacoes />} />
        <Route path="/financeiro" element={<FinanceiroPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    // Categoria não reconhecida - usar parceiro_servico como fallback
    console.log(
      "Categoria não reconhecida, usando parceiro_servico como fallback"
    );
    return (
      <Routes>
        <Route path="/" element={<DashboardParceiroServico />} />
        <Route path="/perfil" element={<MeuPerfilPublico />} />
        <Route path="/servicos" element={<MeusServicos />} />
        <Route path="/produtos" element={<MeusProdutos />} />
        <Route path="/avaliacoes" element={<GestaoAvaliacoes />} />
        <Route path="/financeiro" element={<FinanceiroPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }
};

export default DashboardParceiroRouter;
