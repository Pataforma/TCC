import React from "react";
import Button from "./Button";

function CallToAction() {
  return (
    <section className="py-5 bg-dark text-white text-center">
      <h3>Junte-se à comunidade!</h3>
      <p>Cadastre-se como tutor ou veterinário e faça a diferença!</p>
      <div>
        <Button 
          text="Cadastrar como Tutor" 
          bgColor="white" 
          hoverColor="#f8f9fa" 
          textColor="black" 
          className="me-3"
        />
        <Button 
          text="Cadastrar como Veterinário" 
          bgColor="white" 
          hoverColor="#f8f9fa" 
          textColor="black"
        />
      </div>
    </section>
  );
}

export default CallToAction;
