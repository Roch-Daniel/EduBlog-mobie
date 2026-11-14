![EduBlog](./assets/images/eduBlog-logo.png)

# EduBlog Mobile

Aplicativo mobile da plataforma educacional **EduBlog**, desenvolvido com **React Native, TypeScript e Expo**. O projeto integra-se à API REST do EduBlog e oferece recursos de consulta de publicações para estudantes e professores, além de funcionalidades administrativas destinadas ao perfil de professor.

## Sumário

- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e configuração](#instalação-e-configuração)
- [Executar no dispositivo](#executar-no-dispositivo)
  - [LAN — rede local](#lan--rede-local)
  - [Tunnel com ngrok](#tunnel-com-ngrok)
  - [LAN ou Tunnel](#lan-ou-tunnel)
- [Problemas de conexão com o celular](#problemas-de-conexão-com-o-celular)
- [Diagnóstico do projeto](#diagnóstico-do-projeto)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Arquitetura e organização](#arquitetura-e-organização)
- [Integração com a API](#integração-com-a-api)
- [Autenticação e autorização](#autenticação-e-autorização)
- [Testes e verificações](#testes-e-verificações)
- [Limitações e pendências conhecidas](#limitações-e-pendências-conhecidas)
- [Fluxo de contribuição](#fluxo-de-contribuição)

## Visão geral

O EduBlog Mobile tem como objetivo disponibilizar em dispositivos móveis os principais recursos da plataforma de blogging educacional. A aplicação contempla dois perfis principais:

- **Estudante (`ALUNO`):** consulta publicações disponíveis, pesquisa conteúdos, aplica filtros, lê posts e consulta os próprios dados de perfil.
- **Professor (`PROFESSOR`):** utiliza os recursos de consulta e acessa a área administrativa, que contém funcionalidades de gestão de publicações e de cadastros de professores e estudantes.

O aplicativo atua como cliente da API REST existente. A interface coleta as ações do usuário e apresenta os dados; a API permanece responsável pela persistência, validações de negócio e autorização efetiva das operações protegidas.

## Funcionalidades

### Consulta de publicações

- Página inicial com listagem de publicações.
- Cards com título, resumo e informações do autor.
- Pesquisa textual por conteúdo ou autor.
- Filtros por disciplina, autor, série/ano e semestre.
- Navegação por disciplinas cadastradas e ativas.
- Carrossel de publicações destacadas por meio da propriedade `isFeatured`.
- Tela de leitura com o conteúdo completo da publicação.
- Estados de carregamento, erro, ausência de resultados e possibilidade de nova tentativa, conforme a tela.

### Área do professor

- Dashboard com indicadores e acesso às funcionalidades administrativas.
- Criação de publicações por formulário.
- Edição de publicações existentes, com carregamento dos dados atuais.
- Listagem de publicações com pesquisa e filtros.
- Visualização administrativa de uma publicação.
- Exclusão de publicações com confirmação.
- Cadastro, edição, listagem paginada, alteração de status e exclusão de professores e estudantes.

### Perfil e sessão

- Login por meio da API.
- Exibição de nome, nome de usuário, e-mail e perfil do usuário autenticado.
- Persistência local da sessão com Expo SecureStore.
- Restauração da sessão ao iniciar o aplicativo.
- Verificação local da expiração do JWT.
- Encerramento da sessão (logout).

## Tecnologias

Versões declaradas no `package.json` do snapshot analisado:

| Tecnologia                     |                          Versão declarada |
| ------------------------------ | ----------------------------------------: |
| React Native                   |                                  `0.88.0` |
| React                          |                                  `19.3.0` |
| Expo                           |                       `^58.0.19` (SDK 58) |
| Expo Router                    |                                `~58.0.26` |
| TypeScript                     |                                  `~6.0.3` |
| Expo SecureStore               |                                 `~58.0.2` |
| React Native Reanimated        |                                   `4.7.1` |
| React Native Gesture Handler   |                                  `~3.3.0` |
| React Native Safe Area Context |                                 `~5.10.1` |
| Expo Vector Icons              |                                 `^15.0.2` |
| JWT Decode                     |                                  `^4.0.0` |
| `@expo/ngrok`                  | `^4.1.3` (dependência de desenvolvimento) |

A aplicação utiliza componentes funcionais e Hooks do React. A navegação é baseada em arquivos por meio do Expo Router. O projeto também possui configuração de rotas tipadas (`typedRoutes`) e React Compiler no `app.json`.

## Pré-requisitos

- Node.js em versão compatível com o Expo SDK 58.
- npm.
- Aplicativo **Expo Go compatível com o SDK 58** instalado no celular, para executar o projeto no dispositivo físico.
- Conexão com a internet para instalar dependências, acessar a API e utilizar o Tunnel.
- Para utilizar LAN: computador e celular conectados à mesma rede local, com comunicação permitida pelo roteador e pelo firewall.

O fluxo de desenvolvimento da equipe foi realizado em aparelho físico Android com Expo Go, sem depender de emulador. O uso de dispositivo físico permite observar o comportamento da interface e das interações no hardware real. A compatibilidade do Expo Go com o SDK do projeto deve ser conferida antes da execução.

## Instalação e configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/Roch-Daniel/EduBlog-mobie.git
cd EduBlog-mobie
```

O nome do repositório e o nome do pacote mantêm a grafia `mobie`, conforme o projeto publicado.

### 2. Instalar dependências

```bash
npm ci
```

O comando `npm ci` instala as versões registradas no `package-lock.json` e é recomendado para reproduzir o ambiente do projeto. Ao alterar dependências intencionalmente, atualize e versione tanto o `package.json` quanto o `package-lock.json`.

### 3. Configurar a URL da API

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=https://blog-api-dnfx.onrender.com
```

A variável `EXPO_PUBLIC_API_URL` define a URL base utilizada por `src/services/apiClient.ts`. Para utilizar outra instância, substitua o endereço pelo ambiente correspondente.

**Segurança:** variáveis com prefixo `EXPO_PUBLIC_` podem ser incorporadas ao bundle do aplicativo. Não armazene nelas senhas, tokens privados, chaves secretas ou credenciais. O `.gitignore` ignora arquivos `.env*` e permite versionar um `.env.example` sem segredos; o snapshot analisado ainda não contém esse arquivo de exemplo.

### 4. Verificar as dependências do Expo

```bash
npx expo install --check
```

O comando verifica se as dependências Expo estão alinhadas com o SDK utilizado. Se houver divergências, analise as recomendações antes de atualizar versões manualmente.

## Executar no dispositivo

O projeto pode ser iniciado pela rede local (LAN) ou por Tunnel. A escolha depende da conectividade entre o computador e o aparelho celular.

### LAN — rede local

Inicie o servidor de desenvolvimento:

```bash
npm start
```

O Expo inicia o Metro Bundler e apresenta um QR Code no terminal. Abra o **Expo Go** no celular e leia o QR Code.

O fluxo de comunicação em LAN é direto:

```text
Celular
   ↓
Rede Wi-Fi local
   ↓
Computador
   ↓
Expo / Metro Bundler
```

Na conexão LAN, o celular precisa alcançar o servidor de desenvolvimento executado no computador. Em condições normais, os dois dispositivos devem estar na mesma rede local. O roteador e o firewall também precisam permitir a comunicação entre eles.

Quando a conexão LAN funciona corretamente, costuma ser a opção mais simples e não depende de um serviço externo de túnel.

### Tunnel com ngrok

Durante a configuração inicial, a conexão LAN apresentou dificuldades: mesmo com computador e celular conectados à mesma rede Wi-Fi, o Expo Go não concluía o carregamento do projeto pelo QR Code. A equipe investigou a conectividade local e adotou o modo Tunnel como alternativa.

O projeto declara `@expo/ngrok` como dependência local de desenvolvimento no `package.json` e no `package-lock.json`. Portanto, após executar `npm ci`, não é necessário instalar o ngrok globalmente.

Para iniciar pelo script configurado no projeto:

```bash
npm run start:tunnel
```

O script atual executa:

```bash
expo start --tunnel ngrok
```

Também é possível executar diretamente o comando equivalente:

```bash
npx expo start --tunnel ngrok
```

No modo Tunnel, o fluxo de comunicação é intermediado pelo serviço de túnel:

```text
Celular
   ↓
Internet
   ↓
Serviço Tunnel / ngrok
   ↓
Computador
   ↓
Expo / Metro Bundler
```

O Tunnel facilita a conexão do aparelho ao servidor Metro durante o desenvolvimento. Ele **não hospeda a API REST**, não substitui a configuração de `EXPO_PUBLIC_API_URL` e não representa a publicação do aplicativo em produção.

A disponibilidade depende da conexão com a internet e do serviço externo. A URL e o QR Code do túnel podem permitir acesso ao servidor de desenvolvimento a quem os conhecer; não os compartilhe publicamente e encerre o servidor com `Ctrl + C` ao terminar os testes.

### LAN ou Tunnel

| Comando                         | Uso                                                                        |
| ------------------------------- | -------------------------------------------------------------------------- |
| `npm start`                     | Inicialização padrão do Expo, normalmente utilizada com LAN.               |
| `npm run start:tunnel`          | Inicialização usando Tunnel com ngrok, conforme o script atual do projeto. |
| `npx expo start --tunnel ngrok` | Execução direta do mesmo modo Tunnel, sem utilizar o script npm.           |

A LAN utiliza a rede local diretamente e pode oferecer menor latência. O Tunnel é uma alternativa quando firewall, roteador, isolamento entre dispositivos ou outras restrições impedem a conexão local.

## Problemas de conexão com o celular

Se o Expo Go permanecer indefinidamente em **“carregando”**, verifique os itens a seguir:

1. Quando estiver usando LAN, confirme que celular e computador estão conectados à mesma rede Wi-Fi.
2. Confirme que o servidor do Expo/Metro continua em execução no computador.
3. Verifique se a versão do Expo Go é compatível com o SDK utilizado pelo projeto.
4. Verifique se o firewall do Windows permite a comunicação necessária.
5. Confirme que o roteador não está bloqueando a comunicação entre dispositivos conectados à rede (por exemplo, por isolamento de clientes ou de pontos de acesso).
6. Confirme que as dependências foram instaladas corretamente com `npm ci`.
7. Se a LAN continuar indisponível, tente `npm run start:tunnel`.

### Teste de conectividade pela rede local

É possível fazer uma verificação preliminar do acesso ao Metro Bundler usando o navegador do celular. Com o servidor iniciado, tente abrir:

```text
http://IP_DO_COMPUTADOR:8081
```

Para descobrir o endereço IPv4 do computador no Windows, execute no Prompt de Comando:

```cmd
ipconfig
```

Procure o **Endereço IPv4** do adaptador Wi-Fi em uso. Substitua `IP_DO_COMPUTADOR` pelo endereço encontrado e abra a URL no navegador do celular.

Esse teste ajuda a verificar se o aparelho consegue alcançar a porta utilizada pelo servidor de desenvolvimento. Um resultado isolado não garante que todas as etapas de carregamento do aplicativo funcionarão.

### Verificação do firewall e dos perfis de rede do Windows

O Windows utiliza os perfis `Public` e `Private` para aplicar regras diferentes de rede e firewall. Em uma rede doméstica confiável, o perfil `Private` pode facilitar a comunicação entre dispositivos locais. Em redes públicas ou desconhecidas, mantenha o perfil `Public`.

Para consultar o perfil atual, execute no PowerShell:

```powershell
Get-NetConnectionProfile
```

Em uma rede doméstica **confiável**, a alteração para `Private` pode ser feita com PowerShell em modo de administrador, ajustando o nome da interface se necessário:

```powershell
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Private
```

Para retornar ao perfil público:

```powershell
Set-NetConnectionProfile -InterfaceAlias "Wi-Fi" -NetworkCategory Public
```

O nome da interface pode variar conforme a configuração do computador. **Não altere uma rede pública, corporativa ou desconhecida para `Private` apenas para fazer o Expo funcionar.** Primeiro, confirme que a rede é confiável e siga as políticas de segurança aplicáveis.

### Alternativa quando a LAN não funciona

Se a conectividade local continuar bloqueada, utilize o Tunnel configurado no projeto:

```bash
npm run start:tunnel
```

## Diagnóstico do projeto

Para verificar o alinhamento das dependências Expo:

```bash
npx expo install --check
```

Para executar verificações de configuração e compatibilidade:

```bash
npx expo-doctor
```

O `expo-doctor` realiza diversas verificações e pode precisar acessar serviços do Expo pela internet. Se aparecer um erro de conexão, como `ConnectTimeoutError`, isso não significa necessariamente que o código ou as dependências estejam incorretos. Verifique a conectividade e execute o diagnóstico novamente.

Se uma verificação apontar incompatibilidade, analise a mensagem e a documentação correspondente antes de modificar dependências.

## Rotas da aplicação

O Expo Router utiliza grupos de rotas entre parênteses, como `(app)` e `(auth)`. Esses grupos organizam os fluxos e layouts, mas seus nomes não aparecem no caminho público da URL.

| Caminho                       | Tela / finalidade                                                                                | Acesso previsto                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `/`                           | Login quando não autenticado ou página inicial quando autenticado, conforme os grupos protegidos | Público ou autenticado, conforme a sessão |
| `/profile`                    | Exibição dos dados do usuário autenticado                                                        | Usuário autenticado                       |
| `/posts/[id]`                 | Leitura de uma publicação                                                                        | Usuário autenticado                       |
| `/teacher`                    | Redirecionamento para o dashboard do professor                                                   | Professor                                 |
| `/teacher/dashboard`          | Dashboard do professor                                                                           | Professor                                 |
| `/teacher/posts`              | Listagem de posts do professor no snapshot atual                                                 | Professor                                 |
| `/teacher/posts/new`          | Criação de publicação                                                                            | Professor                                 |
| `/teacher/posts/[id]`         | Visualização administrativa de uma publicação                                                    | Professor                                 |
| `/teacher/posts/[id]/edit`    | Edição de publicação                                                                             | Professor                                 |
| `/teacher/users`              | Área administrativa de usuários                                                                  | Professor                                 |
| `/teacher/teachers`           | Listagem de professores                                                                          | Professor                                 |
| `/teacher/teachers/new`       | Cadastro de professor                                                                            | Professor                                 |
| `/teacher/teachers/[id]/edit` | Edição de professor                                                                              | Professor                                 |
| `/teacher/students`           | Listagem de estudantes                                                                           | Professor                                 |
| `/teacher/students/new`       | Cadastro de estudante                                                                            | Professor                                 |
| `/teacher/students/[id]/edit` | Edição de estudante                                                                              | Professor                                 |

Os segmentos dinâmicos `[id]` recebem o identificador do registro pela rota. As telas recuperam esse parâmetro com `useLocalSearchParams()` e o utilizam para consultar ou atualizar a publicação ou o usuário correspondente.

## Arquitetura e organização

A aplicação combina organização por domínio (_feature-based_) com separação de responsabilidades entre navegação, apresentação, estado, serviços e tipagens.

Estrutura simplificada de `src/` no snapshot analisado:

```text
src/
├── app/                         # Rotas e layouts do Expo Router
│   ├── (app)/                   # Área autenticada
│   │   ├── posts/[id].tsx       # Leitura de publicação
│   │   ├── profile.tsx          # Perfil
│   │   └── teacher/             # Área do professor
│   └── (auth)/                  # Fluxo de autenticação
├── components/ui/               # Componentes visuais reutilizáveis
├── context/                     # Context API (autenticação e Toast)
├── features/
│   ├── auth/                    # Telas de autenticação
│   ├── posts/                   # Consulta e gestão de publicações
│   │   ├── components/
│   │   ├── screens/
│   │   ├── utils/
│   │   └── usePostDiscovery.ts
│   └── users/                   # Gestão de professores e estudantes
│       ├── components/
│       ├── constants/
│       ├── screens/
│       └── utils/
├── hooks/                       # Hooks transversais, como useApiClient e useUsers
├── interfaces/                  # Contratos TypeScript
├── services/                    # Comunicação HTTP com a API
├── types/                       # Tipos compartilhados
└── utils/                       # Utilitários transversais
```

### Responsabilidades das camadas

- **`app/`:** define rotas, layouts e regras de navegação. As rotas encaminham para telas e componentes organizados em `features/`.
- **`components/ui/`:** reúne elementos de interface reutilizáveis, como botões, campos de formulário, seleção, paginação, carregamento e notificações.
- **`features/`:** agrupa telas, componentes, estilos e regras relacionadas a cada domínio funcional.
- **`context/`:** compartilha estados globais, como sessão do usuário e notificações.
- **`hooks/`:** encapsula comportamentos reutilizáveis entre telas.
- **`services/`:** centraliza as chamadas aos endpoints e a transformação dos dados recebidos.
- **`interfaces/` e `types/`:** definem contratos e tipos utilizados pelo TypeScript.
- **`utils/`:** contém funções auxiliares reutilizáveis.

### Fluxo de comunicação

```text
Tela / componente
      ↓
Hook (estado, filtros e ciclo de vida)
      ↓
Serviço de domínio (postsService ou usersService)
      ↓
Cliente HTTP (apiClient)
      ↓
API REST do EduBlog
      ↓
Resposta → normalização → atualização do estado → interface
```

## Integração com a API

### Configuração do cliente HTTP

`src/services/apiClient.ts` centraliza as chamadas HTTP com `fetch`, monta a URL base a partir de `EXPO_PUBLIC_API_URL`, configura cabeçalhos, serializa corpos JSON, anexa o token Bearer quando disponível e converte respostas não exitosas em `ApiError`.

`src/hooks/useApiClient.ts` fornece a função `request` às telas e aos serviços, associando as requisições ao token da sessão e ao fluxo de tratamento de HTTP 401.

Os serviços organizam as operações por domínio:

- `authService.ts`: autenticação.
- `postsService.ts`: consulta, pesquisa, leitura, criação, atualização e exclusão de publicações; consulta de disciplinas e status.
- `usersService.ts`: consulta, criação, atualização e exclusão de usuários.

### Endpoints utilizados pelo mobile

| Método   | Endpoint               | Finalidade                                           |
| -------- | ---------------------- | ---------------------------------------------------- |
| `POST`   | `/auth/login`          | Autenticação e obtenção do token e dados do usuário. |
| `GET`    | `/posts`               | Consulta do catálogo de publicações.                 |
| `GET`    | `/posts/search`        | Pesquisa por texto e filtros enviados à API.         |
| `GET`    | `/posts/:id`           | Consulta de uma publicação específica.               |
| `GET`    | `/posts/all`           | Consulta administrativa de publicações.              |
| `POST`   | `/posts`               | Criação de publicação.                               |
| `PUT`    | `/posts/:id`           | Atualização de publicação.                           |
| `DELETE` | `/posts/:id`           | Exclusão de publicação.                              |
| `GET`    | `/catalog/disciplines` | Consulta de disciplinas.                             |
| `GET`    | `/catalog/status`      | Consulta de status de publicação.                    |
| `GET`    | `/catalog/users`       | Consulta da lista de usuários.                       |
| `POST`   | `/catalog/users`       | Cadastro de professor ou estudante.                  |
| `PUT`    | `/catalog/users/:id`   | Atualização de usuário.                              |
| `DELETE` | `/catalog/users/:id`   | Exclusão de usuário.                                 |

Os caminhos acima refletem as chamadas encontradas nos serviços do snapshot. A disponibilidade, os formatos de resposta e as regras de autorização precisam ser compatíveis com a versão do back-end utilizada no ambiente.

### Busca e filtros

A pesquisa textual, a disciplina e o autor podem ser enviados para `/posts/search` por meio dos parâmetros `q`, `discipline` e `author`. Série/ano e semestre são aplicados no aplicativo sobre os dados retornados, conforme a implementação atual do `usePostDiscovery` e dos utilitários de posts.

A montagem dos parâmetros de consulta utiliza `URLSearchParams`, evitando a concatenação manual de valores na URL.

## Autenticação e autorização

O fluxo de sessão está concentrado em `src/context/AuthContext.tsx`:

1. O usuário informa e-mail e senha na tela de login.
2. `authService` envia as credenciais para `POST /auth/login`.
3. A API retorna o token e os dados do usuário.
4. O perfil é normalizado para `PROFESSOR` ou `ALUNO`.
5. A sessão é armazenada localmente pelo `expo-secure-store`, usando a chave `edublog_session`.
6. Na inicialização seguinte, o aplicativo tenta restaurar a sessão e verifica a expiração (`exp`) do JWT.
7. `Stack.Protected` restringe os grupos de rotas de acordo com a autenticação e o papel do usuário.

O `jwt-decode` decodifica o conteúdo do token no cliente, mas **não valida a assinatura do JWT**. A API deve validar assinatura, expiração e permissões em todas as operações protegidas.

A proteção das rotas e a ocultação de botões melhoram a experiência de uso, mas não substituem a autorização no servidor. A API deve impedir que um estudante crie, atualize ou exclua publicações ou gerencie cadastros, mesmo que tente chamar os endpoints diretamente.

**Ponto de validação de segurança:** no snapshot analisado, a camada mobile filtra publicações por status antes de exibi-las. O back-end precisa assegurar que respostas destinadas a estudantes não contenham rascunhos ou publicações arquivadas sem autorização. Essa regra não pode ser certificada apenas pela análise do código mobile.

## Testes e verificações

### Verificação de dependências e configuração

```bash
npx expo install --check
npx expo-doctor
```

### Verificação de tipos TypeScript

```bash
npx tsc --noEmit
```

### Testes de navegação por perfil

O projeto também contém `scripts/test-professor-navigation.mjs`. Depois de instalar as dependências, execute:

```bash
node --test scripts/test-professor-navigation.mjs
```

Esse script verifica aspectos estruturais de navegação com dependências simuladas; ele não substitui testes de navegação executados no aplicativo real.

### Lint

O `package.json` declara o comando:

```bash
npm run lint
```

A configuração e as dependências de ESLint devem estar disponíveis no ambiente para que o comando funcione. No snapshot analisado, não foi identificada uma configuração ESLint dedicada na raiz nem as dependências `eslint` e `eslint-config-expo` declaradas diretamente; portanto, o lint precisa ser configurado e validado antes de ser tratado como verificação obrigatória da equipe.

## Fluxo de contribuição

1. Atualize a branch de trabalho a partir da `main`.
2. Instale as dependências com `npm ci`.
3. Configure o `.env` local sem versionar credenciais.
4. Implemente mudanças pequenas e organizadas por domínio.
5. Execute as verificações relevantes: compatibilidade Expo, TypeScript e testes disponíveis.
6. Teste os fluxos afetados em dispositivo físico quando envolver interface ou integração.
7. Atualize este README quando houver mudanças em rotas, comandos, dependências, endpoints ou comportamento funcional.
8. Abra um Pull Request com resumo, motivação, evidências e limitações conhecidas.

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

## TO-DO — melhorias futuras

Os itens abaixo são ideias opcionais de evolução do produto. Eles não representam requisitos pendentes do Tech Challenge nem fazem parte do escopo funcional necessário para a entrega.

- **Experiência offline:** avaliar cache local de publicações já consultadas para facilitar o acesso em conexões instáveis.
- **Personalização visual:** oferecer temas claro e escuro, com preferência salva no dispositivo.
- **Favoritos e lista de leitura:** permitir que cada usuário salve publicações para consultá-las novamente com facilidade.
- **Notificações:** estudar notificações opt-in para avisar sobre novas publicações e conteúdos relevantes.
- **Qualidade de código:** consolidar a configuração de análise estática com ESLint e incorporá-la ao fluxo de desenvolvimento.

## Identificação do projeto

- **Projeto:** EduBlog Mobile.
- **Repositório:** https://github.com/Roch-Daniel/EduBlog-mobie
- **Pacote:** `edublog-mobie`.
- **Entrada do aplicativo:** `expo-router/entry`.
- **API padrão do ambiente de desenvolvimento:** `https://blog-api-dnfx.onrender.com` (configurável por `EXPO_PUBLIC_API_URL`).
