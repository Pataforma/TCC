import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import { MdPets, MdEvent, MdHandshake, MdPerson } from "react-icons/md";
import bgPata from "../../assets/imgs/bg-pata.png";

const mainColor = "#0DB2AC";
const secondaryColor = "#FABA32";
const elementsColor = "#fa745a";
const bgButton = "#089691";

const TipoUsuario = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Checa a sessão ao montar o componente
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/telalogin");
      }
      setLoading(false);
    };
    checkSession();
  }, [navigate]);

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
      titulo: "Parceiro ONG",
      descricao: "Gerencie pets para adoção, eventos e campanhas sociais",
      icone: <MdHandshake size={54} color={elementsColor} />,
      rota: "/dashboard/parceiro",
      borderColor: elementsColor,
      bullets: [
        "Gestão de adoções",
        "Eventos e feiras",
        "Controle de interessados",
        "Relatórios de impacto",
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
    if (!user) {
      alert("Usuário não encontrado. Por favor, faça login novamente.");
      navigate("/telalogin");
      return;
    }
    try {
      const { error } = await supabase
        .from("usuario")
        .update({ tipo_usuario: tipo.id })
        .eq("id_usuario", user.id);

      if (error) {
        throw error;
      }

      navigate(tipo.rota);
    } catch (error) {
      alert("Erro ao salvar tipo de usuário: " + error.message);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div
      className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center position-relative p-0"
      style={{
        background: `linear-gradient(120deg, #fff 70%, #f8fafc 100%)`,
        overflow: "hidden",
      }}
    >
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
                cursor: "pointer",
                borderRadius: 24,
                transition:
                  "transform 0.3s, box-shadow 0.3s, border-color 0.3s, box-shadow 0.3s",
                borderTop: `5px solid ${tipo.borderColor}`,
                boxShadow: `0 8px 32px 0 ${tipo.borderColor}22, 0 1.5px 8px 0 #0001`,
                background: "#fff",
                minHeight: 340,
              }}
              onClick={() => handleSelecaoTipo(tipo)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-10px) scale(1.045)";
                e.currentTarget.style.boxShadow = `0 16px 40px 0 ${tipo.borderColor}33, 0 2px 12px 0 #0002`;
                e.currentTarget.style.zIndex = 2;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = `0 8px 32px 0 ${tipo.borderColor}22, 0 1.5px 8px 0 #0001`;
                e.currentTarget.style.zIndex = 1;
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipoUsuario;
