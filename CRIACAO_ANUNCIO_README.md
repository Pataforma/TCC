# 📢 Página de Criação de Anúncio/Evento

## 🎯 Visão Geral

A página **"Criação de Anúncio/Evento"** é uma nova funcionalidade do Dashboard do Anunciante que permite criar campanhas publicitárias com layout interativo e pré-visualização em tempo real.

## 🚀 Funcionalidades Implementadas

### ✅ Layout de Duas Colunas

- **Coluna Esquerda**: Formulário de criação com todos os campos necessários
- **Coluna Direita**: Pré-visualização em tempo real do anúncio
- **Responsivo**: Em telas menores, as colunas se empilham verticalmente

### ✅ Formulário Completo

1. **Nome do Evento/Campanha** (obrigatório)
2. **Título do Anúncio** (obrigatório, máximo 50 caracteres)
3. **Texto do Anúncio** (obrigatório, máximo 150 caracteres)
4. **Upload de Mídia** (opcional - imagens e vídeos)
5. **Texto do Botão** (obrigatório, máximo 20 caracteres)
6. **Link de Destino** (obrigatório, validação de URL)

### ✅ Pré-visualização em Tempo Real

- **Atualização Instantânea**: Conforme o usuário digita, a pré-visualização se atualiza
- **Visual Realista**: Simula como o anúncio aparecerá na plataforma
- **Informações do Anúncio**: Mostra dados técnicos como nome da campanha e link

### ✅ Validação Avançada

- **Validação de Campos**: Todos os campos obrigatórios são validados
- **Limite de Caracteres**: Contadores visuais para cada campo
- **Validação de URL**: Verifica se o link de destino é válido
- **Validação de Arquivo**: Tipo e tamanho de arquivo (máx. 10MB)

### ✅ Upload de Mídia

- **Formatos Suportados**: JPG, PNG, WebP, MP4, WebM
- **Preview**: Miniatura da imagem/vídeo após upload
- **Remoção**: Botão para remover mídia selecionada
- **Loading**: Indicador de progresso durante upload

## 🎨 Design e UX

### Paleta de Cores

- **Cor Principal**: `#0DB2AC` (turquesa)
- **Cor Secundária**: `#FABA32` (amarelo)
- **Cor de Elementos**: `#fa745a` (laranja)
- **Cor de Fundo**: `#f8f9fa` (cinza claro)

### Componentes Utilizados

- **React Bootstrap**: Cards, Forms, Buttons, Alerts
- **React Icons**: Ícones para melhor UX
- **CSS Modules**: Estilos modulares e organizados

### Responsividade

- **Desktop**: Layout de duas colunas lado a lado
- **Tablet**: Colunas se ajustam proporcionalmente
- **Mobile**: Colunas se empilham verticalmente

## 📁 Estrutura de Arquivos

```
src/features/anunciante-dashboard/pages/
├── CriacaoAnuncio.jsx          # Componente principal
├── CriacaoAnuncio.module.css   # Estilos CSS modules
└── CriacaoAnuncioDemo.jsx      # Componente de demonstração
```

## 🔗 Rotas

### Rota Principal (Protegida)

```
/dashboard/anunciante/novo-evento
```

- Requer autenticação de anunciante
- Integrada ao wizard de criação de campanha

### Rota de Demonstração (Pública)

```
/demo/criacao-anuncio
```

- Para testes e demonstração
- Não requer autenticação

## 🛠️ Como Usar

### 1. Acesso à Página

```javascript
// Navegação programática
navigate("/dashboard/anunciante/novo-evento");

// Ou via link
<Link to="/dashboard/anunciante/novo-evento">Criar Novo Anúncio</Link>;
```

### 2. Uso do Componente

```javascript
import CriacaoAnuncio from "./pages/CriacaoAnuncio";

const MeuComponente = () => {
  const handleNext = (formData) => {
    console.log("Dados do formulário:", formData);
    // Lógica para próxima etapa
  };

  const handleBack = () => {
    // Lógica para voltar
  };

  return (
    <CriacaoAnuncio
      onNext={handleNext}
      onBack={handleBack}
      data={dadosIniciais}
    />
  );
};
```

### 3. Estrutura dos Dados

```javascript
const formData = {
  nomeEvento: "Campanha de Verão - Ração Premium",
  tituloAnuncio: "Seu Pet Merece o Melhor!",
  textoAnuncio: "Conheça nossa nova linha de rações naturais...",
  textoBotao: "Saiba Mais",
  linkDestino: "https://exemplo.com",
  midia: {
    file: File,
    url: "data:image/jpeg;base64,...",
    type: "image", // ou "video"
  },
};
```

## 🔧 Configurações

### Limites de Caracteres

```javascript
const LIMITES = {
  tituloAnuncio: 50,
  textoAnuncio: 150,
  textoBotao: 20,
};
```

### Formatos de Arquivo Suportados

```javascript
const validTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];
```

### Tamanho Máximo de Arquivo

- **Limite**: 10MB
- **Configurável**: No código do componente

## 🎯 Próximos Passos

### Melhorias Sugeridas

1. **Integração com Backend**: Substituir dados mockados por APIs reais
2. **Upload Real**: Implementar upload para servidor/CDN
3. **Templates**: Adicionar templates pré-definidos de anúncios
4. **A/B Testing**: Permitir criar variações do mesmo anúncio
5. **Analytics**: Integrar métricas de performance

### Funcionalidades Futuras

- **Editor de Imagem**: Cropping e filtros básicos
- **Scheduling**: Agendar publicação de anúncios
- **Targeting Avançado**: Mais opções de segmentação
- **Preview Mobile**: Visualização específica para mobile

## 🐛 Troubleshooting

### Problemas Comuns

1. **Upload não funciona**

   - Verificar se o arquivo está no formato correto
   - Verificar se o tamanho não excede 10MB

2. **Pré-visualização não atualiza**

   - Verificar se o estado está sendo atualizado corretamente
   - Verificar se não há erros no console

3. **Validação não funciona**
   - Verificar se todos os campos obrigatórios estão preenchidos
   - Verificar se a URL está no formato correto

## 📝 Notas Técnicas

- **React Hooks**: useState, useRef, useEffect
- **CSS Modules**: Estilos modulares e organizados
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Suporte a navegação por teclado
- **Performance**: Lazy loading e otimizações

## 🤝 Contribuição

Para contribuir com melhorias:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste em diferentes dispositivos
5. Submeta um Pull Request

---

**Desenvolvido com ❤️ para a Pataforma**
