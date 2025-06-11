# Pataforma

## Estrutura do Projeto

```
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles/
├── .eslintrc.cjs
├── .gitignore
├── package.json
├── README.md
├── vite.config.js
```

- **public/**: Arquivos estáticos.
- **src/assets/**: Imagens e outros recursos.
- **src/components/**: Componentes reutilizáveis do React.
- **src/pages/**: Páginas principais da aplicação.
- **src/styles/**: Arquivos de estilo (CSS/SCSS).
- **App.jsx**: Componente principal da aplicação.
- **main.jsx**: Ponto de entrada da aplicação.

## Scripts Disponíveis

No diretório do projeto, você pode rodar:

- `npm install` — Instala as dependências.
- `npm run dev` — Inicia o servidor de desenvolvimento.
- `npm run build` — Gera a versão de produção.
- `npm run preview` — Visualiza a build de produção localmente.
- `npm run lint` — Executa o ESLint para análise de código.

## Configuração do Ambiente

1. Clone o repositório:
    ```sh
    git clone <url-do-repositorio>
    cd <nome-do-projeto>
    ```

    ### Configuração do arquivo `.env`

    Crie um arquivo `.env` na raiz do projeto para armazenar variáveis de ambiente sensíveis, como as chaves do Supabase. O arquivo `.env` **não está presente no repositório remoto** por questões de segurança (está listado no `.gitignore`). Exemplo de conteúdo do `.env`:

    ```
    VITE_SUPABASE_URL=<sua-url-do-supabase>
    VITE_SUPABASE_ANON_KEY=<sua-anon-key>
    ```

    ### Configurações Importantes

    - **Supabase:**  
        A configuração do Supabase está no arquivo `src/supabase.js`, que utiliza as variáveis de ambiente do `.env` para inicializar a conexão com o backend.

    - **Rotas:**  
        As rotas da aplicação estão configuradas nos arquivos `src/main.jsx` e `src/App.jsx`, onde são definidos os caminhos das páginas e a navegação entre componentes.

    ---

    ## Resumo das Tecnologias

    - **Vite:**  
        Ferramenta de build e desenvolvimento rápido para projetos front-end. Permite hot reload e builds otimizados.  
        _Exemplo:_  
        ```sh
        npm run dev
        ```

    - **React:**  
        Biblioteca para construção de interfaces de usuário baseadas em componentes reutilizáveis. Utiliza JSX para descrever a UI de forma declarativa.  
        _Exemplo de componente:_  
        ```jsx
        function Botao() {
            return <button>Clique aqui</button>;
        }
        ```

    - **Supabase:**  
        Plataforma backend como serviço (BaaS) que fornece autenticação, banco de dados e APIs em tempo real, baseada em PostgreSQL.  
        _Exemplo de uso:_  
        ```js
        import { supabase } from './supabase';
        const { data, error } = await supabase.from('usuarios').select('*');
        ```

    ---

    ## Estrutura de Componentes e Arquitetura React

    A arquitetura do React é baseada em componentes, que são funções ou classes que retornam elementos de UI. Os componentes podem ser reutilizados e combinados para formar páginas completas.

    - **Componentes:**  
        Ficam em `src/components/` e representam partes reutilizáveis da interface, como botões, formulários, etc.

    - **Páginas:**  
        Ficam em `src/pages/` e representam telas completas, compostas por vários componentes.

    - **Exemplo de estrutura:**
        ```
        src/
            components/
                Header.jsx
                Footer.jsx
            pages/
                Home.jsx
                Login.jsx
        ```

    - **Exemplo de uso em uma página:**
        ```jsx
        import Header from '../components/Header';

        function Home() {
            return (
                <>
                    <Header />
                    <main>Bem-vindo!</main>
                </>
            );
        }
        ```

    Os componentes são conectados por meio das rotas, permitindo navegação entre diferentes páginas da aplicação.
2. Instale as dependências:
    ```sh
    npm install
    ```
3. Inicie o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Supabase](https://supabase.com/)

## Licença

Este projeto está licenciado sob a licença MIT.
