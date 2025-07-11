# Estrutura Organizada - Pataforma

## 📁 Nova Organização de Pastas

### Estrutura Principal

```
src/
├── pages/
│   ├── veterinario/           # Dashboard e páginas do veterinário
│   │   ├── DashboardVeterinario.jsx
│   │   ├── DashboardVeterinarioAgenda.jsx
│   │   ├── DashboardVeterinarioPacientes.jsx
│   │   ├── DashboardVeterinarioFinanceiro.jsx
│   │   └── DashboardVeterinarioMarketing.jsx
│   ├── tutor/                 # Dashboard e páginas do tutor
│   │   └── DashboardTutor.jsx
│   ├── parceiro/              # Dashboard e páginas do parceiro
│   │   └── DashboardParceiro.jsx
│   ├── anunciante/            # Dashboard e páginas do anunciante
│   │   └── DashboardAnunciante.jsx
│   ├── Login/                 # Páginas de autenticação
│   ├── TipoUsuario/           # Seleção de tipo de usuário
│   ├── EscolherPerfil.jsx     # Nova página de escolha de perfil
│   ├── Home.jsx               # Páginas públicas
│   ├── Sobre.jsx
│   ├── Veterinarios.jsx
│   ├── Animais.jsx
│   ├── Produto.jsx
│   ├── Agenda.jsx
│   ├── Contato.jsx
│   └── ...
├── components/
│   ├── Dashboard/             # Componentes específicos do dashboard
│   │   ├── StatCard.jsx
│   │   ├── SimpleChart.jsx
│   │   └── DashboardBase.jsx
│   ├── Header.jsx             # Componentes reutilizáveis
│   ├── Footer.jsx
│   ├── SidebarDashboard.jsx
│   └── ...
├── layouts/
│   ├── DashboardLayout.jsx    # Layout unificado do dashboard
│   └── DashboardLayout.module.css
├── utils/
│   ├── navigation.js
│   └── supabase.js
├── styles/
│   └── custom.css
└── assets/
    └── imgs/
```

## 🔄 Fluxo de Navegação

### 1. Após Login

```
Login → EscolherPerfil → Dashboard específico
```

### 2. Escolha de Perfil

- **Tutor**: `/escolher-perfil` → `/dashboard/tutor`
- **Veterinário**: `/escolher-perfil` → `/dashboard/veterinario`
- **Parceiro**: `/escolher-perfil` → `/dashboard/parceiro`
- **Anunciante**: `/escolher-perfil` → `/dashboard/anunciante`

### 3. Conexões entre Áreas

#### Veterinário ↔ Páginas Públicas

- **Perfil do Veterinário** (Marketing) → **Página Veterinários** (filtro/listagem)
- **Avaliações recebidas** → **Perfil pessoal** e **Módulo Marketing**

#### Tutor ↔ Páginas Públicas

- **Pets cadastrados** → **Página Animais**
- **Registro pet perdido** → **Dashboard Tutor** (formulário focado)

#### Parceiro/Anunciante ↔ Páginas Públicas

- **Eventos criados** → **Páginas públicas** (Agenda, Home)
- **Produtos/Serviços** → **Página Produto**

## 🎯 Benefícios da Nova Organização

### 1. **Organização Clara**

- Cada tipo de usuário tem sua pasta específica
- Fácil localização de arquivos
- Separação clara entre dashboards e páginas públicas

### 2. **Manutenibilidade**

- Imports organizados e consistentes
- Estrutura escalável para novos tipos de usuário
- Componentes reutilizáveis bem definidos

### 3. **Navegação Intuitiva**

- Fluxo claro após login
- Conexões entre áreas bem definidas
- UX consistente

### 4. **Escalabilidade**

- Fácil adição de novos módulos
- Estrutura preparada para crescimento
- Padrões estabelecidos

## 📋 Próximos Passos

### 1. **Implementar Dashboard do Tutor**

- Seguir o mesmo padrão do veterinário
- Conectar com páginas públicas
- Implementar módulo financeiro do tutor

### 2. **Implementar Dashboards Restantes**

- Parceiro (ONGs, Pet Shops)
- Anunciante (Eventos, Campanhas)

### 3. **Conexões de Dados**

- Integrar dados entre dashboards e páginas públicas
- Implementar sistema de avaliações
- Conectar formulários de registro

### 4. **Melhorias de UX**

- Feedback visual nas conexões
- Navegação contextual
- Estados de carregamento

## 🔧 Rotas Principais

### Dashboards

- `/dashboard/veterinario` - Dashboard principal do veterinário
- `/dashboard/veterinario/agenda` - Agenda do veterinário
- `/dashboard/veterinario/pacientes` - Gestão de pacientes
- `/dashboard/veterinario/financeiro` - Módulo financeiro
- `/dashboard/veterinario/marketing` - Marketing do veterinário
- `/dashboard/tutor` - Dashboard do tutor
- `/dashboard/parceiro` - Dashboard do parceiro
- `/dashboard/anunciante` - Dashboard do anunciante

### Páginas Públicas

- `/` - Home
- `/veterinarios` - Lista de veterinários
- `/animais` - Lista de pets
- `/agenda` - Agenda pública
- `/produto` - Produtos/serviços
- `/contato` - Contato
- `/sobre` - Sobre

### Autenticação

- `/telalogin` - Login
- `/escolher-perfil` - Escolha de perfil após login
- `/tipo-usuario` - Seleção de tipo de usuário

---

**Estrutura organizada e pronta para implementação dos próximos dashboards!**
