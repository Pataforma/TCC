// Utilitários de validação reutilizáveis para o projeto

/**
 * Valida se um CNPJ tem formato válido
 * @param {string} cnpj - CNPJ com ou sem máscara
 * @returns {object} - { valido: boolean, erro?: string }
 */
export const validarCNPJ = (cnpj) => {
  if (!cnpj || !cnpj.trim()) {
    return { valido: false, erro: "CNPJ é obrigatório" };
  }

  const cnpjLimpo = cnpj.replace(/\D/g, "");
  
  if (cnpjLimpo.length !== 14) {
    return { valido: false, erro: "CNPJ deve ter 14 dígitos" };
  }

  if (!/^\d{14}$/.test(cnpjLimpo)) {
    return { valido: false, erro: "CNPJ deve conter apenas números" };
  }

  // Validação de dígitos verificadores (algoritmo oficial)
  if (cnpjLimpo === "00000000000000" || 
      cnpjLimpo === "11111111111111" || 
      cnpjLimpo === "22222222222222" || 
      cnpjLimpo === "33333333333333" || 
      cnpjLimpo === "44444444444444" || 
      cnpjLimpo === "55555555555555" || 
      cnpjLimpo === "66666666666666" || 
      cnpjLimpo === "77777777777777" || 
      cnpjLimpo === "88888888888888" || 
      cnpjLimpo === "99999999999999") {
    return { valido: false, erro: "CNPJ inválido" };
  }

  // Validação dos dígitos verificadores
  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  const digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) {
    return { valido: false, erro: "CNPJ inválido" };
  }

  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(1))) {
    return { valido: false, erro: "CNPJ inválido" };
  }

  return { valido: true };
};

/**
 * Valida se um CPF tem formato válido
 * @param {string} cpf - CPF com ou sem máscara
 * @returns {object} - { valido: boolean, erro?: string }
 */
export const validarCPF = (cpf) => {
  if (!cpf || !cpf.trim()) {
    return { valido: false, erro: "CPF é obrigatório" };
  }

  const cpfLimpo = cpf.replace(/\D/g, "");
  
  if (cpfLimpo.length !== 11) {
    return { valido: false, erro: "CPF deve ter 11 dígitos" };
  }

  if (!/^\d{11}$/.test(cpfLimpo)) {
    return { valido: false, erro: "CPF deve conter apenas números" };
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return { valido: false, erro: "CPF inválido" };
  }

  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  
  let resto = 11 - (soma % 11);
  let digitoVerificador1 = resto < 2 ? 0 : resto;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  
  resto = 11 - (soma % 11);
  let digitoVerificador2 = resto < 2 ? 0 : resto;

  if (parseInt(cpfLimpo.charAt(9)) !== digitoVerificador1 || 
      parseInt(cpfLimpo.charAt(10)) !== digitoVerificador2) {
    return { valido: false, erro: "CPF inválido" };
  }

  return { valido: true };
};

/**
 * Valida se um email tem formato válido
 * @param {string} email - Email a ser validado
 * @returns {object} - { valido: boolean, erro?: string }
 */
export const validarEmail = (email) => {
  if (!email || !email.trim()) {
    return { valido: false, erro: "Email é obrigatório" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valido: false, erro: "Email inválido" };
  }

  return { valido: true };
};

/**
 * Valida se um telefone tem formato válido
 * @param {string} telefone - Telefone com ou sem máscara
 * @returns {object} - { valido: boolean, erro?: string }
 */
export const validarTelefone = (telefone) => {
  if (!telefone || !telefone.trim()) {
    return { valido: false, erro: "Telefone é obrigatório" };
  }

  const telefoneLimpo = telefone.replace(/\D/g, "");
  
  if (telefoneLimpo.length < 10) {
    return { valido: false, erro: "Telefone deve ter pelo menos 10 dígitos" };
  }

  if (telefoneLimpo.length > 11) {
    return { valido: false, erro: "Telefone deve ter no máximo 11 dígitos" };
  }

  return { valido: true };
};

/**
 * Valida se um CEP tem formato válido
 * @param {string} cep - CEP com ou sem máscara
 * @returns {object} - { valido: boolean, erro?: string }
 */
export const validarCEP = (cep) => {
  if (!cep || !cep.trim()) {
    return { valido: false, erro: "CEP é obrigatório" };
  }

  const cepLimpo = cep.replace(/\D/g, "");
  
  if (cepLimpo.length !== 8) {
    return { valido: false, erro: "CEP deve ter 8 dígitos" };
  }

  if (!/^\d{8}$/.test(cepLimpo)) {
    return { valido: false, erro: "CEP deve conter apenas números" };
  }

  return { valido: true };
};

/**
 * Valida se um campo obrigatório está preenchido
 * @param {string} valor - Valor do campo
 * @param {string} nomeCampo - Nome do campo para mensagem de erro
 * @returns {object} - { valido: boolean, erro?: string }
 */
export const validarCampoObrigatorio = (valor, nomeCampo) => {
  if (!valor || !valor.toString().trim()) {
    return { valido: false, erro: `${nomeCampo} é obrigatório` };
  }
  return { valido: true };
};

/**
 * Valida se um valor numérico é maior que zero
 * @param {string|number} valor - Valor a ser validado
 * @param {string} nomeCampo - Nome do campo para mensagem de erro
 * @returns {object} - { valido: boolean, erro?: string }
 */
export const validarValorPositivo = (valor, nomeCampo) => {
  const numValor = parseFloat(valor);
  if (isNaN(numValor) || numValor <= 0) {
    return { valido: false, erro: `${nomeCampo} deve ser maior que zero` };
  }
  return { valido: true };
};
