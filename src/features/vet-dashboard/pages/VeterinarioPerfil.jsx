import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { supabase } from "../../../utils/supabase";
import {
  FaUserMd,
  FaEnvelope,
  FaStethoscope,
  FaEdit,
  FaSave,
} from "react-icons/fa";

const VeterinarioPerfil = () => {
  const [perfil, setPerfil] = useState({
    nome: "",
    email: "",
    especialidade: "",
    bio: "",
    foto_url: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;
        // Primeiro buscar dados básicos do usuário
        const { data: userData, error: userError } = await supabase
          .from("usuario")
          .select("nome, email, status")
          .eq("email", session.user.email)
          .eq("status", "ativo")
          .single();

        if (userError) throw userError;

        // Depois buscar dados específicos do veterinário
        const { data: vetData, error: vetError } = await supabase
          .from("veterinarios")
          .select("especialidades, bio, foto_url")
          .eq("id_usuario", session.user.id)
          .single();

        if (vetError && vetError.code !== "PGRST116") throw vetError;

        // Combinar dados
        const data = {
          ...userData,
          especialidade: vetData?.especialidades?.[0] || "",
          bio: vetData?.bio || "",
          foto_url: vetData?.foto_url || "",
        };
        setPerfil(data);
        setFotoPreview(data.foto_url || "");
      } catch (error) {
        setMensagem("Erro ao carregar perfil: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadFoto = async (file) => {
    if (!file) return null;
    const fileName = `vet_${Date.now()}_${file.name}`;
    const filePath = `veterinarios/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });
    if (uploadError) throw uploadError;
    const publicUrl = supabase.storage.from("images").getPublicUrl(filePath);
    return publicUrl.data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");
    try {
      let foto_url = perfil.foto_url;
      if (foto) {
        foto_url = await uploadFoto(foto);
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão expirada");
      // Atualizar dados básicos na tabela usuario
      const { error: userError } = await supabase
        .from("usuario")
        .update({
          nome: perfil.nome,
        })
        .eq("email", session.user.email)
        .eq("status", "ativo");

      if (userError) throw userError;

      // Atualizar dados específicos na tabela veterinarios
      const { error: vetError } = await supabase.from("veterinarios").upsert({
        id_usuario: session.user.id,
        especialidades: [perfil.especialidade],
        bio: perfil.bio,
        foto_url,
      });

      if (vetError) throw vetError;
      setMensagem("Perfil atualizado com sucesso!");
      setEditMode(false);
      setPerfil((prev) => ({ ...prev, foto_url }));
    } catch (error) {
      setMensagem("Erro ao atualizar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={perfil.nome}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div
              className="card border-0 shadow-sm p-4"
              style={{ borderRadius: 20 }}
            >
              <div className="d-flex align-items-center gap-4 mb-4">
                <div>
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Foto"
                      className="rounded-circle border"
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center border"
                      style={{ width: 100, height: 100 }}
                    >
                      <FaUserMd size={48} className="text-secondary" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="fw-bold mb-1">
                    {perfil.nome || "Veterinário"}
                  </h3>
                  <div className="text-muted mb-1">
                    <FaEnvelope className="me-2" />
                    {perfil.email}
                  </div>
                  <div className="text-muted">
                    <FaStethoscope className="me-2" />
                    {perfil.especialidade || "Especialidade não informada"}
                  </div>
                </div>
                <div className="ms-auto">
                  {!editMode && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setEditMode(true)}
                    >
                      <FaEdit className="me-1" /> Editar Perfil
                    </button>
                  )}
                </div>
              </div>
              <hr />
              {editMode ? (
                <form onSubmit={handleSubmit} className="mt-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nome</label>
                      <input
                        type="text"
                        name="nome"
                        className="form-control"
                        value={perfil.nome}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Especialidade</label>
                      <input
                        type="text"
                        name="especialidade"
                        className="form-control"
                        value={perfil.especialidade}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Bio</label>
                      <textarea
                        name="bio"
                        className="form-control"
                        rows={3}
                        value={perfil.bio}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Foto</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2" />
                      ) : (
                        <FaSave className="me-1" />
                      )}{" "}
                      Salvar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-3">
                  <h5 className="fw-semibold mb-2">Sobre</h5>
                  <p className="text-muted">
                    {perfil.bio || "Nenhuma bio cadastrada."}
                  </p>
                </div>
              )}
              {mensagem && (
                <div className="alert alert-info mt-3 text-center">
                  {mensagem}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VeterinarioPerfil;
