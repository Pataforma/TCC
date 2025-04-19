import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cadastro = () => {
  const [userType, setUserType] = useState('tutor');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    // Campos específicos para veterinário
    crmv: '',
    especialidade: '',
    // Campos específicos para tutor
    endereco: '',
    possuiAlimentador: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui será implementada a lógica de cadastro
    console.log('Dados do formulário:', formData);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1 container py-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-10 mt-5 rounded-4">
              <div className="card-body p-4">
                <h2 className="text-center mb-4 text-elements">Cadastro</h2>
                <div className="mb-4">
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="userType"
                      id="tutor"
                      value="tutor"
                      checked={userType === 'tutor'}
                      onChange={(e) => setUserType(e.target.value)}
                    />
                    <label 
                      className="btn btn-outline-primary border-2" 
                      htmlFor="tutor"
                      style={{ 
                        color: 'var(--main-color)', 
                        borderColor: 'var(--main-color)',
                        '&:hover': {
                          backgroundColor: 'var(--main-color)',
                          color: 'white'
                        }
                      }}
                    >
                      Tutor
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="userType"
                      id="veterinario"
                      value="veterinario"
                      checked={userType === 'veterinario'}
                      onChange={(e) => setUserType(e.target.value)}
                    />
                    <label 
                      className="btn btn-outline-primary border-2" 
                      htmlFor="veterinario"
                      style={{ 
                        color: 'var(--main-color)', 
                        borderColor: 'var(--main-color)',
                        '&:hover': {
                          backgroundColor: 'var(--main-color)',
                          color: 'white'
                        }
                      }}
                    >
                      Veterinário
                    </label>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <FormInput
                    label="Nome Completo"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Senha"
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Confirmar Senha"
                    type="password"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Telefone"
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />

                  {userType === 'veterinario' ? (
                    <>
                      <FormInput
                        label="CRMV"
                        name="crmv"
                        value={formData.crmv}
                        onChange={handleChange}
                        required
                      />
                      <FormInput
                        label="Especialidade"
                        name="especialidade"
                        value={formData.especialidade}
                        onChange={handleChange}
                        required
                      />
                    </>
                  ) : (
                    <>
                      <FormInput
                        label="Endereço"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        required
                      />
                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="possuiAlimentador"
                          name="possuiAlimentador"
                          checked={formData.possuiAlimentador}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="possuiAlimentador">
                          Possui Alimentador Pet
                        </label>
                      </div>
                    </>
                  )}

                  <button 
                    type="submit" 
                    className="btn w-100 mb-3 custom-btn text-white"
                  >
                    Cadastrar
                  </button>
                  <div className="text-center">
                    <p className="mb-2">Já tem uma conta?</p>
                    <Link 
                      to="/login" 
                      className="btn btn-outline-primary border-2"
                      style={{ 
                        color: 'var(--main-color)', 
                        borderColor: 'var(--main-color)',
                        '&:hover': {
                          backgroundColor: 'var(--main-color)',
                          color: 'white'
                        }
                      }}
                    >
                      Fazer Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cadastro; 