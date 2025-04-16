import React from "react";

function CallToAction() {
  return (
    <section className="py-5 bg-dark text-white text-center">
      <h3>Junte-se à comunidade!</h3>
      <p>Cadastre-se como tutor ou veterinário e faça a diferença!</p>
      <div>
        <button className="btn btn-light me-3">Cadastrar como Tutor</button>
        <button className="btn btn-light">Cadastrar como Veterinário</button>
      </div>
    </section>
  );
}

export default CallToAction;
