import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

const TutorPerfil = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Obtém usuário logado
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      setMensagem("Usuário não autenticado.");
      return;
    }
    // Salva dados no Supabase
    const { error } = await supabase.from("tutor_perfil").upsert({
      id_usuario: user.id,
      nome,
      telefone,
      cidade,
    });
    if (error) {
      setMensagem("Erro ao salvar perfil: " + error.message);
    } else {
      setMensagem("Perfil salvo com sucesso!");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div
        className="container d-flex flex-column align-items-center justify-content-center flex-grow-1"
        style={{ minHeight: "70vh" }}
      >
        <div className="card shadow p-4 w-100" style={{ maxWidth: 420 }}>
          <button
            className="btn btn-link mb-3 p-0"
            onClick={() => navigate("/dashboard/tutor")}
          >
            <i className="fas fa-arrow-left me-2"></i> Voltar
          </button>
          <h2 className="mb-4 text-center">Cadastro de Perfil do Tutor</h2>
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
              <label className="form-label">Telefone</label>
              <input
                type="text"
                className="form-control"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Cidade</label>
              <input
                type="text"
                className="form-control"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-2">
              Salvar
            </button>
          </form>
          {mensagem && (
            <div className="mt-3 alert alert-info text-center">{mensagem}</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TutorPerfil;
