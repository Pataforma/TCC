import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Botao from "./Botao";

describe("Componente Botao", () => {
  test("deve renderizar o texto corretamente", () => {
    render(<Botao text="Clique Aqui" />);
    const buttonElement = screen.getByText(/Clique Aqui/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test("deve aplicar as cores padrão corretamente", () => {
    render(<Botao text="Botão Padrão" />);
    const buttonElement = screen.getByText(/Botão Padrão/i);
    expect(buttonElement).toHaveStyle({
      backgroundColor: "var(--main-color)",
      color: "rgb(255, 255, 255)",
    });
  });

  test("deve aplicar cores personalizadas corretamente", () => {
    render(
      <Botao text="Botão Personalizado" bgColor="#ff0000" textColor="#000000" />
    );
    const buttonElement = screen.getByText(/Botão Personalizado/i);
    expect(buttonElement).toHaveStyle({
      backgroundColor: "#ff0000",
      color: "#000000",
    });
  });

  test("deve chamar a função onClick quando clicado", () => {
    const handleClick = jest.fn();
    render(<Botao text="Clicável" onClick={handleClick} />);
    const buttonElement = screen.getByText(/Clicável/i);

    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("deve mudar o estilo ao passar o mouse", () => {
    render(<Botao text="Hover Test" />);
    const buttonElement = screen.getByText(/Hover Test/i);

    fireEvent.mouseEnter(buttonElement);
    expect(buttonElement).toHaveStyle({
      backgroundColor: "var(--bg-button)",
    });

    fireEvent.mouseLeave(buttonElement);
    expect(buttonElement).toHaveStyle({
      backgroundColor: "var(--main-color)",
    });
  });

  test("deve aplicar classes CSS adicionais", () => {
    render(<Botao text="Com Classe" className="extra-class" />);
    const buttonElement = screen.getByText(/Com Classe/i);
    expect(buttonElement).toHaveClass("custom-button", "extra-class");
  });
});
