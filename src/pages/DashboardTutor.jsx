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
  const [loading, setLoading] = useState(true);
  const [petCount, setPetCount] = useState(0);
  const [perfilCompleto, setPerfilCompleto] = useState(false);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/telalogin");
          return;
        }

        // Busca dados do usuário
        const { data: userData, error: userError } = await supabase
          .from("usuario")
          .select("*")
          .eq("email", session.user.email)
          .eq("status", "ativo")
          .single();

        if (userError && userError.code !== "PGRST116") {
          throw userError;
        }

        // Define nome do usuário
        if (userData) {
          setNomeUsuario(userData.nome || session.user.email);
          setPerfilCompleto(!!userData.nome && !!userData.telefone);

          // Busca contagem de pets
          const { data: userData2 } = await supabase
            .from("usuario")
            .select("id_usuario")
            .eq("email", session.user.email)
            .eq("status", "ativo")
            .single();

          if (userData2) {
            const { count, error: petsError } = await supabase
              .from("pets")
              .select("id", { count: "exact" })
              .eq("usuario_id", userData2.id_usuario);

            if (petsError) throw petsError;
            setPetCount(count || 0);
          }
        } else {
          setNomeUsuario(session.user.email);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [navigate]);

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
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="card shadow p-4 mb-4">
                  <h2 className="mb-4">Bem-vindo(a) à sua área de Tutor!</h2>
                  
                  {loading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-md-8">
                        <p className="mb-4">
                          Aqui você pode gerenciar seu perfil e seus pets, além de acessar
                          outros recursos disponíveis para tutores.
                        </p>
                        
                        <div className="d-flex flex-column gap-3 mt-4">
                          <button
                            className="btn btn-primary d-flex align-items-center gap-2"
                            onClick={() => navigate("/tutor/perfil")}
                          >
                            <i className="fas fa-user-edit"></i>
                            {perfilCompleto ? "Gerenciar Perfil" : "Completar Perfil"}
                          </button>
                          <button
                            className="btn btn-secondary d-flex align-items-center gap-2"
                            onClick={() => navigate("/tutor/pet")}
                          >
                            <i className="fas fa-paw"></i>
                            {petCount > 0 ? "Gerenciar Pets" : "Cadastrar Pet"}
                          </button>
                        </div>
                      </div>
                      <div className="col-md-4 mt-4 mt-md-0">
                        <div className="card bg-light">
                          <div className="card-body">
                            <h5 className="card-title">Status</h5>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Perfil</span>
                                {perfilCompleto ? (
                                  <span className="badge bg-success">Completo</span>
                                ) : (
                                  <span className="badge bg-warning text-dark">Incompleto</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="d-flex justify-content-between">
                                <span>Pets Cadastrados</span>
                                <span className="badge bg-primary">{petCount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
