import React from "react";

function HeroSection() {
  return (
    <section className="text-center py-5 bg-primary text-white">
      <h2>Cuidado e amor, conectados em um só lugar!</h2>
      <p>Encontre tudo o que você precisa para o bem-estar e cuidado do seu amigo de quatro patas.</p>
      <div>
        <button className="btn btn-lg btn-outline-light me-3">Cadastrar meu pet</button>
        <button className="btn btn-lg btn-outline-light">Anunciar pet perdido</button>
      </div>
    </section>
  );
}

export default HeroSection;
