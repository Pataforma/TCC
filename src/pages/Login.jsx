import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'tutor' // 'tutor' ou 'veterinario'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui será implementada a lógica de autenticação
    console.log('Dados do formulário:', formData);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1 container py-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 mt-5 rounded-4">
              <div className="card-body p-4">
                <h2 className="text-center mb-4 text-elements">Login</h2>
                <form onSubmit={handleSubmit}>
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="mb-3">
                    <label className="form-label">Tipo de Usuário</label>
                    <select
                      className="form-select border-2"
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <option value="tutor">Tutor</option>
                      <option value="veterinario">Veterinário</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="btn w-100 mb-3 custom-btn text-white"
                  >
                    Entrar
                  </button>
                  <div className="text-center">
                    <p className="mb-2">Não tem uma conta?</p>
                    <Link 
                      to="/cadastro" 
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
                      Cadastre-se
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

export default Login; 