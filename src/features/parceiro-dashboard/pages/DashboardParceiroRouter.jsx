import React, { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabase";
import { useAuth } from "../../../features/authentication/components/AuthGuard";
import Loader from "../../../components/ui/Loader";
import DashboardParceiroCausa from "./DashboardParceiroCausa";
import DashboardParceiroServico from "./DashboardParceiroServico";

const DashboardParceiroRouter = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!user) {
          setError("Usuário não autenticado");
          setLoading(false);
          return;
        }

        // Buscar o perfil do parceiro no Supabase
        const { data, error } = await supabase
          .from("parceiros")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          setError("Erro ao carregar perfil do parceiro");
          setLoading(false);
          return;
        }

        if (!data) {
          setError("Perfil de parceiro não encontrado");
          setLoading(false);
          return;
        }

        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro inesperado:", err);
        setError("Erro inesperado ao carregar perfil");
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  // Renderizar loading
  if (loading) {
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
      <div className="container text-center py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Erro ao Carregar Dashboard</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Entre em contato com o suporte se o problema persistir.
          </p>
        </div>
      </div>
    );
  }

  // Renderização condicional baseada na categoria do parceiro
  if (profile.categoria === "parceiro_causa") {
    return <DashboardParceiroCausa />;
  } else if (profile.categoria === "parceiro_servico") {
    return <DashboardParceiroServico />;
  } else {
    // Categoria não reconhecida
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">
            Categoria de Parceiro Não Reconhecida
          </h4>
          <p>A categoria "{profile.categoria}" não é suportada pelo sistema.</p>
          <hr />
          <p className="mb-0">
            Entre em contato com o suporte para configurar sua categoria
            corretamente.
          </p>
        </div>
      </div>
    );
  }
};

export default DashboardParceiroRouter;
