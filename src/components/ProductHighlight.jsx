import React from "react";
import Button from "./Button";

function ProductHighlight() {
  return (
    <section className="py-5 bg-light text-center">
      <h3>Alimentador Inteligente</h3>
      <p>Descubra como o nosso alimentador pode transformar a alimentação do seu pet.</p>
      <img src="src\assets\imgs\alimentador.png" alt="Alimentador" width={"300px"}  />
      <br />
      <Button 
        text="Saiba mais" 
        bgColor="var(--secondary-color)" 
        hoverColor="var(--elements-color)" 
        className="mt-3"
      />
    </section>
  );
}

export default ProductHighlight;
