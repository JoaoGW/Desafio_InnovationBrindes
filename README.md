# Innovation Brindes - Desafio Front End

Aplicação Next.js para listagem de produtos com sistema de autenticação, favoritos e funcionalidades avançadas de filtro/ordenação.

## Tecnologias

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **Zustand** (gerenciamento de estado com persist)
- **React Query** (cache e sincronização de dados)
- **Axios** (client HTTP com interceptor)
- **Lucide React** (ícones)
- **Playwright** (testes E2E)

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
npm start
```

Acesse [http://localhost:3000](http://localhost:3000)

## Como rodar Docker

### Produção (build otimizado)

```bash
# Build da imagem
docker-compose build app

# Subir container em produção
docker-compose up app

# Rodar em background
docker-compose up -d app

# Parar containers
docker-compose down
```

### Desenvolvimento (hot reload)

```bash
# Subir ambiente de desenvolvimento
docker-compose --profile dev up dev

# Acessa em: http://localhost:3001
```

**Estrutura Docker:**

- **Dockerfile**: Imagem simples com Node 20 Alpine (copiar → instalar → build → start)
- **docker-compose.yml**: Orquestração com 2 serviços (produção na porta 3000, dev na porta 3001)
- **.dockerignore**: Arquivos excluídos da imagem

**Benefícios:**

- Usa Node Alpine (imagem leve ~40MB base)
- Build direto sem complexidade de multi-stage
- Fácil de entender e debugar

## Decisões técnicas

### Arquitetura e Estado

**Zustand com Persist Middleware**: Escolhido para gerenciar autenticação e favoritos pela simplicidade e performance. O middleware `persist` garante que token e favoritos sobrevivam ao reload da página sem configuração adicional.

**React Query**: Implementado para cache inteligente de produtos com `staleTime` de 1 minuto e `gcTime` de 5 minutos, reduzindo chamadas desnecessárias à API e melhorando UX com dados instantâneos em navegações subsequentes.

**Separação de Lógica de Negócio**: Funções puras extraídas para `services/produtos.utils.ts` (formatação de preço, validação, ordenação, filtros) permitem testes unitários isolados sem mock de React/DOM.

### Performance e Otimização

**Debounce na Busca**: 400ms de delay evita bombardeio da API durante digitação rápida, reduzindo carga no servidor e melhorando responsividade.

**Paginação Client-Side**: 20 produtos por lote com botão "Carregar mais" balanceia performance inicial (menos renderizações) com UX fluida (scroll infinito simplificado).

**Memoização Estratégica**: `useMemo` em todas as transformações de lista (validação, filtro de favoritos, ordenação, slice de paginação) previne re-cálculos desnecessários em re-renders.

### Acessibilidade

**Labels Semânticas**: Todos inputs/selects possuem `<label>` associado via `htmlFor`, alguns com classe `sr-only` para manter design limpo sem comprometer leitores de tela.

**Focus Trap Manual**: Modal implementa navegação por Tab/Shift+Tab cíclica entre elementos focáveis, garantindo usuários de teclado não "escapem" da modal acidentalmente.

**Contraste de Cores**: Ajustado de `#7a7a7a` para `#555555` e `#9a9a9a` para `#777777` para atingir ratio WCAG AA (4.5:1 mínimo).

**ARIA Attributes**: `aria-modal`, `aria-labelledby`, `aria-label` em botões de ícone e `aria-hidden` em decorações garantem contexto para tecnologias assistivas.

### Autenticação e Segurança

**Interceptor 401**: Axios configurado para capturar erros de autenticação, limpar store via `logout()` e redirecionar automaticamente para `/login`, evitando estados inconsistentes.

**Hidratação Controlada**: Flag `isHydrated` no Zustand impede redirecionamento prematuro antes do localStorage carregar token, resolvendo loop de redirect em page reload.

**Token Bearer**: Enviado em todos requests autenticados via header `Authorization`, seguindo padrão OAuth 2.0.

### Testes

**Testes Unitários Nativos**: Node.js `test` runner (sem Jest) para funções puras, evitando configuração adicional e mantendo stack enxuta.

**Playwright E2E**: Fluxo crítico de login → redirect → grid renderizado validado com seletores semânticos (`getByRole`, `getByPlaceholder`, `getByTestId`).

**Funções Testáveis**: Lógica de preço, validação e ordenação isolada em módulo `utils` permite TDD sem acoplamento com componentes React.

### Docker

**Alpine Linux**: Base Node 20 Alpine (~40MB vs ~900MB da imagem padrão) acelera pull/push e reduz superfície de ataque sem adicionar complexidade.

**Estrutura Clara**: Cada comando tem propósito óbvio: `WORKDIR` define pasta, `COPY` traz arquivos, `RUN` executa comandos, `EXPOSE` declara porta, `CMD` inicia app.

## O que ficou pendente

Nada ficou pendente. Todas as funcionalidades solicitadas foram implementadas.

## Lighthouse

Rota /login:

<img width="590" height="756" alt="Image" src="https://github.com/user-attachments/assets/65c3e6f4-0afe-443a-b147-0fd817fc4fd6" />

Rota /produtos:

<img width="594" height="750" alt="Image" src="https://github.com/user-attachments/assets/ae2efb6b-4b15-4880-bde0-0678b933ec34" />

## Fluxo

Link para o Drive com o vídeo em MP4: [Vídeo do Fluxo](https://drive.google.com/file/d/1wOdIJm4Vsihfws7pOlxwbk_5ZgA5b4am/view?usp=sharing)
