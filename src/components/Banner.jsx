import banner from "../assets/imgs/banner.png";

const Banner = () => {
    return (
      <section className="py-5 bg-elements">
        <div className="container px-5 d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div className="text-white mb-4 mb-lg-0">
            <h3 className="fw-bold">Tudo o que seu pet precisa, em um só lugar!</h3>
            <p>
              Uma plataforma inovadora criada para reunir informações e serviços
              essenciais para o cuidado e bem-estar dos animais.
            </p>
          </div>
          <img
            src={banner}
            alt="Banner"
            className="img-fluid"
            style={{ maxHeight: '250px' }}
          />
        </div>
      </section>
    );
  };
  
  export default Banner;
  