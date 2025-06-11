import React, { useState, useEffect } from "react";
import HeaderDashboard from "../components/HeaderDashboard";
import SidebarDashboard from "../components/SidebarDashboard";
import Footer from "../components/Footer";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

const TutorPerfil = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);
      try {
        // Obtém dados da sessão
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

        if (userData) {
          setNome(userData.nome || "");
          setEmail(userData.email || session.user.email);
          setTelefone(userData.telefone || "");
          setUsuario(userData);
          setEditMode(false);
        } else {
          // Usuário ainda não tem perfil, define email da autenticação
          setEmail(session.user.email);
          setEditMode(true);
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        setMensagem("Erro ao carregar dados: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      // Obtém usuário logado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMensagem("Usuário não autenticado.");
        return;
      }

      // Salva/atualiza dados no Supabase
      const userData = {
        nome,
        telefone,
        email: session.user.email,
        tipo_usuario: "tutor",
        status: "ativo"
      };

      let operation;
      if (usuario?.id_usuario) {
        // Atualização
        operation = supabase
          .from("usuario")
          .update(userData)
          .eq("email", session.user.email)
          .eq("status", "ativo");
      } else {
        // Inserção
        operation = supabase.from("usuario").insert(userData);
      }

      const { error } = await operation;

      if (error) {
        throw error;
      }

      setMensagem("Perfil salvo com sucesso!");
      setEditMode(false);
      
      // Recarrega os dados
      const { data } = await supabase
        .from("usuario")
        .select("*")
        .eq("email", session.user.email)
        .eq("status", "ativo")
        .single();
      
      setUsuario(data);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setMensagem("Erro ao salvar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja desativar sua conta? Esta ação não pode ser desfeita.")) {
      return;
    }
    
    setLoading(true);
    try {
      // Obtém usuário logado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMensagem("Usuário não autenticado.");
        return;
      }

      // Desativa a conta (não exclui)
      const { error } = await supabase
        .from("usuario")
        .update({ status: "inativo" })
        .eq("email", session.user.email);

      if (error) {
        throw error;
      }

      // Logout
      await supabase.auth.signOut();
      navigate("/telalogin");
    } catch (error) {
      console.error("Erro ao desativar conta:", error);
      setMensagem("Erro ao desativar conta: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderDashboard
        nomeUsuario={nome || email}
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
              <div className="col-lg-8">
                <div className="card shadow p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Meu Perfil</h2>
                    {!editMode && (
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => setEditMode(true)}
                        disabled={loading}
                      >
                        <i className="fas fa-edit me-2"></i>Editar
                      </button>
                    )}
                  </div>

                  {loading ? (
                    <div className="text-center p-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </div>
                  ) : editMode ? (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input
                          type="text"
                          className="form-control"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          disabled
                        />
                        <small className="text-muted">
                          O email não pode ser alterado
                        </small>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Telefone</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                        />
                      </div>
                      <div className="d-flex gap-2 mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary flex-grow-1"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Salvando...
                            </>
                          ) : (
                            "Salvar"
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            if (usuario) {
                              setNome(usuario.nome || "");
                              setTelefone(usuario.telefone || "");
                              setEditMode(false);
                            }
                          }}
                          disabled={loading}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <h5>Informações Pessoais</h5>
                        <div className="row mt-3">
                          <div className="col-md-4 fw-bold">Nome:</div>
                          <div className="col-md-8">{nome || "Não informado"}</div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-4 fw-bold">Email:</div>
                          <div className="col-md-8">{email}</div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-md-4 fw-bold">Telefone:</div>
                          <div className="col-md-8">{telefone || "Não informado"}</div>
                        </div>
                      </div>

                      <div className="border-top pt-4 mt-4">
                        <h5 className="text-danger">Zona de Perigo</h5>
                        <p className="text-muted small">
                          A desativação da conta tornará seu perfil inacessível e você não poderá fazer login novamente com este email.
                        </p>
                        <button
                          className="btn btn-outline-danger"
                          onClick={handleDelete}
                        >
                          <i className="fas fa-user-slash me-2"></i>
                          Desativar Minha Conta
                        </button>
                      </div>
                    </div>
                  )}

                  {mensagem && (
                    <div className="mt-3 alert alert-info text-center">
                      {mensagem}
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

export default TutorPerfil;
