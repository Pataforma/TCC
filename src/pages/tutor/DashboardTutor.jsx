import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCheck,
  FaUserTimes,
  FaPaw,
  FaUser,
  FaHeart,
  FaPlus,
  FaCalendarAlt,
  FaVideo,
  FaExclamationTriangle,
  FaSyringe,
  FaBell,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaMoneyBill,
} from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/Dashboard/StatCard";
import SimpleChart from "../../components/Dashboard/SimpleChart";
import PetCard from "../../components/PetCard";
import { useUser } from "../../contexts/UserContext";
import {
  useErrorHandler,
  showSuccessNotification,
  showErrorNotification,
} from "../../utils/errorHandler.jsx";

const DashboardTutor = () => {
  const navigate = useNavigate();
  const { user, pets, consultas, lembretes, loading, error, deletePet } =
    useUser();
  const handleError = useErrorHandler();

  // Dados mockados para gráficos (substituir por dados reais)
  const adocoesData = [
    { label: "Jan", value: 1 },
    { label: "Fev", value: 0 },
    { label: "Mar", value: 2 },
    { label: "Abr", value: 1 },
    { label: "Mai", value: 3 },
    { label: "Jun", value: 0 },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getLembreteIcon = (tipo) => {
    switch (tipo) {
      case "vacina":
        return <FaSyringe className="text-warning" />;
      case "consulta":
        return <FaCalendarAlt className="text-primary" />;
      case "medicamento":
        return <FaExclamationTriangle className="text-info" />;
      default:
        return <FaBell className="text-muted" />;
    }
  };

  const handleJoinTelemedicina = () => {
    // TODO: Implementar integração com sistema de telemedicina
    alert("Iniciando chamada de telemedicina...");
  };

  const handleAgendarVacina = (pet) => {
    navigate("/tutor/vacinas", { state: { pet } });
  };

  const handleViewPetDetails = (pet) => {
    navigate("/tutor/pet", { state: { pet } });
  };

  const handleEditPet = (pet) => {
    navigate("/tutor/pet", { state: { pet, editMode: true } });
  };

  const handleDeletePet = async (petId) => {
    if (!confirm("Tem certeza que deseja excluir este pet?")) {
      return;
    }

    try {
      await deletePet(petId);
      showSuccessNotification("Pet excluído com sucesso!");
    } catch (error) {
      const { userMessage } = handleError(error, "excluir pet");
      showErrorNotification(userMessage);
    }
  };

  // Se está carregando, mostrar loading
  if (loading) {
    return (
      <DashboardLayout tipoUsuario="tutor" nomeUsuario="Carregando...">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Se há erro, mostrar mensagem
  if (error) {
    return (
      <DashboardLayout
        tipoUsuario="tutor"
        nomeUsuario={user?.nome || "Usuário"}
      >
        <div className="alert alert-danger">
          <h5>Erro ao carregar dados</h5>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const nomeUsuario = user?.nome || user?.email || "Usuário";
  const perfilCompleto = !!(user?.nome && user?.telefone);

  return (
    <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
      <div className="container-fluid">
        {/* Alert de perfil incompleto */}
        {!perfilCompleto && (
          <div
            className="alert alert-warning alert-dismissible fade show"
            role="alert"
          >
            <FaUserTimes className="me-2" />
            <strong>Perfil Incompleto!</strong> Complete seu perfil para
            aproveitar todas as funcionalidades.
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Meus Pets"
              value={pets.length}
              icon={FaPaw}
              color="primary"
              trend={pets.length > 0 ? "up" : "neutral"}
              trendValue={pets.length > 0 ? "+1" : "0"}
              onClick={() => navigate("/tutor/pet")}
            />
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Consultas Agendadas"
              value={consultas.length}
              icon={FaCalendarAlt}
              color="success"
              trend="up"
              trendValue="+2"
              onClick={() => navigate("/tutor/agendamentos")}
            />
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Lembretes Pendentes"
              value={lembretes.filter((l) => l.urgente).length}
              icon={FaBell}
              color="warning"
              trend="down"
              trendValue="-1"
              onClick={() => navigate("/tutor/vacinas")}
            />
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Gastos do Mês"
              value={`R$ ${(pets.length * 150).toFixed(2)}`}
              icon={FaMoneyBill}
              color="info"
              trend="up"
              trendValue="+15%"
              onClick={() => navigate("/dashboard/tutor/financeiro")}
            />
          </div>
        </div>

        <div className="row">
          {/* Coluna Esquerda */}
          <div className="col-lg-8">
            {/* Meus Pets */}
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">
                  <FaPaw className="me-2" />
                  Meus Pets
                </h6>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate("/tutor/pet")}
                >
                  <FaPlus className="me-1" />
                  Adicionar Pet
                </button>
              </div>
              <div className="card-body">
                {pets.length === 0 ? (
                  <div className="text-center py-4">
                    <FaPaw size={48} className="text-muted mb-3" />
                    <h5>Nenhum pet cadastrado</h5>
                    <p className="text-muted">
                      Cadastre seu primeiro pet para começar a usar a
                      plataforma.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/tutor/pet")}
                    >
                      <FaPlus className="me-1" />
                      Cadastrar Pet
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="row row-cols-1 row-cols-md-2 g-4">
                      {pets.slice(0, 4).map((pet) => (
                        <div className="col" key={pet.id}>
                          <PetCard
                            pet={pet}
                            onViewDetails={handleViewPetDetails}
                            onEdit={handleEditPet}
                            onDelete={handleDeletePet}
                            variant="default"
                          />
                        </div>
                      ))}
                    </div>
                    {pets.length > 4 && (
                      <div className="text-center mt-3">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => navigate("/tutor/pet")}
                        >
                          Ver Todos os Pets ({pets.length})
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Próxima Consulta */}
            {consultas.length > 0 && (
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">
                    <FaCalendarAlt className="me-2" />
                    Próxima Consulta
                  </h6>
                </div>
                <div className="card-body">
                  {consultas[0] && (
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="mb-1">
                          {consultas[0].pet} - {consultas[0].tipo}
                        </h6>
                        <p className="mb-1 text-muted">
                          <FaCalendarAlt className="me-1" />
                          {formatDate(consultas[0].data)} às{" "}
                          {consultas[0].horario}
                        </p>
                        <p className="mb-1 text-muted">
                          <FaUser className="me-1" />
                          {consultas[0].veterinario}
                        </p>
                        <p className="mb-0 text-muted">
                          <FaMapMarkerAlt className="me-1" />
                          {consultas[0].clinica}
                        </p>
                      </div>
                      <div className="text-end">
                        <div className="mb-2">
                          <span className="badge bg-primary fs-6">
                            {consultas[0].valor}
                          </span>
                        </div>
                        {consultas[0].isTelemedicina ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={handleJoinTelemedicina}
                          >
                            <FaVideo className="me-1" />
                            Entrar na Consulta
                          </button>
                        ) : (
                          <button className="btn btn-outline-primary btn-sm">
                            <FaMapMarkerAlt className="me-1" />
                            Ver Local
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gráfico de Adoções */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  <FaHeart className="me-2" />
                  Histórico de Adoções
                </h6>
              </div>
              <div className="card-body">
                <SimpleChart
                  data={adocoesData}
                  title="Adoções por Mês"
                  color="var(--elements-color)"
                />
              </div>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="col-lg-4">
            {/* Lembretes */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  <FaBell className="me-2" />
                  Lembretes
                </h6>
              </div>
              <div className="card-body">
                {lembretes.length === 0 ? (
                  <p className="text-muted text-center py-3">
                    Nenhum lembrete pendente
                  </p>
                ) : (
                  <div className="list-group list-group-flush">
                    {lembretes.slice(0, 5).map((lembrete) => (
                      <div
                        key={lembrete.id}
                        className={`list-group-item list-group-item-action ${
                          lembrete.urgente ? "border-warning" : ""
                        }`}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">
                            {getLembreteIcon(lembrete.tipo)} {lembrete.titulo}
                          </h6>
                          {lembrete.urgente && (
                            <small className="text-danger">
                              <FaExclamationTriangle /> Urgente
                            </small>
                          )}
                        </div>
                        <p className="mb-1">{lembrete.descricao}</p>
                        <small className="text-muted">
                          <FaCalendarAlt className="me-1" />
                          {formatDate(lembrete.data)} - {lembrete.pet}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
                {lembretes.length > 5 && (
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate("/tutor/vacinas")}
                    >
                      Ver Todos os Lembretes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  <FaArrowRight className="me-2" />
                  Ações Rápidas
                </h6>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/tutor/agendamentos")}
                  >
                    <FaCalendarAlt className="me-2" />
                    Agendar Consulta
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => navigate("/tutor/vacinas")}
                  >
                    <FaSyringe className="me-2" />
                    Ver Vacinas
                  </button>
                  <button
                    className="btn btn-outline-info"
                    onClick={() => navigate("/tutor/servicos")}
                  >
                    <FaUser className="me-2" />
                    Meus Serviços
                  </button>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/tutor/mensagens")}
                  >
                    <FaBell className="me-2" />
                    Mensagens
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardTutor;
