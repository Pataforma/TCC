import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OnboardingWizard.module.css";

export default function OnboardingWizard({
  steps,
  onComplete,
  title = "Configuração do Perfil",
  subtitle = "Complete as etapas para configurar seu perfil",
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateFormData = useCallback((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
      // O componente pai deve lidar com o redirecionamento
    } catch (error) {
      console.error("Erro ao completar onboarding:", error);
      alert("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepComponent = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.wizard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>

          {/* Progress Bar */}
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.progressText}>
              Etapa {currentStep + 1} de {steps.length}
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${styles.step} ${
                index <= currentStep ? styles.active : ""
              } ${index < currentStep ? styles.completed : ""}`}
            >
              <div className={styles.stepNumber}>
                {index < currentStep ? (
                  <i className="fas fa-check"></i>
                ) : (
                  index + 1
                )}
              </div>
              <span className={styles.stepLabel}>{step.title}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>
          <currentStepComponent.component
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
            onComplete={handleComplete}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <div className={styles.navigationLeft}>
            {!isFirstStep && (
              <button
                className={styles.btnSecondary}
                onClick={prevStep}
                disabled={isSubmitting}
              >
                <i className="fas fa-arrow-left"></i> Voltar
              </button>
            )}
          </div>

          <div className={styles.navigationRight}>
            {!isLastStep ? (
              <button
                className={styles.btnPrimary}
                onClick={nextStep}
                disabled={isSubmitting}
              >
                Próximo <i className="fas fa-arrow-right"></i>
              </button>
            ) : (
              <button
                className={styles.btnComplete}
                onClick={handleComplete}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Salvando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i> Completar Configuração
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
