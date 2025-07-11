import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import { supabase } from "../../utils/supabase";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/Dashboard/StatCard";
import SimpleChart from "../../components/Dashboard/SimpleChart";

const DashboardTutorPet = () => {
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [nfcId, setNfcId] = useState("");
  const [foto, setFoto] = useState(null);
  const [fotoUrl, setFotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editPetId, setEditPetId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/telalogin");
        return;
      }

      // Busca nome do usuário
      const { data } = await supabase
        .from("usuario")
        .select("nome, email")
        .eq("email", session.user.email)
        .eq("status", "ativo")
        .single();

      setNomeUsuario(data?.nome || data?.email || session.user.email);
    };

    fetchUserInfo();
    fetchPets();
  }, [navigate]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // Primeiro, busca o ID do usuário pelo email
      const { data: userData, error: userError } = await supabase
        .from("usuario")
        .select("id_usuario")
        .eq("email", session.user.email)
        .eq("status", "ativo")
        .single();

      if (userError) throw userError;

      // Busca todos os pets do usuário
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("usuario_id", userData.id_usuario)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      setMensagem("Erro ao carregar pets: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNome("");
    setRaca("");
    setIdade("");
    setPeso("");
    setNfcId("");
    setFotoUrl("");
    setFoto(null);
    setEditPetId(null);
    setEditMode(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);

      // Exibe preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFoto = async (file) => {
    if (!file) return null;

    setUploading(true);
    try {
      // Adicione um console.log para verificar a sessão
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Sessão atual:", session);

      const fileName = `pet_${Date.now()}_${file.name}`;
      const filePath = `pets/${fileName}`;

      // Tente usar um caminho mais simples para o upload
      const { error: uploadError, data } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true, // Tente sobrescrever se já existir
        });

      if (uploadError) throw uploadError;

      // Use getPublicUrl apenas se o upload for bem-sucedido
      const publicUrl = supabase.storage.from("images").getPublicUrl(filePath);
      return publicUrl.data.publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      // Retorne null em vez de lançar o erro
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      // Obtém usuário logado
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setMensagem("Usuário não autenticado.");
        return;
      }

      // Obtém ID do usuário
      const { data: userData, error: userError } = await supabase
        .from("usuario")
        .select("id_usuario")
        .eq("email", session.user.email)
        .eq("status", "ativo")
        .single();

      if (userError) throw userError;

      // Tenta fazer upload da foto, se houver
      let foto_url = fotoUrl;
      if (foto) {
        try {
          const uploadedUrl = await uploadFoto(foto);
          if (uploadedUrl) foto_url = uploadedUrl;
        } catch (uploadError) {
          console.log("Erro no upload, continuando sem imagem:", uploadError);
        }
      }

      const petData = {
        nome,
        raca,
        idade: idade ? parseInt(idade) : null,
        peso: peso ? parseFloat(peso) : null,
        nfc_id: nfcId || null,
        foto_url: foto_url || null,
        usuario_id: userData.id_usuario,
      };

      let error;

      if (editMode && editPetId) {
        // Atualização - use update em vez de insert
        console.log("Atualizando pet existente:", editPetId);
        const { error: updateError } = await supabase
          .from("pets")
          .update(petData)
          .eq("id", editPetId);
        error = updateError;
      } else {
        // Inserção - continue usando o RPC
        console.log("Inserindo novo pet");
        const { data, error: rpcError } = await supabase.rpc(
          "insert_pet_bypass_rls",
          {
            nome_pet: nome,
            raca_pet: raca,
            idade_pet: idade ? parseInt(idade) : null,
            peso_pet: peso ? parseFloat(peso) : null,
            nfc_id_pet: nfcId || null,
            foto_url_pet: foto_url || null,
            usuario_id_pet: userData.id_usuario,
          }
        );

        if (rpcError) {
          // Tente a inserção direta se a RPC falhar
          const { error: insertError } = await supabase
            .from("pets")
            .insert(petData);

          error = insertError;
        }
      }

      if (error) throw error;

      setMensagem(
        editMode ? "Pet atualizado com sucesso!" : "Pet cadastrado com sucesso!"
      );
      resetForm();
      fetchPets(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
      setMensagem(
        `Erro ao ${editMode ? "atualizar" : "cadastrar"} pet: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pet) => {
    setNome(pet.nome || "");
    setRaca(pet.raca || "");
    setIdade(pet.idade?.toString() || "");
    setPeso(pet.peso?.toString() || "");
    setNfcId(pet.nfc_id || "");
    setFotoUrl(pet.foto_url || "");
    setEditPetId(pet.id);
    setEditMode(true);

    // Rola para o formulário
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este pet?")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("pets").delete().eq("id", id);

      if (error) throw error;

      setMensagem("Pet excluído com sucesso!");
      fetchPets(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao excluir pet:", error);
      setMensagem("Erro ao excluir pet: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow p-4 mb-4">
              <h2 className="mb-4">
                {editMode ? "Editar Pet" : "Cadastrar Novo Pet"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nome do Pet</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Raça</label>
                      <input
                        type="text"
                        className="form-control"
                        value={raca}
                        onChange={(e) => setRaca(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Idade (anos)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={idade}
                        onChange={(e) => setIdade(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Peso (kg)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">ID NFC (opcional)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nfcId}
                        onChange={(e) => setNfcId(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Foto</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>

                {fotoUrl && (
                  <div className="mb-3 text-center">
                    <img
                      src={fotoUrl}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    disabled={loading || uploading}
                  >
                    {loading || uploading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {uploading ? "Enviando foto..." : "Salvando..."}
                      </>
                    ) : editMode ? (
                      "Atualizar Pet"
                    ) : (
                      "Cadastrar Pet"
                    )}
                  </button>
                  {editMode && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de Pets */}
            <div className="card shadow p-4">
              <h3 className="mb-4">Meus Pets</h3>

              {loading && !editMode ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : pets.length === 0 ? (
                <div className="alert alert-info">
                  Você ainda não tem pets cadastrados.
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-md-2 g-4">
                  {pets.map((pet) => (
                    <div className="col" key={pet.id}>
                      <div className="card h-100">
                        <div className="position-relative">
                          {pet.foto_url ? (
                            <img
                              src={pet.foto_url}
                              className="card-img-top"
                              alt={pet.nome}
                              style={{
                                height: "180px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="card-img-top bg-light d-flex align-items-center justify-content-center"
                              style={{ height: "180px" }}
                            >
                              <i className="fas fa-paw fa-3x text-secondary"></i>
                            </div>
                          )}
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">{pet.nome}</h5>
                          <div className="card-text">
                            {pet.raca && (
                              <p>
                                <strong>Raça:</strong> {pet.raca}
                              </p>
                            )}
                            {pet.idade && (
                              <p>
                                <strong>Idade:</strong> {pet.idade} ano(s)
                              </p>
                            )}
                            {pet.peso && (
                              <p>
                                <strong>Peso:</strong> {pet.peso} kg
                              </p>
                            )}
                            {pet.nfc_id && (
                              <p>
                                <strong>ID NFC:</strong> {pet.nfc_id}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="card-footer bg-white border-top-0">
                          <div className="d-flex justify-content-between">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(pet)}
                            >
                              <i className="fas fa-edit me-1"></i> Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(pet.id)}
                            >
                              <i className="fas fa-trash me-1"></i> Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {mensagem && (
              <div className="mt-3 alert alert-info text-center">
                {mensagem}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardTutorPet;
