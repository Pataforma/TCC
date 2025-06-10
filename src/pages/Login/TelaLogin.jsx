import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);

  // Listener para eventos de autenticação
  useEffect(() => {
    const handleAuthChange = async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setLoading(true);
        const userId = session.user.id;
        const userEmail = session.user.email;
        
        try {
          // Verifica se o usuário já existe na tabela usuario
          const { data: existingUser, error: fetchError } = await supabase
            .from("usuario")
            .select("tipo_usuario")
            .eq("email", userEmail)
            .maybeSingle();
            
          if (fetchError) {
            console.error("Erro ao verificar usuário:", fetchError);
            alert("Erro ao verificar dados do usuário");
            setLoading(false);
            return;
          }
          
          // Se o usuário já existe
          if (existingUser) {
            // Verifica se já tem tipo definido
            if (existingUser.tipo_usuario && existingUser.tipo_usuario !== "pendente") {
              navigate(`/dashboard/${existingUser.tipo_usuario}`);
            } else {
              navigate("/tipo-usuario");
            }
          } else {
            // Usuário novo - cria registro na tabela usuario
            const { error: insertError } = await supabase
              .from("usuario")
              .insert([
                {
                  id_usuario: userId,
                  email: userEmail,
                  tipo_usuario: "pendente"
                },
              ]);
              
            if (insertError) {
              console.error("Erro ao inserir usuário:", insertError);
              alert("Erro ao criar perfil do usuário");
              setLoading(false);
              return;
            }
            
            // Redireciona para seleção de tipo
            navigate("/tipo-usuario");
          }
        } catch (error) {
          console.error("Erro no processo de autenticação:", error);
          alert("Erro no processo de login");
        } finally {
          setLoading(false);
        }
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          alert("Email ou senha incorretos");
        } else {
          alert("Erro ao fazer login: " + error.message);
        }
        setLoading(false);
        return;
      }

      // Verifica o tipo de usuário na tabela
      const { data: userData, error: userError } = await supabase
        .from("usuario")
        .select("tipo_usuario")
        .eq("email", loginEmail)
        .maybeSingle();

      if (userError) {
        console.error("Erro ao buscar dados do usuário:", userError);
        alert("Erro ao verificar dados do usuário");
        setLoading(false);
        return;
      }

      if (userData?.tipo_usuario && userData.tipo_usuario !== "pendente") {
        navigate(`/dashboard/${userData.tipo_usuario}`);
      } else {
        navigate("/tipo-usuario");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro inesperado no login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Primeiro verifica se o email já existe na tabela usuario
      const { data: existingUser, error: checkError } = await supabase
        .from("usuario")
        .select("email")
        .eq("email", signupEmail)
        .maybeSingle();

      if (checkError) {
        console.error("Erro ao verificar email:", checkError);
        alert("Erro ao verificar email");
        setLoading(false);
        return;
      }

      if (existingUser) {
        alert("Já existe um usuário cadastrado com este email");
        setLoading(false);
        return;
      }

      // Cria conta de autenticação no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          alert("Já existe um usuário cadastrado com este email");
        } else {
          alert("Erro ao cadastrar: " + authError.message);
        }
        setLoading(false);
        return;
      }

      const userId = authData?.user?.id;

      if (userId) {
        // Insere dados na tabela "usuario"
        const { error: insertError } = await supabase.from("usuario").insert([
          {
            id_usuario: userId,
            email: signupEmail,
            tipo_usuario: "pendente"
          },
        ]);

        if (insertError) {
          console.error("Erro ao salvar dados do usuário:", insertError);
          alert("Erro ao salvar dados do usuário: " + insertError.message);
          setLoading(false);
          return;
        }

        // Redireciona para a tela de seleção de tipo de usuário
        navigate("/tipo-usuario");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro inesperado no cadastro");
    } finally {
      setLoading(false);
    }
  };

  // Função para autenticação com Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/tipo-usuario`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        alert("Erro ao logar com Google: " + error.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro na autenticação Google:", error);
      alert("Erro ao processar login com Google");
      setLoading(false);
    }
  };

  // Função para alternar entre os modos login e cadastro
  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Limpa os campos ao trocar de modo
    setLoginEmail("");
    setLoginPassword("");
    setSignupEmail("");
    setSignupPassword("");
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
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
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
                    required
                    disabled={loading}
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
                  {loading ? "Entrando..." : "Acessar"}
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
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
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
                    className={`far fa-envelope ${styles["auth-icon-modify"]}`}
                  ></i>
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    disabled={loading}
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
                    required
                    disabled={loading}
                  />
                </label>
                <button
                  className={`${styles["auth-btn"]} ${styles["auth-btn-second"]}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
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