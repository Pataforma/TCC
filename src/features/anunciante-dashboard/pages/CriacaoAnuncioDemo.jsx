import React, { useState } from "react";
import CriacaoAnuncio from "./CriacaoAnuncio";

const CriacaoAnuncioDemo = () => {
  const [currentStep, setCurrentStep] = useState(3);
  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    console.log("Dados do formulário:", data);
    setFormData(data);
    setCurrentStep(currentStep + 1);
    alert("Formulário enviado com sucesso! Dados no console.");
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    alert("Voltando para etapa anterior...");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <CriacaoAnuncio onNext={handleNext} onBack={handleBack} data={formData} />
    </div>
  );
};

export default CriacaoAnuncioDemo;
