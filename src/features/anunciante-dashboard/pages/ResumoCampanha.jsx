import React from "react";
import { Card, Badge } from "react-bootstrap";
import {
  FaUsers,
  FaImage,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import styles from "./OrcamentoDuracao.module.css";

const ResumoCampanha = ({ campaignData, budgetData, scheduleData }) => {
  // Funções auxiliares
  const formatCurrency = (value) => {
    if (!value) return "";
    return parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getDurationText = () => {
    if (!scheduleData?.startDate) return "Data não definida";

    const startDate = formatDate(scheduleData.startDate);

    if (scheduleData?.isContinuous) {
      return `A partir de ${startDate}, continuamente`;
    }

    if (scheduleData?.endDate) {
      const endDate = formatDate(scheduleData.endDate);
      return `De ${startDate} até ${endDate}`;
    }

    return `A partir de ${startDate}`;
  };

  const getBudgetText = () => {
    if (!budgetData?.value) return "Orçamento não definido";

    const value = formatCurrency(budgetData.value);

    if (budgetData?.type === "diario") {
      return `Até ${value} por dia`;
    } else {
      return `Total de ${value}`;
    }
  };

  const getMonthlyEstimateText = () => {
    if (budgetData?.type !== "diario" || !budgetData?.monthlyEstimate) {
      return null;
    }

    return `Estimativa mensal: ${formatCurrency(budgetData.monthlyEstimate)}`;
  };

  const getAudienceText = () => {
    const segmentation = campaignData?.segmentation;
    if (!segmentation) return "Público não definido";

    const location = segmentation.localizacao;
    const pet = segmentation.segmentacaoPet;

    let text = "";

    if (location?.cidade) {
      text += `Tutores em ${location.cidade}`;
    } else if (location?.estado) {
      text += `Tutores em ${location.estado}`;
    } else {
      text += "Tutores";
    }

    if (pet?.especies?.length > 0) {
      text += ` com ${pet.especies.join(", ").toLowerCase()}`;
    }

    if (pet?.portes?.length > 0) {
      text += ` de ${pet.portes.join(", ").toLowerCase()}`;
    }

    return text || "Público não definido";
  };

  const getCreativePreview = () => {
    const creative = campaignData?.creative;
    if (!creative) return null;

    return {
      title: creative.tituloAnuncio || "Título não definido",
      text: creative.textoAnuncio || "Texto não definido",
      media: creative.midia,
      buttonText: creative.textoBotao || "Saiba Mais",
    };
  };

  const creativePreview = getCreativePreview();

  return (
    <Card className={styles.formCard}>
      <Card.Header className={styles.cardHeader}>
        <h5 className="mb-0">
          <FaChartLine className="me-2 text-primary" />
          Resumo da Campanha
        </h5>
      </Card.Header>
      <Card.Body className={styles.cardBody}>
        <div className={styles.summaryContainer}>
          {/* Seção: Público */}
          <div className={styles.summarySection}>
            <div className={styles.summaryHeader}>
              <FaUsers className={styles.summaryIcon} />
              <h6 className={styles.summaryTitle}>Público</h6>
            </div>
            <p className={styles.summaryText}>{getAudienceText()}</p>
          </div>

          {/* Seção: Criativo */}
          <div className={styles.summarySection}>
            <div className={styles.summaryHeader}>
              <FaImage className={styles.summaryIcon} />
              <h6 className={styles.summaryTitle}>Criativo</h6>
            </div>
            {creativePreview ? (
              <div className={styles.creativePreview}>
                {/* Preview da mídia */}
                {creativePreview.media && (
                  <div className={styles.mediaPreview}>
                    {creativePreview.media.type === "image" ? (
                      <img
                        src={creativePreview.media.url}
                        alt="Preview"
                        className={styles.mediaImage}
                      />
                    ) : (
                      <video
                        src={creativePreview.media.url}
                        className={styles.mediaVideo}
                        muted
                      />
                    )}
                  </div>
                )}

                {/* Conteúdo do anúncio */}
                <div className={styles.creativeContent}>
                  <h6 className={styles.creativeTitle}>
                    {creativePreview.title}
                  </h6>
                  <p className={styles.creativeText}>{creativePreview.text}</p>
                  <Badge bg="primary" className={styles.creativeButton}>
                    {creativePreview.buttonText}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className={styles.summaryText}>Criativo não definido</p>
            )}
          </div>

          {/* Seção: Orçamento */}
          <div className={styles.summarySection}>
            <div className={styles.summaryHeader}>
              <FaMoneyBillWave className={styles.summaryIcon} />
              <h6 className={styles.summaryTitle}>Orçamento</h6>
            </div>
            <div className={styles.budgetInfo}>
              <p className={styles.summaryText}>{getBudgetText()}</p>
              {getMonthlyEstimateText() && (
                <p className={styles.monthlyEstimate}>
                  {getMonthlyEstimateText()}
                </p>
              )}
            </div>
          </div>

          {/* Seção: Duração */}
          <div className={styles.summarySection}>
            <div className={styles.summaryHeader}>
              <FaCalendarAlt className={styles.summaryIcon} />
              <h6 className={styles.summaryTitle}>Duração</h6>
            </div>
            <p className={styles.summaryText}>{getDurationText()}</p>
          </div>

          {/* Informações Adicionais */}
          <div className={styles.additionalInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Status:</span>
              <Badge bg="warning" className={styles.statusBadge}>
                Aguardando Publicação
              </Badge>
            </div>

            {campaignData?.creative?.linkDestino && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Link de Destino:</span>
                <span className={styles.infoValue}>
                  {campaignData.creative.linkDestino}
                </span>
              </div>
            )}

            {campaignData?.creative?.nomeEvento && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Nome da Campanha:</span>
                <span className={styles.infoValue}>
                  {campaignData.creative.nomeEvento}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ResumoCampanha;
