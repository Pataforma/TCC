import bgPata from "../assets/imgs/bg-pata.png";
import cachorro from "../assets/imgs/original.png"
import Button from "./Button";

const Intro = () => {
    return (
      <section className="container espacamento-header mb-5 pb-0" >
        <div className="row px-3 px-md-5">
          <div className="col-12 col-lg-6 mb-5 mb-lg-0">
            <h1 className="text-elements mb-4 mb-md-5" 
                style={{ 
                  fontSize: "clamp(3rem, 8vw, 5rem)", 
                  textShadow: "3px 3px ##fa745a;" 
                }}>
              Pataforma
            </h1>
            <h3 className="mb-4 mb-md-5 fs-4">
              Descubra um novo jeito de <span className="fw-bold">cuidar 
              do seu amigo de quatro patas</span> com a Pataforma.
            </h3>
            <p className="mb-4 mb-md-5">
              <span className="fw-bold">Cuide da saúde:</span> agende consultas veterinárias, 
              vacinas e exames diretamente pela nossa plataforma, com <span className="fw-bold">total confiança.</span>
            </p>
            <Button 
              text="Saiba mais" 
              bgColor="var(--secondary-color)" 
              hoverColor="var(--elements-color)" 
              className="mt-2"
            />
          </div>
          <div className="col-12 col-lg-6 position-relative text-center mt-4 mt-lg-0">
            <img 
              src={bgPata} 
              alt="Background" 
              id="bg-pata" 
              className="d-none d-md-block"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <img 
              src={cachorro} 
              alt="Cachorro" 
              className="img-fluid intro-dog mt-2"
              style={{
                maxWidth: "80%",
                height: "auto",
              }}
            />
          </div>
        </div>
      </section>
    );
  };
  
  export default Intro;
  