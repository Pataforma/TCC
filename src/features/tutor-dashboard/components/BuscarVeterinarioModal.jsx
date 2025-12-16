import React, { useState, useEffect } from "react";
import { Modal, Form, InputGroup, ListGroup, Button, Badge } from "react-bootstrap";
import { FaSearch, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import { api } from "../../../utils/api";
import { useUser } from "../../../contexts/UserContext";

const BuscarVeterinarioModal = ({ show, onHide, onConversaCriada }) => {
  const { user } = useUser();
  const [termoBusca, setTermoBusca] = useState("");
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      buscarVeterinarios();
    }
  }, [show, termoBusca]);

  const buscarVeterinarios = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (termoBusca.trim()) {
        params.append("termo", termoBusca.trim());
      }
      
      const data = await api.get(`/veterinarios/publicos?${params.toString()}`);
      // Filtrar apenas veterinários que permitem contato e não são o próprio usuário
      const vetsPermitemContato = (data || []).filter(
        (vet) => 
          vet.permitir_contato !== false && 
          vet.permitir_contato !== 0 &&
          vet.id_usuario !== user?.id_usuario // Excluir próprio perfil veterinário
      );
      setVeterinarios(vetsPermitemContato);
    } catch (error) {
      console.error("Erro ao buscar veterinários:", error);
      setVeterinarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarConversa = async (veterinario) => {
    try {
      const conversa = await api.post("/conversas", {
        veterinario_id: veterinario.id_veterinarios,
      });
      onConversaCriada(conversa);
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
      alert(
        error.message || "Erro ao iniciar conversa. Tente novamente."
      );
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nova Conversa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Buscar veterinários..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </InputGroup>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : veterinarios.length === 0 ? (
          <div className="text-center py-4 text-muted">
            Nenhum veterinário encontrado
          </div>
        ) : (
          <ListGroup>
            {veterinarios.map((vet) => (
              <ListGroup.Item
                key={vet.id_veterinarios}
                className="d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-3">
                  {vet.foto_url ? (
                    <img
                      src={vet.foto_url}
                      alt={vet.nome_clinica || vet.nome_usuario}
                      className="rounded-circle"
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: 50, height: 50 }}
                    >
                      <FaUser />
                    </div>
                  )}
                  <div>
                    <h6 className="mb-1">
                      {vet.nome_clinica || vet.nome_usuario || "Veterinário"}
                    </h6>
                    {vet.cidade_clinica && (
                      <small className="text-muted">
                        <FaMapMarkerAlt className="me-1" />
                        {vet.cidade_clinica}
                        {vet.estado_clinica && `, ${vet.estado_clinica}`}
                      </small>
                    )}
                    {vet.especialidades && (
                      <div className="mt-1">
                        {vet.especialidades.split(",").slice(0, 2).map((esp, idx) => (
                          <Badge key={idx} bg="primary" className="me-1">
                            {esp.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleIniciarConversa(vet)}
                >
                  Iniciar Conversa
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BuscarVeterinarioModal;

