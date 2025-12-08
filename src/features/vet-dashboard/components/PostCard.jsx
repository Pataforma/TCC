import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Badge,
  Image,
  Modal,
} from "react-bootstrap";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaRegHeart,
  FaUser,
  FaCalendarAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";
import ComentariosModal from "./ComentariosModal";

const PostCard = ({ post, onUpdate, showSeguir = false }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [curtido, setCurtido] = useState(false);
  const [curtidasCount, setCurtidasCount] = useState(post.curtidas_count || post.curtidasCount || 0);
  const [comentariosCount, setComentariosCount] = useState(post.comentarios_count || post.comentariosCount || 0);
  const [showComentarios, setShowComentarios] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seguindo, setSeguindo] = useState(false);

  const handlePerfilClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (post.veterinario_id) {
      navigate(`/rede-social/veterinario/${post.veterinario_id}`);
    }
  };

  useEffect(() => {
    if (user) {
      verificarCurtida();
      if (showSeguir) {
        verificarSeguindo();
      }
    }
  }, [user, post.id]);

  const verificarCurtida = async () => {
    try {
      const data = await api.get(`/posts/curtidas/${post.id}/verificar`);
      setCurtido(data.curtido || false);
    } catch (error) {
      console.error("Erro ao verificar curtida:", error);
    }
  };

  const verificarSeguindo = async () => {
    try {
      const data = await api.get(`/seguidores/${post.veterinario_id}/verificar`);
      setSeguindo(data.seguindo || false);
    } catch (error) {
      console.error("Erro ao verificar seguindo:", error);
    }
  };

  const handleCurtir = async () => {
    if (!user) {
      alert("Você precisa estar logado para curtir posts");
      return;
    }

    try {
      setLoading(true);
      const data = await api.post("/posts/curtidas", { post_id: post.id });
      setCurtido(data.curtido);
      setCurtidasCount((prev) => (data.curtido ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Erro ao curtir post:", error);
      alert("Erro ao curtir post: " + (error.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const handleSeguir = async () => {
    if (!user) {
      alert("Você precisa estar logado para seguir veterinários");
      return;
    }

    try {
      setLoading(true);
      const data = await api.post("/seguidores", {
        veterinario_id: post.veterinario_id,
      });
      setSeguindo(data.seguindo);
    } catch (error) {
      console.error("Erro ao seguir veterinário:", error);
      alert("Erro ao seguir veterinário: " + (error.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: 0, maxWidth: 614, margin: "0 auto", width: "100%" }}>
        {/* Header do Post */}
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3 px-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
              style={{ width: 40, height: 40, flexShrink: 0, cursor: "pointer" }}
              onClick={handlePerfilClick}
            >
              {post.veterinario_foto ? (
                <Image
                  src={post.veterinario_foto}
                  roundedCircle
                  style={{ width: 40, height: 40, objectFit: "cover" }}
                />
              ) : (
                <FaUser size={18} />
              )}
            </div>
            <div>
              <button
                className="fw-semibold border-0 bg-transparent p-0 text-start"
                style={{ fontSize: "14px", cursor: "pointer", color: "inherit" }}
                onClick={handlePerfilClick}
                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.target.style.textDecoration = "none"}
              >
                {post.nome_clinica || post.veterinario_nome || "Veterinário"}
              </button>
            </div>
          </div>
          {showSeguir && user && user.id_usuario !== post.veterinario_usuario_id && (
            <Button
              variant={seguindo ? "outline-primary" : "primary"}
              size="sm"
              onClick={handleSeguir}
              disabled={loading}
              style={{ fontSize: "14px", padding: "4px 16px" }}
            >
              {seguindo ? "Seguindo" : "Seguir"}
            </Button>
          )}
        </Card.Header>

        {/* Imagem ou Vídeo em Destaque (estilo Instagram) */}
        {(post.tipo === "video" && post.video) || post.imagem ? (
          <div style={{ width: "100%", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {post.tipo === "video" && post.video ? (
              <video
                controls
                style={{ width: "100%", maxHeight: "614px", objectFit: "contain", display: "block" }}
                src={post.video}
              >
                Seu navegador não suporta vídeos.
              </video>
            ) : post.imagem ? (
              <Image
                src={post.imagem}
                style={{ width: "100%", maxHeight: "614px", objectFit: "contain", display: "block" }}
              />
            ) : null}
          </div>
        ) : null}

        {/* Footer com Ações e Descrição */}
        <Card.Footer className="bg-white border-0 px-3 py-2">
          {/* Ações (Curtir, Comentar, Compartilhar) */}
          <div className="d-flex align-items-center gap-3 mb-2">
            <Button
              variant="link"
              className="text-decoration-none p-0 border-0"
              onClick={handleCurtir}
              disabled={loading || !user}
              style={{ padding: "8px" }}
            >
              {curtido ? (
                <FaHeart size={24} color="#dc3545" />
              ) : (
                <FaRegHeart size={24} color="#212529" />
              )}
            </Button>
            <Button
              variant="link"
              className="text-decoration-none p-0 border-0"
              onClick={() => setShowComentarios(true)}
              disabled={!user}
              style={{ padding: "8px" }}
            >
              <FaComment className="text-dark" size={24} />
            </Button>
            <Button
              variant="link"
              className="text-decoration-none p-0 border-0"
              style={{ padding: "8px" }}
            >
              <FaShare className="text-dark" size={24} />
            </Button>
          </div>

          {/* Curtidas */}
          {curtidasCount > 0 && (
            <div className="mb-2" style={{ fontSize: "14px", fontWeight: 600 }}>
              {curtidasCount} {curtidasCount === 1 ? "curtida" : "curtidas"}
            </div>
          )}

          {/* Título e Descrição */}
          <div className="mb-2">
            <button
              className="fw-semibold border-0 bg-transparent p-0 text-start"
              style={{ fontSize: "14px", marginRight: "8px", cursor: "pointer", color: "inherit" }}
              onClick={handlePerfilClick}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}
            >
              {post.nome_clinica || post.veterinario_nome || "Veterinário"}
            </button>
            {post.titulo && (
              <span style={{ fontSize: "14px" }}> {post.titulo}</span>
            )}
            {post.conteudo && (
              <div style={{ fontSize: "14px", marginTop: "4px" }}>
                {post.conteudo}
              </div>
            )}
          </div>

          {/* Ver todos os comentários */}
          {comentariosCount > 0 && (
            <Button
              variant="link"
              className="text-decoration-none p-0 text-muted mb-2"
              onClick={() => setShowComentarios(true)}
              style={{ fontSize: "14px", padding: 0 }}
            >
              Ver todos os {comentariosCount} {comentariosCount === 1 ? "comentário" : "comentários"}
            </Button>
          )}

          {/* Data */}
          <div className="text-muted" style={{ fontSize: "12px", textTransform: "uppercase" }}>
            {formatDate(post.data || post.created_at)}
          </div>
        </Card.Footer>
      </Card>

      {/* Modal de Comentários (estilo Instagram) */}
      <ComentariosModal
        show={showComentarios}
        onHide={() => setShowComentarios(false)}
        postId={post.id}
        post={post}
        onComentarioAdicionado={() => {
          setComentariosCount((prev) => prev + 1);
        }}
      />
    </>
  );
};

export default PostCard;

