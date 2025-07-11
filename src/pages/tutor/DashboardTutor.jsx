import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
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

const DashboardTutor = () => {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [loading, setLoading] = useState(true);
  const [petCount, setPetCount] = useState(0);
  const [perfilCompleto, setPerfilCompleto] = useState(false);

  // Dados mockados para os widgets
  const [meusPets] = useState([
    {
      id: 1,
      nome: "Thor",
      especie: "Cão",
      raca: "Golden Retriever",
      foto: "https://via.placeholder.com/80x80/ff6b6b/ffffff?text=T",
      status: "Saudável",
      idade: "3 anos",
      proximaVacina: "2024-02-15",
    },
    {
      id: 2,
      nome: "Luna",
      especie: "Gato",
      raca: "Siamês",
      foto: "https://via.placeholder.com/80x80/4ecdc4/ffffff?text=L",
      status: "Vacina Pendente",
      idade: "1 ano",
      proximaVacina: "2024-01-20",
    },
    {
      id: 3,
      nome: "Max",
      especie: "Cão",
      raca: "Labrador",
      foto: "https://via.placeholder.com/80x80/45b7d1/ffffff?text=M",
      status: "Recuperação",
      idade: "5 anos",
      proximaVacina: "2024-03-10",
    },
  ]);

  const [proximaConsulta] = useState({
    id: 1,
    data: "2024-01-20",
    horario: "14:30",
    pet: "Thor",
    veterinario: "Dr. André Silva",
    clinica: "Clínica Veterinária Pataforma",
    tipo: "Consulta de Rotina",
    valor: "R$ 120,00",
    isTelemedicina: true,
    endereco: "Rua das Flores, 123 - Centro",
    telefone: "(11) 99999-9999",
  });

  const [lembretes] = useState([
    {
      id: 1,
      tipo: "vacina",
      titulo: "Vacina Antirrábica",
      pet: "Luna",
      data: "2024-01-20",
      urgente: true,
      descricao: "Vacina antirrábica está pendente há 5 dias",
    },
    {
      id: 2,
      tipo: "consulta",
      titulo: "Retorno Pós-Cirurgia",
      pet: "Max",
      data: "2024-01-25",
      urgente: false,
      descricao: "Retorno para retirar pontos da cirurgia",
    },
    {
      id: 3,
      tipo: "medicamento",
      titulo: "Antibiótico",
      pet: "Thor",
      data: "2024-01-18",
      urgente: false,
      descricao: "Último dia do tratamento com antibiótico",
    },
  ]);

  const [adocoesData] = useState([
    { label: "Jan", value: 1 },
    { label: "Fev", value: 0 },
    { label: "Mar", value: 2 },
    { label: "Abr", value: 1 },
    { label: "Mai", value: 3 },
    { label: "Jun", value: 0 },
  ]);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          navigate("/telalogin");
          return;
        }

        // Busca dados do usuário
        const { data: userData, error: userError } = await supabase
          .from("usuario")
          .select("*")
          .eq("email", session.user.email)
          .eq("status", "ativo")
          .single();

        if (userError && userError.code !== "PGRST116") {
          throw userError;
        }

        // Define nome do usuário
        if (userData) {
          setNomeUsuario(userData.nome || session.user.email);
          setPerfilCompleto(!!userData.nome && !!userData.telefone);

          // Busca contagem de pets
          const { data: userData2 } = await supabase
            .from("usuario")
            .select("id_usuario")
            .eq("email", session.user.email)
            .eq("status", "ativo")
            .single();

          if (userData2) {
            const { count, error: petsError } = await supabase
              .from("pets")
              .select("id", { count: "exact" })
              .eq("usuario_id", userData2.id_usuario);

            if (petsError) throw petsError;
            setPetCount(count || 0);
          }
        } else {
          setNomeUsuario(session.user.email);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status) => {
    const variants = {
      Saudável: "success",
      "Vacina Pendente": "warning",
      Recuperação: "info",
    };
    return variants[status] || "secondary";
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
    // TODO: Implementar agendamento de vacina
    alert(`Agendando vacina para ${pet}...`);
  };

  return (
    <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
      <div className="container-fluid">
        {/* Header da Página */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <FaUser size={28} color="var(--main-color)" />
            <h2
              className="fw-bold mb-0"
              style={{
                color: "var(--main-color)",
                fontSize: 28,
                letterSpacing: 1,
              }}
            >
              Dashboard Tutor
            </h2>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Pets Cadastrados"
              value={petCount}
              icon={FaPaw}
              color="primary"
              onClick={() => navigate("/tutor/pet")}
              style={{
                borderTop: "4px solid var(--main-color)",
                borderRadius: 18,
                boxShadow: "0 6px 24px 0 #0db2ac22",
              }}
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Perfil"
              value={perfilCompleto ? "Completo" : "Incompleto"}
              icon={perfilCompleto ? FaUserCheck : FaUserTimes}
              color={perfilCompleto ? "success" : "warning"}
              onClick={() => navigate("/tutor/perfil")}
              style={{
                borderTop: perfilCompleto
                  ? "4px solid var(--main-color)"
                  : "4px solid var(--secondary-color)",
                borderRadius: 18,
                boxShadow: "0 6px 24px 0 #0db2ac22",
              }}
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Consultas Pendentes"
              value={1}
              icon={FaCalendarAlt}
              color="info"
              onClick={() => navigate("/tutor/agendamentos")}
              style={{
                borderTop: "4px solid var(--elements-color)",
                borderRadius: 18,
                boxShadow: "0 6px 24px 0 #fa745a22",
              }}
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Lembretes Urgentes"
              value={lembretes.filter((l) => l.urgente).length}
              icon={FaBell}
              color="warning"
              onClick={() => navigate("/tutor/lembretes")}
              style={{
                borderTop: "4px solid var(--secondary-color)",
                borderRadius: 18,
                boxShadow: "0 6px 24px 0 #faba3222",
              }}
            />
          </div>
        </div>

        {/* Widgets Principais */}
        <div className="row g-4 mb-4">
          {/* Widget: Meus Pets */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <FaPaw className="me-2 text-primary" />
                    Meus Pets
                  </h5>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate("/tutor/pet")}
                  >
                    Ver Todos
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {meusPets.map((pet) => (
                    <div key={pet.id} className="col-md-4">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center p-3">
                          <img
                            src={pet.foto}
                            alt={pet.nome}
                            className="rounded-circle mb-3"
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                            }}
                          />
                          <h6 className="fw-bold mb-1">{pet.nome}</h6>
                          <p className="text-muted small mb-2">
                            {pet.especie} • {pet.raca}
                          </p>
                          <span
                            className={`badge bg-${getStatusBadge(
                              pet.status
                            )} mb-2`}
                          >
                            {pet.status}
                          </span>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{pet.idade}</small>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => navigate(`/tutor/pet/${pet.id}`)}
                            >
                              Ver Detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Widget: Próxima Consulta */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0 fw-bold">
                  <FaCalendarAlt className="me-2 text-primary" />
                  Próxima Consulta
                </h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-3">
                  <div
                    className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 60, height: 60 }}
                  >
                    <FaCalendarAlt size={24} />
                  </div>
                  <h6 className="fw-bold mb-1">{proximaConsulta.pet}</h6>
                  <p className="text-muted mb-2">{proximaConsulta.tipo}</p>
                  <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                    <FaClock className="text-muted" />
                    <span className="fw-semibold">
                      {formatDate(proximaConsulta.data)} às{" "}
                      {proximaConsulta.horario}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaUser className="text-muted" />
                    <small className="text-muted">Veterinário:</small>
                  </div>
                  <p className="fw-semibold mb-2">
                    {proximaConsulta.veterinario}
                  </p>

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-muted" />
                    <small className="text-muted">Clínica:</small>
                  </div>
                  <p className="fw-semibold mb-2">{proximaConsulta.clinica}</p>

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaMoneyBill className="text-muted" />
                    <small className="text-muted">Valor:</small>
                  </div>
                  <p className="fw-semibold text-success mb-3">
                    {proximaConsulta.valor}
                  </p>
                </div>

                {proximaConsulta.isTelemedicina ? (
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={handleJoinTelemedicina}
                  >
                    <FaVideo className="me-2" />
                    Entrar na Telemedicina
                  </button>
                ) : (
                  <button className="btn btn-outline-primary w-100 mb-2">
                    <FaMapMarkerAlt className="me-2" />
                    Ver Localização
                  </button>
                )}

                <div className="d-flex gap-2">
                  <button className="btn btn-outline-success flex-fill">
                    <FaPhone className="me-1" />
                    Ligar
                  </button>
                  <button className="btn btn-outline-success flex-fill">
                    <FaWhatsapp className="me-1" />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget: Lembretes e Vacinas Pendentes */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0 fw-bold">
                  <FaBell className="me-2 text-warning" />
                  Lembretes e Vacinas Pendentes
                </h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {lembretes.map((lembrete) => (
                    <div
                      key={lembrete.id}
                      className="list-group-item border-0 px-0"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="flex-shrink-0">
                          {getLembreteIcon(lembrete.tipo)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="fw-semibold mb-1">
                                {lembrete.titulo}
                              </h6>
                              <p className="text-muted mb-1">
                                {lembrete.descricao}
                              </p>
                              <div className="d-flex align-items-center gap-3">
                                <small className="text-muted">
                                  <FaPaw className="me-1" />
                                  {lembrete.pet}
                                </small>
                                <small className="text-muted">
                                  <FaCalendarAlt className="me-1" />
                                  {formatDate(lembrete.data)}
                                </small>
                              </div>
                            </div>
                            <div className="text-end">
                              {lembrete.urgente && (
                                <span className="badge bg-danger mb-2">
                                  Urgente
                                </span>
                              )}
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  handleAgendarVacina(lembrete.pet)
                                }
                              >
                                Agendar Agora
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Widget: Ações Rápidas */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0 fw-bold">
                  <FaPlus className="me-2 text-primary" />
                  Ações Rápidas
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-3">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/tutor/pet")}
                  >
                    <FaPaw className="me-2" />
                    Cadastrar Novo Pet
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => navigate("/tutor/agendamentos")}
                  >
                    <FaCalendarAlt className="me-2" />
                    Agendar Consulta
                  </button>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/tutor/vacinas")}
                  >
                    <FaSyringe className="me-2" />
                    Controle de Vacinas
                  </button>
                  <button
                    className="btn btn-outline-info"
                    onClick={() => navigate("/tutor/servicos")}
                  >
                    <FaMapMarkerAlt className="me-2" />
                    Serviços Locais
                  </button>
                  <button
                    className="btn btn-outline-secondary"
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
