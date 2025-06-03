import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TelaLogin.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../utils/supabase";

const TelaLogin = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      alert("Erro ao logar: " + error.message);
    } else {
      // Redirecionar para a dashboard baseada no tipo de usuário
      const { data: userData } = await supabase
        .from("usuario")
        .select("tipo_usuario")
        .eq("id_usuario", data.user.id)
        .single();

      if (userData?.tipo_usuario && userData.tipo_usuario !== "pendente") {
        navigate(`/dashboard/${userData.tipo_usuario}`);
      } else {
        // Se o usuário ainda não tem tipo definido ou está pendente, redireciona para a tela de seleção
        navigate("/tipo-usuario");
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Cria conta de autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
    });

    if (authError) {
      alert("Erro ao cadastrar: " + authError.message);
      return;
    }

    const userId = authData?.user?.id;

    // Insere dados na tabela "usuario" com tipo_usuario como 'pendente'
    const { error: insertError } = await supabase.from("usuario").insert([
      {
        id_usuario: userId,
        email: signupEmail,
        status: "ativo",
        tipo_usuario: "pendente", // Valor padrão temporário
      },
    ]);

    if (insertError) {
      alert("Erro ao salvar dados adicionais: " + insertError.message);
      return;
    }

    // Redireciona para a tela de seleção de tipo de usuário
    navigate("/tipo-usuario");
  };

  // Função para alternar entre os modos login e cadastro
  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <Header />
      <div
        className={`${styles["auth-container"]} ${
          isLogin ? styles["auth-signin"] : styles["auth-signup"]
        }`}
      >
        <div className={styles["auth-content"]}>
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
                  {["google-plus-g"].map((icon) => (
                    <a
                      key={icon}
                      href="#"
                      className={styles["auth-link-social-media"]}
                    >
                      <li className={styles["auth-item-social-media"]}>
                        <i className={`fab fa-${icon}`}></i>
                      </li>
                    </a>
                  ))}
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
                  />
                </label>
                <label className={styles["auth-label-input"]}>
                  <i
                    className={`fas fa-lock ${styles["auth-icon-modify"]}`}
                  ></i>
                  <input
                    type="password"
                    placeholder="Senha"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </label>
                <a className={styles["auth-password"]} href="#">
                  Esqueceu sua senha?
                </a>
                <button
                  className={`${styles["auth-btn"]} ${styles["auth-btn-second"]}`}
                  type="submit"
                >
                  Acessar
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
                  {["google-plus-g"].map((icon) => (
                    <a
                      key={icon}
                      href="#"
                      className={styles["auth-link-social-media"]}
                    >
                      <li className={styles["auth-item-social-media"]}>
                        <i className={`fab fa-${icon}`}></i>
                      </li>
                    </a>
                  ))}
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
                    className={`far fa-envelope ${styles["auth-icon-modify"]}`}
                  ></i>
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </label>
                <label className={styles["auth-label-input"]}>
                  <i
                    className={`fas fa-lock ${styles["auth-icon-modify"]}`}
                  ></i>
                  <input
                    type="password"
                    placeholder="Senha"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </label>
                <button
                  className={`${styles["auth-btn"]} ${styles["auth-btn-second"]}`}
                  type="submit"
                >
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

export default TelaLogin;
