import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Badge,
  Nav,
  Tab,
  Table,
  Form,
  Modal,
  Alert,
  ListGroup,
  Image,
} from "react-bootstrap";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useUser } from "../../../contexts/UserContext";
import { useParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import {
  FaPaw,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaWeight,
  FaRuler,
  FaSyringe,
  FaFileMedical,
  FaPills,
  FaMicroscope,
  FaEdit,
  FaTrash,
  FaDownload,
  FaUpload,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaFileAlt,
  FaHistory,
  FaPrescriptionBottle,
  FaFileUpload,
  FaPlus,
  FaSearch,
  FaShoppingCart,
  FaBox,
  FaSignature,
  FaFilePdf,
  FaFileWord,
  FaShare,
} from "react-icons/fa";

const ProntuarioPage = () => {
  const [activeTab, setActiveTab] = useState("resumo");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Estado para prescrição digital
  const [prescriptionData, setPrescriptionData] = useState({
    medicamentos: [
      {
        id: 1,
        nome: "",
        dosagem: "",
        forma: "",
        via: "",
        frequencia: "",
        duracao: "",
      },
    ],
    observacoes: "",
    dataPrescricao: new Date().toISOString().split("T")[0],
  });

  // Dados do veterinário logado (para prescrição)
  const [veterinario, setVeterinario] = useState({
    nome: "",
    crmv: "",
    endereco: "",
    telefone: "",
    email: "",
    assinatura: "",
  });

  // Produtos disponíveis no estoque (carregados do banco)
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);

  // Paciente (carregado do banco)
  const [paciente, setPaciente] = useState(null);
  const [historicoClinico, setHistoricoClinico] = useState([]);
  const [exames, setExames] = useState([]);
  const [prescricoes, setPrescricoes] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [produtosVendidos, setProdutosVendidos] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Carregar dados do veterinário logado
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: vet, error: vetError } = await supabase
            .from('usuario')
            .select('nome, email')
            .eq('id_usuario', session.user.id)
            .single();
          if (!vetError && vet) {
            setVeterinario((prev) => ({ ...prev, nome: vet.nome || '', email: vet.email || '' }));
          }
        }

        // Carregar paciente e tutor
        const { data: pet, error: petError } = await supabase
          .from('pets')
          .select(`
            id, nome, especie, raca, data_nascimento, peso, sexo, cor, microchip, observacoes,
            tutor:tutor_id (nome, telefone, email)
          `)
          .eq('id', id)
          .maybeSingle();
        if (petError) throw petError;
        if (pet) {
          setPaciente({
            ...pet,
            tutor: pet.tutor?.nome || 'N/A',
            telefone: pet.tutor?.telefone || 'N/A',
            email: pet.tutor?.email || 'N/A',
            foto: "https://via.placeholder.com/150x150/0DB2AC/FFFFFF?text=PET",
          });
        }

        // Carregar histórico clínico a partir de consultas
        const { data: consultas, error: consError } = await supabase
          .from('consultas')
          .select('id, data_consulta, tipo, observacoes')
          .eq('paciente_id', id)
          .order('data_consulta', { ascending: false });
        if (!consError && consultas) {
          setHistoricoClinico(
            consultas.map((c) => ({
              id: c.id,
              data: c.data_consulta,
              tipo: c.tipo,
              veterinario: 'Você',
              diagnostico: c.observacoes || '-',
              prescricao: '-',
              observacoes: c.observacoes || '-',
            }))
          );
        }

        // Carregar produtos disponíveis no estoque (se existirem as tabelas)
        const { data: estoque, error: estError } = await supabase
          .from('estoque_produtos')
          .select('id, produto, categoria, estoque_atual, preco_venda, unidade, lote_atual');
        if (!estError && Array.isArray(estoque)) {
          setProdutosDisponiveis(
            estoque.map((p) => ({
              id: p.id,
              produto: p.produto,
              categoria: p.categoria,
              estoqueAtual: p.estoque_atual,
              precoVenda: Number(p.preco_venda) || 0,
              unidade: p.unidade,
              lote: p.lote_atual || '',
            }))
          );
        } else {
          setProdutosDisponiveis([]);
        }
      } catch (error) {
        console.error('Erro ao carregar prontuário:', error);
      }
    };
    if (id) carregarDados();
  }, [id]);

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  };

  const getAlertaIcon = (tipo) => {
    switch (tipo) {
      case "alergia":
        return <FaExclamationTriangle className="text-danger" />;
      case "condicao":
        return <FaFileMedical className="text-warning" />;
      case "medicacao":
        return <FaPills className="text-info" />;
      default:
        return <FaExclamationTriangle className="text-danger" />;
    }
  };

  const getAlertaVariant = (severidade) => {
    switch (severidade) {
      case "alta":
        return "danger";
      case "media":
        return "warning";
      case "baixa":
        return "info";
      default:
        return "secondary";
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      ativa: "success",
      finalizada: "secondary",
      pendente: "warning",
    };

    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarPreco = (preco) => {
    return `R$ ${preco.toFixed(2).replace(".", ",")}`;
  };

  const handleFileUpload = (type) => {
    setUploadType(type);
    setShowUploadModal(true);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // Aqui seria implementada a lógica de upload
    console.log("Uploading file:", selectedFile, "for type:", uploadType);
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  const handleAddProduct = () => {
    setShowProductModal(true);
    setProductSearchTerm("");
    setSelectedProduct(null);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSellProduct = () => {
    if (selectedProduct) {
      // Aqui seria implementada a lógica de venda integrada
      // 1. Adicionar ao histórico do paciente
      // 2. Decrementar estoque
      // 3. Adicionar à fatura
      console.log("Vendendo produto:", selectedProduct);
      alert(`Produto ${selectedProduct.produto} adicionado à fatura!`);
      setShowProductModal(false);
      setSelectedProduct(null);
    }
  };

  const filteredProducts = produtosDisponiveis.filter(
    (product) =>
      product.produto.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  // Funções para prescrição digital
  const handleAddMedication = () => {
    const newMedication = {
      id: Date.now(),
      nome: "",
      dosagem: "",
      forma: "",
      via: "",
      frequencia: "",
      duracao: "",
    };
    setPrescriptionData({
      ...prescriptionData,
      medicamentos: [...prescriptionData.medicamentos, newMedication],
    });
  };

  const handleRemoveMedication = (id) => {
    setPrescriptionData({
      ...prescriptionData,
      medicamentos: prescriptionData.medicamentos.filter(
        (med) => med.id !== id
      ),
    });
  };

  const handleMedicationChange = (id, field, value) => {
    setPrescriptionData({
      ...prescriptionData,
      medicamentos: prescriptionData.medicamentos.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      ),
    });
  };

  const handleGeneratePrescription = () => {
    // Aqui seria implementada a geração do PDF com assinatura
    console.log("Gerando prescrição:", prescriptionData);
    alert(
      "Prescrição gerada e assinada com sucesso! PDF disponível para download."
    );
    setShowPrescriptionModal(false);
  };

  const handleNewPrescription = () => {
    setPrescriptionData({
      medicamentos: [
        {
          id: Date.now(),
          nome: "",
          dosagem: "",
          forma: "",
          via: "",
          frequencia: "",
          duracao: "",
        },
      ],
      observacoes: "",
      dataPrescricao: new Date().toISOString().split("T")[0],
    });
    setShowPrescriptionModal(true);
  };

  const { user } = useUser();
  if (!paciente) {
    return (
      <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
        <div className="container-fluid">
          <div className="text-center py-5">
            <span className="spinner-border" />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout tipoUsuario="veterinario" nomeUsuario={user?.nome}>
      <div className="container-fluid">
        {/* Header do Paciente */}
        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={2} className="text-center">
                <Image
                  src={paciente.foto}
                  roundedCircle
                  width={120}
                  height={120}
                  className="border border-3 border-primary"
                />
              </Col>
              <Col md={7}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <h2 className="fw-bold text-dark mb-0">{paciente.nome}</h2>
                  <Badge bg="primary" className="fs-6">
                    {paciente.especie} • {paciente.raca}
                  </Badge>
                </div>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <p className="text-muted mb-1">
                      <FaUser className="me-2" />
                      <strong>Tutor:</strong> {paciente.tutor}
                    </p>
                    <p className="text-muted mb-1">
                      <FaPhone className="me-2" />
                      <strong>Telefone:</strong> {paciente.telefone}
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <p className="text-muted mb-1">
                      <FaCalendarAlt className="me-2" />
                      <strong>Idade:</strong> {calcularIdade(paciente.data_nascimento) ?? 'N/A'} {calcularIdade(paciente.data_nascimento) ? 'anos' : ''}
                    </p>
                    <p className="text-muted mb-1">
                      <FaWeight className="me-2" />
                      <strong>Peso:</strong> {paciente.peso ?? 'N/A'} {paciente.peso ? 'kg' : ''}
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={3} className="text-end">
                <div className="d-flex flex-column gap-2">
                  <Button variant="outline-primary" size="sm">
                    <FaEdit className="me-2" />
                    Editar Dados
                  </Button>
                  <Button variant="outline-success" size="sm">
                    <FaCalendarAlt className="me-2" />
                    Agendar Consulta
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Navegação por Abas */}
        <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
          <Card.Body className="p-0">
            <Nav variant="tabs" className="nav-tabs-custom px-4 pt-3">
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "resumo"}
                  onClick={() => setActiveTab("resumo")}
                >
                  <FaFileAlt className="me-2" />
                  Resumo
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "historico"}
                  onClick={() => setActiveTab("historico")}
                >
                  <FaHistory className="me-2" />
                  Histórico Clínico
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "exames"}
                  onClick={() => setActiveTab("exames")}
                >
                  <FaMicroscope className="me-2" />
                  Exames
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "prescricoes"}
                  onClick={() => setActiveTab("prescricoes")}
                >
                  <FaPrescriptionBottle className="me-2" />
                  Prescrições
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "documentos"}
                  onClick={() => setActiveTab("documentos")}
                >
                  <FaFileUpload className="me-2" />
                  Documentos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "produtos"}
                  onClick={() => setActiveTab("produtos")}
                >
                  <FaShoppingCart className="me-2" />
                  Produtos
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="p-4">
              {/* Aba Resumo */}
              <Tab.Pane active={activeTab === "resumo"}>
                <Row>
                  <Col lg={8}>
                    {/* Alertas Importantes */}
                    <Card className="border-0 shadow-sm mb-4">
                      <Card.Header className="bg-white border-0">
                        <h5 className="fw-semibold text-dark mb-0">
                          <FaExclamationTriangle className="me-2 text-danger" />
                          Alertas Importantes
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        {(paciente.alertas || []).map((alerta, index) => (
                          <Alert
                            key={index}
                            variant={getAlertaVariant(alerta.severidade)}
                            className="d-flex align-items-center gap-3"
                          >
                            {getAlertaIcon(alerta.tipo)}
                            <div className="flex-grow-1">
                              <strong>{alerta.descricao}</strong>
                              <br />
                              <small>
                                Identificado em: {formatarData(alerta.data)}
                              </small>
                            </div>
                          </Alert>
                        ))}
                      </Card.Body>
                    </Card>

                    {/* Informações Gerais */}
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-white border-0">
                        <h5 className="fw-semibold text-dark mb-0">
                          <FaPaw className="me-2 text-primary" />
                          Informações Gerais
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col sm={6}>
                            <p>
                              <strong>Espécie:</strong> {paciente.especie}
                            </p>
                            <p>
                              <strong>Raça:</strong> {paciente.raca}
                            </p>
                            <p>
                              <strong>Idade:</strong> {calcularIdade(paciente.data_nascimento) ?? 'N/A'} {calcularIdade(paciente.data_nascimento) ? 'anos' : ''}
                            </p>
                            <p>
                              <strong>Sexo:</strong> {paciente.sexo}
                            </p>
                          </Col>
                          <Col sm={6}>
                            <p>
                              <strong>Peso:</strong> {paciente.peso ?? 'N/A'} {paciente.peso ? 'kg' : ''}
                            </p>
                            <p>
                              <strong>Altura:</strong> {paciente.altura} cm
                            </p>
                            <p>
                              <strong>Cor:</strong> {paciente.cor}
                            </p>
                            <p>
                              <strong>Microchip:</strong> {paciente.microchip}
                            </p>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={4}>
                    {/* Próximas Consultas */}
                    <Card className="border-0 shadow-sm mb-4">
                      <Card.Header className="bg-white border-0">
                        <h5 className="fw-semibold text-dark mb-0">
                          <FaCalendarAlt className="me-2 text-success" />
                          Próximas Consultas
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="text-center py-3">
                          <FaCalendarAlt
                            size={48}
                            className="text-muted mb-3"
                          />
                          <h6 className="text-muted">
                            Nenhuma consulta agendada
                          </h6>
                          <Button variant="outline-primary" size="sm">
                            Agendar Consulta
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Vacinas */}
                    <Card className="border-0 shadow-sm">
                      <Card.Header className="bg-white border-0">
                        <h5 className="fw-semibold text-dark mb-0">
                          <FaSyringe className="me-2 text-warning" />
                          Vacinas
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <ListGroup variant="flush">
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>V10</strong>
                              <br />
                              <small className="text-muted">
                                Aplicada em 15/12/2023
                              </small>
                            </div>
                            <Badge bg="success">Atualizada</Badge>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>Antirrábica</strong>
                              <br />
                              <small className="text-muted">
                                Aplicada em 15/12/2023
                              </small>
                            </div>
                            <Badge bg="success">Atualizada</Badge>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Aba Histórico Clínico */}
              <Tab.Pane active={activeTab === "historico"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold text-dark mb-0">
                    Histórico Clínico
                  </h5>
                  <Button variant="primary" size="sm">
                    <FaEdit className="me-2" />
                    Nova Entrada
                  </Button>
                </div>
                <Table responsive className="table-custom">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Tipo</th>
                      <th>Veterinário</th>
                      <th>Diagnóstico</th>
                      <th>Prescrição</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoClinico.map((entrada) => (
                      <tr key={entrada.id}>
                        <td>{formatarData(entrada.data)}</td>
                        <td>
                          <Badge bg="primary">{entrada.tipo}</Badge>
                        </td>
                        <td>{entrada.veterinario}</td>
                        <td>{entrada.diagnostico}</td>
                        <td>{entrada.prescricao}</td>
                        <td>
                          <Button variant="outline-primary" size="sm">
                            <FaEdit />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>

              {/* Aba Exames */}
              <Tab.Pane active={activeTab === "exames"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold text-dark mb-0">Exames</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleFileUpload("exame")}
                  >
                    <FaUpload className="me-2" />
                    Upload Exame
                  </Button>
                </div>
                <Table responsive className="table-custom">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Exame</th>
                      <th>Resultado</th>
                      <th>Tipo</th>
                      <th>Arquivo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exames.map((exame) => (
                      <tr key={exame.id}>
                        <td>{formatarData(exame.data)}</td>
                        <td>{exame.nome}</td>
                        <td>
                          <Badge bg="success">{exame.resultado}</Badge>
                        </td>
                        <td>
                          <Badge bg="info">{exame.tipo}</Badge>
                        </td>
                        <td>{exame.arquivo}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <FaDownload />
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>

              {/* Aba Prescrições */}
              <Tab.Pane active={activeTab === "prescricoes"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold text-dark mb-0">Prescrições</h5>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm">
                      <FaEdit className="me-2" />
                      Nova Prescrição Manual
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleNewPrescription}
                    >
                      <FaSignature className="me-2" />
                      Nova Prescrição Digital
                    </Button>
                  </div>
                </div>
                <Table responsive className="table-custom">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Medicamento</th>
                      <th>Dosagem</th>
                      <th>Frequência</th>
                      <th>Duração</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescricoes.map((prescricao) => (
                      <tr key={prescricao.id}>
                        <td>{formatarData(prescricao.data)}</td>
                        <td>{prescricao.medicamento}</td>
                        <td>{prescricao.dosagem}</td>
                        <td>{prescricao.frequencia}</td>
                        <td>{prescricao.duracao}</td>
                        <td>{getStatusBadge(prescricao.status)}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <FaEdit />
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>

              {/* Aba Documentos */}
              <Tab.Pane active={activeTab === "documentos"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold text-dark mb-0">Documentos</h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleFileUpload("documento")}
                  >
                    <FaUpload className="me-2" />
                    Upload Documento
                  </Button>
                </div>
                <Table responsive className="table-custom">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Arquivo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.map((documento) => (
                      <tr key={documento.id}>
                        <td>{formatarData(documento.data)}</td>
                        <td>{documento.nome}</td>
                        <td>
                          <Badge bg="secondary">{documento.tipo}</Badge>
                        </td>
                        <td>{documento.arquivo}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button variant="outline-primary" size="sm">
                              <FaDownload />
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>

              {/* Aba Produtos */}
              <Tab.Pane active={activeTab === "produtos"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold text-dark mb-0">
                    Produtos Vendidos/Aplicados
                  </h5>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddProduct}
                  >
                    <FaPlus className="me-2" />
                    Adicionar Produto à Fatura
                  </Button>
                </div>
                <Table responsive className="table-custom">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Produto</th>
                      <th>Tipo</th>
                      <th>Quantidade</th>
                      <th>Preço Unitário</th>
                      <th>Preço Total</th>
                      <th>Lote</th>
                      <th>Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosVendidos.map((produto) => (
                      <tr key={produto.id}>
                        <td>{formatarData(produto.data)}</td>
                        <td>{produto.produto}</td>
                        <td>
                          <Badge
                            bg={
                              produto.tipo === "venda" ? "success" : "primary"
                            }
                          >
                            {produto.tipo === "venda" ? "Venda" : "Aplicação"}
                          </Badge>
                        </td>
                        <td>{produto.quantidade}</td>
                        <td>{formatarPreco(produto.precoUnitario)}</td>
                        <td>{formatarPreco(produto.precoTotal)}</td>
                        <td>{produto.lote}</td>
                        <td>{produto.observacoes}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>

        {/* Modal de Upload */}
        <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              Upload de {uploadType === "exame" ? "Exame" : "Documento"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Selecione o arquivo</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleUpload}>
              Upload
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Seleção de Produtos */}
        <Modal
          show={showProductModal}
          onHide={() => setShowProductModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaShoppingCart className="me-2" />
              Adicionar Produto à Fatura
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar produtos no estoque..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="mb-4">
              <h6>Produtos Disponíveis</h6>
              <div className="row g-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="col-md-6">
                    <Card
                      className={`cursor-pointer hover-lift ${
                        selectedProduct?.id === product.id
                          ? "border-primary"
                          : ""
                      }`}
                      onClick={() => handleSelectProduct(product)}
                    >
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="fw-semibold mb-1">
                              {product.produto}
                            </h6>
                            <p className="text-muted mb-1">
                              {product.categoria}
                            </p>
                            <small className="text-muted">
                              Estoque: {product.estoqueAtual} {product.unidade}
                            </small>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold text-primary">
                              {formatarPreco(product.precoVenda)}
                            </div>
                            <small className="text-muted">
                              Lote: {product.lote}
                            </small>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {selectedProduct && (
              <Alert variant="info">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Produto Selecionado:</strong>{" "}
                    {selectedProduct.produto}
                    <br />
                    <small>
                      Preço: {formatarPreco(selectedProduct.precoVenda)} |
                      Estoque: {selectedProduct.estoqueAtual}{" "}
                      {selectedProduct.unidade}
                    </small>
                  </div>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleSellProduct}
                  >
                    <FaPlus className="me-2" />
                    Adicionar à Fatura
                  </Button>
                </div>
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowProductModal(false)}
            >
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Prescrição Digital */}
        <Modal
          show={showPrescriptionModal}
          onHide={() => setShowPrescriptionModal(false)}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaSignature className="me-2" />
              Prescrição Digital - {paciente.nome}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="prescription-editor">
              {/* Cabeçalho da Prescrição */}
              <div className="prescription-header mb-4 p-4 border rounded-3 bg-light">
                <Row>
                  <Col md={6}>
                    <h6 className="fw-bold mb-2">Informações do Veterinário</h6>
                    <p className="mb-1">
                      <strong>{veterinario.nome}</strong>
                    </p>
                    <p className="mb-1 text-muted">{veterinario.crmv}</p>
                    <p className="mb-1 text-muted">{veterinario.endereco}</p>
                    <p className="mb-0 text-muted">{veterinario.telefone}</p>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold mb-2">Informações do Paciente</h6>
                    <p className="mb-1">
                      <strong>Pet:</strong> {paciente.nome}
                    </p>
                    <p className="mb-1">
                      <strong>Tutor:</strong> {paciente.tutor}
                    </p>
                    <p className="mb-1 text-muted">
                      {paciente.especie} • {paciente.raca}
                    </p>
                    <p className="mb-0 text-muted">
                      Data: {formatarData(prescriptionData.dataPrescricao)}
                    </p>
                  </Col>
                </Row>
              </div>

              {/* Medicamentos */}
              <div className="medications-section mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Medicamentos</h6>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleAddMedication}
                  >
                    <FaPlus className="me-2" />
                    Adicionar Medicamento
                  </Button>
                </div>

                {prescriptionData.medicamentos.map((medication, index) => (
                  <Card key={medication.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Medicamento {index + 1}</h6>
                        {prescriptionData.medicamentos.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                              handleRemoveMedication(medication.id)
                            }
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </div>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nome do Medicamento *</Form.Label>
                            <Form.Control
                              type="text"
                              value={medication.nome}
                              onChange={(e) =>
                                handleMedicationChange(
                                  medication.id,
                                  "nome",
                                  e.target.value
                                )
                              }
                              placeholder="Ex: Amoxicilina"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Dosagem *</Form.Label>
                            <Form.Control
                              type="text"
                              value={medication.dosagem}
                              onChange={(e) =>
                                handleMedicationChange(
                                  medication.id,
                                  "dosagem",
                                  e.target.value
                                )
                              }
                              placeholder="Ex: 50mg"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Forma Farmacêutica</Form.Label>
                            <Form.Select
                              value={medication.forma}
                              onChange={(e) =>
                                handleMedicationChange(
                                  medication.id,
                                  "forma",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Selecione</option>
                              <option value="Comprimido">Comprimido</option>
                              <option value="Suspensão">Suspensão</option>
                              <option value="Cápsula">Cápsula</option>
                              <option value="Injetável">Injetável</option>
                              <option value="Pomada">Pomada</option>
                              <option value="Gotas">Gotas</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Via de Administração</Form.Label>
                            <Form.Select
                              value={medication.via}
                              onChange={(e) =>
                                handleMedicationChange(
                                  medication.id,
                                  "via",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Selecione</option>
                              <option value="Oral">Oral</option>
                              <option value="Tópica">Tópica</option>
                              <option value="Intramuscular">
                                Intramuscular
                              </option>
                              <option value="Subcutânea">Subcutânea</option>
                              <option value="Intravenosa">Intravenosa</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Frequência</Form.Label>
                            <Form.Control
                              type="text"
                              value={medication.frequencia}
                              onChange={(e) =>
                                handleMedicationChange(
                                  medication.id,
                                  "frequencia",
                                  e.target.value
                                )
                              }
                              placeholder="Ex: 2x ao dia"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Duração do Tratamento</Form.Label>
                            <Form.Control
                              type="text"
                              value={medication.duracao}
                              onChange={(e) =>
                                handleMedicationChange(
                                  medication.id,
                                  "duracao",
                                  e.target.value
                                )
                              }
                              placeholder="Ex: 7 dias"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              {/* Observações */}
              <Form.Group className="mb-4">
                <Form.Label>Observações Adicionais</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={prescriptionData.observacoes}
                  onChange={(e) =>
                    setPrescriptionData({
                      ...prescriptionData,
                      observacoes: e.target.value,
                    })
                  }
                  placeholder="Instruções especiais, contraindicações, etc."
                />
              </Form.Group>

              {/* Área de Assinatura */}
              <div className="signature-area p-4 border rounded-3 bg-light">
                <Row>
                  <Col md={6}>
                    <h6 className="fw-bold mb-3">Assinatura Digital</h6>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="border rounded p-3 bg-white"
                        style={{ minHeight: 80, minWidth: 200 }}
                      >
                        <small className="text-muted">
                          Assinatura do Veterinário
                        </small>
                        <div className="mt-2">
                          <img
                            src={veterinario.assinatura}
                            alt="Assinatura"
                            style={{ maxHeight: 50, maxWidth: 150 }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                          <div
                            style={{
                              display: "none",
                              fontSize: "12px",
                              color: "#6c757d",
                            }}
                          >
                            [Assinatura Digital]
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold mb-3">Data e Hora</h6>
                    <p className="mb-1">
                      <strong>Data:</strong>{" "}
                      {formatarData(prescriptionData.dataPrescricao)}
                    </p>
                    <p className="mb-0">
                      <strong>Hora:</strong>{" "}
                      {new Date().toLocaleTimeString("pt-BR")}
                    </p>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPrescriptionModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="outline-primary">
              <FaFileWord className="me-2" />
              Salvar Rascunho
            </Button>
            <Button variant="primary" onClick={handleGeneratePrescription}>
              <FaSignature className="me-2" />
              Gerar & Assinar PDF
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ProntuarioPage;
