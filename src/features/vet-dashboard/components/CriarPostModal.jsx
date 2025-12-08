import React, { useState } from "react";
import { Modal, Form, Button, Alert, Image } from "react-bootstrap";
import { FaImage, FaVideo, FaTimes, FaUpload } from "react-icons/fa";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";

const CriarPostModal = ({ show, onHide, onPostCriado }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    tipo: "imagem",
    imagem: null,
    video: null,
    tipo_post: "social", // 'social' ou 'blog'
    categoria: "", // Opcional, apenas para posts de blog
  });
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    // Validar tamanho
    const maxSize = tipo === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB para vídeo, 10MB para imagem
    if (file.size > maxSize) {
      setError(
        `Arquivo muito grande. Máximo: ${tipo === "video" ? "100MB" : "10MB"}`
      );
      return;
    }

    // Validar tipo
    if (tipo === "video") {
      const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
      if (!allowedTypes.includes(file.type)) {
        setError("Formato de vídeo não suportado. Use MP4, WebM ou MOV.");
        return;
      }
    } else {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Formato de imagem não suportado. Use JPEG, PNG, GIF ou WebP.");
        return;
      }
    }

    try {
      setUploading(true);

      // Upload do arquivo
      const formDataUpload = new FormData();
      formDataUpload.append(tipo === "video" ? "video" : "image", file);

      // Não definir Content-Type manualmente - o api.js já cuida disso para FormData
      const uploadResponse = await api.post(
        `/upload/${tipo === "video" ? "video" : "image"}`,
        formDataUpload
      );

      if (tipo === "video") {
        setFormData({ ...formData, video: uploadResponse.url, tipo: "video" });
        setPreview(uploadResponse.url);
      } else {
        setFormData({ ...formData, imagem: uploadResponse.url, tipo: "imagem" });
        // Criar preview para imagem
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      setError("Erro ao fazer upload do arquivo: " + (error.message || "Erro desconhecido"));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.titulo.trim()) {
      setError("Título é obrigatório");
      return;
    }

    if (formData.tipo === "imagem" && !formData.imagem) {
      setError("Selecione uma imagem");
      return;
    }

    if (formData.tipo === "video" && !formData.video) {
      setError("Selecione um vídeo");
      return;
    }

    try {
      setSaving(true);
      const postData = {
        titulo: formData.titulo,
        conteudo: formData.conteudo || null,
        tipo: formData.tipo,
        imagem: formData.imagem || null,
        video: formData.video || null,
        tipo_post: formData.tipo_post,
        categoria: formData.tipo_post === "blog" && formData.categoria ? formData.categoria : null,
        status: "ativo",
      };

      await api.post("/marketing/posts", postData);

      // Limpar formulário
      setFormData({
        titulo: "",
        conteudo: "",
        tipo: "imagem",
        imagem: null,
        video: null,
        tipo_post: "social",
        categoria: "",
      });
      setPreview(null);
      setError("");

      if (onPostCriado) {
        onPostCriado();
      }

      onHide();
    } catch (error) {
      console.error("Erro ao criar post:", error);
      setError("Erro ao criar post: " + (error.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      titulo: "",
      conteudo: "",
      tipo: "imagem",
      imagem: null,
      video: null,
      tipo_post: "social",
      categoria: "",
    });
    setPreview(null);
    setError("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Criar Novo Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Título *</Form.Label>
            <Form.Control
              type="text"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              placeholder="Digite o título do post..."
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.conteudo}
              onChange={(e) =>
                setFormData({ ...formData, conteudo: e.target.value })
              }
              placeholder="Descreva seu post..."
            />
          </Form.Group>

          {user?.tipo_usuario === "veterinario" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Post *</Form.Label>
                <Form.Select
                  value={formData.tipo_post}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_post: e.target.value,
                      categoria: e.target.value === "social" ? "" : formData.categoria,
                    })
                  }
                >
                  <option value="social">Social</option>
                  <option value="blog">Dicas e Cuidados (Blog)</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Posts de blog aparecem na seção "Dicas e Cuidados"
                </Form.Text>
              </Form.Group>

              {formData.tipo_post === "blog" && (
                <Form.Group className="mb-3">
                  <Form.Label>Categoria (Opcional)</Form.Label>
                  <Form.Select
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Comportamento">Comportamento</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Treinamento">Treinamento</option>
                  </Form.Select>
                </Form.Group>
              )}
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Conteúdo</Form.Label>
            <div className="d-flex gap-3">
              <Button
                variant={formData.tipo === "imagem" ? "primary" : "outline-primary"}
                onClick={() => {
                  setFormData({ ...formData, tipo: "imagem", video: null });
                  setPreview(null);
                }}
              >
                <FaImage className="me-2" />
                Imagem
              </Button>
              <Button
                variant={formData.tipo === "video" ? "primary" : "outline-primary"}
                onClick={() => {
                  setFormData({ ...formData, tipo: "video", imagem: null });
                  setPreview(null);
                }}
              >
                <FaVideo className="me-2" />
                Vídeo
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              {formData.tipo === "video" ? "Vídeo" : "Imagem"} *
            </Form.Label>
            <Form.Control
              type="file"
              accept={
                formData.tipo === "video"
                  ? "video/mp4,video/webm,video/quicktime"
                  : "image/jpeg,image/jpg,image/png,image/gif,image/webp"
              }
              onChange={(e) => handleFileChange(e, formData.tipo)}
              disabled={uploading}
            />
            <Form.Text className="text-muted">
              {formData.tipo === "video"
                ? "Formatos: MP4, WebM, MOV. Máximo: 100MB"
                : "Formatos: JPEG, PNG, GIF, WebP. Máximo: 10MB"}
            </Form.Text>
          </Form.Group>

          {preview && (
            <div className="mb-3">
              {formData.tipo === "video" ? (
                <video
                  controls
                  style={{ width: "100%", maxHeight: "300px", borderRadius: 8 }}
                  src={preview}
                >
                  Seu navegador não suporta vídeos.
                </video>
              ) : (
                <div className="position-relative">
                  <Image
                    src={preview}
                    fluid
                    style={{ borderRadius: 8, maxHeight: "300px" }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-2"
                    onClick={() => {
                      setPreview(null);
                      setFormData({ ...formData, imagem: null });
                    }}
                  >
                    <FaTimes />
                  </Button>
                </div>
              )}
            </div>
          )}

          {uploading && (
            <Alert variant="info">Fazendo upload do arquivo...</Alert>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={saving || uploading || !formData.titulo.trim()}
        >
          {saving ? "Publicando..." : "Publicar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CriarPostModal;

