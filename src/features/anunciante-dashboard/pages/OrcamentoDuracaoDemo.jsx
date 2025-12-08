import React, { useState } from "react";
import OrcamentoDuracao from "./OrcamentoDuracao";

const OrcamentoDuracaoDemo = () => {
  const [currentStep, setCurrentStep] = useState(4);
  const [formData, setFormData] = useState({});

  // Dados mockados das etapas anteriores
  const mockCampaignData = {
    segmentation: {
      localizacao: {
        estado: "BA",
        cidade: "Salvador",
      },
      segmentacaoPet: {
        especies: ["Cão"],
        portes: ["Pequeno"],
        idadeMin: 0,
        idadeMax: 15,
      },
    },
    creative: {
      nomeEvento: "Campanha de Verão - Ração Premium",
      tituloAnuncio: "Seu Pet Merece o Melhor!",
      textoAnuncio:
        "Conheça nossa nova linha de rações naturais. Nutrição completa para cães e gatos de todas as idades.",
      textoBotao: "Saiba Mais",
      linkDestino: "https://exemplo.com",
      midia: {
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjBGMEYwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VtIGRlIEV4ZW1wbG88L3RleHQ+Cjwvc3ZnPgo=",
        type: "image",
      },
    },
  };

  const handleNext = (data) => {
    console.log("Dados finais da campanha:", data);
    setFormData(data);
    setCurrentStep(currentStep + 1);
    alert("Campanha publicada com sucesso! Dados no console.");
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    alert("Voltando para etapa anterior...");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <OrcamentoDuracao
        onNext={handleNext}
        onBack={handleBack}
        data={formData}
        campaignData={mockCampaignData}
      />
    </div>
  );
};

export default OrcamentoDuracaoDemo;
