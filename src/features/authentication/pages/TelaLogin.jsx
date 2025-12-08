import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TelaLogin.module.css";
import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";
import PasswordInput from "../../../components/ui/PasswordInput";
import { auth } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";
import { signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuth, googleProvider } from '../../../services/firebase';

const TelaLogin = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading, fetchUserData } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupNome, setSignupNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Se já está logado, redireciona
  useEffect(() => {
    if (!userLoading && user && auth.isAuthenticated()) {
      const tipoUsuario = user.tipo_usuario || "tutor";
      if (tipoUsuario !== "pendente") {
        navigate(`/dashboard/${tipoUsuario}/perfil`, { replace: true });
      } else {
        navigate("/tipo-usuario", { replace: true });
      }
    }
  }, [user, userLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validação básica
      if (!loginEmail || !loginPassword) {
        setError("Por favor, preencha todos os campos");
        setLoading(false);
        return;
      }

      // Fazer login
      const response = await auth.login(loginEmail, loginPassword);

      if (!response || !response.token) {
        setError("Erro ao fazer login. Tente novamente.");
        setLoading(false);
        return;
      }

      // Aguardar um pouco para garantir que o token foi salvo
      await new Promise(resolve => setTimeout(resolve, 200));

      // Buscar dados do usuário atualizado
      await fetchUserData();

      // Aguardar mais um pouco para o contexto atualizar
      await new Promise(resolve => setTimeout(resolve, 300));

      // Redirecionar baseado no tipo de usuário
      const userData = response.user;
      if (userData && userData.tipo_usuario && userData.tipo_usuario !== "pendente") {
        navigate(`/dashboard/${userData.tipo_usuario}/perfil`, { replace: true });
      } else {
        navigate("/tipo-usuario", { replace: true });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      let errorMessage = "Erro ao fazer login. Tente novamente.";

      if (error.message) {
        if (error.message.includes("Credenciais inválidas") ||
          error.message.includes("401") ||
          error.message.includes("inválid")) {
          errorMessage = "E-mail ou senha incorretos. Verifique suas credenciais.";
        } else if (error.message.includes("já cadastrado") ||
          error.message.includes("already")) {
          errorMessage = "Este e-mail já está cadastrado.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validação básica
      if (!signupEmail || !signupPassword) {
        setError("Por favor, preencha e-mail e senha");
        setLoading(false);
        return;
      }

      if (signupPassword.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres");
        setLoading(false);
        return;
      }

      // Fazer cadastro
      const response = await auth.signup({
        email: signupEmail,
        senha: signupPassword,
        nome: signupNome || undefined,
      });

      if (!response || !response.token) {
        setError("Erro ao cadastrar. Tente novamente.");
        setLoading(false);
        return;
      }

      // Aguardar um pouco para garantir que o token foi salvo
      await new Promise(resolve => setTimeout(resolve, 200));

      // Buscar dados do usuário atualizado
      await fetchUserData();

      // Redirecionar para seleção de tipo
      navigate("/tipo-usuario", { replace: true });
    } catch (error) {
      console.error("Erro no cadastro:", error);
      let errorMessage = "Erro ao cadastrar. Tente novamente.";

      if (error.message) {
        if (error.message.includes("já cadastrado") ||
          error.message.includes("already") ||
          error.message.includes("Email já")) {
          errorMessage = "Este e-mail já está cadastrado. Faça login ou use outro e-mail.";
        } else if (error.message.includes("senha") ||
          error.message.includes("password")) {
          errorMessage = "A senha deve ter no mínimo 6 caracteres.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const googleUser = result.user;
      const token = await googleUser.getIdToken();

      const response = await auth.loginGoogle(token);

      if (!response || !response.token) {
        throw new Error("Erro ao processar login com Google");
      }

      // Aguardar um pouco para garantir que o token foi salvo
      await new Promise(resolve => setTimeout(resolve, 200));

      // Buscar dados do usuário atualizado
      await fetchUserData();

      // Aguardar mais um pouco para o contexto atualizar
      await new Promise(resolve => setTimeout(resolve, 300));

      const userData = response.user;
      if (userData && userData.tipo_usuario && userData.tipo_usuario !== "pendente") {
        navigate(`/dashboard/${userData.tipo_usuario}/perfil`, { replace: true });
      } else {
        navigate("/tipo-usuario", { replace: true });
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
      setError("Erro ao entrar com Google. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setLoginEmail("");
    setLoginPassword("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupNome("");
  };

  if (userLoading) {
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div
        className={`${styles["auth-container"]} ${isLogin ? styles["auth-signin"] : styles["auth-signup"]
          }`}
      >
        <div className={styles["auth-content"]}>
          {/* Mensagem de erro */}
          {error && (
            <div className="alert alert-danger mx-auto mb-3" style={{ maxWidth: "500px" }}>
              {error}
            </div>
          )}

          {/* Visão de Login */}
          <div
            className={styles["auth-first-content"]}
            style={{ display: isLogin ? "flex" : "none" }}
          >
            <div className={styles["auth-first-column"]}>
              <h2
                className={`${styles["auth-title"]} ${styles["auth-title-primary"]}`}
              >
                Ainda não tem uma conta?
              </h2>
              <p
                className={`${styles["auth-description"]} ${styles["auth-description-primary"]}`}
              >
                Preencha seus dados
              </p>
              <p
                className={`${styles["auth-description"]} ${styles["auth-description-primary"]}`}
              >
                e comece sua jornada conosco!
              </p>
              <button
                className={`${styles["auth-btn"]} ${styles["auth-btn-primary"]}`}
                onClick={toggleMode}
                disabled={loading}
              >
                Crie sua conta
              </button>
            </div>
            <div className={styles["auth-second-column"]}>
              <h2
                className={`${styles["auth-title"]} ${styles["auth-title-second"]}`}
              >
                Já tem uma conta?
              </h2>
              <div className={styles["auth-social-media"]}>
                <ul className={styles["auth-list-social-media"]}>
                  <a
                    onClick={handleGoogleLogin}
                    className={styles["auth-link-social-media"]}
                    style={{ cursor: loading ? "not-allowed" : "pointer" }}
                  >
                    <li className={styles["auth-item-social-media"]}>
                      <i className="fab fa-google"></i>
                    </li>
                  </a>
                </ul>
              </div>
              <p
                className={`${styles["auth-description"]} ${styles["auth-description-second"]}`}
              >
                Ou entre com seu e-mail:
              </p>
              <form className={styles["auth-form"]} onSubmit={handleLogin}>
                <label className={styles["auth-label-input"]}>
                  <i
                    className={`far fa-envelope ${styles["auth-icon-modify"]}`}
                  ></i>
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </label>
                <label className={styles["auth-label-input"]}>
                  <i
                    className={`fas fa-lock ${styles["auth-icon-modify"]}`}
                  ></i>
                  <PasswordInput
                    id="loginPassword"
                    placeholder="Senha"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                    inputClassName=""
                    className=""
                    style={{ flex: 1 }}
                    autoComplete="current-password"
                  />
                </label>
                <a className={styles["auth-password"]} href="#">
                  Esqueceu sua senha?
                </a>
                <button
                  className={`${styles["auth-btn"]} ${styles["auth-btn-second"]}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Entrando...
                    </>
                  ) : (
                    "Acessar"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Visão de Cadastro */}
          <div
            className={styles["auth-second-content"]}
            style={{ display: isLogin ? "none" : "flex" }}
          >
            <div className={styles["auth-first-column"]}>
              <h2
                className={`${styles["auth-title"]} ${styles["auth-title-primary"]}`}
              >
                Já possui uma conta?
              </h2>
              <p
                className={`${styles["auth-description"]} ${styles["auth-description-primary"]}`}
              >
                Para ficar conectado conosco,
              </p>
              <p
                className={`${styles["auth-description"]} ${styles["auth-description-primary"]}`}
              >
                faça login com seus dados pessoais.
              </p>
              <button
                className={`${styles["auth-btn"]} ${styles["auth-btn-primary"]}`}
                onClick={toggleMode}
                disabled={loading}
              >
                Entrar
              </button>
            </div>
            <div className={styles["auth-second-column"]}>
              <h2
                className={`${styles["auth-title"]} ${styles["auth-title-second"]}`}
              >
                Cadastre-se
              </h2>
              <div className={styles["auth-social-media"]}>
                <ul className={styles["auth-list-social-media"]}>
                  <a
                    onClick={handleGoogleLogin}
                    className={styles["auth-link-social-media"]}
                    style={{ cursor: loading ? "not-allowed" : "pointer" }}
                  >
                    <li className={styles["auth-item-social-media"]}>
                      <i className="fab fa-google"></i>
                    </li>
                  </a>
                </ul>
              </div>
              <p
                className={`${styles["auth-description"]} ${styles["auth-description-second"]}`}
              >
                Ou cadastre-se com seu e-mail:
              </p>
              <form className={styles["auth-form"]} onSubmit={handleSignup}>
                <label className={styles["auth-label-input"]}>
                  <i
                    className={`far fa-user ${styles["auth-icon-modify"]}`}
                  ></i>
                  <input
                    type="text"
                    placeholder="Nome (opcional)"
                    value={signupNome}
                    onChange={(e) => setSignupNome(e.target.value)}
                    disabled={loading}
                    autoComplete="name"
                  />
                </label>
                <label className={styles["auth-label-input"]}>
                  <i
                    className={`far fa-envelope ${styles["auth-icon-modify"]}`}
                  ></i>
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </label>
                <label className={styles["auth-label-input"]}>
                  <i
                    className={`fas fa-lock ${styles["auth-icon-modify"]}`}
                  ></i>
                  <PasswordInput
                    id="signupPassword"
                    placeholder="Senha (mínimo 6 caracteres)"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    disabled={loading}
                    inputClassName=""
                    className=""
                    style={{ flex: 1 }}
                    autoComplete="new-password"
                  />
                </label>
                <button
                  className={`${styles["auth-btn"]} ${styles["auth-btn-second"]}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar"
                  )}
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

export default TelaLogin;
