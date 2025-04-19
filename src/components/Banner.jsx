import banner from "../assets/imgs/banneredit.png";

const Banner = () => {
    return (
      <section className="py-5 pb-0 bg-elements">
        <div className="container px-5 d-flex flex-column flex-lg-row align-items-center justify-content-between gap-5">
          <img
            src={banner}
            alt="Banner"
            className="img-fluid"
            style={{ maxHeight: '350px'}}
          />
          <div className="text-white mb-4 mb-lg-0 w-100 w-lg-50 d-flex flex-column gap-4">
            <h3 className="fw-bold fs-1">Cuidado e amor conectados em um só lugar!</h3>
            <p className="fs-5">
              Uma plataforma inovadora criada para reunir informações e serviços
              essenciais para o cuidado e bem-estar dos animais.
            </p>
          </div>
        </div>
      </section>
    );
  };
  
  export default Banner;
  