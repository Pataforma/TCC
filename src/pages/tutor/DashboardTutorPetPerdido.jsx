import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const DashboardTutorPetPerdido = ({ nomeUsuario }) => {
  const [form, setForm] = useState({
    nome: "",
    tipo: "Cachorro",
    raca: "",
    cor: "",
    cidade: "",
    bairro: "",
    local: "",
    data: "",
    descricao: "",
    foto: null,
    contato: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode integrar com o Supabase ou backend
    alert("Pet perdido cadastrado! (integração futura)");
  };

  return (
    <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
      <div className="container py-5">
        <h2 className="fw-bold mb-4" style={{ color: "var(--main-color)" }}>
          Cadastrar Pet Perdido
        </h2>
        <div className="card shadow p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Tipo</label>
                <select
                  className="form-select"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Raça</label>
                <input
                  type="text"
                  className="form-control"
                  name="raca"
                  value={form.raca}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Cor</label>
                <input
                  type="text"
                  className="form-control"
                  name="cor"
                  value={form.cor}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Cidade</label>
                <input
                  type="text"
                  className="form-control"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Bairro</label>
                <input
                  type="text"
                  className="form-control"
                  name="bairro"
                  value={form.bairro}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Local do desaparecimento</label>
                <input
                  type="text"
                  className="form-control"
                  name="local"
                  value={form.local}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Data do desaparecimento</label>
                <input
                  type="date"
                  className="form-control"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-control"
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Foto</label>
                <input
                  type="file"
                  className="form-control"
                  name="foto"
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Contato</label>
                <input
                  type="text"
                  className="form-control"
                  name="contato"
                  value={form.contato}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-4 px-4">
              Cadastrar Pet Perdido
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardTutorPetPerdido;
