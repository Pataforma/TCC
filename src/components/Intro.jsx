const Intro = () => {
    return (
      <section className="container d-flex flex-column flex-lg-row align-items-center justify-content-between my-5 px-5">
        <div className="w-100 w-lg-50">
          <h1 className="text-elements">Pataforma</h1>
          <h3>
            Descubra um novo jeito de <span className="fw-bold">cuidar<br /> do seu amigo de quatro patas</span> com <br /> a Pataforma.
          </h3>
          <p>
            <span className="fw-bold">Cuide da saúde:</span> agende consultas veterinárias, <br />
            vacinas e exames diretamente pela nossa <br /> plataforma, com <span className="fw-bold">total confiança.</span>
          </p>
          <button className="btn text-white mt-2 custom-btn">Saiba mais</button>
        </div>
        <div className="position-relative w-100 w-lg-50 text-center mt-4 mt-lg-0">
          <img src="/imgs/bg-pata.png" alt="Background" id="bg-pata" />
          <img src="/imgs/cachorro.png" alt="Cachorro" className="img-fluid" />
        </div>
      </section>
    );
  };
  
  export default Intro;
  