import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import logo from "../assets/imgs/logo.png";

const Contato = () => {
  // Estados para formulários
  const [formGeral, setFormGeral] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: ""
  });

  const [formParceria, setFormParceria] = useState({
    nomeOrganizacao: "",
    tipoOrganizacao: "",
    email: "",
    telefone: "",
    descricao: ""
  });

  const [formSuporte, setFormSuporte] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipoProblema: "",
    descricao: ""
  });

  const [activeTab, setActiveTab] = useState("geral");

  // Manipuladores de eventos para formulário geral
  const handleGeralChange = (e) => {
    const { name, value } = e.target;
    setFormGeral(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeralSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o formulário geral
    alert(`Mensagem enviada com sucesso! Em breve nossa equipe entrará em contato.`);
    setFormGeral({
      nome: "",
      email: "",
      assunto: "",
      mensagem: ""
    });
  };

  // Manipuladores de eventos para formulário de parceria
  const handleParceriaChange = (e) => {
    const { name, value } = e.target;
    setFormParceria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParceriaSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o formulário de parceria
    alert(`Solicitação de parceria enviada! Analisaremos sua proposta e entraremos em contato.`);
    setFormParceria({
      nomeOrganizacao: "",
      tipoOrganizacao: "",
      email: "",
      telefone: "",
      descricao: ""
    });
  };

  // Manipuladores de eventos para formulário de suporte
  const handleSuporteChange = (e) => {
    const { name, value } = e.target;
    setFormSuporte(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSuporteSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o formulário de suporte
    alert(`Solicitação de suporte registrada! Um especialista entrará em contato em breve.`);
    setFormSuporte({
      nome: "",
      email: "",
      telefone: "",
      tipoProblema: "",
      descricao: ""
    });
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="container-fluid contato-bg text-white py-5 mt-5 position-relative">
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1 }}></div>
        <div className="container py-4 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-5 fw-bold">Fale Conosco</h1>
              <p className="lead">
                Estamos à disposição para ouvir suas dúvidas, sugestões, propostas de parceria ou solicitações de suporte técnico.
              </p>
            </div>
            <div className="col-md-4 text-center d-none d-md-block">
              <i className="bi bi-chat-dots" style={{ fontSize: "5rem" }}></i>
            </div>
          </div>
        </div>
      </section>


      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Formulários */}
          <div className="col-lg-8 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <ul className="nav nav-tabs mb-4">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "geral" ? "active text-elements fw-bold" : ""}`}
                      onClick={() => setActiveTab("geral")}
                    >
                      Contato Geral
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "parceria" ? "active text-elements fw-bold" : ""}`}
                      onClick={() => setActiveTab("parceria")}
                    >
                      Parcerias
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === "suporte" ? "active text-elements fw-bold" : ""}`}
                      onClick={() => setActiveTab("suporte")}
                    >
                      Suporte Técnico
                    </button>
                  </li>
                </ul>

                {/* Formulário Geral */}
                {activeTab === "geral" && (
                  <form onSubmit={handleGeralSubmit}>
                    <h4 className="text-elements mb-3">Envie sua mensagem</h4>
                    <div className="mb-3">
                      <label htmlFor="nome" className="form-label">Nome completo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nome"
                        name="nome"
                        value={formGeral.nome}
                        onChange={handleGeralChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formGeral.email}
                        onChange={handleGeralChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="assunto" className="form-label">Assunto</label>
                      <select
                        className="form-select"
                        id="assunto"
                        name="assunto"
                        value={formGeral.assunto}
                        onChange={handleGeralChange}
                        required
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="Dúvida">Dúvida</option>
                        <option value="Sugestão">Sugestão</option>
                        <option value="Elogio">Elogio</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="mensagem" className="form-label">Mensagem</label>
                      <textarea
                        className="form-control"
                        id="mensagem"
                        name="mensagem"
                        rows="5"
                        value={formGeral.mensagem}
                        onChange={handleGeralChange}
                        required
                      ></textarea>
                    </div>
                    <Button
                      text="Enviar Mensagem"
                      bgColor="var(--main-color)"
                      hoverColor="var(--bg-button)"
                      type="submit"
                    />
                  </form>
                )}

                {/* Formulário de Parceria */}
                {activeTab === "parceria" && (
                  <form onSubmit={handleParceriaSubmit}>
                    <h4 className="text-elements mb-3">Torne-se nosso parceiro</h4>
                    <p className="text-muted mb-4">
                      Clínicas veterinárias, ONGs e outras organizações relacionadas a pets podem se tornar parceiras da plataforma.
                    </p>
                    <div className="mb-3">
                      <label htmlFor="nomeOrganizacao" className="form-label">Nome da Organização</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nomeOrganizacao"
                        name="nomeOrganizacao"
                        value={formParceria.nomeOrganizacao}
                        onChange={handleParceriaChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="tipoOrganizacao" className="form-label">Tipo de Organização</label>
                      <select
                        className="form-select"
                        id="tipoOrganizacao"
                        name="tipoOrganizacao"
                        value={formParceria.tipoOrganizacao}
                        onChange={handleParceriaChange}
                        required
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="Clínica Veterinária">Clínica Veterinária</option>
                        <option value="Pet Shop">Pet Shop</option>
                        <option value="ONG">ONG</option>
                        <option value="Abrigo">Abrigo</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="emailParceria" className="form-label">E-mail institucional</label>
                        <input
                          type="email"
                          className="form-control"
                          id="emailParceria"
                          name="email"
                          value={formParceria.email}
                          onChange={handleParceriaChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="telefoneParceria" className="form-label">Telefone</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="telefoneParceria"
                          name="telefone"
                          value={formParceria.telefone}
                          onChange={handleParceriaChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="descricaoParceria" className="form-label">Descreva como podemos colaborar</label>
                      <textarea
                        className="form-control"
                        id="descricaoParceria"
                        name="descricao"
                        rows="4"
                        value={formParceria.descricao}
                        onChange={handleParceriaChange}
                        required
                        placeholder="Conte-nos sobre sua organização e o tipo de parceria que tem interesse"
                      ></textarea>
                    </div>
                    <Button
                      text="Solicitar Parceria"
                      bgColor="var(--main-color)"
                      hoverColor="var(--bg-button)"
                      type="submit"
                    />
                  </form>
                )}

                {/* Formulário de Suporte */}
                {activeTab === "suporte" && (
                  <form onSubmit={handleSuporteSubmit}>
                    <h4 className="text-elements mb-3">Suporte Técnico</h4>
                    <p className="text-muted mb-4">
                      Está enfrentando problemas na plataforma? Nossa equipe de suporte técnico está pronta para ajudar.
                    </p>
                    <div className="mb-3">
                      <label htmlFor="nomeSuporte" className="form-label">Nome completo</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nomeSuporte"
                        name="nome"
                        value={formSuporte.nome}
                        onChange={handleSuporteChange}
                        required
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="emailSuporte" className="form-label">E-mail</label>
                        <input
                          type="email"
                          className="form-control"
                          id="emailSuporte"
                          name="email"
                          value={formSuporte.email}
                          onChange={handleSuporteChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="telefoneSuporte" className="form-label">Telefone</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="telefoneSuporte"
                          name="telefone"
                          value={formSuporte.telefone}
                          onChange={handleSuporteChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="tipoProblema" className="form-label">Tipo de problema</label>
                      <select
                        className="form-select"
                        id="tipoProblema"
                        name="tipoProblema"
                        value={formSuporte.tipoProblema}
                        onChange={handleSuporteChange}
                        required
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="Acesso à conta">Problemas de acesso à conta</option>
                        <option value="Falha no aplicativo">Falha no aplicativo</option>
                        <option value="Erro no cadastro">Erro no cadastro</option>
                        <option value="Problemas com pagamento">Problemas com pagamento</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="descricaoSuporte" className="form-label">Descreva detalhadamente o problema</label>
                      <textarea
                        className="form-control"
                        id="descricaoSuporte"
                        name="descricao"
                        rows="4"
                        value={formSuporte.descricao}
                        onChange={handleSuporteChange}
                        required
                        placeholder="Forneça detalhes sobre o problema, quando ocorre e quais passos podemos seguir para reproduzi-lo"
                      ></textarea>
                    </div>
                    <Button
                      text="Enviar Solicitação"
                      bgColor="var(--main-color)"
                      hoverColor="var(--bg-button)"
                      type="submit"
                    />
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h4 className="text-elements mb-3">Informações de Contato</h4>

                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-envelope-fill text-elements me-3 fs-5"></i>
                  <div>
                    <p className="fw-bold mb-0">E-mail</p>
                    <p className="mb-0">contato@pataforma.com.br</p>
                    <p className="small text-muted">Respondemos em até 48h úteis</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-telephone-fill text-elements me-3 fs-5"></i>
                  <div>
                    <p className="fw-bold mb-0">Telefone</p>
                    <p className="mb-0">(75) 3622-0000</p>
                    <p className="small text-muted">Seg-Sex, 8h às 18h</p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-geo-alt-fill text-elements me-3 fs-5"></i>
                  <div>
                    <p className="fw-bold mb-0">Endereço</p>
                    <p className="mb-0">Av. Universitária, 1000</p>
                    <p className="mb-0">Feira de Santana, BA</p>
                    <p className="small text-muted">Visite-nos com agendamento prévio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h4 className="text-elements mb-3">Redes Sociais</h4>
                <p className="text-muted mb-3">Siga-nos e fique por dentro de todas as novidades!</p>

                <div className="d-flex flex-wrap gap-3">
                  <a href="#" className="btn btn-light d-flex align-items-center border px-3 py-2 text-decoration-none">
                    <i className="bi bi-instagram text-elements me-2 fs-5"></i>
                    <span>Instagram</span>
                  </a>

                  <a href="#" className="btn btn-light d-flex align-items-center border px-3 py-2 text-decoration-none">
                    <i className="bi bi-facebook text-elements me-2 fs-5"></i>
                    <span>Facebook</span>
                  </a>

                  <a href="#" className="btn btn-light d-flex align-items-center border px-3 py-2 text-decoration-none">
                    <i className="bi bi-linkedin text-elements me-2 fs-5"></i>
                    <span>LinkedIn</span>
                  </a>

                  <a href="#" className="btn btn-light d-flex align-items-center border px-3 py-2 text-decoration-none">
                    <i className="bi bi-youtube text-elements me-2 fs-5"></i>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Horário de Atendimento */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="text-elements mb-3">Horário de Atendimento</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Segunda a Sexta</span>
                    <span className="fw-semibold">8h às 18h</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Sábado</span>
                    <span className="fw-semibold">9h às 12h</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Domingo e Feriados</span>
                    <span className="fw-semibold">Fechado</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="container-fluid bg-light py-5">
        <div className="container">
          <h2 className="text-elements fw-bold mb-4 text-center">Perguntas Frequentes</h2>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-elements">Como faço para me cadastrar na plataforma?</h5>
                  <p className="card-text">Para se cadastrar, clique no botão "Cadastre-se" no cabeçalho do site e preencha o formulário com seus dados. É rápido e gratuito!</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-elements">Posso anunciar meus serviços veterinários?</h5>
                  <p className="card-text">Sim! Veterinários podem se cadastrar e anunciar seus serviços através de uma conta profissional. Utilize o formulário de parcerias.</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-elements">Como posso divulgar animais para adoção?</h5>
                  <p className="card-text">Após fazer login, acesse a página "Animais" e clique em "Publicar para Adoção". Preencha os dados e adicione fotos do pet.</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-elements">O aplicativo é gratuito?</h5>
                  <p className="card-text">Sim, nosso aplicativo básico é completamente gratuito. Oferecemos também planos premium com recursos adicionais para usuários e profissionais.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Button
              text="Ver todas as perguntas"
              bgColor="var(--secondary-color)"
              hoverColor="var(--elements-color)"
              className="px-4 py-2"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h2 className="text-elements fw-bold mb-3">Fique por dentro das novidades</h2>
            <p className="mb-4">Cadastre-se em nossa newsletter e receba conteúdos exclusivos sobre cuidados com pets, eventos e promoções.</p>

            <div className="input-group mb-3">
              <input type="email" className="form-control" placeholder="Seu melhor e-mail" aria-label="Seu melhor e-mail" />
              <Button
                text="Inscrever-se"
                bgColor="var(--main-color)"
                hoverColor="var(--bg-button)"
                className="px-4"
              />
            </div>
            <p className="small text-muted">Ao se inscrever, você concorda com nossa política de privacidade.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contato;