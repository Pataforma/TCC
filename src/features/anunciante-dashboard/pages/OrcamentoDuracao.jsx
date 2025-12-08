import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import {
  FaInfoCircle,
  FaCalculator,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import ResumoCampanha from "./ResumoCampanha";
import styles from "./OrcamentoDuracao.module.css";

const OrcamentoDuracao = ({ onNext, onBack, data, campaignData }) => {
  // Estados do formulário
  const [budgetType, setBudgetType] = useState(data?.budgetType || "diario");
  const [budgetValue, setBudgetValue] = useState(data?.budgetValue || "");
  const [startDate, setStartDate] = useState(
    data?.startDate || getCurrentDate()
  );
  const [endDateOption, setEndDateOption] = useState(
    data?.endDateOption || "continuo"
  );
  const [endDate, setEndDate] = useState(data?.endDate || "");

  // Estados de validação
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Função para obter a data atual no formato YYYY-MM-DD
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Função para obter a data mínima para data de fim (startDate + 1 dia)
  function getMinEndDate() {
    if (!startDate) return getCurrentDate();
    const start = new Date(startDate);
    start.setDate(start.getDate() + 1);
    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, "0");
    const day = String(start.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};

    // Validação do tipo de orçamento
    if (!budgetType) {
      newErrors.budgetType = "Selecione um tipo de orçamento";
    }

    // Validação do valor do orçamento
    if (!budgetValue || budgetValue <= 0) {
      newErrors.budgetValue = "Digite um valor válido para o orçamento";
    } else if (budgetValue < 5) {
      newErrors.budgetValue = "O valor mínimo é R$ 5,00";
    }

    // Validação da data de início
    if (!startDate) {
      newErrors.startDate = "Selecione uma data de início";
    }

    // Validação da data de fim (se necessário)
    if (endDateOption === "definido" && !endDate) {
      newErrors.endDate = "Selecione uma data de término";
    } else if (
      endDateOption === "definido" &&
      endDate &&
      endDate <= startDate
    ) {
      newErrors.endDate =
        "A data de término deve ser posterior à data de início";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar se o formulário está válido
  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [budgetType, budgetValue, startDate, endDateOption, endDate]);

  // Calcular estimativa de gasto mensal
  const calculateMonthlyEstimate = () => {
    if (budgetType === "diario" && budgetValue) {
      return (parseFloat(budgetValue) * 30.4).toFixed(2);
    }
    return null;
  };

  // Formatar valor monetário
  const formatCurrency = (value) => {
    if (!value) return "";
    return parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Manipular mudanças nos campos
  const handleInputChange = (field, value) => {
    switch (field) {
      case "budgetType":
        setBudgetType(value);
        break;
      case "budgetValue":
        setBudgetValue(value);
        break;
      case "startDate":
        setStartDate(value);
        // Se a data de início mudar e for posterior à data de fim, limpar data de fim
        if (endDate && value >= endDate) {
          setEndDate("");
        }
        break;
      case "endDateOption":
        setEndDateOption(value);
        if (value === "continuo") {
          setEndDate("");
        }
        break;
      case "endDate":
        setEndDate(value);
        break;
      default:
        break;
    }

    // Limpar erro quando usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Submeter formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    // Consolidar dados da campanha
    const finalCampaignData = {
      segmentation: campaignData?.segmentation || {},
      creative: campaignData?.creative || {},
      budget: {
        type: budgetType,
        value: parseFloat(budgetValue),
      },
      schedule: {
        startDate: startDate,
        endDate: endDateOption === "definido" ? endDate : null,
        isContinuous: endDateOption === "continuo",
      },
      summary: {
        monthlyEstimate: calculateMonthlyEstimate(),
        formattedBudget: formatCurrency(budgetValue),
        formattedStartDate: formatDate(startDate),
        formattedEndDate: endDate ? formatDate(endDate) : null,
      },
    };

    console.log(
      "Publicando campanha com os seguintes dados:",
      finalCampaignData
    );

    // Chamar função de callback
    onNext(finalCampaignData);
  };

  // Tooltip para explicar tipos de orçamento
  const budgetTypeTooltip = (
    <Tooltip id="budget-type-tooltip">
      <div className="text-start">
        <strong>Orçamento Diário:</strong> Define um limite de gasto por dia.
        <br />
        <strong>Orçamento Total:</strong> Define um limite total para toda a
        campanha.
      </div>
    </Tooltip>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold text-dark mb-1">Orçamento e Duração</h2>
            <p className="text-muted mb-0">
              Defina seu investimento e período da campanha
            </p>
          </div>
          <div className={styles.progressInfo}>
            <span className="badge bg-primary me-2">Etapa 4 de 4</span>
            <div className={styles.progress}>
              <div
                className={styles.progressFill}
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <Row>
        {/* Coluna Esquerda - Formulário */}
        <Col lg={6} className="mb-4">
          <Card className={styles.formCard}>
            <Card.Header className={styles.cardHeader}>
              <h5 className="mb-0">
                <FaCalculator className="me-2 text-primary" />
                Configurações da Campanha
              </h5>
            </Card.Header>
            <Card.Body className={styles.cardBody}>
              <Form onSubmit={handleSubmit}>
                {/* Seção: Defina seu Orçamento */}
                <div className={styles.section}>
                  <h6 className={styles.sectionTitle}>
                    <FaMoneyBillWave className="me-2 text-primary" />
                    Defina seu Orçamento
                    <OverlayTrigger placement="top" overlay={budgetTypeTooltip}>
                      <FaInfoCircle
                        className="ms-2 text-muted"
                        style={{ cursor: "help" }}
                      />
                    </OverlayTrigger>
                  </h6>

                  <Form.Group className="mb-3">
                    <div className={styles.radioGroup}>
                      <Form.Check
                        type="radio"
                        id="budget-daily"
                        name="budgetType"
                        label="Orçamento Diário"
                        value="diario"
                        checked={budgetType === "diario"}
                        onChange={(e) =>
                          handleInputChange("budgetType", e.target.value)
                        }
                        className={styles.radioOption}
                      />
                      <Form.Check
                        type="radio"
                        id="budget-total"
                        name="budgetType"
                        label="Orçamento Total"
                        value="total"
                        checked={budgetType === "total"}
                        onChange={(e) =>
                          handleInputChange("budgetType", e.target.value)
                        }
                        className={styles.radioOption}
                      />
                    </div>
                    {errors.budgetType && (
                      <div className={styles.errorText}>
                        {errors.budgetType}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className={styles.formLabel}>
                      Valor do Orçamento *
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>R$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={budgetValue}
                        onChange={(e) =>
                          handleInputChange("budgetValue", e.target.value)
                        }
                        placeholder="0,00"
                        min="5"
                        step="0.01"
                        isInvalid={!!errors.budgetValue}
                        className={styles.formControl}
                      />
                    </InputGroup>
                    {errors.budgetValue && (
                      <Form.Control.Feedback type="invalid">
                        {errors.budgetValue}
                      </Form.Control.Feedback>
                    )}
                    <Form.Text className="text-muted">
                      Valor mínimo: R$ 5,00
                    </Form.Text>
                  </Form.Group>
                </div>

                {/* Seção: Defina o Período da Campanha */}
                <div className={styles.section}>
                  <h6 className={styles.sectionTitle}>
                    <FaCalendarAlt className="me-2 text-primary" />
                    Defina o Período da Campanha
                  </h6>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.formLabel}>
                      Data de Início *
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      min={getCurrentDate()}
                      isInvalid={!!errors.startDate}
                      className={styles.formControl}
                    />
                    {errors.startDate && (
                      <Form.Control.Feedback type="invalid">
                        {errors.startDate}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className={styles.formLabel}>
                      Data de Término
                    </Form.Label>
                    <div className={styles.radioGroup}>
                      <Form.Check
                        type="radio"
                        id="end-continuous"
                        name="endDateOption"
                        label="Veicular continuamente"
                        value="continuo"
                        checked={endDateOption === "continuo"}
                        onChange={(e) =>
                          handleInputChange("endDateOption", e.target.value)
                        }
                        className={styles.radioOption}
                      />
                      <Form.Check
                        type="radio"
                        id="end-defined"
                        name="endDateOption"
                        label="Definir uma data de término"
                        value="definido"
                        checked={endDateOption === "definido"}
                        onChange={(e) =>
                          handleInputChange("endDateOption", e.target.value)
                        }
                        className={styles.radioOption}
                      />
                    </div>
                  </Form.Group>

                  {endDateOption === "definido" && (
                    <Form.Group className="mb-4">
                      <Form.Label className={styles.formLabel}>
                        Data de Fim *
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) =>
                          handleInputChange("endDate", e.target.value)
                        }
                        min={getMinEndDate()}
                        isInvalid={!!errors.endDate}
                        className={styles.formControl}
                      />
                      {errors.endDate && (
                        <Form.Control.Feedback type="invalid">
                          {errors.endDate}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Coluna Direita - Resumo da Campanha */}
        <Col lg={6} className="mb-4">
          <ResumoCampanha
            campaignData={campaignData}
            budgetData={{
              type: budgetType,
              value: budgetValue,
              monthlyEstimate: calculateMonthlyEstimate(),
            }}
            scheduleData={{
              startDate: startDate,
              endDate: endDate,
              isContinuous: endDateOption === "continuo",
            }}
          />
        </Col>
      </Row>

      {/* Botões de Navegação */}
      <Row>
        <Col-12>
          <div className={styles.navigationButtons}>
            <Button
              variant="outline-secondary"
              onClick={onBack}
              className={styles.navButton}
            >
              ← Voltar
            </Button>
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`${styles.navButton} ${styles.publishButton}`}
            >
              🚀 Finalizar e Publicar Campanha
            </Button>
          </div>
        </Col-12>
      </Row>
    </div>
  );
};

export default OrcamentoDuracao;
