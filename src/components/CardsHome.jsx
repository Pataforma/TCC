import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function DicaCard({ title, text }) {
  return (
    <Card
      className="shadow-sm mx-auto h-100"
      style={{ maxWidth: "20rem", borderRadius: "0.75rem" }}
    >
      <Card.Body>
        <Card.Title
          className="fs-5 mb-3"
          style={{ color: "var(--elements-color)" }}
        >
          {title}
        </Card.Title>
        <Card.Text className="text-muted">{text}</Card.Text>
      </Card.Body>
    </Card>
  );
}

// Lista de dicas sobre cuidados e bem-estar animal
const dicas = [
  {
    title: "Socialização Precoce",
    text: "Exponha seu pet a diferentes pessoas, ambientes e sons desde filhote para torná-lo confiante e equilibrado.",
  },
  {
    title: "Alimentação Balanceada",
    text: "Ofereça ração de qualidade adequada à idade, porte e necessidades do seu animal; evite alimentos humanos sem orientação veterinária.",
  },
  {
    title: "Exercício Diário",
    text: "Caminhadas, brincadeiras e estímulos mentais ajudam a manter seu pet ativo e prevenir obesidade e estresse.",
  },
  {
    title: "Higiene e Pelagem",
    text: "Escove o pelo regularmente para evitar nós e ferimentos, e faça banhos periódicos conforme recomendação do veterinário.",
  },
];

export default function ListaDicas() {
  return (
    <section className="py-5">
      <h3
        className="text-center mb-4"
        style={{ color: "var(--black)", fontWeight: "500" }}
      >
        Dicas de Cuidados
      </h3>
      <div className="container">
        <div className="row gx-3 gy-4 justify-content-center" >
          {dicas.map((dica, idx) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={idx}>
              <DicaCard {...dica} />
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Button
            as="a"
            href="/dicas"
            className="btn text-white custom-btn"
          >
            Saiba mais
          </Button>
        </div>
      </div>
    </section>
  );
}
