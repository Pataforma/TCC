# 🐾 Pataforma - Plataforma Veterinária

Uma plataforma completa para gestão veterinária, conectando tutores, veterinários e clínicas em um só lugar.

## ✨ Melhorias Implementadas

### 🚀 Performance e Otimização

- **Lazy Loading**: Implementado carregamento sob demanda para todas as páginas
- **Code Splitting**: Separação automática de código por rota
- **Suspense**: Loading states elegantes durante carregamento
- **Otimização de Imagens**: Componente OptimizedImage com lazy loading e fallbacks

### 🏗️ Arquitetura e Estado

- **Context API**: Gerenciamento centralizado de estado global
- **UserProvider**: Contexto unificado para dados do usuário, pets, consultas e lembretes
- **Reducer Pattern**: Gerenciamento de estado complexo com useReducer
- **Hooks Personalizados**: useUser, useAuth, useErrorHandler

### 🛡️ Segurança e Autenticação

- **AuthGuard**: Sistema de proteção de rotas com HOC
- **Role-based Access**: Controle de acesso por tipo de usuário
- **Route Protection**: Rotas protegidas para tutores, veterinários, anunciantes e parceiros
- **Session Management**: Gerenciamento robusto de sessões

### 🔧 Tratamento de Erros

- **Error Boundary**: Captura de erros em componentes React
- **Error Handler Centralizado**: Sistema unificado de tratamento de erros
- **Error Classification**: Classificação automática de tipos de erro
- **User-friendly Messages**: Mensagens de erro amigáveis ao usuário
- **Error Logging**: Sistema de log para monitoramento

### 📝 Validação de Formulários

- **React Hook Form**: Validação eficiente e performática
- **Yup Schemas**: Validação robusta com esquemas reutilizáveis
- **FormField Component**: Componente reutilizável para campos de formulário
- **Real-time Validation**: Validação em tempo real
- **Accessibility**: Labels, aria-labels e feedback visual

### 🎨 Componentização

- **PetCard**: Componente reutilizável para exibição de pets
- **OptimizedImage**: Componente de imagem com lazy loading
- **FormField**: Campo de formulário com validação integrada
- **StatCard**: Cards de estatísticas reutilizáveis
- **SimpleChart**: Componente de gráficos simples

### ♿ Acessibilidade

- **WCAG 2.1 Compliance**: Conformidade com diretrizes de acessibilidade
- **Keyboard Navigation**: Navegação completa por teclado
- **Screen Reader Support**: Suporte a leitores de tela
- **High Contrast**: Melhor contraste para usuários com deficiência visual
- **Focus Management**: Gerenciamento adequado de foco
- **ARIA Labels**: Atributos ARIA apropriados

### 📱 Responsividade

- **Mobile-First**: Design responsivo mobile-first
- **Bootstrap 5**: Framework CSS moderno e responsivo
- **Flexible Layouts**: Layouts adaptáveis a diferentes tamanhos de tela

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 19**: Framework JavaScript moderno
- **React Router 7**: Roteamento declarativo
- **Bootstrap 5**: Framework CSS responsivo
- **React Hook Form**: Gerenciamento de formulários
- **Yup**: Validação de esquemas
- **React Icons**: Biblioteca de ícones

### Backend e Infraestrutura

- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Banco de dados relacional
- **Row Level Security**: Segurança em nível de linha
- **Real-time Subscriptions**: Atualizações em tempo real

### Ferramentas de Desenvolvimento

- **Vite**: Build tool rápido
- **ESLint**: Linting de código
- **GitHub Pages**: Deploy automático

## �� Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/pataforma.git
cd pataforma

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o arquivo .env.local com suas credenciais do Supabase

# Execute em modo de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção
npm run lint         # Executa o linter
npm run deploy       # Deploy para GitHub Pages
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── AuthGuard.jsx   # Proteção de rotas
│   ├── FormField.jsx   # Campo de formulário
│   ├── OptimizedImage.jsx # Imagem otimizada
│   ├── PetCard.jsx     # Card de pet
│   └── Dashboard/      # Componentes do dashboard
├── contexts/           # Contextos React
│   └── UserContext.jsx # Contexto do usuário
├── layouts/            # Layouts da aplicação
│   └── DashboardLayout.jsx
├── pages/              # Páginas da aplicação
│   ├── tutor/          # Páginas do tutor
│   ├── veterinario/    # Páginas do veterinário
│   └── ...
├── styles/             # Estilos CSS
│   ├── custom.css      # Estilos customizados
│   └── accessibility.css # Estilos de acessibilidade
├── utils/              # Utilitários
│   ├── errorHandler.js # Tratamento de erros
│   ├── navigation.js   # Utilitários de navegação
│   └── supabase.js     # Configuração do Supabase
└── App.jsx             # Componente principal
```

## 🔐 Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Configure as tabelas necessárias:

   - `usuario`: Dados dos usuários
   - `pets`: Dados dos pets
   - `consultas`: Agendamentos
   - `lembretes`: Lembretes e vacinas

4. Configure as variáveis de ambiente:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar testes de integração
npm run test:integration

# Executar testes de acessibilidade
npm run test:a11y
```

## 📊 Monitoramento

- **Error Tracking**: Integração com Sentry (configurável)
- **Analytics**: Google Analytics (configurável)
- **Performance**: Lighthouse CI

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Documentação**: [Wiki do projeto](link-para-wiki)
- **Issues**: [GitHub Issues](link-para-issues)
- **Email**: suporte@pataforma.com

## 🎯 Roadmap

### Próximas Funcionalidades

- [ ] Sistema de notificações push
- [ ] Integração com WhatsApp Business
- [ ] Sistema de pagamentos
- [ ] Telemedicina integrada
- [ ] App mobile nativo
- [ ] IA para diagnóstico preliminar
- [ ] Sistema de gamificação
- [ ] Marketplace de produtos veterinários

### Melhorias Técnicas

- [ ] Testes automatizados completos
- [ ] PWA (Progressive Web App)
- [ ] Service Workers para cache
- [ ] Otimização de bundle
- [ ] CDN para assets
- [ ] Monitoramento de performance
- [ ] Logs estruturados
- [ ] Backup automático

---

**Desenvolvido com ❤️ para a comunidade veterinária**
