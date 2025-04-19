import bgPata from "../assets/imgs/bg-pata.png";
import cachorro from "../assets/imgs/original.png"
import Button from "./Button";

const Intro = () => {
    return (
      <section className="container d-flex flex-column flex-lg-row justify-content-beetween my-0 px-5 espacamento-header mb-5 pb-0" >
        <div className="w-100 w-lg-50">
          <h1 className="text-elements mb-5" style={{ fontSize: "5rem", textShadow: "3px 3px ##fa745a;" }}>Pataforma</h1>
          <h3 className="mb-5">
            Descubra um novo jeito de <span className="fw-bold">cuidar<br /> do seu amigo de quatro patas</span> com <br /> a Pataforma.
          </h3>
          <p className="mb-5">
            <span className="fw-bold">Cuide da saúde:</span> agende consultas veterinárias, <br />
            vacinas e exames diretamente pela nossa <br /> plataforma, com <span className="fw-bold">total confiança.</span>
          </p>
          <Button 
            text="Saiba mais" 
            bgColor="var(--secondary-color)" 
            hoverColor="var(--elements-color)" 
            className="mt-2"
          />
        </div>
        <div className="position-relative w-100 w-lg-50 text-center mt-4 mt-lg-0">
          <img src={bgPata} alt="Background" id="bg-pata" />
          <img src={cachorro} alt="Cachorro" className="img-fluid intro-dog w-75 mt-2" />
        </div>
      </section>
    );
  };
  
  export default Intro;
  