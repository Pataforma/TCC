/**
 * Funções utilitárias para navegação com animação de carregamento
 */

/**
 * Navega para a página de destino com uma tela de carregamento intermediária
 * 
 * @param {function} navigate - Função de navegação do React Router
 * @param {string} destination - Rota de destino
 * @param {object} options - Opções adicionais
 * @param {string} options.message - Mensagem de carregamento
 * @param {number} options.timeout - Tempo em ms para exibir a tela de carregamento
 */
export const navigateWithLoading = (navigate, destination, options = {}) => {
  const { message = "Carregando...", timeout = 2000 } = options;
  
  // Constrói a URL da página de carregamento com os parâmetros
  const loadingUrl = `/loading?next=${encodeURIComponent(destination)}&message=${encodeURIComponent(message)}&timeout=${timeout}`;
  
  // Navega para a página de carregamento
  navigate(loadingUrl);
};

/**
 * Hook personalizado para navegação com carregamento (exemplo de uso)
 * 
 * Exemplo de uso em um componente:
 * ```jsx
 * const handleClick = () => {
 *   navigateToWithLoading('/destino', 'Carregando dados...');
 * };
 * ```
 */ 