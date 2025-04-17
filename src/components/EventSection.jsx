import React from "react";

function EventSection() {
  const eventos = [
    {
      titulo: "Feira de Adoção de Pets",
      data: "27 de Abril",
      local: "Praça Central, Feira de Santana",
      descricao: "Adote um amigo! Evento com veterinários, ONGs e muita fofura.",
    },
    {
      titulo: "Campanha de Vacinação Gratuita",
      data: "15 de Maio",
      local: "Clínica Pet Saúde, Bairro São João",
      descricao: "Vacinação antirrábica gratuita para cães e gatos.",
    },
  ];

  return (
    <section className="py-5 bg-light" id="eventos">
      <div className="container">
        <h3 className="text-center mb-5 text-elements">Agenda de Eventos</h3>
        <div className="row">
          {eventos.map((evento, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card h-100 shadow rounded-4">
                <div className="card-body">
                  <h5 className="card-title text-elements">{evento.titulo}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{evento.data} - {evento.local}</h6>
                  <p className="card-text">{evento.descricao}</p>
                  <button className="btn btn-paleta mt-2">Saiba mais</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventSection;
