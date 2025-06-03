import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import styles from "./TipoUsuario.module.css";
import { MdPets, MdEvent, MdHandshake, MdPerson } from "react-icons/md";

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
      titulo: "Veterinário",
      descricao: "Acesso ao blog de conteúdo e cadastro de perfil profissional",
      icone: <MdPerson size={48} color="#4a90e2" />,
      rota: "/dashboard/veterinario",
    },
    {
      id: "tutor",
      titulo: "Tutor",
      descricao: "Cadastro de perfil e gerenciamento de pets",
      icone: <MdPets size={48} color="#4a90e2" />,
      rota: "/dashboard/tutor",
    },
    {
      id: "anunciante",
      titulo: "Anunciante de Eventos",
      descricao: "Crie e gerencie eventos relacionados a pets",
      icone: <MdEvent size={48} color="#4a90e2" />,
      rota: "/dashboard/anunciante",
    },
    {
      id: "parceiro",
      titulo: "Parceiro",
      descricao: "Acesso a recursos especiais para parceiros",
      icone: <MdHandshake size={48} color="#4a90e2" />,
      rota: "/dashboard/parceiro",
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
    <div className={styles.container}>
      <h1 className={styles.titulo}>Escolha seu perfil</h1>
      <p className={styles.subtitulo}>
        Selecione o tipo de conta que melhor se adequa a você
      </p>
      <div className={styles.cardsContainer}>
        {tiposUsuario.map((tipo) => (
          <div
            key={tipo.id}
            className={styles.card}
            onClick={() => handleSelecaoTipo(tipo)}
          >
            <div className={styles.iconeContainer}>{tipo.icone}</div>
            <h2 className={styles.cardTitulo}>{tipo.titulo}</h2>
            <p className={styles.cardDescricao}>{tipo.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipoUsuario;
