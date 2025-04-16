import perdido from "../assets/imgs/perdido.png";

const Perdidos = () => {
    return (
      <section className="py-5 bg-button text-white">
        <div className="container px-5 d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <div>
            <h3 className="bg-white text-center text-elements py-2 px-3 rounded-3">
              Encontre pets perdidos
            </h3>
            <p className="mt-3">
              Com a Pataforma, você pode encontrar pets perdidos e ajudar a trazer de volta para casa aqueles que mais precisam.
            </p>
          </div>
          <img
            src={perdido}
            alt="Gatinho perdido"
            className="img-fluid mt-3 mt-lg-0"
            style={{ maxHeight: '300px' }}
          />
        </div>
      </section>
    );
  };
  
  export default Perdidos;
  