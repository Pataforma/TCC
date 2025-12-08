import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, auth } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";
import { MdPets, MdEvent, MdHandshake, MdPerson } from "react-icons/md";
import bgPata from "../../../assets/imgs/bg-pata.png";

const mainColor = "#0DB2AC";
const secondaryColor = "#FABA32";
const elementsColor = "#fa745a";
const bgButton = "#089691";

const TipoUsuario = () => {
  const navigate = useNavigate();
  const { user, fetchUserData } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Verificar se está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      if (!auth.isAuthenticated()) {
        navigate("/telalogin");
        return;
      }

      // Se não tem user no contexto, buscar
      if (!user) {
        try {
          await fetchUserData();
        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err);
          navigate("/telalogin");
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate, user, fetchUserData]);

  const tiposUsuario = [
    {
      id: "veterinario",
      titulo: "Veterinário Autônomo",
      descricao:
        "Gerencie consultas, prontuários, prescrições e seu perfil profissional",
      icone: <MdPerson size={54} color={mainColor} />,
      rota: "/dashboard/veterinario",
      borderColor: mainColor,
      bullets: [
        "Agenda de consultas",
        "Prontuários digitais",
        "Controle financeiro",
        "Perfil público",
      ],
    },
    {
      id: "tutor",
      titulo: "Tutor de Pet",
      descricao:
        "Acompanhe a saúde dos seus pets e encontre serviços na sua região",
      icone: <MdPets size={54} color={secondaryColor} />,
      rota: "/dashboard/tutor",
      borderColor: secondaryColor,
      bullets: ["Histórico médico", "Serviços locais", "Agendamentos"],
    },
    {
      id: "parceiro",
      titulo: "Parceiro de Negócio",
      descricao: "Gerencie seu negócio e divulgue seus serviços",
      icone: <MdHandshake size={54} color={elementsColor} />,
      rota: "/dashboard/parceiro",
      borderColor: elementsColor,
      bullets: [
        "Gestão de negócio",
        "Divulgação de serviços",
        "Gestão de clientes",
        "Gestão de fornecedores",
      ],
    },
    {
      id: "anunciante",
      titulo: "Anunciante de Evento",
      descricao: "Organize e promova eventos pet com ferramentas de divulgação",
      icone: <MdEvent size={54} color={bgButton} />,
      rota: "/dashboard/anunciante",
      borderColor: bgButton,
      bullets: [
        "Criação de eventos",
        "Gestão de inscritos",
        "Ferramentas de divulgação",
        "Métricas de engajamento",
      ],
    },
  ];

  const handleSelecaoTipo = async (tipo) => {
    if (!user || !user.id_usuario) {
      setError("Usuário não encontrado. Por favor, faça login novamente.");
      setTimeout(() => navigate("/telalogin"), 2000);
      return;
    }

    setSaving(true);
    setError("");

    try {
      console.log('🔍 [TipoUsuario] Verificando tipo:', tipo.id);
      console.log('🔍 [TipoUsuario] user.tipos:', user.tipos);
      console.log('🔍 [TipoUsuario] user.tipo_usuario:', user.tipo_usuario);
      
      // Verificar se o usuário já tem este tipo de perfil
      const tipoExistente = user.tipos?.find(t => t.tipo === tipo.id);
      console.log('🔍 [TipoUsuario] tipoExistente:', tipoExistente);
      
      // Se já tem o tipo e o perfil está completo, redirecionar para o dashboard
      if (tipoExistente && tipoExistente.perfil_completo) {
        console.log('✅ [TipoUsuario] Perfil completo encontrado, redirecionando para dashboard');
        console.log('📍 [TipoUsuario] Rota do tipo:', tipo.rota);
        console.log('📍 [TipoUsuario] Tipo ativo atual:', user.tipo_usuario);
        console.log('📍 [TipoUsuario] Tipo selecionado:', tipo.id);
        
        // Atualizar o tipo ativo se necessário
        if (user.tipo_usuario !== tipo.id) {
          console.log('🔄 [TipoUsuario] Tipo ativo diferente, atualizando...');
          try {
            await api.post("/usuarios/switch-tipo", { tipo_usuario: tipo.id });
            await fetchUserData();
            console.log('✅ [TipoUsuario] Tipo ativo atualizado com sucesso');
          } catch (error) {
            console.error('❌ [TipoUsuario] Erro ao atualizar tipo ativo:', error);
            // Continuar mesmo com erro
          }
        } else {
          console.log('ℹ️  [TipoUsuario] Tipo ativo já está correto, não precisa atualizar');
        }
        
        // Redirecionar direto para o dashboard
        console.log('🚀 [TipoUsuario] Executando navigate para:', tipo.rota);
        navigate(tipo.rota, { replace: true });
        console.log('✅ [TipoUsuario] Navigate executado');
        return;
      }

      // Se já tem o tipo mas o perfil não está completo, ir para o onboarding
      if (tipoExistente && !tipoExistente.perfil_completo) {
        console.log('⚠️  [TipoUsuario] Perfil existe mas não está completo, indo para onboarding');
        // Atualizar o tipo ativo se necessário
        if (user.tipo_usuario !== tipo.id) {
          await api.post("/usuarios/switch-tipo", { tipo_usuario: tipo.id });
          await fetchUserData();
        }
        // Redirecionar para o onboarding
        navigate(`/onboarding/${tipo.id}`);
        return;
      }

      // Se não tem o tipo, criar novo perfil
      console.log('✨ [TipoUsuario] Criando novo tipo de perfil');
      // Atualizar tipo de usuário via API (sem passar perfil_completo para não sobrescrever)
      const response = await api.put("/usuarios/perfil", {
        tipo_usuario: tipo.id,
        // NÃO passar perfil_completo aqui, deixar o backend manter o valor existente ou usar false por padrão
      });

      if (!response || !response.user) {
        throw new Error("Erro ao salvar tipo de usuário");
      }

      // Atualizar contexto
      await fetchUserData();

      // Redirecionar para o onboarding específico do tipo de usuário
      navigate(`/onboarding/${tipo.id}`);
    } catch (error) {
      console.error("Erro ao salvar tipo de usuário:", error);
      let errorMessage = "Erro ao salvar tipo de usuário. Tente novamente.";
      
      if (error.message) {
        if (error.message.includes("não encontrado")) {
          errorMessage = "Usuário não encontrado. Por favor, faça login novamente.";
        } else if (error.message.includes("não autenticado")) {
          errorMessage = "Sessão expirada. Por favor, faça login novamente.";
          setTimeout(() => navigate("/telalogin"), 2000);
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: `linear-gradient(120deg, #fff 70%, #f8fafc 100%)`,
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center position-relative p-0"
      style={{
        background: `linear-gradient(120deg, #fff 70%, #f8fafc 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Botão de voltar para Home */}
      <button
        className="btn btn-outline-secondary position-absolute"
        style={{
          top: 24,
          left: 24,
          zIndex: 10,
          opacity: 0.85,
          borderRadius: 24,
          padding: "6px 18px",
          fontWeight: 500,
          fontSize: 16,
          boxShadow: "0 2px 8px 0 #0001",
          transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
        }}
        onClick={() => navigate("/")}
        title="Voltar para a Home"
        disabled={saving}
      >
        <span className="me-2" style={{ fontSize: 18 }}>
          🏠
        </span>
        Home
      </button>

      {/* Mensagem de erro */}
      {error && (
        <div
          className="alert alert-danger position-absolute"
          style={{
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            maxWidth: "600px",
            width: "90%",
          }}
        >
          {error}
        </div>
      )}

      {/* Background decorativo de pata */}
      <img
        src={bgPata}
        alt="pata decorativa"
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 400,
          opacity: 0.08,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div className="w-100 text-center mb-5 mt-4" style={{ zIndex: 1 }}>
        <h1
          className="display-3 fw-bold mb-2"
          style={{ color: mainColor, letterSpacing: 1 }}
        >
          Pataforma
        </h1>
        <p
          className="lead mb-4"
          style={{ color: elementsColor, fontWeight: 500, fontSize: 22 }}
        >
          Centro de Referência Animal - Conectando veterinários, tutores, ONGs e
          eventos pet em uma única plataforma
        </p>
        <p className="text-muted">
          Selecione o tipo de perfil que deseja criar. Você pode ter múltiplos perfis!
        </p>
      </div>

      <div
        className="row w-100 justify-content-center g-4"
        style={{ zIndex: 1 }}
      >
        {tiposUsuario.map((tipo) => (
          <div
            key={tipo.id}
            className="col-12 col-sm-6 col-lg-3 d-flex align-items-stretch"
          >
            <div
              className="card shadow-lg border-0 w-100 h-100 card-hover position-relative fade-in"
              style={{
                cursor: saving ? "not-allowed" : "pointer",
                borderRadius: 24,
                transition:
                  "transform 0.3s, box-shadow 0.3s, border-color 0.3s, box-shadow 0.3s",
                borderTop: `5px solid ${tipo.borderColor}`,
                boxShadow: `0 8px 32px 0 ${tipo.borderColor}22, 0 1.5px 8px 0 #0001`,
                background: "#fff",
                minHeight: 340,
                opacity: saving ? 0.6 : 1,
              }}
              onClick={() => !saving && handleSelecaoTipo(tipo)}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.transform =
                    "translateY(-10px) scale(1.045)";
                  e.currentTarget.style.boxShadow = `0 16px 40px 0 ${tipo.borderColor}33, 0 2px 12px 0 #0002`;
                  e.currentTarget.style.zIndex = 2;
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = `0 8px 32px 0 ${tipo.borderColor}22, 0 1.5px 8px 0 #0001`;
                  e.currentTarget.style.zIndex = 1;
                }
              }}
            >
              <div className="card-body d-flex flex-column align-items-center p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: 80,
                    height: 80,
                    background: tipo.borderColor + "18",
                    boxShadow: `0 2px 8px 0 ${tipo.borderColor}22`,
                  }}
                >
                  {tipo.icone}
                </div>
                <h5
                  className="card-title fw-bold text-center mb-2"
                  style={{ color: tipo.borderColor, fontSize: 22 }}
                >
                  {tipo.titulo}
                </h5>
                <p
                  className="card-text text-center mb-3"
                  style={{ minHeight: 48, color: "#444", fontWeight: 500 }}
                >
                  {tipo.descricao}
                </p>
                <ul className="list-unstyled small mb-0 w-100">
                  {tipo.bullets.map((b, i) => (
                    <li key={i} className="d-flex align-items-center mb-1">
                      <span
                        className="me-2"
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: tipo.borderColor,
                          display: "inline-block",
                        }}
                      ></span>
                      {b}
                    </li>
                  ))}
                </ul>
                {saving && (
                  <div className="mt-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Salvando...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipoUsuario;
