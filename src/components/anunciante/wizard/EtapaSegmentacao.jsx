import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { FaMapMarkerAlt, FaPaw, FaUsers, FaChartLine } from "react-icons/fa";

const EtapaSegmentacao = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    localizacao: data?.localizacao || {
      estado: "",
      cidade: "",
    },
    segmentacaoPet: data?.segmentacaoPet || {
      especies: [],
      portes: [],
      idadeMin: 0,
      idadeMax: 15,
    },
  });

  const [cidadesDisponiveis, setCidadesDisponiveis] = useState([]);
  const [publicoEstimado, setPublicoEstimado] = useState(0);

  // Dados mockados para estados e cidades
  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  // Dados mockados de cidades por estado
  const cidadesPorEstado = {
    SP: [
      "São Paulo",
      "Campinas",
      "Santos",
      "Ribeirão Preto",
      "Sorocaba",
      "São José dos Campos",
    ],
    RJ: [
      "Rio de Janeiro",
      "Niterói",
      "Petrópolis",
      "Nova Iguaçu",
      "Duque de Caxias",
      "São Gonçalo",
    ],
    MG: [
      "Belo Horizonte",
      "Uberlândia",
      "Contagem",
      "Juiz de Fora",
      "Betim",
      "Montes Claros",
    ],
    RS: [
      "Porto Alegre",
      "Caxias do Sul",
      "Pelotas",
      "Canoas",
      "Santa Maria",
      "Gravataí",
    ],
    PR: [
      "Curitiba",
      "Londrina",
      "Maringá",
      "Ponta Grossa",
      "Cascavel",
      "São José dos Pinhais",
    ],
    SC: [
      "Florianópolis",
      "Joinville",
      "Blumenau",
      "Criciúma",
      "São José",
      "Itajaí",
    ],
    BA: [
      "Salvador",
      "Feira de Santana",
      "Vitória da Conquista",
      "Camaçari",
      "Itabuna",
      "Lauro de Freitas",
    ],
    CE: [
      "Fortaleza",
      "Caucaia",
      "Sobral",
      "Juazeiro do Norte",
      "Maracanaú",
      "Crato",
    ],
    PE: [
      "Recife",
      "Jaboatão dos Guararapes",
      "Olinda",
      "Caruaru",
      "Petrolina",
      "Paulista",
    ],
    GO: [
      "Goiânia",
      "Aparecida de Goiânia",
      "Anápolis",
      "Rio Verde",
      "Luziânia",
      "Águas Lindas de Goiás",
    ],
  };

  const especies = ["Cão", "Gato", "Pássaro", "Outros"];
  const portes = ["Pequeno", "Médio", "Grande"];

  // Função para calcular público estimado baseado nos filtros
  const calcularPublicoEstimado = () => {
    let base = 0;

    // Base por cidade (mockado)
    if (formData.localizacao.cidade) {
      const populacoes = {
        "São Paulo": 12000000,
        "Rio de Janeiro": 6700000,
        Salvador: 2900000,
        Brasília: 3100000,
        Fortaleza: 2700000,
        "Belo Horizonte": 2500000,
        Manaus: 2200000,
        Curitiba: 1900000,
        Recife: 1600000,
        "Porto Alegre": 1500000,
      };

      base = populacoes[formData.localizacao.cidade] || 1000000;
    } else if (formData.localizacao.estado) {
      base = 5000000; // População média do estado
    } else {
      base = 1000000; // População base
    }

    // Estimativa: 30% da população tem pets
    let publicoComPets = base * 0.3;

    // Filtros por espécie
    if (formData.segmentacaoPet.especies.length > 0) {
      const distribuicaoEspecies = {
        Cão: 0.6,
        Gato: 0.3,
        Pássaro: 0.08,
        Outros: 0.02,
      };

      let percentualEspecies = 0;
      formData.segmentacaoPet.especies.forEach((especie) => {
        percentualEspecies += distribuicaoEspecies[especie] || 0;
      });

      publicoComPets *= percentualEspecies;
    }

    // Filtros por porte
    if (formData.segmentacaoPet.portes.length > 0) {
      const distribuicaoPortes = {
        Pequeno: 0.4,
        Médio: 0.35,
        Grande: 0.25,
      };

      let percentualPortes = 0;
      formData.segmentacaoPet.portes.forEach((porte) => {
        percentualPortes += distribuicaoPortes[porte] || 0;
      });

      publicoComPets *= percentualPortes;
    }

    // Filtro por idade (simplificado)
    if (
      formData.segmentacaoPet.idadeMin > 0 ||
      formData.segmentacaoPet.idadeMax < 15
    ) {
      publicoComPets *= 0.7; // Reduz em 30% se houver filtro de idade
    }

    return Math.round(publicoComPets);
  };

  // Atualizar cidades quando estado mudar
  useEffect(() => {
    if (formData.localizacao.estado) {
      setCidadesDisponiveis(
        cidadesPorEstado[formData.localizacao.estado] || []
      );
      // Limpar cidade quando estado mudar
      setFormData((prev) => ({
        ...prev,
        localizacao: {
          ...prev.localizacao,
          cidade: "",
        },
      }));
    } else {
      setCidadesDisponiveis([]);
    }
  }, [formData.localizacao.estado]);

  // Atualizar público estimado quando filtros mudarem
  useEffect(() => {
    const publico = calcularPublicoEstimado();
    setPublicoEstimado(publico);
  }, [formData]);

  const handleLocalizacaoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      localizacao: {
        ...prev.localizacao,
        [field]: value,
      },
    }));
  };

  const handleSegmentacaoPetChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      segmentacaoPet: {
        ...prev.segmentacaoPet,
        [field]: value,
      },
    }));
  };

  const handleMultiSelect = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].includes(value)
          ? prev[section][field].filter((item) => item !== value)
          : [...prev[section][field], value],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <div className="mb-3">
            <FaUsers size={48} className="text-primary" />
          </div>
          <h4 className="fw-bold">Segmentação Inteligente</h4>
          <p className="text-muted">
            Defina onde e para quem seus anúncios devem aparecer
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          {/* Segmentação Geográfica */}
          <div className="mb-4">
            <h6 className="mb-3">
              <FaMapMarkerAlt className="me-2 text-primary" />
              Onde seus anúncios devem aparecer?
            </h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado *</Form.Label>
                  <Form.Select
                    value={formData.localizacao.estado}
                    onChange={(e) =>
                      handleLocalizacaoChange("estado", e.target.value)
                    }
                    required
                  >
                    <option value="">Selecione o estado</option>
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cidade *</Form.Label>
                  <Form.Select
                    value={formData.localizacao.cidade}
                    onChange={(e) =>
                      handleLocalizacaoChange("cidade", e.target.value)
                    }
                    disabled={!formData.localizacao.estado}
                    required
                  >
                    <option value="">
                      {formData.localizacao.estado
                        ? "Selecione a cidade"
                        : "Primeiro selecione o estado"}
                    </option>
                    {cidadesDisponiveis.map((cidade) => (
                      <option key={cidade} value={cidade}>
                        {cidade}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Segmentação por Pet */}
          <div className="mb-4">
            <h6 className="mb-3">
              <FaPaw className="me-2 text-primary" />
              Refine seu público (Opcional)
            </h6>
            <p className="text-muted mb-3">
              Alcance os tutores certos direcionando seus anúncios com base nas
              características dos seus pets.
            </p>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Espécie</Form.Label>
                  <Row>
                    {especies.map((especie) => (
                      <Col md={6} key={especie}>
                        <Form.Check
                          type="checkbox"
                          id={`especie-${especie}`}
                          label={especie}
                          checked={formData.segmentacaoPet.especies.includes(
                            especie
                          )}
                          onChange={() =>
                            handleMultiSelect(
                              "segmentacaoPet",
                              "especies",
                              especie
                            )
                          }
                          className="mb-2"
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Porte</Form.Label>
                  <Row>
                    {portes.map((porte) => (
                      <Col md={6} key={porte}>
                        <Form.Check
                          type="checkbox"
                          id={`porte-${porte}`}
                          label={porte}
                          checked={formData.segmentacaoPet.portes.includes(
                            porte
                          )}
                          onChange={() =>
                            handleMultiSelect("segmentacaoPet", "portes", porte)
                          }
                          className="mb-2"
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Faixa de Idade do Pet</Form.Label>
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        type="number"
                        min="0"
                        max="15"
                        value={formData.segmentacaoPet.idadeMin}
                        onChange={(e) =>
                          handleSegmentacaoPetChange(
                            "idadeMin",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                      />
                      <small className="text-muted">De (anos)</small>
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="number"
                        min="0"
                        max="15"
                        value={formData.segmentacaoPet.idadeMax}
                        onChange={(e) =>
                          handleSegmentacaoPetChange(
                            "idadeMax",
                            parseInt(e.target.value) || 15
                          )
                        }
                        placeholder="15"
                      />
                      <small className="text-muted">Até (anos)</small>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Feedback em Tempo Real */}
          <div className="mb-4">
            <Alert variant="info" className="border-0 bg-light">
              <div className="d-flex align-items-center">
                <FaChartLine className="me-2 text-primary" />
                <div>
                  <strong>Público Estimado:</strong>{" "}
                  {publicoEstimado > 0 ? (
                    <>
                      Aproximadamente{" "}
                      <span className="text-primary fw-bold">
                        {publicoEstimado.toLocaleString()}
                      </span>{" "}
                      tutores
                      {formData.localizacao.cidade &&
                        ` em ${formData.localizacao.cidade}`}
                      {formData.segmentacaoPet.especies.length > 0 && (
                        <>
                          {" "}
                          com{" "}
                          {formData.segmentacaoPet.especies
                            .join(", ")
                            .toLowerCase()}
                          {formData.segmentacaoPet.portes.length > 0 && (
                            <>
                              {" "}
                              de{" "}
                              {formData.segmentacaoPet.portes
                                .join(", ")
                                .toLowerCase()}
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    "Selecione uma localização para ver o público estimado"
                  )}
                </div>
              </div>
            </Alert>
          </div>

          <div className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={onBack}>
              Voltar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={
                !formData.localizacao.estado || !formData.localizacao.cidade
              }
            >
              Continuar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EtapaSegmentacao;
