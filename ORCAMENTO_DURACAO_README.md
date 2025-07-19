# 💰 Página de Orçamento e Duração

## 🎯 Visão Geral

A página **"Orçamento e Duração"** é a tela final do wizard de criação de campanha, onde o anunciante define seu investimento e período da campanha publicitária. Esta tela oferece controle total e clareza sobre o investimento, com validação robusta e resumo em tempo real.

## 🚀 Funcionalidades Implementadas

### ✅ Gerenciamento de Estado Completo

- **budgetType**: 'diario' ou 'total'
- **budgetValue**: Valor do orçamento
- **startDate**: Data de início da campanha
- **endDateOption**: 'continuo' ou 'definido'
- **endDate**: Data de término (condicional)

### ✅ Formulário Principal (Coluna Esquerda)

#### **Seção: Defina seu Orçamento**

- ✅ **Radio Buttons**: Orçamento Diário vs Orçamento Total
- ✅ **Campo de Valor**: InputGroup com prefixo "R$"
- ✅ **Tooltip Informativo**: Explica diferença entre tipos
- ✅ **Validação**: Valor mínimo R$ 5,00

#### **Seção: Defina o Período da Campanha**

- ✅ **Data de Início**: Campo date com data mínima = hoje
- ✅ **Opções de Término**: Continuamente vs Data definida
- ✅ **Data de Fim Condicional**: Aparece apenas quando necessário
- ✅ **Validação de Datas**: Data fim > Data início

### ✅ Card de Resumo da Campanha (Coluna Direita)

#### **Componente ResumoCampanha**

- ✅ **Público**: Exibe segmentação definida
- ✅ **Criativo**: Preview da imagem/vídeo + conteúdo
- ✅ **Orçamento**: Valor formatado + estimativa mensal
- ✅ **Duração**: Período formatado
- ✅ **Informações Adicionais**: Status, links, etc.

### ✅ Validação Robusta

- ✅ **Campos Obrigatórios**: Todos validados
- ✅ **Valores Mínimos**: R$ 5,00 para orçamento
- ✅ **Datas Válidas**: Início >= hoje, Fim > Início
- ✅ **Feedback Visual**: Erros em tempo real
- ✅ **Botão Inteligente**: Desabilitado até validação completa

### ✅ Cálculos Automáticos

- ✅ **Estimativa Mensal**: budgetValue \* 30.4 (apenas para orçamento diário)
- ✅ **Formatação Monetária**: R$ 0,00
- ✅ **Formatação de Datas**: DD/MM/AAAA

## 🎨 Design e UX

### Paleta de Cores

- **Turquesa** (`#0DB2AC`): Cor principal
- **Verde** (`#28a745`): Botão de publicação
- **Cinza** (`#6c757d`): Textos secundários
- **Vermelho** (`#dc3545`): Erros de validação

### Componentes Utilizados

- **React Bootstrap**: Form, InputGroup, Tooltip, OverlayTrigger
- **React Icons**: FaCalculator, FaCalendarAlt, FaMoneyBillWave
- **CSS Modules**: Estilos modulares e organizados

### Responsividade

- **Desktop**: Layout de duas colunas
- **Tablet**: Ajuste proporcional
- **Mobile**: Colunas empilhadas

## 📁 Estrutura de Arquivos

```
src/features/anunciante-dashboard/pages/
├── OrcamentoDuracao.jsx          # Componente principal
├── ResumoCampanha.jsx            # Componente de resumo
├── OrcamentoDuracao.module.css   # Estilos CSS modules
└── OrcamentoDuracaoDemo.jsx      # Componente de demonstração
```

## 🔗 Rotas

### Rota Principal (Protegida)

```
/dashboard/anunciante/orcamento-duracao
```

- Requer autenticação de anunciante
- Integrada ao wizard de criação

### Rota de Demonstração (Pública)

```
/demo/orcamento-duracao
```

- Para testes e demonstração
- Não requer autenticação

## 🛠️ Como Usar

### 1. Acesso à Página

```javascript
// Navegação programática
navigate("/dashboard/anunciante/orcamento-duracao");

// Ou via link
<Link to="/dashboard/anunciante/orcamento-duracao">Orçamento e Duração</Link>;
```

### 2. Uso do Componente

```javascript
import OrcamentoDuracao from "./pages/OrcamentoDuracao";

const MeuComponente = () => {
  const handleNext = (finalData) => {
    console.log("Dados finais da campanha:", finalData);
    // Lógica para publicar campanha
  };

  const handleBack = () => {
    // Lógica para voltar
  };

  return (
    <OrcamentoDuracao
      onNext={handleNext}
      onBack={handleBack}
      data={dadosIniciais}
      campaignData={dadosDasEtapasAnteriores}
    />
  );
};
```

### 3. Estrutura dos Dados Finais

```javascript
const finalCampaignData = {
  segmentation: {
    localizacao: { estado: "BA", cidade: "Salvador" },
    segmentacaoPet: { especies: ["Cão"], portes: ["Pequeno"] },
  },
  creative: {
    nomeEvento: "Campanha de Verão",
    tituloAnuncio: "Seu Pet Merece o Melhor!",
    textoAnuncio: "Conheça nossa nova linha...",
    textoBotao: "Saiba Mais",
    linkDestino: "https://exemplo.com",
    midia: { url: "...", type: "image" },
  },
  budget: {
    type: "diario",
    value: 20.0,
  },
  schedule: {
    startDate: "2025-07-19",
    endDate: null, // ou data específica
    isContinuous: true,
  },
  summary: {
    monthlyEstimate: "608.00",
    formattedBudget: "R$ 20,00",
    formattedStartDate: "19/07/2025",
    formattedEndDate: null,
  },
};
```

## 🔧 Configurações

### Validações Implementadas

```javascript
// Orçamento
- Valor mínimo: R$ 5,00
- Tipo obrigatório: 'diario' ou 'total'

// Datas
- Data início >= hoje
- Data fim > data início (se definida)
- Data fim obrigatória se 'definido' selecionado
```

### Cálculos Automáticos

```javascript
// Estimativa mensal (apenas orçamento diário)
monthlyEstimate = budgetValue * 30.4;

// Formatação monetária
formatCurrency(20.0); // "R$ 20,00"

// Formatação de data
formatDate("2025-07-19"); // "19/07/2025"
```

## 🎯 Funcionalidades Especiais

### Tooltip Informativo

- **Orçamento Diário**: Define limite de gasto por dia
- **Orçamento Total**: Define limite total para toda campanha

### Resumo em Tempo Real

- **Público**: "Tutores em Salvador com cães de pequeno porte"
- **Criativo**: Preview da imagem + título + texto + botão
- **Orçamento**: "Até R$ 20,00 por dia" + estimativa mensal
- **Duração**: "A partir de 19/07/2025, continuamente"

### Validação Inteligente

- **Botão de Publicação**: Desabilitado até validação completa
- **Feedback Visual**: Erros aparecem em tempo real
- **Limpeza Automática**: Erros são limpos ao corrigir

## 🎯 Próximos Passos

### Melhorias Sugeridas

1. **Integração com Backend**: Enviar dados para API
2. **Persistência**: Salvar dados em localStorage
3. **Preview Avançado**: Simulação de resultados
4. **Templates**: Orçamentos pré-definidos
5. **Analytics**: Estimativas de performance

### Funcionalidades Futuras

- **Orçamento Dinâmico**: Sugestões baseadas no público
- **Scheduling Avançado**: Horários específicos
- **A/B Testing**: Múltiplos orçamentos
- **Relatórios**: Projeções de gasto

## 🐛 Troubleshooting

### Problemas Comuns

1. **Botão não habilita**

   - Verificar se todos os campos obrigatórios estão preenchidos
   - Verificar se as datas estão válidas
   - Verificar se o valor do orçamento é >= R$ 5,00

2. **Resumo não atualiza**

   - Verificar se campaignData está sendo passado corretamente
   - Verificar se os dados das etapas anteriores estão completos

3. **Validação não funciona**
   - Verificar se as funções de validação estão sendo chamadas
   - Verificar se os estados estão sendo atualizados

## 📝 Notas Técnicas

### Hooks Utilizados

- **useState**: Gerenciamento de estado local
- **useEffect**: Validação automática do formulário

### Validações Implementadas

- **Campos obrigatórios**: Todos os campos necessários
- **Valores mínimos**: Orçamento >= R$ 5,00
- **Datas válidas**: Lógica de datas coerente
- **Feedback visual**: Erros em tempo real

### Performance

- **Lazy Loading**: Componentes carregados sob demanda
- **Validação Otimizada**: Apenas quando necessário
- **Renderização Condicional**: Elementos mostrados conforme necessário

## 🤝 Contribuição

Para contribuir com melhorias:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste a validação e responsividade
5. Submeta um Pull Request

---

**Desenvolvido com ❤️ para a Pataforma**
