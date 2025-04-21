import React from "react";
import Button from "./Button";
import LoadingButton from "./LoadingButton";

function CallToAction() {
  return (
    <section className="py-5 bg-dark text-white text-center">
      <h3>Junte-se à comunidade!</h3>
      <p>Cadastre-se como tutor ou veterinário e faça a diferença!</p>
      <div>
        <LoadingButton 
          text="Cadastrar como Tutor" 
          bgColor="white" 
          hoverColor="#f8f9fa" 
          textColor="black" 
          className="me-3"
          to="/cadastro"
          loadingMessage="Preparando formulário de cadastro..."
          timeout={2500}
        />
        <LoadingButton 
          text="Cadastrar como Veterinário" 
          bgColor="white" 
          hoverColor="#f8f9fa" 
          textColor="black"
          to="/veterinarios?cadastro=true"
          loadingMessage="Carregando área de veterinários..."
          timeout={2000}
        />
      </div>
    </section>
  );
}

export default CallToAction;
