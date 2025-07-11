import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import nina from "../../assets/imgs/nina.jpeg";
import simba from "../../assets/imgs/simba.jpg";
import rex from "../../assets/imgs/rex.jpg";

const petsAdocao = [
  {
    id: 1,
    foto: nina,
    nome: "Nina",
    tipo: "Cachorro",
    raca: "SRD",
    sexo: "Fêmea",
    porte: "Médio",
    idade: "Filhote",
    cidade: "Feira de Santana",
    descricao:
      "Nina é uma cachorrinha muito carinhosa e brincalhona. Adora crianças e se dá bem com outros cães.",
    contato: {
      responsavel: "ONG Patinhas Felizes",
      telefone: "(75) 98888-1111",
    },
  },
  {
    id: 2,
    foto: simba,
    nome: "Simba",
    tipo: "Gato",
    raca: "SRD",
    sexo: "Macho",
    porte: "Pequeno",
    idade: "Adulto",
    cidade: "Salvador",
    descricao:
      "Gato muito carinhoso e independente. Já está castrado e com todas as vacinas em dia.",
    contato: {
      responsavel: "Abrigo Miau Amigo",
      telefone: "(71) 97777-2222",
    },
  },
  {
    id: 3,
    foto: rex,
    nome: "Rex",
    tipo: "Cachorro",
    raca: "Labrador",
    sexo: "Macho",
    porte: "Grande",
    idade: "Adulto",
    cidade: "Feira de Santana",
    descricao:
      "Rex é um cão muito inteligente e obediente. Ótimo cão de guarda e companheiro para a família.",
    contato: {
      responsavel: "Fernando Gomes",
      telefone: "(75) 96666-3333",
    },
  },
];

const DashboardTutorAdotarPet = ({ nomeUsuario }) => {
  const [pets] = useState(petsAdocao);

  return (
    <DashboardLayout tipoUsuario="tutor" nomeUsuario={nomeUsuario}>
      <div className="container py-5">
        <h2 className="fw-bold mb-4" style={{ color: "var(--main-color)" }}>
          Adotar Pet
        </h2>
        <div className="row g-4">
          {pets.map((pet) => (
            <div className="col-md-4" key={pet.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={pet.foto}
                  alt={pet.nome}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: 220 }}
                />
                <div className="card-body">
                  <h5 className="card-title text-elements fw-bold mb-2">
                    {pet.nome}
                  </h5>
                  <p className="mb-1">
                    <strong>Tipo:</strong> {pet.tipo}
                  </p>
                  <p className="mb-1">
                    <strong>Raça:</strong> {pet.raca}
                  </p>
                  <p className="mb-1">
                    <strong>Porte:</strong> {pet.porte}
                  </p>
                  <p className="mb-1">
                    <strong>Idade:</strong> {pet.idade}
                  </p>
                  <p className="mb-2">
                    <strong>Cidade:</strong> {pet.cidade}
                  </p>
                  <p className="mb-2">{pet.descricao}</p>
                  <div className="alert alert-info p-2 mb-2">
                    <strong>Contato:</strong> {pet.contato.responsavel} <br />
                    <span>{pet.contato.telefone}</span>
                  </div>
                  <button className="btn btn-success w-100 mt-2" disabled>
                    Quero Adotar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardTutorAdotarPet;
