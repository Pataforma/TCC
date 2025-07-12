import React, { useState } from "react";
import { Modal, Button, ProgressBar } from "react-bootstrap";
import {
  FaBullhorn,
  FaUsers,
  FaDollarSign,
  FaImage,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";
import EtapaObjetivoFormato from "./wizard/EtapaObjetivoFormato";
import EtapaSegmentacao from "./wizard/EtapaSegmentacao";
import EtapaOrcamentoDuracao from "./wizard/EtapaOrcamentoDuracao";
import EtapaCriativo from "./wizard/EtapaCriativo";

const CriarCampanhaModal = ({ show, onHide, onCampanhaCriada }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [campanhaData, setCampanhaData] = useState({
    nome: "",
    objetivo: "",
    formato: "",
    localizacao: {
      cidade: "",
      estado: "",
    },
    orcamentoDiario: 0,
    dataInicio: "",
    dataFim: "",
    imagem: null,
    titulo: "",
    descricao: "",
  });

  const steps = [
    {
      id: "objetivo-formato",
      title: "Objetivo e Formato",
      component: EtapaObjetivoFormato,
      icon: FaBullhorn,
    },
    {
      id: "segmentacao",
      title: "Segmentação",
      component: EtapaSegmentacao,
      icon: FaUsers,
    },
    {
      id: "orcamento-duracao",
      title: "Orçamento e Duração",
      component: EtapaOrcamentoDuracao,
      icon: FaDollarSign,
    },
    {
      id: "criativo",
      title: "Criativo do Anúncio",
      component: EtapaCriativo,
      icon: FaImage,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepUpdate = (data) => {
    setCampanhaData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleSubmit = () => {
    // TODO: Salvar campanha no backend
    const campanhaCompleta = {
      ...campanhaData,
      id: Date.now(),
      status: "ativa",
      cliques: 0,
      impressoes: 0,
      gastoTotal: 0,
      dataCriacao: new Date().toISOString(),
    };

    onCampanhaCriada(campanhaCompleta);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    setCampanhaData({
      nome: "",
      objetivo: "",
      formato: "",
      localizacao: {
        cidade: "",
        estado: "",
      },
      orcamentoDiario: 0,
      dataInicio: "",
      dataFim: "",
      imagem: null,
      titulo: "",
      descricao: "",
    });
    onHide();
  };

  const isStepValid = () => {
    const currentStepData = steps[currentStep];
    switch (currentStepData.id) {
      case "objetivo-formato":
        return (
          campanhaData.nome && campanhaData.objetivo && campanhaData.formato
        );
      case "segmentacao":
        return (
          campanhaData.localizacao.cidade && campanhaData.localizacao.estado
        );
      case "orcamento-duracao":
        return (
          campanhaData.orcamentoDiario > 0 &&
          campanhaData.dataInicio &&
          campanhaData.dataFim
        );
      case "criativo":
        return campanhaData.titulo && campanhaData.descricao;
      default:
        return false;
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaBullhorn className="me-2 text-primary" />
          Criar Nova Campanha
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">
              Etapa {currentStep + 1} de {steps.length}
            </small>
            <small className="text-muted">
              {Math.round(progress)}% completo
            </small>
          </div>
          <ProgressBar now={progress} className="mb-3" />

          {/* Step Indicators */}
          <div className="d-flex justify-content-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`d-flex flex-column align-items-center ${
                  index <= currentStep ? "text-primary" : "text-muted"
                }`}
                style={{ flex: 1 }}
              >
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center mb-1 ${
                    index <= currentStep ? "bg-primary text-white" : "bg-light"
                  }`}
                  style={{ width: "30px", height: "30px" }}
                >
                  {index < currentStep ? (
                    <FaCheck size={12} />
                  ) : (
                    <step.icon size={12} />
                  )}
                </div>
                <small className="text-center" style={{ fontSize: "0.7rem" }}>
                  {step.title}
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="step-content">
          <CurrentStepComponent
            data={campanhaData}
            onUpdate={handleStepUpdate}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancelar
        </Button>

        {currentStep > 0 && (
          <Button variant="outline-primary" onClick={handlePrevious}>
            <FaArrowLeft className="me-1" />
            Anterior
          </Button>
        )}

        {!isLastStep ? (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            Próximo
            <FaArrowRight className="me-1" />
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={!isStepValid()}
          >
            <FaCheck className="me-1" />
            Criar Campanha
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CriarCampanhaModal;
