import React from "react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";

const Termos = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div
          className="card shadow p-4 w-100"
          style={{ maxWidth: 700, borderRadius: 20 }}
        >
          <h2 className="mb-4 text-center text-elements">Termos de Uso</h2>
          <div className="text-muted" style={{ fontSize: 17, lineHeight: 1.7 }}>
            <p>
              Bem-vindo à Pataforma! Ao utilizar nossos serviços, você concorda
              com os seguintes termos:
            </p>
            <ul>
              <li>
                Seus dados são protegidos e utilizados apenas para fins de
                cadastro e uso da plataforma.
              </li>
              <li>
                Você é responsável pelas informações fornecidas e pelo uso
                correto do sistema.
              </li>
              <li>
                Não é permitido publicar conteúdo ofensivo, ilegal ou que viole
                direitos de terceiros.
              </li>
              <li>
                O cadastro de pets, eventos e perfis deve ser feito de forma
                verdadeira e ética.
              </li>
              <li>
                Reservamo-nos o direito de suspender contas que violem estes
                termos.
              </li>
            </ul>
            <p>
              Para mais informações, entre em contato pelo nosso canal de
              suporte.
            </p>
            <p className="mt-4 text-end">
              <strong>Pataforma</strong> &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Termos;
