import React, { useEffect, useState } from "react";
import HeaderDashboard from "../components/HeaderDashboard";
import SidebarDashboard from "../components/SidebarDashboard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

const DashboardTutor = () => {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchNome = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (user) {
        // Busca nome do perfil do tutor
        const { data } = await supabase
          .from("tutor_perfil")
          .select("nome")
          .eq("id_usuario", user.id)
          .single();
        setNomeUsuario(data?.nome || user.email);
      }
    };
    fetchNome();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderDashboard
        nomeUsuario={nomeUsuario}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
      <SidebarDashboard
        tipoUsuario="tutor"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="d-flex" style={{ flex: 1, minHeight: "70vh" }}>
        {/* Espaço para sidebar no desktop */}
        <div className="d-none d-md-block" style={{ width: 240 }}></div>
        <main className="flex-grow-1 p-4">
          <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1">
            <div className="text-center w-100" style={{ maxWidth: 600 }}>
              <h2>Bem-vindo(a) à sua área de Tutor!</h2>
              <p>
                Aqui você poderá preencher seu perfil e cadastrar seus pets.
              </p>
              <div className="d-flex gap-3 mt-4 justify-content-center">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/tutor/perfil")}
                >
                  Preencher Perfil
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/tutor/pet")}
                >
                  Cadastrar Pet
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardTutor;
