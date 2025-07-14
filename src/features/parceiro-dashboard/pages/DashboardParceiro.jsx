import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPaw,
  FaUsers,
  FaCalendarAlt,
  FaPlus,
  FaHeart,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartLine,
  FaHandHoldingHeart,
  FaBullhorn,
  FaClipboardList,
} from "react-icons/fa";
import DashboardLayout from "../../../layouts/DashboardLayout";
import StatCard from "../../../components/Dashboard/StatCard";
import AnimalCard from "../../../components/parceiro/AnimalCard";
import EventoCard from "../../../components/parceiro/EventoCard";
import CandidaturaCard from "../../../components/parceiro/CandidaturaCard";

const DashboardParceiro = () => {
  const navigate = useNavigate();

  // Dados mockados para KPIs
  const kpis = {
    animaisAdocao: 12,
    candidaturasPendentes: 8,
    proximoEvento: "Feira de Adoção - Dezembro",
    dataProximoEvento: "2024-12-15",
  };

  // Dados mockados para animais
  const animais = [
    {
      id: 1,
      nome: "Luna",
      especie: "Cão",
      raca: "Golden Retriever",
      idade: "2 anos",
      status: "disponivel",
      foto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300",
      candidaturas: 3,
    },
    {
      id: 2,
      nome: "Thor",
      especie: "Gato",
      raca: "Siamês",
      idade: "1 ano",
      status: "disponivel",
      foto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300",
      candidaturas: 2,
    },
    {
      id: 3,
      nome: "Max",
      especie: "Cão",
      raca: "Labrador",
      idade: "3 anos",
      status: "adotado",
      foto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300",
      candidaturas: 5,
    },
    {
      id: 4,
      nome: "Nina",
      especie: "Gato",
      raca: "Persa",
      idade: "6 meses",
      status: "disponivel",
      foto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300",
      candidaturas: 1,
    },
  ];

  // Dados mockados para eventos
  const eventos = [
    {
      id: 1,
      titulo: "Feira de Adoção - Dezembro",
      data: "2024-12-15",
      horario: "10h às 16h",
      local: "Parque Ibirapuera, São Paulo",
      status: "agendado",
      inscritos: 45,
      vagas: 50,
    },
    {
      id: 2,
      titulo: "Adoção Especial - Gatos",
      data: "2024-12-20",
      horario: "14h às 18h",
      local: "Shopping Center, Rio de Janeiro",
      status: "agendado",
      inscritos: 28,
      vagas: 30,
    },
    {
      id: 3,
      titulo: "Feira de Adoção - Novembro",
      data: "2024-11-30",
      horario: "10h às 16h",
      local: "Parque da Aclimação, São Paulo",
      status: "concluido",
      inscritos: 52,
      vagas: 50,
      adocoes: 8,
    },
  ];

  // Dados mockados para candidaturas
  const candidaturas = [
    {
      id: 1,
      nome: "Maria Silva",
      email: "maria@email.com",
      telefone: "(11) 99999-9999",
      animal: "Luna",
      status: "novo-contato",
      dataCandidatura: "2024-12-10",
    },
    {
      id: 2,
      nome: "João Santos",
      email: "joao@email.com",
      telefone: "(11) 88888-8888",
      animal: "Thor",
      status: "analise-formulario",
      dataCandidatura: "2024-12-09",
    },
    {
      id: 3,
      nome: "Ana Costa",
      email: "ana@email.com",
      telefone: "(11) 77777-7777",
      animal: "Max",
      status: "entrevista-agendada",
      dataCandidatura: "2024-12-08",
    },
    {
      id: 4,
      nome: "Pedro Lima",
      email: "pedro@email.com",
      telefone: "(11) 66666-6666",
      animal: "Nina",
      status: "aprovado",
      dataCandidatura: "2024-12-07",
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleAdicionarAnimal = () => {
    navigate("/parceiro/animais/novo");
  };

  const handleCriarEvento = () => {
    navigate("/parceiro/eventos/novo");
  };

  const handleVerAnimais = () => {
    navigate("/parceiro/animais");
  };

  const handleVerEventos = () => {
    navigate("/parceiro/eventos");
  };

  const handleVerCandidaturas = () => {
    navigate("/parceiro/candidaturas");
  };

  return (
    <DashboardLayout tipoUsuario="parceiro" nomeUsuario="ONG Parceira">
      <div className="container-fluid">
        {/* Header com CTAs Principais */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1">Visão Geral da ONG</h1>
                <p className="text-muted mb-0">
                  Gerencie seus animais, eventos e candidaturas de adoção
                </p>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleAdicionarAnimal}
                >
                  <FaPlus className="me-2" />
                  Adicionar Animal
                </button>
                <button className="btn btn-success" onClick={handleCriarEvento}>
                  <FaPlus className="me-2" />
                  Criar Evento
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs em Destaque */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Animais para Adoção"
              value={kpis.animaisAdocao}
              icon={FaPaw}
              color="primary"
              trend="up"
              trendValue="+2"
              subtitle="disponíveis"
              onClick={handleVerAnimais}
            />
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Candidaturas Pendentes"
              value={kpis.candidaturasPendentes}
              icon={FaUsers}
              color="warning"
              trend="up"
              trendValue="+3"
              subtitle="aguardando análise"
              onClick={handleVerCandidaturas}
            />
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Próximo Evento"
              value={kpis.proximoEvento}
              icon={FaCalendarAlt}
              color="success"
              trend="neutral"
              trendValue=""
              subtitle={formatDate(kpis.dataProximoEvento)}
              onClick={handleVerEventos}
            />
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <StatCard
              title="Adoções Realizadas"
              value={12}
              icon={FaHeart}
              color="info"
              trend="up"
              trendValue="+5"
              subtitle="este mês"
            />
          </div>
        </div>

        {/* Seção de Animais */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaPaw className="me-2 text-primary" />
                  Animais para Adoção
                </h5>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleVerAnimais}
                >
                  Ver todos os animais
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  {animais.slice(0, 4).map((animal) => (
                    <div key={animal.id} className="col-md-3 mb-3">
                      <AnimalCard
                        animal={animal}
                        onEdit={() =>
                          navigate(`/parceiro/animais/${animal.id}/editar`)
                        }
                        onView={() =>
                          navigate(`/parceiro/animais/${animal.id}`)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Eventos */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCalendarAlt className="me-2 text-success" />
                  Próximos Eventos
                </h5>
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={handleVerEventos}
                >
                  Ver todos os eventos
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  {eventos
                    .filter((e) => e.status === "agendado")
                    .slice(0, 2)
                    .map((evento) => (
                      <div key={evento.id} className="col-md-6 mb-3">
                        <EventoCard
                          evento={evento}
                          onEdit={() =>
                            navigate(`/parceiro/eventos/${evento.id}/editar`)
                          }
                          onView={() =>
                            navigate(`/parceiro/eventos/${evento.id}`)
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline de Candidaturas */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaClipboardList className="me-2 text-warning" />
                  Pipeline de Adoção
                </h5>
                <button
                  className="btn btn-outline-warning btn-sm"
                  onClick={handleVerCandidaturas}
                >
                  Ver todas as candidaturas
                </button>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <h6 className="text-primary mb-3">
                      <FaUsers className="me-1" />
                      Novo Contato (
                      {
                        candidaturas.filter((c) => c.status === "novo-contato")
                          .length
                      }
                      )
                    </h6>
                    {candidaturas
                      .filter((c) => c.status === "novo-contato")
                      .map((candidatura) => (
                        <CandidaturaCard
                          key={candidatura.id}
                          candidatura={candidatura}
                          onView={() =>
                            navigate(`/parceiro/candidaturas/${candidatura.id}`)
                          }
                        />
                      ))}
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-warning mb-3">
                      <FaClipboardList className="me-1" />
                      Análise (
                      {
                        candidaturas.filter(
                          (c) => c.status === "analise-formulario"
                        ).length
                      }
                      )
                    </h6>
                    {candidaturas
                      .filter((c) => c.status === "analise-formulario")
                      .map((candidatura) => (
                        <CandidaturaCard
                          key={candidatura.id}
                          candidatura={candidatura}
                          onView={() =>
                            navigate(`/parceiro/candidaturas/${candidatura.id}`)
                          }
                        />
                      ))}
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-info mb-3">
                      <FaCalendarAlt className="me-1" />
                      Entrevista (
                      {
                        candidaturas.filter(
                          (c) => c.status === "entrevista-agendada"
                        ).length
                      }
                      )
                    </h6>
                    {candidaturas
                      .filter((c) => c.status === "entrevista-agendada")
                      .map((candidatura) => (
                        <CandidaturaCard
                          key={candidatura.id}
                          candidatura={candidatura}
                          onView={() =>
                            navigate(`/parceiro/candidaturas/${candidatura.id}`)
                          }
                        />
                      ))}
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-success mb-3">
                      <FaCheckCircle className="me-1" />
                      Aprovado (
                      {
                        candidaturas.filter((c) => c.status === "aprovado")
                          .length
                      }
                      )
                    </h6>
                    {candidaturas
                      .filter((c) => c.status === "aprovado")
                      .map((candidatura) => (
                        <CandidaturaCard
                          key={candidatura.id}
                          candidatura={candidatura}
                          onView={() =>
                            navigate(`/parceiro/candidaturas/${candidatura.id}`)
                          }
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Rápido */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <FaChartLine className="me-2 text-info" />
                  Estatísticas do Mês
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Novos animais cadastrados:</span>
                  <strong>5</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Adoções realizadas:</span>
                  <strong>8</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Eventos realizados:</span>
                  <strong>2</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Novas candidaturas:</span>
                  <strong>15</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <FaHandHoldingHeart className="me-2 text-success" />
                  Próximas Ações
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Entrevistas agendadas:</span>
                  <strong>3</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Formulários para analisar:</span>
                  <strong>5</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Evento em 5 dias:</span>
                  <strong>Feira de Adoção</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Animais precisam de fotos:</span>
                  <strong>2</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardParceiro;
