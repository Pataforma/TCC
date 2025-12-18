import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";
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
    especialidades: [],
    bio: "",
    foto_url: "",
  });
  const [especialidadesDisponiveis, setEspecialidadesDisponiveis] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const { updateUserProfile, fetchUserData } = useUser();

  // Carregar especialidades disponíveis do backend
  useEffect(() => {
    const carregarEspecialidades = async () => {
      try {
        const data = await api.get("/especialidades");
        setEspecialidadesDisponiveis(Array.isArray(data) ? data.map(e => e.nome) : []);
      } catch (error) {
        console.error("Erro ao carregar especialidades:", error);
      }
    };
    carregarEspecialidades();
  }, []);

  useEffect(() => {
    const fetchPerfil = async () => {
      setLoading(true);
      try {
        // Buscar dados do usuário
        const userData = await api.get("/usuarios/perfil");
        
        // Buscar dados específicos do veterinário
        let vetData = null;
        try {
          vetData = await api.get("/veterinarios/me");
        } catch (error) {
          // Se não encontrar, não é erro crítico
          console.warn("Perfil de veterinário não encontrado:", error);
        }

        // Processar especialidades (pode vir como string separada por vírgula)
        const especialidadesArray = vetData?.especialidades
          ? vetData.especialidades.split(",").map(e => e.trim()).filter(e => e)
          : [];

        // Combinar dados
        const data = {
          nome: userData.nome || "",
          email: userData.email || "",
          especialidades: especialidadesArray,
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

  const handleEspecialidadeToggle = (especialidade) => {
    setPerfil((prev) => {
      const especialidades = [...prev.especialidades];
      const index = especialidades.indexOf(especialidade);
      
      if (index > -1) {
        especialidades.splice(index, 1);
      } else {
        especialidades.push(especialidade);
      }
      
      return {
        ...prev,
        especialidades,
      };
    });
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
    // TODO IN DEBUG: Implementar upload de foto quando tiver endpoint de storage - Erro 16/11/2025 Edupds
    // Por enquanto, retornar null ou usar base64
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        // Por enquanto, usar data URL (base64)
        // Em produção, fazer upload para servidor de arquivos
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
      
      // Atualizar dados básicos do usuário
      await updateUserProfile({ nome: perfil.nome });

      // Atualizar dados específicos do veterinário
      await api.put("/veterinarios/me", {
        especialidades: perfil.especialidades.join(", "),
        bio: perfil.bio,
        foto_url: foto_url,
      });

      setMensagem("Perfil atualizado com sucesso!");
      setEditMode(false);
      setPerfil((prev) => ({ ...prev, foto_url }));
      
      // Garantir que o cabeçalho reflita o novo nome imediatamente
      try {
        await fetchUserData();
      } catch {}
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
                    {perfil.especialidades.length > 0
                      ? perfil.especialidades.join(", ")
                      : "Especialidades não informadas"}
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
                      <label className="form-label">Especialidades</label>
                      <div
                        className="border rounded p-3"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        {especialidadesDisponiveis.length > 0 ? (
                          especialidadesDisponiveis.map((esp) => (
                            <div key={esp} className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`esp-${esp}`}
                                checked={perfil.especialidades.includes(esp)}
                                onChange={() => handleEspecialidadeToggle(esp)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`esp-${esp}`}
                              >
                                {esp}
                              </label>
                            </div>
                          ))
                        ) : (
                          <small className="text-muted">
                            Carregando especialidades...
                          </small>
                        )}
                      </div>
                      {perfil.especialidades.length > 0 && (
                        <small className="text-muted mt-2 d-block">
                          {perfil.especialidades.length} especialidade(s) selecionada(s)
                        </small>
                      )}
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
