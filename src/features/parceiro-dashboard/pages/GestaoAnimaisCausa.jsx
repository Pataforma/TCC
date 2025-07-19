import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaPaw,
  FaHeart,
  FaCheckCircle,
  FaClock,
  FaImage,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import AnimalAdocaoCard from "../../../components/parceiro/AnimalAdocaoCard";
import AnimalModal from "../../../components/parceiro/AnimalModal";

const GestaoAnimaisCausa = () => {
  const navigate = useNavigate();
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [especieFilter, setEspecieFilter] = useState("todos");

  // Dados mockados dos animais
  const [animais, setAnimais] = useState([
    {
      id: 1,
      nome: "Luna",
      especie: "Cão",
      raca: "Golden Retriever",
      idade: "2 anos",
      porte: "Médio",
      sexo: "Fêmea",
      status: "disponivel",
      foto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300",
      candidaturas: 3,
      descricao:
        "Luna é uma cachorrinha muito carinhosa e brincalhona. Adora crianças e passeios no parque.",
      historia:
        "Luna foi resgatada das ruas quando tinha apenas 6 meses. Hoje está saudável e pronta para uma família amorosa.",
      saude: {
        vacinado: true,
        castrado: true,
        vermifugado: true,
        observacoes: "Todas as vacinas em dia",
      },
      galeria: [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300",
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300",
      ],
    },
    {
      id: 2,
      nome: "Thor",
      especie: "Gato",
      raca: "Siamês",
      idade: "1 ano",
      porte: "Pequeno",
      sexo: "Macho",
      status: "disponivel",
      foto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300",
      candidaturas: 2,
      descricao:
        "Thor é um gato muito inteligente e curioso. Gosta de carinho e brincadeiras com bolinhas.",
      historia:
        "Thor foi encontrado abandonado em um parque. É muito dócil e se adapta bem a novos ambientes.",
      saude: {
        vacinado: true,
        castrado: true,
        vermifugado: true,
        observacoes: "Gato saudável, sem problemas",
      },
      galeria: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300",
      ],
    },
    {
      id: 3,
      nome: "Max",
      especie: "Cão",
      raca: "Labrador",
      idade: "3 anos",
      porte: "Grande",
      sexo: "Macho",
      status: "adotado",
      foto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300",
      candidaturas: 5,
      descricao:
        "Max é um cão muito leal e protetor. Perfeito para famílias que buscam um companheiro fiel.",
      historia:
        "Max foi entregue à ONG por uma família que não podia mais cuidar dele. É muito obediente e carinhoso.",
      saude: {
        vacinado: true,
        castrado: true,
        vermifugado: true,
        observacoes: "Cão saudável, todas as vacinas em dia",
      },
      galeria: [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300",
      ],
    },
    {
      id: 4,
      nome: "Nina",
      especie: "Gato",
      raca: "Persa",
      idade: "6 meses",
      porte: "Pequeno",
      sexo: "Fêmea",
      status: "disponivel",
      foto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300",
      candidaturas: 1,
      descricao:
        "Nina é uma gatinha muito tranquila e elegante. Perfeita para apartamentos.",
      historia:
        "Nina foi resgatada de um abandono. É muito calma e gosta de ambientes tranquilos.",
      saude: {
        vacinado: true,
        castrado: false,
        vermifugado: true,
        observacoes: "Precisa ser castrada",
      },
      galeria: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300",
      ],
    },
  ]);

  const handleAdicionarAnimal = () => {
    setEditingAnimal(null);
    setShowAnimalModal(true);
  };

  const handleEditarAnimal = (animal) => {
    setEditingAnimal(animal);
    setShowAnimalModal(true);
  };

  const handleExcluirAnimal = (animalId) => {
    if (window.confirm("Tem certeza que deseja excluir este animal?")) {
      // TODO: Excluir animal no backend
      setAnimais((prev) => prev.filter((animal) => animal.id !== animalId));
    }
  };

  const handleAnimalSalvo = (animalData) => {
    if (editingAnimal) {
      // Editar animal existente
      setAnimais((prev) =>
        prev.map((animal) =>
          animal.id === editingAnimal.id
            ? { ...animalData, id: animal.id }
            : animal
        )
      );
    } else {
      // Adicionar novo animal
      const novoAnimal = {
        ...animalData,
        id: Date.now(),
        candidaturas: 0,
      };
      setAnimais((prev) => [novoAnimal, ...prev]);
    }
    setShowAnimalModal(false);
    setEditingAnimal(null);
  };

  const handleVerDetalhes = (animalId) => {
    navigate(`/parceiro/animais/${animalId}`);
  };

  // Filtros
  const filteredAnimais = animais.filter((animal) => {
    const matchesSearch =
      animal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.raca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || animal.status === statusFilter;
    const matchesEspecie =
      especieFilter === "todos" || animal.especie === especieFilter;
    return matchesSearch && matchesStatus && matchesEspecie;
  });

  const especies = [...new Set(animais.map((animal) => animal.especie))];

  return (
    <DashboardLayout tipoUsuario="parceiro" nomeUsuario="ONG Parceira">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Gestão de Animais</h1>
                <p className="text-muted mb-0">
                  Gerencie todos os animais da sua ONG
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleAdicionarAnimal}
              >
                <FaPlus className="me-2" />
                Adicionar Animal
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nome ou raça..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="disponivel">Disponível</option>
              <option value="adotado">Adotado</option>
              <option value="reservado">Reservado</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={especieFilter}
              onChange={(e) => setEspecieFilter(e.target.value)}
            >
              <option value="todos">Todas as espécies</option>
              {especies.map((especie) => (
                <option key={especie} value={especie}>
                  {especie}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary">
                <FaFilter className="me-1" />
                Mais filtros
              </button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <FaPaw className="text-primary mb-2" size={24} />
                <h5 className="text-primary">{animais.length}</h5>
                <small className="text-muted">Total de Animais</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <FaHeart className="text-success mb-2" size={24} />
                <h5 className="text-success">
                  {animais.filter((a) => a.status === "disponivel").length}
                </h5>
                <small className="text-muted">Disponíveis</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <FaCheckCircle className="text-secondary mb-2" size={24} />
                <h5 className="text-secondary">
                  {animais.filter((a) => a.status === "adotado").length}
                </h5>
                <small className="text-muted">Adotados</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <FaClock className="text-warning mb-2" size={24} />
                <h5 className="text-warning">
                  {animais.filter((a) => a.status === "reservado").length}
                </h5>
                <small className="text-muted">Reservados</small>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Animais */}
        <div className="card">
          <div className="card-body">
            {filteredAnimais.length === 0 ? (
              <div className="text-center py-5">
                <FaPaw className="text-muted mb-3" size={48} />
                <h5>Nenhum animal encontrado</h5>
                <p className="text-muted">
                  {searchTerm ||
                  statusFilter !== "todos" ||
                  especieFilter !== "todos"
                    ? "Tente ajustar os filtros de busca"
                    : "Comece adicionando seu primeiro animal"}
                </p>
                {!searchTerm &&
                  statusFilter === "todos" &&
                  especieFilter === "todos" && (
                    <button
                      className="btn btn-primary"
                      onClick={handleAdicionarAnimal}
                    >
                      <FaPlus className="me-2" />
                      Adicionar Primeiro Animal
                    </button>
                  )}
              </div>
            ) : (
              <div className="row">
                {filteredAnimais.map((animal) => (
                  <div key={animal.id} className="col-md-3 mb-4">
                    <AnimalAdocaoCard
                      animal={animal}
                      onEdit={() => handleEditarAnimal(animal)}
                      onView={() => handleVerDetalhes(animal.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Animal */}
        <AnimalModal
          show={showAnimalModal}
          onHide={() => {
            setShowAnimalModal(false);
            setEditingAnimal(null);
          }}
          animal={editingAnimal}
          onSave={handleAnimalSalvo}
        />
      </div>
    </DashboardLayout>
  );
};

export default GestaoAnimaisCausa;
