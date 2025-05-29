import React, { useState } from 'react';
import styles from './AuthPage.module.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Função para alternar entre os modos login e cadastro
  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <Header />
      <div className={`${styles['auth-container']} ${isLogin ? styles['auth-signin'] : styles['auth-signup']}`}>
        <div className={styles['auth-content']}>
          {/* Visão de Login */}
          <div
            className={styles['auth-first-content']}
            style={{ display: isLogin ? 'flex' : 'none' }}
          >
            <div className={styles['auth-first-column']}>
              <h2 className={`${styles['auth-title']} ${styles['auth-title-primary']}`}>Ainda não tem uma conta?</h2>
              <p className={`${styles['auth-description']} ${styles['auth-description-primary']}`}>Preencha seus dados</p>
              <p className={`${styles['auth-description']} ${styles['auth-description-primary']}`}>e comece sua jornada conosco!</p>
              <button
                className={`${styles['auth-btn']} ${styles['auth-btn-primary']}`}
                onClick={toggleMode}
              >
                Crie sua conta
              </button>
            </div>
            <div className={styles['auth-second-column']}>
              <h2 className={`${styles['auth-title']} ${styles['auth-title-second']}`}>Já tem uma conta?</h2>
              <div className={styles['auth-social-media']}>
                <ul className={styles['auth-list-social-media']}>
                  {['google-plus-g'].map((icon) => (
                    <a key={icon} href="#" className={styles['auth-link-social-media']}>
                      <li className={styles['auth-item-social-media']}>
                        <i className={`fab fa-${icon}`}></i>
                      </li>
                    </a>
                  ))}
                </ul>
              </div>
              <p className={`${styles['auth-description']} ${styles['auth-description-second']}`}>Ou entre com seu e-mail:</p>
              <form className={styles['auth-form']}>
                <label className={styles['auth-label-input']}>
                  <i className={`far fa-envelope ${styles['auth-icon-modify']}`}></i>
                  <input type="email" placeholder="E-mail" />
                </label>
                <label className={styles['auth-label-input']}>
                  <i className={`fas fa-lock ${styles['auth-icon-modify']}`}></i>
                  <input type="password" placeholder="Senha" />
                </label>
                <a className={styles['auth-password']} href="#">Esqueceu sua senha?</a>
                <button className={`${styles['auth-btn']} ${styles['auth-btn-second']}`} type="button">
                  Acessar
                </button>
              </form>
            </div>
          </div>

          {/* Visão de Cadastro */}
          <div
            className={styles['auth-second-content']}
            style={{ display: isLogin ? 'none' : 'flex' }}
          >
            <div className={styles['auth-first-column']}>
              <h2 className={`${styles['auth-title']} ${styles['auth-title-primary']}`}>Já possui uma conta?</h2>
              <p className={`${styles['auth-description']} ${styles['auth-description-primary']}`}>Para ficar conectado conosco,</p>
              <p className={`${styles['auth-description']} ${styles['auth-description-primary']}`}>faça login com seus dados pessoais.</p>
              <button
                className={`${styles['auth-btn']} ${styles['auth-btn-primary']}`}
                onClick={toggleMode}
              >
                Entrar
              </button>
            </div>
            <div className={styles['auth-second-column']}>
              <h2 className={`${styles['auth-title']} ${styles['auth-title-second']}`}>Cadastre-se</h2>
              {/* <div className={styles['auth-social-media']}>
                <ul className={styles['auth-list-social-media']}>
                  {['google-plus-g'].map((icon) => (
                    <a key={icon} href="#" className={styles['auth-link-social-media']}>
                      <li className={styles['auth-item-social-media']}>
                        <i className={`fab fa-${icon}`}></i>
                      </li>
                    </a>
                  ))}
                </ul>
              </div> */}
              {/* <p className={`${styles['auth-description']} ${styles['auth-description-second']}`}>Ou cadastre-se com seu e-mail:</p> */}
              <form className={styles['auth-form']}>
                <label className={styles['auth-label-input']}>
                  <i className={`far fa-user ${styles['auth-icon-modify']}`}></i>
                  <div className={styles['auth-select-wrapper']}>
                    <select className={styles['auth-select']} defaultValue="">
                      <option value="" disabled>Selecione o tipo de usuário</option>
                      <option value="veterinario">Veterinário</option>
                      <option value="tutor">Tutor</option>
                    </select>
                    <span className={styles['auth-select-arrow']}>&#9662;</span> {/* ▼ */}
                  </div>
                </label>
                <label className={styles['auth-label-input']}>
                  <i className={`far fa-envelope ${styles['auth-icon-modify']}`}></i>
                  <input type="email" placeholder="E-mail" />
                </label>
                <label className={styles['auth-label-input']}>
                  <i className={`fas fa-lock ${styles['auth-icon-modify']}`}></i>
                  <input type="password" placeholder="Senha" />
                </label>
                <button className={`${styles['auth-btn']} ${styles['auth-btn-second']}`} type="button">
                  Cadastrar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthPage;
