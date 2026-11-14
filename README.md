![EduBlog](./assets/images/eduBlog-logo.png)

# EduBlog Mobile

Aplicativo mobile da plataforma educacional **EduBlog**, desenvolvido com **React Native, TypeScript e Expo**. A aplicação integra-se à API REST do EduBlog e oferece consulta e leitura de publicações para estudantes e professores, além de ferramentas administrativas para o perfil de professor.

Este README apresenta as funcionalidades implementadas, as tecnologias utilizadas, a organização do código, as rotas internas do aplicativo, os endpoints HTTP chamados pelo mobile e as instruções de instalação e execução.

## Sumário

- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e configuração](#instalação-e-configuração)
- [Executar no dispositivo](#executar-no-dispositivo)
- [Problemas de conexão com o celular](#problemas-de-conexão-com-o-celular)
- [Diagnóstico e testes](#diagnóstico-e-testes)
- [Rotas do aplicativo](#rotas-do-aplicativo)
- [Arquitetura e organização](#arquitetura-e-organização)
- [Integração com a API](#integração-com-a-api)
- [Autenticação e autorização](#autenticação-e-autorização)
- [TO-DO — melhorias futuras](#to-do--melhorias-futuras)
- [Fluxo de contribuição](#fluxo-de-contribuição)

## Visão geral

O EduBlog Mobile disponibiliza em dispositivos móveis os principais recursos da plataforma educacional. A aplicação contempla dois perfis:

- **Estudante (`ALUNO`):** consulta publicações, pesquisa conteúdos, aplica filtros, lê posts e consulta os próprios dados de perfil.
- **Professor (`PROFESSOR`):** utiliza os recursos de consulta e acessa a área administrativa, com ferramentas para gerenciar publicações e cadastros de professores e estudantes.

O aplicativo atua como cliente da API REST. A interface apresenta os dados e encaminha as ações do usuário; a API é responsável pela persistência, pelas validações de negócio e pela autorização efetiva das operações protegidas.

## Funcionalidades

### Consulta e leitura de publicações

- Listagem de publicações na página inicial, com cards contendo título, resumo, autor e metadados disponíveis.
- Pesquisa textual com debounce e envio do termo para a API.
- Filtros por disciplina e autor, enviados à API, e por série/ano e semestre, aplicados no aplicativo.
- Navegação por disciplinas ativas, inclusive disciplinas que ainda não possuem publicações.
- Carrossel de destaques com base na propriedade `isFeatured`.
- Tela de leitura com conteúdo completo, autor, disciplina, status, série/ano e semestre.
- Estados de carregamento, erro, ausência de resultados e ações de nova tentativa nas telas pertinentes.
- Exibição de publicações com status `Publicado` na experiência de consulta e leitura.

### Área do professor

- Dashboard com contagem de posts publicados e rascunhos, além dos cinco posts mais recentes do professor.
- Listagem administrativa dos próprios posts, com filtros por título, disciplina e status.
- Visualização administrativa de uma publicação.
- Criação e edição de publicações por formulário, incluindo disciplina, status e marcação de destaque.
- Exclusão de publicações com confirmação.
- Acesso à área administrativa de usuários.
- Cadastro, edição, listagem e exclusão de professores e estudantes.
- Alteração do status ativo/inativo por meio do formulário de edição do usuário.
- Paginação local das listas de usuários, com seis registros por página.

### Perfil e sessão

- Login por meio da API.
- Exibição de nome, nome de usuário, e-mail e perfil do usuário autenticado.
- Armazenamento local da sessão com Expo SecureStore.
- Restauração da sessão ao iniciar o aplicativo e verificação local da expiração do JWT.
- Encerramento da sessão (logout), com remoção da sessão armazenada e limpeza do estado em memória.

## Tecnologias

Versões declaradas no `package.json` do projeto:

| Tecnologia                     |                          Versão declarada |
| ------------------------------ | ----------------------------------------: |
| Expo                           |                       `^58.0.19` (SDK 58) |
| React Native                   |                                  `0.88.0` |
| React                          |                                  `19.3.0` |
| Expo Router                    |                                `~58.0.26` |
| TypeScript                     |                                  `~6.0.3` |
| Expo SecureStore               |                                 `~58.0.2` |
| React Native Reanimated        |                                   `4.7.1` |
| React Native Gesture Handler   |                                  `~3.3.0` |
| React Native Safe Area Context |                                 `~5.10.1` |
| Expo Vector Icons              |                                 `^15.0.2` |
| JWT Decode                     |                                  `^4.0.0` |
| `@expo/ngrok`                  | `^4.1.3` (dependência de desenvolvimento) |

A aplicação utiliza componentes funcionais e Hooks do React. A navegação é baseada em arquivos com Expo Router. O `app.json` habilita rotas tipadas (`typedRoutes`) e React Compiler.

## Pré-requisitos

- Node.js compatível com os requisitos declarados por Expo e React Native no `package-lock.json` (linha 22 a partir de `22.13.0`, linha 24 a partir de `24.3.0` ou linha 26 a partir de `26.0.0`).
- npm.
- Expo Go compatível com o SDK 58 instalado no dispositivo Android.
- Conexão com a internet para instalação das dependências, acesso à API e utilização do Tunnel.
- Para LAN: computador e celular na mesma rede local, com a comunicação entre os dispositivos permitida pelo roteador e pelo firewall.

O fluxo de desenvolvimento utilizado pela equipe foi realizado em aparelho Android físico com Expo Go, sem depender de emulador.

## Instalação e configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/Roch-Daniel/EduBlog-mobie.git
cd EduBlog-mobie
```

O repositório e o pacote mantêm a grafia `mobie`, conforme os identificadores publicados no projeto.

### 2. Instalar dependências

```bash
npm ci
```

O comando instala as versões registradas no `package-lock.json`, reproduzindo o conjunto de dependências versionado.

### 3. Configurar a URL da API

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=https://blog-api-dnfx.onrender.com
```

`EXPO_PUBLIC_API_URL` define a URL base utilizada por `src/services/apiClient.ts`. Para utilizar outra instância, substitua o endereço pelo ambiente correspondente.

**Segurança:** variáveis com prefixo `EXPO_PUBLIC_` podem ser incorporadas ao bundle do aplicativo. Não armazene nelas senhas, tokens privados, chaves secretas ou outras credenciais. O `.gitignore` ignora arquivos `.env*` e permite manter um `.env.example` versionado sem valores sensíveis.

### 4. Verificar dependências Expo

```bash
npx expo install --check
```

O comando verifica o alinhamento das dependências Expo com o SDK utilizado. Analise as recomendações antes de atualizar versões manualmente.

## Executar no dispositivo

O projeto oferece execução pela rede local (LAN) ou por Tunnel. A escolha depende da conectividade entre o computador e o dispositivo.

### LAN — rede local

```bash
npm start
```

O Expo inicia o Metro Bundler e apresenta um QR Code. Abra o Expo Go no celular e leia o código. Em LAN, o celular precisa alcançar o servidor de desenvolvimento executado no computador; em condições normais, ambos devem estar na mesma rede local.

```text
Celular → Wi-Fi local → Computador → Expo / Metro Bundler
```

O roteador e o firewall precisam permitir a comunicação entre os dispositivos. Quando a LAN funciona corretamente, é uma opção direta e não depende de um serviço externo de túnel.

### Tunnel com ngrok

A dependência `@expo/ngrok` está declarada localmente no `package.json` e no `package-lock.json`; por isso, é instalada junto com as demais dependências por `npm ci`. Não é necessário instalá-la globalmente.

O script configurado no projeto executa `expo start --tunnel ngrok`:

```bash
npm run start:tunnel
```

O comando direto equivalente é:

```bash
npx expo start --tunnel ngrok
```

O Tunnel intermedeia a conexão do dispositivo ao servidor Metro:

```text
Celular → Internet → Serviço Tunnel / ngrok → Computador → Expo / Metro Bundler
```

**O Tunnel não hospeda a API REST e não encaminha as chamadas HTTP da aplicação à API.** Ele disponibiliza um caminho para o dispositivo acessar o servidor de desenvolvimento. As requisições feitas pelo app seguem diretamente para a URL configurada em `EXPO_PUBLIC_API_URL`.

A disponibilidade do Tunnel depende da conexão com a internet e do serviço externo. Não compartilhe publicamente a URL ou o QR Code do servidor de desenvolvimento; encerre o servidor com `Ctrl + C` ao terminar os testes.

### LAN ou Tunnel

| Comando                         | Uso                                                               |
| ------------------------------- | ----------------------------------------------------------------- |
| `npm start`                     | Inicialização padrão do Expo, utilizada normalmente com LAN.      |
| `npm run start:tunnel`          | Inicialização por Tunnel com ngrok, conforme o script do projeto. |
| `npx expo start --tunnel ngrok` | Execução direta do modo Tunnel com ngrok.                         |

A LAN pode oferecer menor latência por utilizar a rede local diretamente. O Tunnel é uma alternativa quando firewall, roteador ou isolamento entre dispositivos impedem a conexão local.

## Problemas de conexão com o celular

Se o Expo Go permanecer em “carregando”, verifique:

1. Em LAN, confirme que celular e computador estão na mesma rede Wi-Fi.
2. Confirme que o servidor Expo/Metro continua em execução.
3. Verifique a compatibilidade do Expo Go com o SDK 58 utilizado pelo projeto.
4. Verifique se o firewall permite a comunicação necessária.
5. Confirme que o roteador não bloqueia a comunicação entre dispositivos (por exemplo, por isolamento de clientes).
6. Confirme que as dependências foram instaladas com `npm ci`.
7. Se a LAN continuar indisponível, tente `npm run start:tunnel`.

### Teste de conectividade pela rede local

Com o servidor iniciado, é possível fazer um teste preliminar no navegador do celular:

```text
http://IP_DO_COMPUTADOR:8081
```

No Windows, obtenha o IPv4 do computador com:

```cmd
ipconfig
```

Localize o Endereço IPv4 do adaptador Wi-Fi em uso, substitua `IP_DO_COMPUTADOR` e abra a URL no navegador do celular. O resultado ajuda a verificar o acesso à porta do servidor, mas não garante sozinho que todas as etapas de carregamento do app funcionarão.

### Perfil de rede e firewall do Windows

O Windows aplica regras diferentes conforme o perfil `Public` ou `Private`. Em uma rede doméstica confiável, `Private` pode facilitar a comunicação local. Em redes públicas ou desconhecidas, mantenha `Public`.

Para consultar o perfil atual, use o PowerShell:

```powershell
Get-NetConnectionProfile
```

Em uma rede doméstica confiável, a alteração para `Private` pode ser feita em PowerShell com privilégios administrativos, ajustando o nome da interface se necessário:

```powershell
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private
```

Para retornar ao perfil público:

```powershell
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Public
```

O nome da interface pode variar. Não altere uma rede pública, corporativa ou desconhecida para `Private` apenas para fazer o Expo funcionar.

## Diagnóstico e testes

### Diagnóstico Expo

```bash
npx expo install --check
npx expo-doctor
```

O `expo-doctor` executa verificações de configuração e compatibilidade e pode precisar acessar serviços Expo pela internet. Erros de conexão, como `ConnectTimeoutError`, não significam necessariamente que o código ou as dependências estejam incorretos.

### Verificação de tipos TypeScript

```bash
npx tsc --noEmit
```

O comando verifica os tipos sem gerar arquivos JavaScript.

### Testes de descoberta e serviços de posts

O arquivo `scripts/test-posts.mjs` contém testes para filtragem de publicações, disciplina/autor/série/semestre, ordenação, codificação de parâmetros, cancelamento de requisições e serviços de posts. Execute com Node compatível com TypeScript type stripping:

```bash
node --experimental-strip-types --test scripts/test-posts.mjs
```

### Testes de navegação por perfil

O arquivo `scripts/test-professor-navigation.mjs` verifica a exibição do atalho para professores, a proteção do grupo de rotas, o redirecionamento `/teacher` e o mapeamento da rota do dashboard. Execute após instalar as dependências:

```bash
node --test scripts/test-professor-navigation.mjs
```

Esse teste renderiza componentes com dependências simuladas para validar condições estruturais; ele não substitui testes end-to-end no dispositivo.

### Lint

O `package.json` disponibiliza o script:

```bash
npm run lint
```

O script chama `expo lint`.

## Rotas do aplicativo

O Expo Router organiza as telas em grupos como `(app)` e `(auth)`. Os nomes dos grupos entre parênteses organizam os layouts, mas não aparecem no caminho da rota.

> **Importante:** os caminhos abaixo são rotas internas de navegação do aplicativo mobile, gerenciadas pelo Expo Router. Não são endpoints do back-end. Assim, `/teacher` existe no app como rota interna e redireciona para o dashboard; isso não significa que a API precise possuir uma rota HTTP `/teacher`.

| Caminho mobile                | Tela / finalidade                                       | Acesso previsto                           |
| ----------------------------- | ------------------------------------------------------- | ----------------------------------------- |
| `/`                           | Login quando não autenticado ou Home quando autenticado | Público ou autenticado, conforme a sessão |
| `/profile`                    | Dados do usuário autenticado                            | Usuário autenticado                       |
| `/posts/[id]`                 | Leitura de uma publicação                               | Usuário autenticado                       |
| `/teacher`                    | Redirecionamento para `/teacher/dashboard`              | Professor                                 |
| `/teacher/dashboard`          | Dashboard do professor                                  | Professor                                 |
| `/teacher/posts`              | Listagem e gerenciamento dos próprios posts             | Professor                                 |
| `/teacher/posts/new`          | Criação de publicação                                   | Professor                                 |
| `/teacher/posts/[id]`         | Visualização administrativa de publicação               | Professor                                 |
| `/teacher/posts/[id]/edit`    | Edição de publicação                                    | Professor                                 |
| `/teacher/users`              | Área administrativa de usuários                         | Professor                                 |
| `/teacher/teachers`           | Listagem de professores                                 | Professor                                 |
| `/teacher/teachers/new`       | Cadastro de professor                                   | Professor                                 |
| `/teacher/teachers/[id]/edit` | Edição de professor                                     | Professor                                 |
| `/teacher/students`           | Listagem de estudantes                                  | Professor                                 |
| `/teacher/students/new`       | Cadastro de estudante                                   | Professor                                 |
| `/teacher/students/[id]/edit` | Edição de estudante                                     | Professor                                 |

Os segmentos dinâmicos `[id]` recebem o identificador pela rota. As telas utilizam esses parâmetros para consultar ou atualizar a publicação ou o usuário correspondente.

## Arquitetura e organização

A aplicação combina organização por domínio (_feature-based_) com separação de responsabilidades entre navegação, apresentação, estado, serviços HTTP e tipagens.

Estrutura simplificada de `src/`:

```text
src/
├── app/                         # Rotas e layouts do Expo Router
│   ├── (app)/                   # Área autenticada
│   │   ├── posts/[id].tsx       # Leitura de publicação
│   │   ├── profile.tsx          # Perfil
│   │   └── teacher/             # Área do professor
│   └── (auth)/                  # Fluxo de autenticação
├── components/ui/               # Componentes visuais reutilizáveis
├── context/                     # Context API: autenticação e Toast
├── features/
│   ├── auth/screens/            # Tela de login
│   ├── posts/
│   │   ├── components/          # Cards, carrossel, filtros e feedback
│   │   ├── screens/             # Home, leitura e telas do professor
│   │   ├── utils/               # Validação e utilitários de posts
│   │   └── usePostDiscovery.ts  # Estado e descoberta de publicações
│   └── users/
│       ├── components/          # Cards e formulários de usuários
│       ├── constants/           # Configuração por perfil
│       ├── screens/             # Listagem e formulários administrativos
│       └── utils/               # Validação e regras de usuário
├── hooks/                       # Hooks transversais
├── interfaces/                  # Contratos TypeScript
├── services/                    # Comunicação HTTP com a API
├── types/                       # Tipos compartilhados
└── utils/                       # Utilitários transversais
```

### Responsabilidades

- **`app/`:** define rotas, layouts e proteção de navegação.
- **`components/ui/`:** fornece elementos reutilizáveis, como botões, campos, seleção, paginação, carregamento e notificações.
- **`features/`:** agrupa componentes, telas e regras relacionadas aos domínios de autenticação, posts e usuários.
- **`context/`:** compartilha sessão e notificações entre componentes.
- **`hooks/`:** encapsula comportamentos reutilizáveis, como requisições autenticadas e carregamento de usuários.
- **`services/`:** concentra as operações HTTP por domínio.
- **`interfaces/` e `types/`:** descrevem contratos e tipos utilizados pelo TypeScript.
- **`utils/`:** reúne funções auxiliares compartilhadas, como paginação e tratamento de erros.

### Fluxo de comunicação

As requisições de dados seguem o fluxo:

```text
Tela / componente
      ↓
Hook (estado e ciclo de vida)
      ↓
Serviço de domínio (postsService / usersService / authService)
      ↓
apiClient (fetch, URL base, headers e erros)
      ↓
API REST do EduBlog
      ↓
Resposta → atualização do estado → interface
```

A conexão LAN/Tunnel é utilizada para carregar o bundle do aplicativo no Expo Go durante o desenvolvimento. As chamadas HTTP da aplicação para a API são independentes desse caminho e utilizam `EXPO_PUBLIC_API_URL`.

## Integração com a API

### Cliente HTTP

`src/services/apiClient.ts` centraliza chamadas com `fetch`, monta a URL base com `EXPO_PUBLIC_API_URL`, configura os cabeçalhos, serializa corpos JSON, anexa o token Bearer quando fornecido e converte respostas HTTP não exitosas em `ApiError`.

`src/hooks/useApiClient.ts` fornece a função `request` para serviços e telas, vinculando as requisições ao token da sessão e ao logout em respostas HTTP 401.

Os serviços estão separados por domínio:

- `authService.ts`: autenticação.
- `postsService.ts`: consulta, pesquisa, leitura, criação, atualização e exclusão de publicações; consulta de disciplinas e status.
- `usersService.ts`: consulta, criação, atualização e exclusão de usuários.

### Endpoints HTTP chamados pelo aplicativo

| Método   | Endpoint               | Finalidade                                              |
| -------- | ---------------------- | ------------------------------------------------------- |
| `POST`   | `/auth/login`          | Autenticação e obtenção do token e dados do usuário.    |
| `GET`    | `/posts`               | Consulta do catálogo de publicações.                    |
| `GET`    | `/posts/search`        | Pesquisa por texto, disciplina e autor.                 |
| `GET`    | `/posts/:id`           | Consulta de uma publicação específica.                  |
| `GET`    | `/posts/all`           | Consulta administrativa de publicações.                 |
| `POST`   | `/posts`               | Criação de publicação.                                  |
| `PUT`    | `/posts/:id`           | Atualização de publicação.                              |
| `DELETE` | `/posts/:id`           | Exclusão de publicação.                                 |
| `GET`    | `/catalog/disciplines` | Consulta de disciplinas.                                |
| `GET`    | `/catalog/status`      | Consulta dos status disponíveis no formulário de posts. |
| `GET`    | `/catalog/users`       | Listagem de usuários para a área administrativa.        |
| `POST`   | `/catalog/users`       | Cadastro de professor ou estudante.                     |
| `PUT`    | `/catalog/users/:id`   | Atualização de dados e status do usuário.               |
| `DELETE` | `/catalog/users/:id`   | Exclusão de usuário.                                    |

A tabela descreve os caminhos e métodos chamados pelos serviços do mobile. A disponibilidade efetiva, o formato de resposta e as regras de autorização dependem da versão da API configurada no ambiente.

### Pesquisa e filtros

A pesquisa textual, disciplina e autor são enviados para `/posts/search` por meio dos parâmetros `q`, `discipline` e `author`. Os filtros de série/ano e semestre são aplicados no aplicativo após o retorno dos dados. O hook `usePostDiscovery` também utiliza debounce para o termo digitado e cancela requisições anteriores quando necessário.

A resposta do catálogo é filtrada no mobile para apresentar posts com status `Publicado` na área de consulta e leitura. Isso é um filtro de apresentação: a API deve aplicar autenticação e autorização no servidor e não deve depender da filtragem do aplicativo para proteger rascunhos ou conteúdos arquivados.

## Fluxo de desenvolvimento

```text
┌──────────────────────┐
│    EduBlog Mobile    │
│    React Native      │
│    TypeScript        │
│    Expo SDK 58       │
└──────────┬───────────┘
           │
           ▼
        Expo Go
           │
           ▼
     Celular Android
           │
       ┌───┴───┐
       │       │
      LAN    Tunnel
       │       │
       └───┬───┘
           │
           ▼
    Computador / Expo
           │
           ▼
        API REST
```

## Autenticação e autorização

O fluxo está concentrado em `src/context/AuthContext.tsx`:

1. O usuário informa e-mail e senha na tela de login.
2. `authService` envia as credenciais para `POST /auth/login`.
3. A resposta da API fornece token e dados do usuário.
4. O perfil é normalizado para `PROFESSOR` ou `ALUNO`.
5. Token e usuário são armazenados localmente pelo Expo SecureStore, sob a chave `edublog_session`.
6. Na inicialização seguinte, o aplicativo tenta restaurar a sessão e verifica a expiração (`exp`) do JWT.
7. `Stack.Protected` restringe as áreas autenticadas e o grupo `teacher` ao perfil `PROFESSOR`.

O `jwt-decode` decodifica o conteúdo do token no cliente, mas **não valida sua assinatura**. A API deve validar assinatura, expiração, perfil e permissões em cada operação protegida. A proteção de rotas e a ocultação de ações na interface melhoram a experiência, mas não substituem autorização no servidor.

## TO-DO — melhorias futuras

Os itens abaixo são ideias opcionais de evolução do produto. Não representam requisitos pendentes do Tech Challenge nem fazem parte do escopo funcional necessário para a entrega.

- [ ] **Experiência offline:** avaliar cache local de publicações já consultadas para conexões instáveis.
- [ ] **Personalização visual:** oferecer temas claro e escuro com preferência salva no dispositivo.
- [ ] **Favoritos e lista de leitura:** permitir que usuários salvem publicações para consulta posterior.
- [ ] **Notificações opt-in:** estudar avisos sobre novas publicações e conteúdos relevantes.

## Fluxo de contribuição

1. Atualize a branch de trabalho a partir da `main`.
2. Instale as dependências com `npm ci`.
3. Configure o `.env` local sem versionar credenciais.
4. Organize mudanças por domínio funcional.
5. Execute as verificações relevantes: compatibilidade Expo, TypeScript e testes disponíveis.
6. Teste os fluxos afetados em dispositivo físico quando envolver interface ou integração.
7. Atualize este README quando houver mudanças em rotas, comandos, dependências, endpoints ou comportamento funcional.
8. Abra um Pull Request com resumo, motivação, evidências e impactos da alteração.

## Identificação do projeto

- **Projeto:** EduBlog Mobile.
- **Pacote:** `edublog-mobie`.
- **Entrada do aplicativo:** `expo-router/entry`.
- **API padrão do ambiente de desenvolvimento:** `https://blog-api-dnfx.onrender.com`, configurável por `EXPO_PUBLIC_API_URL`.
