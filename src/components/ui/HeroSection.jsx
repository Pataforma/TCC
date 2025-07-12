import React from "react";
import Botao from "./Botao";

function HeroSection() {
  return (
    <section className="text-center py-5 bg-primary text-white">
      <h2>Cuidado e amor, conectados em um só lugar!</h2>
      <p>Encontre tudo o que você precisa para o bem-estar e cuidado do seu amigo de quatro patas.</p>
      <div>
        <Botao 
          text="Cadastrar meu pet" 
          bgColor="transparent"
          hoverColor="rgba(255, 255, 255, 0.2)"
          textColor="white"
          className="me-3"
          style={{ border: "1px solid white" }}
        />
        <Botao 
          text="Anunciar pet perdido" 
          bgColor="transparent"
          hoverColor="rgba(255, 255, 255, 0.2)"
          textColor="white"
          style={{ border: "1px solid white" }}
        />
      </div>
    </section>
  );
}

export default HeroSection;
