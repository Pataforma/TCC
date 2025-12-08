import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Form,
  Button,
  Image,
  Alert,
} from "react-bootstrap";
import { FaUser, FaReply, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";

const ComentariosModal = ({
  show,
  onHide,
  postId,
  post,
  onComentarioAdicionado,
}) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handlePerfilClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (post?.veterinario_id) {
      navigate(`/rede-social/veterinario/${post.veterinario_id}`);
    }
  };
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [respostaPara, setRespostaPara] = useState(null);
  const [respostaTexto, setRespostaTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [editandoTexto, setEditandoTexto] = useState("");

  useEffect(() => {
    if (show && postId) {
      carregarComentarios();
    }
  }, [show, postId]);

  const carregarComentarios = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/posts/comentarios/${postId}`);
      setComentarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
      setComentarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarComentario = async (e) => {
    e.preventDefault();
    if (!novoComentario.trim() || !user) return;

    try {
      setSaving(true);
      await api.post("/posts/comentarios", {
        post_id: postId,
        comentario: novoComentario,
      });
      setNovoComentario("");
      await carregarComentarios();
      if (onComentarioAdicionado) {
        onComentarioAdicionado();
      }
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      alert("Erro ao criar comentário: " + (error.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const handleResponder = async (e) => {
    e.preventDefault();
    if (!respostaTexto.trim() || !user || !respostaPara) return;

    try {
      setSaving(true);
      await api.post("/posts/comentarios", {
        post_id: postId,
        comentario: respostaTexto,
        parent_id: respostaPara.id,
      });
      setRespostaTexto("");
      setRespostaPara(null);
      await carregarComentarios();
      if (onComentarioAdicionado) {
        onComentarioAdicionado();
      }
    } catch (error) {
      console.error("Erro ao responder comentário:", error);
      alert("Erro ao responder comentário: " + (error.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const handleEditar = async (id) => {
    if (!editandoTexto.trim()) return;

    try {
      setSaving(true);
      await api.put(`/posts/comentarios/${id}`, {
        comentario: editandoTexto,
      });
      setEditandoId(null);
      setEditandoTexto("");
      await carregarComentarios();
    } catch (error) {
      console.error("Erro ao editar comentário:", error);
      alert("Erro ao editar comentário: " + (error.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeletar = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este comentário?")) return;

    try {
      await api.delete(`/posts/comentarios/${id}`);
      await carregarComentarios();
      if (onComentarioAdicionado) {
        onComentarioAdicionado();
      }
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      alert("Erro ao deletar comentário: " + (error.message || "Erro desconhecido"));
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

  const renderComentario = (comentario, nivel = 0) => {
    const isOwner = user && user.id_usuario === comentario.usuario_id;
    const isEditando = editandoId === comentario.id;

    return (
      <div
        key={comentario.id}
        style={{
          marginLeft: nivel * 20,
          marginBottom: 16,
          paddingBottom: 16,
          borderBottom: nivel === 0 ? "1px solid #efefef" : "none",
        }}
      >
        <div className="d-flex align-items-start gap-2 mb-1">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
            style={{ width: 32, height: 32, flexShrink: 0 }}
          >
            {comentario.usuario_foto ? (
              <Image
                src={comentario.usuario_foto}
                roundedCircle
                style={{ width: 32, height: 32, objectFit: "cover" }}
              />
            ) : (
              <FaUser size={16} />
            )}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="fw-semibold" style={{ fontSize: "14px" }}>
                {comentario.usuario_nome || "Usuário"}
              </span>
              <span style={{ fontSize: "14px" }}>{comentario.comentario}</span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <small className="text-muted" style={{ fontSize: "12px" }}>
                {formatDate(comentario.created_at)}
              </small>
              {user && !isEditando && nivel < 2 && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-decoration-none text-muted"
                  onClick={() => {
                    setRespostaPara(comentario);
                    setRespostaTexto("");
                  }}
                  style={{ fontSize: "12px", padding: 0 }}
                >
                  Responder
                </Button>
              )}
            </div>
          </div>
          {isOwner && !isEditando && (
            <div className="d-flex gap-2">
              <Button
                variant="link"
                size="sm"
                className="p-0 text-decoration-none"
                onClick={() => {
                  setEditandoId(comentario.id);
                  setEditandoTexto(comentario.comentario);
                }}
                style={{ fontSize: "12px" }}
              >
                Editar
              </Button>
              <Button
                variant="link"
                size="sm"
                className="p-0 text-danger text-decoration-none"
                onClick={() => handleDeletar(comentario.id)}
                style={{ fontSize: "12px" }}
              >
                Excluir
              </Button>
            </div>
          )}
        </div>

        {isEditando && (
          <div className="mb-2 mt-2">
            <Form.Control
              as="textarea"
              rows={2}
              value={editandoTexto}
              onChange={(e) => setEditandoTexto(e.target.value)}
              style={{ fontSize: "14px" }}
            />
            <div className="d-flex gap-2 mt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleEditar(comentario.id)}
                disabled={saving}
                style={{ fontSize: "12px" }}
              >
                Salvar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditandoId(null);
                  setEditandoTexto("");
                }}
                style={{ fontSize: "12px" }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Respostas */}
        {comentario.respostas && comentario.respostas.length > 0 && (
          <div className="mt-3">
            {comentario.respostas.map((resposta) =>
              renderComentario(resposta, nivel + 1)
            )}
          </div>
        )}

        {/* Formulário de resposta */}
        {respostaPara && respostaPara.id === comentario.id && (
          <div className="mt-2 ms-5">
            <Form onSubmit={handleResponder} className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                style={{ width: 24, height: 24, flexShrink: 0 }}
              >
                {user?.foto_url ? (
                  <Image
                    src={user.foto_url}
                    roundedCircle
                    style={{ width: 24, height: 24, objectFit: "cover" }}
                  />
                ) : (
                  <FaUser size={12} />
                )}
              </div>
              <Form.Control
                type="text"
                value={respostaTexto}
                onChange={(e) => setRespostaTexto(e.target.value)}
                placeholder="Adicione uma resposta..."
                className="border-0"
                style={{ fontSize: "14px" }}
              />
              <Button
                type="submit"
                variant="link"
                className="text-primary text-decoration-none p-0"
                disabled={saving || !respostaTexto.trim()}
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                {saving ? "..." : "Publicar"}
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-muted text-decoration-none p-0"
                onClick={() => {
                  setRespostaPara(null);
                  setRespostaTexto("");
                }}
                style={{ fontSize: "14px" }}
              >
                Cancelar
              </Button>
            </Form>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      centered
      dialogClassName="modal-comentarios"
    >
      <Modal.Body className="p-0" style={{ display: "flex", maxHeight: "90vh", width: "100%" }}>
        {/* Lado Esquerdo - Foto/Vídeo */}
        <div 
          style={{ 
            width: "50%", 
            backgroundColor: "#000", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          {post?.tipo === "video" && post?.video ? (
            <video
              controls
              style={{ width: "100%", maxHeight: "90vh", objectFit: "contain" }}
              src={post.video}
            >
              Seu navegador não suporta vídeos.
            </video>
          ) : post?.imagem ? (
            <Image
              src={post.imagem}
              style={{ width: "100%", maxHeight: "90vh", objectFit: "contain" }}
            />
          ) : (
            <div className="text-white text-center p-4">
              <FaUser size={48} />
              <p className="mt-3">Sem mídia</p>
            </div>
          )}
        </div>

        {/* Lado Direito - Comentários e Descrição */}
        <div 
          style={{ 
            width: "50%", 
            display: "flex", 
            flexDirection: "column",
            maxHeight: "90vh"
          }}
        >
          {/* Header com informações do post */}
          <div className="border-bottom p-3 d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
              style={{ width: 32, height: 32, flexShrink: 0, cursor: "pointer" }}
              onClick={handlePerfilClick}
            >
              {post?.veterinario_foto ? (
                <Image
                  src={post.veterinario_foto}
                  roundedCircle
                  style={{ width: 32, height: 32, objectFit: "cover" }}
                />
              ) : (
                <FaUser size={16} />
              )}
            </div>
            <div className="flex-grow-1">
              <button
                className="fw-semibold border-0 bg-transparent p-0 text-start"
                style={{ fontSize: "14px", cursor: "pointer", color: "inherit" }}
                onClick={handlePerfilClick}
                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                onMouseLeave={(e) => e.target.style.textDecoration = "none"}
              >
                {post?.veterinario_nome || post?.nome_clinica || "Veterinário"}
              </button>
            </div>
            <Button
              variant="link"
              className="text-decoration-none p-0 border-0"
              onClick={onHide}
              style={{ padding: "4px" }}
            >
              <FaTimes size={20} />
            </Button>
          </div>

          {/* Área de comentários scrollável */}
          <div 
            style={{ 
              flex: 1, 
              overflowY: "auto", 
              padding: "16px",
              backgroundColor: "#fff"
            }}
          >
            {/* Descrição do post */}
            {post && (
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                    style={{ width: 32, height: 32, flexShrink: 0, cursor: "pointer" }}
                    onClick={handlePerfilClick}
                  >
                    {post.veterinario_foto ? (
                      <Image
                        src={post.veterinario_foto}
                        roundedCircle
                        style={{ width: 32, height: 32, objectFit: "cover" }}
                      />
                    ) : (
                      <FaUser size={16} />
                    )}
                  </div>
                  <div>
                    <button
                      className="fw-semibold border-0 bg-transparent p-0 text-start"
                      style={{ fontSize: "14px", marginRight: "8px", cursor: "pointer", color: "inherit" }}
                      onClick={handlePerfilClick}
                      onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                      onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                    >
                      {post.veterinario_nome || post.nome_clinica || "Veterinário"}
                    </button>
                    {post.titulo && (
                      <span style={{ fontSize: "14px" }}> {post.titulo}</span>
                    )}
                  </div>
                </div>
                {post.conteudo && (
                  <div style={{ fontSize: "14px", marginLeft: "40px" }}>
                    {post.conteudo}
                  </div>
                )}
              </div>
            )}

            {/* Lista de comentários */}
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            ) : comentarios.length > 0 ? (
              <div>
                {comentarios.map((comentario) => renderComentario(comentario))}
              </div>
            ) : (
              <div className="text-center p-4 text-muted">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </div>
            )}
          </div>

          {/* Footer com ações e input de comentário */}
          <div className="border-top p-3" style={{ backgroundColor: "#fff" }}>
            {/* Ações (Curtir, etc) - se necessário */}
            
            {/* Input de comentário */}
            {user ? (
              <Form onSubmit={handleCriarComentario} className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                  style={{ width: 32, height: 32, flexShrink: 0 }}
                >
                  {user.foto_url ? (
                    <Image
                      src={user.foto_url}
                      roundedCircle
                      style={{ width: 32, height: 32, objectFit: "cover" }}
                    />
                  ) : (
                    <FaUser size={16} />
                  )}
                </div>
                <Form.Control
                  type="text"
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="border-0"
                  style={{ fontSize: "14px" }}
                />
                <Button
                  type="submit"
                  variant="link"
                  className="text-primary text-decoration-none p-0"
                  disabled={saving || !novoComentario.trim()}
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  {saving ? "..." : "Publicar"}
                </Button>
              </Form>
            ) : (
              <Alert variant="info" className="mb-0" style={{ fontSize: "14px" }}>
                Você precisa estar logado para comentar.
              </Alert>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ComentariosModal;

