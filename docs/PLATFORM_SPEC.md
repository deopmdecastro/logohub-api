# LogoHub — Especificação Funcional da Plataforma

Este documento descreve, em detalhe, todas as páginas e funcionalidades da plataforma LogoHub para os dois perfis de utilizador: **Consumidor** e **Criador**. Serve como referência para desenho de produto, arquitetura de backend e implementação de frontend.

> Convenções: todos os endpoints assumem prefixo `/api/v1`. Autenticação via `Authorization: Bearer <JWT>` exceto onde indicado. Todos os modelos de dados são ilustrativos e devem ser adaptados ao schema Prisma real do projeto.

---

## Índice

1. [Perfil: Consumidor](#perfil-consumidor)
   - 1.1 Dashboard Principal
   - 1.2 Catálogo de APIs
   - 1.3 Explorar APIs
   - 1.4 Documentação da API
   - 1.5 API Playground
   - 1.6 Gestão de API Keys
   - 1.7 Gestão de Projetos
   - 1.8 Analytics de Utilização
   - 1.9 Consumo por Período
   - 1.10 Limites e Quotas
   - 1.11 Plano/Subscrição
   - 1.12 Faturação e Histórico de Pagamentos
   - 1.13 Conta e Perfil
   - 1.14 Segurança (2FA, Sessões, Dispositivos)
   - 1.15 Centro de Notificações
   - 1.16 Centro de Suporte
   - 1.17 Changelog e Novidades
   - 1.18 Configurações
2. [Perfil: Criador](#perfil-criador)
   - 2.1 Dashboard do Criador
   - 2.2 Gestão de APIs
   - 2.3 Criar Nova API
   - 2.4 Editar API
   - 2.5 Gestão de Versões
   - 2.6 Gestão de Documentação
   - 2.7 Gestão de Endpoints
   - 2.8 Configuração de Autenticação
   - 2.9 Gestão de Exemplos
   - 2.10 Gestão de SDKs
   - 2.11 Publicação e Estado da API
   - 2.12 Analytics da API
   - 2.13 Logs
   - 2.14 Monitorização
   - 2.15 Gestão de Erros
   - 2.16 Permissões e Colaboradores
   - 2.17 Marketplace de APIs
   - 2.18 Feedback e Avaliações
   - 2.19 Monetização
3. [Arquitetura de Backend Transversal](#arquitetura-de-backend-transversal)
4. [Modelos de Dados Globais](#modelos-de-dados-globais)
5. [Regras de Negócio Transversais](#regras-de-negócio-transversais)
6. [Segurança, Performance e Escalabilidade](#segurança-performance-e-escalabilidade)

---

## Perfil: Consumidor

### 1.1 Dashboard Principal

**Objetivo:** Dar ao consumidor uma visão imediata do estado da sua conta — consumo, keys ativas, plano atual e alertas relevantes — para que decida rapidamente se precisa de agir (ex: aumentar plano, rever erros).

**Layout e estrutura:**
- Sidebar de navegação fixa à esquerda (Dashboard, Catálogo, Projetos, API Keys, Analytics, Faturação, Suporte, Definições).
- Header superior com seletor de projeto ativo, avatar/menu de conta, sino de notificações.
- Grid principal em cards: (a) resumo de requests do mês vs limite do plano, (b) gráfico de utilização últimos 30 dias, (c) top 3 APIs mais usadas, (d) últimas keys criadas, (e) alertas de quota/erros recentes, (f) atalhos rápidos ("Nova API Key", "Explorar APIs", "Ver Faturação").

**Componentes de interface:**
- `UsageSummaryCard`, `LineChart` (requests/dia), `DonutChart` (distribuição por API), `RecentKeysTable`, `AlertBanner`, `QuickActionButtons`.

**Estados:**
- *Loading*: skeletons nos cards enquanto carrega métricas agregadas.
- *Vazio*: conta nova sem consumo → CTA central "Cria a tua primeira API Key" e link para o catálogo.
- *Erro*: falha ao obter métricas → banner com opção "Tentar novamente", mantendo os restantes cards funcionais (fail isolation por card).
- *Sucesso*: dados renderizados com timestamps de última atualização.

**Ações disponíveis:** trocar de projeto ativo, criar API key rapidamente, navegar para qualquer secção, marcar alertas como lidos.

**Fluxos de navegação:** entrada por defeito após login → pode navegar para Catálogo, API Keys, Analytics ou Faturação a partir dos cards.

**Permissões:** visível a qualquer utilizador autenticado com role `consumer`; dados filtrados pelo projeto/organização selecionado.

**Integrações com APIs / Endpoints necessários:**
- `GET /consumer/dashboard/summary` — agregados de uso, keys, alertas.
- `GET /consumer/usage/timeseries?range=30d`
- `GET /consumer/projects/{id}/top-apis`

**Estrutura do backend:** serviço `DashboardAggregationService` que consulta a tabela de `usage_metrics` (pré-agregada por job periódico) em vez de calcular em tempo real sobre logs brutos, para performance.

**Modelos de dados:** `UsageMetric(project_id, api_id, date, request_count, error_count, avg_latency_ms)`.

**Regras de negócio:** métricas agregadas com atraso máximo de 5 minutos (near real-time); alertas de quota disparados a 80% e 100% do limite do plano.

**Casos de utilização:** consumidor verifica rapidamente se está perto do limite antes de lançar uma campanha que aumenta tráfego.

**Boas práticas UX/UI:** hierarquia visual clara (número grande + tendência), cores semânticas (verde/amarelo/vermelho) para consumo vs limite, nunca mais de 6 cards visíveis sem scroll.

**Responsividade:** grid de cards colapsa para 1 coluna em mobile; sidebar vira menu hambúrguer.

**Escalabilidade:** dados pré-agregados via cron/stream processing (ex: janelas de 1 min) para suportar milhões de requests/dia sem sobrecarregar queries do dashboard.

**Segurança:** todos os endpoints validam `project_id` pertence ao utilizador autenticado (evitar IDOR).

**Performance:** cache de 60s no agregado do dashboard por projeto (Redis), invalidado por evento de novo uso relevante.

---

### 1.2 Catálogo de APIs

**Objetivo:** Apresentar todas as APIs disponíveis na plataforma (Logotipos, Ícones, Brands, Assets, futuras) para descoberta e comparação.

**Layout e estrutura:** grelha de cards de API com filtros laterais (categoria, popularidade, gratuita/paga) e barra de pesquisa no topo.

**Componentes de interface:** `ApiCard` (nome, ícone, descrição curta, badge de estado — Public/Beta, rating), `FilterSidebar`, `SearchBar`, `SortDropdown` (popularidade, recente, alfabética).

**Estados:**
- *Loading*: skeleton grid.
- *Vazio*: pesquisa sem resultados → sugestão de limpar filtros.
- *Erro*: toast de erro + botão retry.
- *Sucesso*: grid paginado/infinite scroll.

**Ações disponíveis:** pesquisar, filtrar, ordenar, clicar numa API para abrir a página de documentação, favoritar uma API.

**Fluxos de navegação:** Catálogo → Documentação da API → Playground / Gestão de API Keys (para gerar key para essa API).

**Permissões:** público (visível mesmo sem login, mas ações como "favoritar" exigem sessão).

**Integrações com APIs / Endpoints:**
- `GET /catalog/apis?category=&sort=&page=`
- `POST /catalog/apis/{id}/favorite`

**Estrutura do backend:** índice de pesquisa (ex: Postgres full-text ou Elasticsearch/Meilisearch) sobre metadados públicos de APIs publicadas.

**Modelos de dados:** `Api(id, name, slug, category, description, status, owner_id, rating_avg, rating_count, pricing_model)`.

**Regras de negócio:** apenas APIs com estado `Public` aparecem no catálogo; APIs `Beta` aparecem com badge visível apenas se o criador optar por listagem antecipada.

**Casos de utilização:** novo consumidor explora o catálogo para decidir qual API integrar no seu produto.

**Boas práticas UX/UI:** cards consistentes, informação de preço visível sem necessidade de clicar, rating visível para confiança.

**Responsividade:** grid de 4→2→1 colunas conforme largura do ecrã.

**Escalabilidade:** paginação cursor-based para catálogos com milhares de APIs.

**Segurança:** sanitização de inputs de pesquisa; rate limiting no endpoint de pesquisa para evitar scraping abusivo.

**Performance:** cache CDN para listagens públicas (TTL curto, ex: 60s) já que o catálogo é maioritariamente leitura.

---

### 1.3 Explorar APIs

**Objetivo:** Permitir navegação aprofundada dentro de uma categoria específica (Logotipos, Ícones, Brands, Assets) com pré-visualização de resultados/exemplos antes de integrar.

**Layout e estrutura:** layout de duas colunas — filtros de categoria/subcategoria à esquerda, grelha de pré-visualizações (ex: thumbnails de logos/ícones) à direita.

**Componentes de interface:** `CategoryTree`, `AssetPreviewGrid`, `AssetPreviewModal` (com detalhes: formatos disponíveis, tags, dimensões), `TryInPlaygroundButton`.

**Estados:** loading (skeleton thumbnails), vazio (categoria sem assets), erro (falha a carregar preview), sucesso.

**Ações disponíveis:** pré-visualizar asset, copiar exemplo de request, ir diretamente para o Playground pré-preenchido com esse asset.

**Fluxos de navegação:** Explorar → modal de detalhe → Playground ou Documentação.

**Permissões:** público para pré-visualização; download/consumo real exige API Key válida.

**Integrações com APIs / Endpoints:**
- `GET /explore/{category}/items?tags=&format=`
- `GET /explore/{category}/items/{id}`

**Estrutura do backend:** serviço de catálogo de assets com armazenamento de metadados (tags, formatos, dimensões) separado do binário (CDN/object storage).

**Modelos de dados:** `Asset(id, api_id, name, category, tags[], formats[], preview_url, created_at)`.

**Regras de negócio:** pré-visualizações servidas em baixa resolução/watermark quando aplicável para proteger o conteúdo original até haver consumo autenticado.

**Casos de utilização:** developer procura um ícone específico de "shopping-cart" antes de decidir integrar a API de Ícones.

**Boas práticas UX/UI:** pesquisa com autocomplete de tags, preview instantâneo ao hover.

**Responsividade:** grid adaptativo tipo masonry para thumbnails de proporções variadas.

**Escalabilidade:** CDN para todos os assets de preview; lazy loading/virtualização da grelha para milhares de itens.

**Segurança:** proteção contra hotlinking de assets originais (apenas via API autenticada).

**Performance:** thumbnails otimizadas (WebP/AVIF), lazy load com intersection observer.

---

### 1.4 Página de Documentação de Cada API

**Objetivo:** Fornecer documentação técnica completa e navegável de uma API específica, para que o consumidor consiga integrá-la sem suporte adicional.

**Layout e estrutura:** layout de 3 colunas — índice de endpoints à esquerda, conteúdo (descrição, parâmetros, exemplos) ao centro, exemplos de código/resposta à direita (estilo Stripe/Swagger docs).

**Componentes de interface:** `EndpointSidebarNav`, `MarkdownRenderer`, `ParameterTable`, `CodeSampleTabs` (cURL, JS, Python, etc.), `ResponseExample`, `TryItButton` (abre Playground), `VersionSelector`.

**Estados:** loading (skeleton de secções), vazio (endpoint sem exemplos ainda — mostra apenas schema), erro (versão de docs não encontrada → fallback para versão estável mais recente), sucesso.

**Ações disponíveis:** trocar versão da API, copiar código de exemplo, abrir playground pré-preenchido, aceder a changelog da API.

**Fluxos de navegação:** Catálogo/Explorar → Documentação → Playground ou Gestão de API Keys (se ainda não tiver key).

**Permissões:** documentação pública para leitura; "Try it" com execução real exige API Key.

**Integrações com APIs / Endpoints:**
- `GET /apis/{slug}/docs?version=`
- `GET /apis/{slug}/versions`

**Estrutura do backend:** conteúdo de documentação armazenado como markdown/MDX versionado, associado a cada versão publicada da API (imutável após publicação, exceto correções menores).

**Modelos de dados:** `ApiDocVersion(id, api_id, version, content_markdown, endpoints_schema_json, published_at)`.

**Regras de negócio:** documentação de versões `Deprecated` mostra banner de aviso com data de fim de suporte e link para a versão atual.

**Casos de utilização:** developer integra endpoint `GET /logos/{id}` e precisa de confirmar formatos de resposta suportados.

**Boas práticas UX/UI:** deep-linking por âncora para cada endpoint, syntax highlighting, "copy to clipboard" em todos os blocos de código.

**Responsividade:** em mobile, colunas colapsam em tabs (Docs / Exemplos).

**Escalabilidade:** conteúdo servido via CDN estático sempre que possível (docs raramente mudam).

**Segurança:** sanitização de markdown renderizado para evitar XSS em conteúdo submetido por criadores.

**Performance:** pré-renderização (SSG) das páginas de documentação públicas.

---

### 1.5 Testador de APIs (API Playground)

**Objetivo:** Permitir testar endpoints reais da API diretamente no browser, com a própria API Key do consumidor, sem necessidade de ferramentas externas (Postman, etc.).

**Layout e estrutura:** editor de request à esquerda (método, URL, headers, body), painel de resposta à direita (status, headers, body formatado, tempo de resposta).

**Componentes de interface:** `MethodSelector`, `UrlBuilder` (com parâmetros dinâmicos), `HeadersEditor`, `BodyEditor` (JSON com validação), `ApiKeySelector`, `SendButton`, `ResponseViewer`, `RequestHistoryList`.

**Estados:** loading (spinner no botão Send + skeleton na resposta), vazio (sem histórico ainda), erro (erro de rede ou 4xx/5xx destacado a vermelho com explicação), sucesso (resposta 2xx com syntax highlighting).

**Ações disponíveis:** selecionar/gerar API key, editar parâmetros, enviar pedido, guardar request como exemplo, ver histórico de pedidos anteriores, exportar como cURL/código.

**Fluxos de navegação:** acedido a partir da Documentação ou diretamente do Dashboard; após teste, pode ir para Analytics para ver o request refletido nas métricas.

**Permissões:** exige API Key válida do próprio utilizador; requests contam para a quota do plano.

**Integrações com APIs / Endpoints:**
- Proxy: `POST /playground/execute` (encaminha para o endpoint real da API selecionada, injeta a key do utilizador).
- `GET /playground/history`

**Estrutura do backend:** serviço proxy que regista o request no sistema de métricas como "playground request", sujeito às mesmas regras de rate limiting/quota que um pedido normal.

**Modelos de dados:** `PlaygroundRequest(id, user_id, api_id, method, url, headers_json, body_json, response_status, response_time_ms, created_at)`.

**Regras de negócio:** requests de playground consomem quota real (para refletir uso genuíno), mas são marcados com uma flag `source=playground` para distinção em analytics.

**Casos de utilização:** developer testa autenticação e parâmetros antes de escrever código de integração.

**Boas práticas UX/UI:** autocomplete de parâmetros a partir do schema da API, validação inline antes de enviar, atalhos de teclado (Cmd+Enter para enviar).

**Responsividade:** em mobile, painéis de request/resposta em tabs verticais.

**Escalabilidade:** proxy stateless, horizontally scalable; histórico paginado.

**Segurança:** nunca expor a API key completa no DOM/histórico partilhado; sandboxing do proxy para evitar SSRF (whitelisting de hosts de destino).

**Performance:** timeout configurável no proxy (ex: 30s) para não bloquear recursos indefinidamente.

---

### 1.6 Gestão de API Keys

**Objetivo:** Permitir gerar, visualizar (parcialmente), revogar e organizar API Keys por projeto.

**Layout e estrutura:** tabela de keys (nome, prefixo visível, projeto associado, scopes, último uso, estado) com botão "Nova API Key" em destaque.

**Componentes de interface:** `ApiKeyTable`, `CreateKeyModal` (nome, projeto, scopes/permissões, expiração opcional), `RevealSecretOnceModal`, `RevokeConfirmDialog`, `ScopeBadges`.

**Estados:** loading (skeleton table), vazio (sem keys — CTA central), erro (falha ao revogar → toast), sucesso.

**Ações disponíveis:** criar key, definir scopes/permissões, definir expiração, revogar key, renomear, ver estatísticas de uso por key.

**Fluxos de navegação:** Dashboard/Catálogo → Gestão de API Keys → Playground (usa a key criada) → Analytics (filtrado por key).

**Permissões:** cada utilizador só vê/gere as keys dos seus próprios projetos; em contas de equipa, permissões controlam quem pode criar/revogar.

**Integrações com APIs / Endpoints:**
- `GET /api-keys?project_id=`
- `POST /api-keys` (retorna o secret **uma única vez**)
- `DELETE /api-keys/{id}`
- `PATCH /api-keys/{id}` (renomear, alterar scopes)

**Estrutura do backend:** o secret da key é gerado com alta entropia, hasheado (ex: SHA-256) e armazenado apenas o hash; apenas o prefixo (ex: primeiros 8 caracteres) é guardado em claro para identificação.

**Modelos de dados:** `ApiKey(id, project_id, name, key_prefix, key_hash, scopes[], expires_at, last_used_at, revoked_at, created_by)`.

**Regras de negócio:** o valor completo da key só é mostrado no momento da criação; revogação é imediata e propagada a todos os edge nodes de autenticação em <60s.

**Casos de utilização:** equipa cria uma key só de leitura para o ambiente de staging e outra full-access para produção.

**Boas práticas UX/UI:** aviso explícito "Guarda esta chave agora — não a vais voltar a ver", confirmação com digitação do nome antes de revogar.

**Responsividade:** tabela colapsa para cards em mobile.

**Escalabilidade:** validação de keys via cache distribuído (Redis) para não bater na base de dados em cada pedido.

**Segurança:** rotação recomendada a cada X meses (aviso automático); nunca logar o secret completo em nenhum sistema.

**Performance:** invalidação de cache de key em <1s após revogação.

---

### 1.7 Gestão de Projetos

**Objetivo:** Organizar API Keys, consumo e configurações por "projeto" (ex: app de produção, staging, app móvel).

**Layout e estrutura:** lista de projetos em cards, cada um com nome, nº de keys, consumo do mês, botão de acesso rápido às definições do projeto.

**Componentes de interface:** `ProjectCard`, `CreateProjectModal`, `ProjectSettingsPanel`, `MembersList` (se aplicável ao plano), `DangerZone` (eliminar projeto).

**Estados:** loading, vazio (nenhum projeto — cria-se um por defeito no onboarding), erro, sucesso.

**Ações disponíveis:** criar, renomear, arquivar/eliminar projeto, convidar membros (planos de equipa), transferir propriedade.

**Fluxos de navegação:** Projetos → API Keys (filtradas por projeto) → Analytics (filtrado por projeto).

**Permissões:** owner do projeto tem controlo total; membros convidados têm permissões conforme role (viewer, developer, admin do projeto).

**Integrações com APIs / Endpoints:**
- `GET /projects`
- `POST /projects`
- `PATCH /projects/{id}`
- `DELETE /projects/{id}`
- `POST /projects/{id}/members`

**Estrutura do backend:** `Project` como entidade central que agrupa `ApiKey`, `UsageMetric` e `Webhook`; eliminação em cascade controlada (soft delete com período de graça).

**Modelos de dados:** `Project(id, org_id, name, created_by, created_at, archived_at)`, `ProjectMember(project_id, user_id, role)`.

**Regras de negócio:** eliminar um projeto revoga automaticamente todas as suas API Keys; não é possível eliminar o único projeto de uma conta sem criar outro primeiro.

**Casos de utilização:** empresa separa consumo de "App iOS" e "App Android" para faturação e análise independentes.

**Boas práticas UX/UI:** confirmação forte (digitar nome do projeto) antes de eliminar; indicação clara de quantas keys/quanta faturação está associada.

**Responsividade:** cards em coluna única em mobile.

**Escalabilidade:** suporta múltiplos projetos por organização sem limite rígido (exceto por plano).

**Segurança:** verificação de permissão em cada operação (owner/admin apenas para eliminar).

**Performance:** contadores de uso por projeto pré-agregados, não calculados on-the-fly.

---

### 1.8 Analytics de Utilização

**Objetivo:** Dar visibilidade detalhada sobre como as APIs estão a ser consumidas — volume, latência, erros, distribuição geográfica/endpoint.

**Layout e estrutura:** filtros no topo (período, projeto, API, key), seguidos de gráficos: requests ao longo do tempo, taxa de erro, latência p50/p95/p99, top endpoints, top status codes.

**Componentes de interface:** `DateRangePicker`, `MultiSelectFilter`, `TimeSeriesChart`, `LatencyPercentileChart`, `ErrorRateChart`, `TopEndpointsTable`, `ExportButton`.

**Estados:** loading (skeleton charts), vazio (sem tráfego no período), erro (falha ao agregar — retry), sucesso.

**Ações disponíveis:** filtrar por dimensão, comparar períodos, exportar CSV/PDF, criar alerta a partir de um gráfico (ex: "avisa-me se erro > 5%").

**Fluxos de navegação:** Dashboard → Analytics → Consumo por Período (drill-down) → Suporte (se detetar anomalia e quiser abrir ticket).

**Permissões:** visível ao owner e membros com permissão de leitura de analytics no projeto.

**Integrações com APIs / Endpoints:**
- `GET /analytics/usage?project_id=&api_id=&from=&to=&granularity=`
- `GET /analytics/errors`
- `GET /analytics/latency`
- `POST /analytics/export`

**Estrutura do backend:** pipeline de agregação (ex: stream processing tipo Kafka+ClickHouse, ou tabelas de agregação em Postgres com materialized views) separado da base transacional para não degradar performance da API principal.

**Modelos de dados:** `UsageMetric` (já definido), `LatencySample(api_id, endpoint, p50, p95, p99, date)`.

**Regras de negócio:** dados detalhados (request-level) retidos por período limitado (ex: 30-90 dias conforme plano); agregados diários retidos indefinidamente.

**Casos de utilização:** equipa identifica pico de erros 429 e decide fazer upgrade de plano antes que afete produção.

**Boas práticas UX/UI:** comparação visual clara entre períodos (ex: "vs mês anterior"), tooltips com valores exatos ao hover.

**Responsividade:** gráficos redimensionáveis, tabelas com scroll horizontal em mobile.

**Escalabilidade:** agregações pré-computadas para evitar table scans sobre biliões de linhas de log.

**Segurança:** exportações assinadas/expiráveis (link temporário), nunca expor dados de outros projetos no export.

**Performance:** queries de analytics com timeout e cache de resultados por combinação de filtros (ex: 5 min).

---

### 1.9 Consumo por Período

**Objetivo:** Vista focada e detalhada de consumo (requests, custos associados) segmentada por dia/semana/mês, para reconciliação com faturação.

**Layout e estrutura:** tabela detalhada por período com totais, ao lado de um resumo de custo estimado do ciclo atual.

**Componentes de interface:** `PeriodSelector`, `UsageTable` (data, requests, overage, custo), `CostEstimateCard`, `DownloadInvoicePreviewButton`.

**Estados:** loading, vazio (novo ciclo sem dados ainda), erro, sucesso.

**Ações disponíveis:** mudar período, exportar tabela, navegar para faturação para ver a fatura real gerada.

**Fluxos de navegação:** Analytics → Consumo por Período → Faturação e Histórico de Pagamentos.

**Permissões:** owner e membros com acesso a billing/analytics.

**Integrações com APIs / Endpoints:**
- `GET /billing/usage-breakdown?period=`

**Estrutura do backend:** reutiliza `UsageMetric` agregado, cruzado com `PricingTier` do plano para calcular custo estimado (overage acima da quota incluída).

**Modelos de dados:** `PricingTier(plan_id, included_requests, overage_price_per_1000, currency)`.

**Regras de negócio:** custo estimado é apenas indicativo até ao fecho do ciclo; valor final confirmado na fatura emitida.

**Casos de utilização:** consumidor com plano pay-as-you-go acompanha gastos a meio do mês para evitar surpresas na fatura.

**Boas práticas UX/UI:** destaque visual quando o consumo já ultrapassou o incluído no plano (indicação de overage).

**Responsividade:** tabela com colunas prioritárias visíveis primeiro em ecrãs pequenos.

**Escalabilidade:** cálculo de custo feito sobre agregados diários, não sobre eventos individuais.

**Segurança:** valores financeiros nunca calculados no frontend — sempre confirmados pelo backend.

**Performance:** cache do breakdown por ciclo corrente (invalidado diariamente).

---

### 1.10 Limites e Quotas

**Objetivo:** Mostrar de forma transparente os limites do plano atual (rate limit por segundo/minuto, quota mensal) e o quanto já foi consumido.

**Layout e estrutura:** cards por tipo de limite (rate limit, quota mensal, limite de keys, limite de projetos) com barra de progresso.

**Componentes de interface:** `LimitProgressCard`, `UpgradePlanCTA`, `RateLimitHeaderInfoBox` (explica os headers `X-RateLimit-*` retornados pela API).

**Estados:** loading, vazio (não aplicável — sempre há limites definidos), erro, sucesso.

**Ações disponíveis:** ver detalhes de cada limite, ir diretamente para upgrade de plano.

**Fluxos de navegação:** Dashboard/Analytics → Limites e Quotas → Plano/Subscrição (upgrade).

**Permissões:** visível a qualquer membro do projeto.

**Integrações com APIs / Endpoints:**
- `GET /consumer/limits?project_id=`

**Estrutura do backend:** rate limiting implementado via algoritmo token bucket/sliding window em Redis; quota mensal validada de forma assíncrona (near real-time) para não adicionar latência a cada pedido.

**Modelos de dados:** `PlanLimits(plan_id, rate_limit_per_min, monthly_quota, max_projects, max_keys)`.

**Regras de negócio:** ao atingir 100% da quota mensal, comportamento configurável pelo plano: bloquear pedidos (hard limit) ou continuar com overage cobrado (soft limit).

**Casos de utilização:** consumidor recebe 429 e consulta esta página para perceber exatamente qual limite foi excedido.

**Boas práticas UX/UI:** explicação clara em linguagem simples do que cada limite significa, não apenas números técnicos.

**Responsividade:** cards empilhados verticalmente em mobile.

**Escalabilidade:** rate limiting distribuído (Redis cluster) para suportar múltiplos nós de API sem inconsistência.

**Segurança:** limites aplicados no gateway/edge antes de atingir a lógica de negócio, protegendo contra abuso e ataques de DoS aplicacional.

**Performance:** verificação de rate limit em O(1) via Redis, adicionando latência mínima (<5ms) ao pedido.

---

### 1.11 Gestão do Plano/Subscrição

**Objetivo:** Permitir ver o plano atual, comparar com outros planos e fazer upgrade/downgrade.

**Layout e estrutura:** tabela comparativa de planos (Free, Starter, Pro, Enterprise) com o plano atual destacado, e resumo de ciclo de faturação.

**Componentes de interface:** `PlanComparisonTable`, `CurrentPlanBadge`, `ChangePlanModal` (com confirmação de proration), `CancelSubscriptionFlow`.

**Estados:** loading, vazio (n/a), erro (falha no processamento de pagamento ao mudar de plano — mensagem clara + suporte), sucesso.

**Ações disponíveis:** fazer upgrade, downgrade (com aviso de perda de funcionalidades/keys extra), cancelar subscrição, reativar.

**Fluxos de navegação:** Limites/Faturação → Plano/Subscrição → Faturação (confirmação da alteração refletida na próxima fatura).

**Permissões:** apenas owner da organização pode alterar plano/subscrição.

**Integrações com APIs / Endpoints:**
- `GET /billing/plans`
- `POST /billing/subscription/change`
- `POST /billing/subscription/cancel`

**Estrutura do backend:** integração com processador de pagamentos (ex: Stripe) via webhooks para confirmar mudança de plano de forma assíncrona e idempotente.

**Modelos de dados:** `Subscription(org_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end)`.

**Regras de negócio:** downgrade que violaria limites atuais (ex: mais projetos do que o novo plano permite) exige resolução prévia antes de confirmar; upgrade é imediato com proration.

**Casos de utilização:** startup cresce e faz upgrade de Free para Pro a meio do ciclo, pagando valor proporcional.

**Boas práticas UX/UI:** transparência total sobre o que muda (preço, limites, funcionalidades) antes de confirmar.

**Responsividade:** tabela comparativa com scroll horizontal em mobile, plano atual sempre visível primeiro.

**Escalabilidade:** lógica de subscrição delegada ao processador de pagamentos, LogoHub mantém apenas o estado sincronizado via webhook.

**Segurança:** nenhuma alteração de plano é aplicada localmente sem confirmação do webhook do processador de pagamento (evita bypass de pagamento).

**Performance:** UI otimista com rollback caso o webhook de confirmação falhe.

---

### 1.12 Faturação e Histórico de Pagamentos

**Objetivo:** Consultar faturas emitidas, métodos de pagamento e histórico de transações.

**Layout e estrutura:** secção de método de pagamento no topo, seguida de tabela de faturas (data, valor, estado, download PDF).

**Componentes de interface:** `PaymentMethodCard`, `AddPaymentMethodModal`, `InvoiceTable`, `InvoiceDetailDrawer`, `DownloadPdfButton`.

**Estados:** loading, vazio (conta nova sem faturas), erro (falha ao carregar histórico), sucesso.

**Ações disponíveis:** adicionar/remover método de pagamento, descarregar fatura, disputar cobrança (abre ticket de suporte), atualizar dados de faturação (NIF, morada).

**Fluxos de navegação:** Plano/Subscrição → Faturação → Suporte (em caso de disputa).

**Permissões:** apenas owner/financeiro da organização.

**Integrações com APIs / Endpoints:**
- `GET /billing/invoices`
- `GET /billing/invoices/{id}/pdf`
- `POST /billing/payment-methods`
- `DELETE /billing/payment-methods/{id}`

**Estrutura do backend:** faturas geradas pelo processador de pagamento e sincronizadas via webhook; PDFs armazenados em storage privado com URLs assinadas e expiráveis.

**Modelos de dados:** `Invoice(id, org_id, amount, currency, status, pdf_url, issued_at, paid_at)`.

**Regras de negócio:** dados de cartão nunca armazenados diretamente pela LogoHub (tokenização via processador, PCI-DSS compliance delegado).

**Casos de utilização:** empresa descarrega faturas do trimestre para contabilidade.

**Boas práticas UX/UI:** estado de fatura sempre visível (Paga, Pendente, Falhada) com cor semântica.

**Responsividade:** tabela responsiva com colunas essenciais em mobile.

**Escalabilidade:** paginação de histórico de faturas para contas antigas com muitos registos.

**Segurança:** links de download de PDF expiráveis (ex: 15 min) e apenas gerados sob pedido autenticado.

**Performance:** cache de lista de faturas recente (não financeiramente sensível para cache curto).

---

### 1.13 Gestão da Conta e Perfil

**Objetivo:** Gerir dados pessoais, preferências e informação da organização.

**Layout e estrutura:** tabs: Perfil (nome, email, avatar), Organização (nome, NIF, morada), Preferências (idioma, fuso horário, tema).

**Componentes de interface:** `ProfileForm`, `AvatarUploader`, `OrganizationForm`, `PreferencesForm`, `DeleteAccountSection`.

**Estados:** loading, vazio (n/a), erro (validação de campos), sucesso (toast de confirmação ao guardar).

**Ações disponíveis:** editar nome/email (com verificação), trocar password, atualizar avatar, eliminar conta.

**Fluxos de navegação:** acessível a partir do menu de utilizador em qualquer página.

**Permissões:** cada utilizador só edita o seu próprio perfil; dados de organização apenas por owner/admin.

**Integrações com APIs / Endpoints:**
- `GET /account/profile`
- `PATCH /account/profile`
- `POST /account/profile/avatar`
- `DELETE /account`

**Estrutura do backend:** alteração de email exige fluxo de verificação (token enviado para o novo endereço antes de efetivar a troca).

**Modelos de dados:** `User(id, name, email, avatar_url, locale, timezone, created_at)`.

**Regras de negócio:** eliminação de conta é soft-delete com período de retenção (ex: 30 dias) antes de purga definitiva, permitindo recuperação.

**Casos de utilização:** utilizador atualiza o email após mudar de empresa.

**Boas práticas UX/UI:** confirmação explícita para ações destrutivas (eliminar conta requer digitar o email).

**Responsividade:** tabs colapsam para accordion em mobile.

**Escalabilidade:** upload de avatar direto para object storage (URL assinada), não através do servidor de aplicação.

**Segurança:** alteração de password/email exige reautenticação (password atual ou 2FA).

**Performance:** validação de formulário no cliente antes de submissão para reduzir round-trips.

---

### 1.14 Segurança (2FA, Sessões, Dispositivos)

**Objetivo:** Dar controlo total sobre a segurança da conta — autenticação de dois fatores, sessões ativas e dispositivos reconhecidos.

**Layout e estrutura:** secções: 2FA (estado, ativar/desativar), Sessões Ativas (lista com dispositivo/localização/IP/última atividade), Dispositivos Confiáveis.

**Componentes de interface:** `TwoFactorSetupWizard` (QR code + código de backup), `SessionsList` com botão "Terminar sessão", `TrustedDevicesList`, `SecurityActivityLog`.

**Estados:** loading, vazio (sem sessões extra além da atual), erro (falha ao configurar 2FA), sucesso.

**Ações disponíveis:** ativar/desativar 2FA, gerar códigos de recuperação, terminar sessões individualmente ou todas exceto a atual, remover dispositivo confiável.

**Fluxos de navegação:** Conta e Perfil → Segurança; pode ser forçado no login se a organização exigir 2FA.

**Permissões:** cada utilizador gere apenas a sua própria segurança; admins de organização podem forçar política de 2FA obrigatório para todos os membros.

**Integrações com APIs / Endpoints:**
- `POST /account/2fa/enable`
- `POST /account/2fa/verify`
- `GET /account/sessions`
- `DELETE /account/sessions/{id}`

**Estrutura do backend:** 2FA baseado em TOTP (RFC 6238); sessões geridas via tokens de refresh identificáveis e revogáveis individualmente (não apenas JWT stateless puro).

**Modelos de dados:** `Session(id, user_id, device_info, ip_address, location, created_at, last_active_at)`, `TwoFactorSecret(user_id, secret_encrypted, backup_codes_hashed[])`.

**Regras de negócio:** ao desativar 2FA é obrigatório reautenticar; terminar uma sessão invalida imediatamente o respetivo refresh token.

**Casos de utilização:** utilizador perde o telemóvel e usa código de recuperação para desativar 2FA e reconfigurar num novo dispositivo.

**Boas práticas UX/UI:** mostrar geolocalização aproximada e tipo de dispositivo de forma amigável (não apenas IP cru).

**Responsividade:** lista de sessões em cards empilhados em mobile.

**Escalabilidade:** revogação de sessão propagada via blacklist distribuída de tokens (Redis) com TTL igual à validade do token.

**Segurança:** segredo do 2FA armazenado encriptado at-rest; códigos de backup armazenados apenas como hash.

**Performance:** verificação de sessão revogada em cache (O(1)) sem hit à base de dados principal.

---

### 1.15 Centro de Notificações

**Objetivo:** Centralizar todas as notificações do sistema (alertas de quota, faturação, segurança, novidades) num único local.

**Layout e estrutura:** lista cronológica de notificações agrupadas por dia, com filtro por tipo (Sistema, Faturação, Segurança, Produto).

**Componentes de interface:** `NotificationItem` (ícone por tipo, título, timestamp, estado lido/não lido), `NotificationFilterTabs`, `MarkAllReadButton`, `NotificationPreferencesLink`.

**Estados:** loading, vazio ("Sem notificações"), erro, sucesso.

**Ações disponíveis:** marcar como lida/não lida, arquivar, clicar para navegar ao contexto relevante (ex: notificação de quota → página de Limites).

**Fluxos de navegação:** acessível via sino no header em qualquer página; item clicado navega para o contexto correspondente.

**Permissões:** cada utilizador vê apenas as suas próprias notificações (ou as da organização, se relevante ao seu role).

**Integrações com APIs / Endpoints:**
- `GET /notifications?filter=&page=`
- `PATCH /notifications/{id}/read`
- `POST /notifications/mark-all-read`
- Stream em tempo real: `GET /notifications/stream` (SSE) para novas notificações instantâneas.

**Estrutura do backend:** serviço de notificações desacoplado (produtor/consumidor de eventos internos) que gera notificações a partir de eventos de domínio (quota atingida, pagamento falhado, novo comentário, etc.).

**Modelos de dados:** `Notification(id, user_id, type, title, body, link, read_at, created_at)`.

**Regras de negócio:** notificações críticas de segurança/faturação nunca são silenciadas mesmo que o utilizador desative notificações de produto.

**Casos de utilização:** utilizador recebe notificação em tempo real quando uma API key é revogada por outro membro da equipa.

**Boas práticas UX/UI:** badge de contagem não lida no sino, agrupamento inteligente (ex: "5 novas notificações de sistema hoje").

**Responsividade:** dropdown no desktop, painel full-screen em mobile.

**Escalabilidade:** SSE ou WebSocket com fallback para polling; fan-out de eventos via message queue para múltiplos utilizadores.

**Segurança:** stream de notificações autenticado por token, sem vazamento entre utilizadores.

**Performance:** paginação e retenção configurável (ex: 90 dias) para não crescer indefinidamente.

---

### 1.16 Centro de Suporte (Tickets, Chat, FAQ)

**Objetivo:** Permitir obter ajuda através de FAQ, abertura de tickets ou chat, reduzindo fricção no suporte.

**Layout e estrutura:** três separadores: FAQ (pesquisável, por categoria), Os Meus Tickets (lista + criar novo), Chat ao Vivo (se plano incluir).

**Componentes de interface:** `FaqSearch`, `FaqAccordion`, `TicketList`, `CreateTicketModal` (assunto, categoria, prioridade, anexos), `TicketThread` (mensagens + anexos), `LiveChatWidget`.

**Estados:** loading, vazio (sem tickets ainda), erro (falha ao submeter ticket — mantém rascunho local), sucesso.

**Ações disponíveis:** pesquisar FAQ, criar ticket, responder a ticket existente, anexar ficheiros/logs, avaliar atendimento após resolução.

**Fluxos de navegação:** acessível a partir do menu principal; notificações de resposta a ticket levam diretamente à thread.

**Permissões:** cada utilizador vê apenas os tickets da sua organização; agentes de suporte (interno) têm vista alargada (fora do escopo deste perfil).

**Integrações com APIs / Endpoints:**
- `GET /support/faq?query=`
- `GET /support/tickets`
- `POST /support/tickets`
- `POST /support/tickets/{id}/messages`

**Estrutura do backend:** sistema de tickets com SLA por prioridade/plano (ex: Enterprise com resposta em 1h); integração opcional com ferramenta externa de helpdesk.

**Modelos de dados:** `Ticket(id, org_id, subject, category, priority, status, created_by, created_at)`, `TicketMessage(ticket_id, author_id, body, attachments[], created_at)`.

**Regras de negócio:** tickets com anexos limitados em tamanho/tipo de ficheiro (ex: sem executáveis); auto-sugestão de artigos de FAQ relevantes ao escrever o assunto do ticket antes de submeter.

**Casos de utilização:** consumidor reporta um erro 500 intermitente anexando logs do playground.

**Boas práticas UX/UI:** estado do ticket sempre visível (Aberto, Em Progresso, Resolvido), tempo estimado de resposta indicado.

**Responsividade:** thread de ticket em layout de chat também em mobile.

**Escalabilidade:** anexos armazenados em object storage, não na base de dados.

**Segurança:** verificação antivírus em anexos; sanitização de conteúdo HTML em mensagens.

**Performance:** notificação em tempo real de nova resposta via o sistema de Notificações.

---

### 1.17 Changelog e Novidades

**Objetivo:** Comunicar de forma transparente as novidades, melhorias e correções da plataforma e das APIs consumidas.

**Layout e estrutura:** timeline cronológica de entradas, com filtro por tipo (Nova Funcionalidade, Melhoria, Correção, Breaking Change) e por API específica.

**Componentes de interface:** `ChangelogEntryCard` (tag de tipo, data, título, descrição, link para docs relevante), `FilterByApiDropdown`, `SubscribeToUpdatesToggle`.

**Estados:** loading, vazio (sem entradas no filtro selecionado), erro, sucesso.

**Ações disponíveis:** filtrar por tipo/API, subscrever notificações de novidades (email/in-app), partilhar entrada específica (link direto).

**Fluxos de navegação:** acessível a partir do menu; entradas sobre uma API específica linkam para a respetiva Documentação/versão.

**Permissões:** público (changelog geral da plataforma); entradas de API específica visíveis conforme visibilidade da própria API.

**Integrações com APIs / Endpoints:**
- `GET /changelog?type=&api_id=&page=`
- `POST /changelog/subscribe`

**Estrutura do backend:** entradas de changelog associadas opcionalmente a uma `ApiDocVersion` (para breaking changes ligados a uma versão concreta).

**Modelos de dados:** `ChangelogEntry(id, api_id_nullable, type, title, body_markdown, published_at)`.

**Regras de negócio:** breaking changes devem obrigatoriamente referenciar a versão afetada e a data de fim de suporte da versão anterior.

**Casos de utilização:** consumidor subscreve atualizações da API de Ícones para ser avisado antes de uma versão ser descontinuada.

**Boas práticas UX/UI:** tags de cor consistente por tipo de entrada (ex: vermelho para breaking change).

**Responsividade:** timeline vertical simples, totalmente funcional em mobile.

**Escalabilidade:** conteúdo estático/cacheável, pré-renderizável (SSG).

**Segurança:** apenas Criadores/Admins podem publicar entradas (via backend do Criador).

**Performance:** RSS/Atom feed opcional para integração externa.

---

### 1.18 Configurações

**Objetivo:** Ponto central para preferências gerais não cobertas noutras páginas específicas (ex: webhooks, integrações, preferências de comunicação).

**Layout e estrutura:** menu lateral de subsecções: Webhooks, Integrações, Preferências de Comunicação, API Defaults (ex: versão por defeito a usar).

**Componentes de interface:** `WebhookList` + `CreateWebhookModal` (URL, eventos subscritos, secret), `IntegrationsGrid` (Slack, Zapier, etc.), `CommunicationPreferencesForm`.

**Estados:** loading, vazio, erro (teste de webhook falhado — mostra resposta HTTP recebida), sucesso.

**Ações disponíveis:** criar/editar/remover webhook, testar webhook (envio de evento de teste), ativar/desativar integrações, ajustar preferências de email.

**Fluxos de navegação:** acessível a partir do menu principal; interliga com Centro de Notificações (preferências partilhadas).

**Permissões:** apenas owner/admin do projeto pode gerir webhooks e integrações.

**Integrações com APIs / Endpoints:**
- `GET /projects/{id}/webhooks`
- `POST /projects/{id}/webhooks`
- `POST /projects/{id}/webhooks/{id}/test`
- `DELETE /projects/{id}/webhooks/{id}`

**Estrutura do backend:** entrega de webhooks com retry exponencial (ex: até 5 tentativas) e assinatura HMAC do payload para verificação de autenticidade pelo recetor.

**Modelos de dados:** `Webhook(id, project_id, url, events[], secret, is_active, last_delivery_status)`.

**Regras de negócio:** webhooks com taxa de falha persistente (ex: >90% falhas em 24h) são automaticamente desativados com notificação ao owner.

**Casos de utilização:** consumidor configura webhook para ser avisado via endpoint próprio sempre que uma key é revogada ou o plano muda.

**Boas práticas UX/UI:** log visível das últimas entregas de cada webhook (estado, código HTTP, tempo).

**Responsividade:** formulários em coluna única em mobile.

**Escalabilidade:** fila de entrega de webhooks assíncrona (message queue) desacoplada do fluxo principal da API.

**Segurança:** validação de URL de destino (bloquear IPs internos/privados — proteção SSRF); secret nunca reenviado em claro após criação.

**Performance:** entrega de webhook não bloqueia o pedido original que gerou o evento (processamento assíncrono).

---

## Perfil: Criador

### 2.1 Dashboard do Criador

**Objetivo:** Visão geral do desempenho de todas as APIs publicadas pelo criador — utilização agregada, receita, feedback recente e estado de publicação.

**Layout e estrutura:** cards de resumo (total de requests recebidos, receita do mês, rating médio, nº de APIs publicadas) seguidos de lista das APIs do criador com estado e atalhos.

**Componentes de interface:** `CreatorSummaryCards`, `MyApisTable` (nome, estado, requests 30d, receita, rating), `RecentFeedbackList`, `QuickCreateApiButton`.

**Estados:** loading (skeletons), vazio (criador sem APIs — CTA "Cria a tua primeira API"), erro (fail isolado por card), sucesso.

**Ações disponíveis:** criar nova API, aceder rapidamente a qualquer API existente, ver feedback recente, aceder a analytics agregada.

**Fluxos de navegação:** entrada por defeito do perfil Criador → Gestão de APIs, Analytics, Monetização.

**Permissões:** visível a utilizadores com role `creator`; dados filtrados às APIs de que é owner ou colaborador.

**Integrações com APIs / Endpoints:**
- `GET /creator/dashboard/summary`
- `GET /creator/apis?owned_by=me`

**Estrutura do backend:** agregação semelhante ao dashboard do consumidor, mas cruzando `UsageMetric` com `Api.owner_id` e dados de `Payout`/receita.

**Modelos de dados:** reutiliza `Api`, `UsageMetric`; adiciona `Payout(creator_id, period, gross_amount, platform_fee, net_amount)`.

**Regras de negócio:** receita mostrada é sempre líquida da comissão da plataforma, com breakdown disponível ao clicar.

**Casos de utilização:** criador verifica rapidamente qual das suas 5 APIs está a gerar mais receita este mês.

**Boas práticas UX/UI:** ordenação da tabela de APIs por qualquer coluna (requests, receita, rating).

**Responsividade:** tabela colapsa para cards em mobile.

**Escalabilidade:** métricas pré-agregadas por job periódico, não calculadas em tempo real.

**Segurança:** um criador nunca vê dados agregados de APIs que não possui/colabora.

**Performance:** cache de 5 min no resumo do dashboard.

---

### 2.2 Gestão de APIs

**Objetivo:** Listar e gerir todas as APIs do criador num único local.

**Layout e estrutura:** tabela/grid com filtros por estado (Draft, Beta, Public, Deprecated, Archived) e pesquisa por nome.

**Componentes de interface:** `ApiManagementTable`, `StatusFilterTabs`, `CreateApiButton`, `BulkActionsMenu` (arquivar múltiplas, etc.).

**Estados:** loading, vazio (sem APIs no filtro), erro, sucesso.

**Ações disponíveis:** criar, editar, arquivar, duplicar (como base para nova API), aceder à página de detalhe/edição.

**Fluxos de navegação:** Dashboard → Gestão de APIs → Editar API / Criar Nova API.

**Permissões:** owner e colaboradores com permissão `manage_api`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis?status=&query=`
- `POST /creator/apis/{id}/archive`
- `POST /creator/apis/{id}/duplicate`

**Estrutura do backend:** `Api` como aggregate root com relação a versões, endpoints, documentação e colaboradores.

**Modelos de dados:** `Api(id, name, slug, category, status, owner_id, created_at)`.

**Regras de negócio:** uma API só pode ser arquivada se não tiver consumidores ativos nos últimos 30 dias, ou requer confirmação explícita alertando sobre impacto.

**Casos de utilização:** criador duplica uma API existente como ponto de partida para uma nova categoria de assets.

**Boas práticas UX/UI:** badges de estado com cor consistente em toda a plataforma.

**Responsividade:** tabela → cards em mobile.

**Escalabilidade:** paginação para criadores com muitas APIs.

**Segurança:** verificação de permissão por ação (nem todo colaborador pode arquivar).

**Performance:** contadores (requests, rating) pré-calculados, não join em tempo real.

---

### 2.3 Criar Nova API

**Objetivo:** Wizard guiado para configurar os elementos essenciais de uma nova API antes da primeira publicação.

**Layout e estrutura:** wizard multi-step: (1) Informação básica (nome, categoria, descrição), (2) Autenticação, (3) Primeiro endpoint, (4) Plano de acesso/preço inicial, (5) Revisão.

**Componentes de interface:** `StepperNav`, `BasicInfoForm`, `AuthConfigForm`, `EndpointBuilderForm`, `PricingForm`, `ReviewSummary`.

**Estados:** loading (ao submeter), vazio (n/a), erro (validação por step, não deixa avançar), sucesso (redireciona para Editar API em modo Draft).

**Ações disponíveis:** avançar/recuar entre steps, guardar como rascunho a qualquer momento, cancelar.

**Fluxos de navegação:** Gestão de APIs → Criar Nova API → Editar API (estado Draft).

**Permissões:** qualquer utilizador com role `creator` verificado (ex: email confirmado, eventualmente KYC para monetização).

**Integrações com APIs / Endpoints:**
- `POST /creator/apis` (cria em estado Draft)
- `PATCH /creator/apis/{id}/wizard-step`

**Estrutura do backend:** criação transacional de `Api` + `ApiVersion` inicial (v1, estado Draft) + `AuthConfig` associada.

**Modelos de dados:** `Api`, `ApiVersion(id, api_id, version, status)`, `AuthConfig(api_id, type, config_json)`.

**Regras de negócio:** API criada sempre em estado `Draft`; não é visível no catálogo até publicação explícita (ver 2.11).

**Casos de utilização:** criador configura uma nova API de "Bandeiras" definindo autenticação por API Key e o primeiro endpoint `GET /flags/{code}`.

**Boas práticas UX/UI:** progresso salvo automaticamente a cada step (evita perda de trabalho).

**Responsividade:** stepper vira lista vertical de steps em mobile.

**Escalabilidade:** n/a (operação pontual de baixa frequência).

**Segurança:** validação de nome/slug único; sanitização de todo o conteúdo textual submetido.

**Performance:** autosave assíncrono não bloqueia a navegação entre steps.

---

### 2.4 Editar APIs

**Objetivo:** Página central de edição de uma API existente, agregando acesso a todas as suas subsecções (endpoints, docs, versões, etc.) através de navegação interna.

**Layout e estrutura:** header com nome/estado da API e tabs internas (Visão Geral, Endpoints, Documentação, Versões, Exemplos, SDKs, Autenticação, Permissões, Monetização, Analytics, Logs).

**Componentes de interface:** `ApiHeader` (com `StatusBadge` e `PublishButton`), `TabNavigation`, conteúdo específico de cada tab (ver secções seguintes).

**Estados:** loading, vazio (tab sem conteúdo ainda, ex: sem exemplos), erro, sucesso.

**Ações disponíveis:** navegar entre tabs, publicar/despublicar, arquivar, ver preview público da documentação.

**Fluxos de navegação:** hub central que liga a todas as páginas 2.5–2.10.

**Permissões:** owner e colaboradores conforme permissão específica por tab (ex: um colaborador pode só ter acesso a Documentação, não a Monetização).

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}`
- `PATCH /creator/apis/{id}`

**Estrutura do backend:** endpoint agregador que devolve metadados da API + contagens de cada subsecção para badges nas tabs (ex: "3 endpoints", "2 erros por resolver").

**Modelos de dados:** reutiliza `Api` e relações.

**Regras de negócio:** algumas tabs ficam bloqueadas/desabilitadas consoante o estado da API (ex: não é possível editar schema de endpoints de uma API `Public` sem criar nova versão — ver 2.5).

**Casos de utilização:** criador acede à API "Ícones" e navega diretamente para a tab de Logs após receber alerta de erro.

**Boas práticas UX/UI:** indicadores visuais (badges numéricos) nas tabs para chamar atenção a itens pendentes.

**Responsividade:** tabs em dropdown/scroll horizontal em mobile.

**Escalabilidade:** carregamento lazy de cada tab (só busca dados da tab ativa).

**Segurança:** verificação de permissão granular por tab no backend, não apenas no frontend.

**Performance:** cache do metadata da API entre navegação de tabs.

---

### 2.5 Gestão de Versões

**Objetivo:** Gerir o ciclo de vida de múltiplas versões de uma API (v1, v2...) permitindo evolução sem quebrar consumidores existentes.

**Layout e estrutura:** lista de versões com estado (Draft, Beta, Public, Deprecated, Archived), data de publicação e nº de consumidores ativos por versão.

**Componentes de interface:** `VersionList`, `CreateVersionButton` (clona a versão atual como ponto de partida), `DeprecateVersionModal` (define data de fim de suporte), `VersionDiffViewer`.

**Estados:** loading, vazio (só v1 existe), erro, sucesso.

**Ações disponíveis:** criar nova versão, comparar diferenças entre versões (schema diff), promover Draft→Beta→Public, marcar como Deprecated/Archived.

**Fluxos de navegação:** Editar API → Versões → Endpoints/Documentação (edita-se dentro do contexto da versão selecionada).

**Permissões:** owner e colaboradores com permissão `manage_versions`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/versions`
- `POST /creator/apis/{id}/versions` (clonar versão)
- `PATCH /creator/apis/{id}/versions/{v}/status`

**Estrutura do backend:** cada `ApiVersion` tem o seu próprio conjunto imutável de endpoints/schema após publicação; alterações a uma versão `Public` exigem criar uma nova versão em vez de editar diretamente.

**Modelos de dados:** `ApiVersion(id, api_id, version, status, deprecated_at, sunset_at)`.

**Regras de negócio:** uma versão `Public` não pode ser editada diretamente (imutabilidade); só transições de estado e correções de documentação (não de schema/comportamento) são permitidas.

**Casos de utilização:** criador lança v2 com novo formato de resposta, mantendo v1 disponível por mais 6 meses com aviso de deprecação.

**Boas práticas UX/UI:** timeline visual do ciclo de vida de cada versão.

**Responsividade:** lista simples, funcional em mobile.

**Escalabilidade:** roteamento de pedidos por versão feito no gateway/edge, não na lógica de aplicação.

**Segurança:** consumidores de uma versão `Archived` recebem erro explícito em vez de comportamento indefinido.

**Performance:** cache de schema por versão (imutável, logo altamente cacheável).

---

### 2.6 Gestão de Documentação

**Objetivo:** Editor de conteúdo de documentação (markdown/MDX) para a versão selecionada da API.

**Layout e estrutura:** editor markdown com preview lado a lado, árvore de secções à esquerda.

**Componentes de interface:** `MarkdownEditor` (com toolbar), `LivePreviewPane`, `SectionTree`, `SaveDraftButton`, `PublishDocsButton`.

**Estados:** loading, vazio (documentação ainda não escrita — template inicial gerado a partir do schema de endpoints), erro (markdown inválido/preview falha), sucesso.

**Ações disponíveis:** editar conteúdo, reordenar secções, inserir exemplos de código, publicar alterações de documentação (independente de nova versão da API, se forem apenas correções).

**Fluxos de navegação:** Editar API → Documentação; preview linka para a página pública real (1.4).

**Permissões:** owner e colaboradores com permissão `manage_docs`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/docs/{version}`
- `PUT /creator/apis/{id}/docs/{version}`

**Estrutura do backend:** conteúdo armazenado versionado (histórico de edições para rollback); sanitização de markdown no momento de publicação.

**Modelos de dados:** `ApiDocVersion` (já definido), `ApiDocRevision(doc_version_id, content_snapshot, edited_by, edited_at)`.

**Regras de negócio:** correções de documentação (typos, clarificações) não exigem nova versão da API; mudanças de schema exigem passar por 2.5.

**Casos de utilização:** criador corrige um exemplo de código desatualizado sem precisar de publicar uma nova versão da API.

**Boas práticas UX/UI:** preview idêntico ao rendering público real, para evitar surpresas após publicar.

**Responsividade:** editor/preview em tabs em mobile (não side-by-side).

**Escalabilidade:** conteúdo servido via CDN após publicação.

**Segurança:** sanitização rigorosa de HTML embebido em markdown (XSS).

**Performance:** autosave de rascunho a cada X segundos.

---

### 2.7 Gestão de Endpoints

**Objetivo:** Definir e configurar os endpoints técnicos de uma versão da API (método, path, parâmetros, schema de resposta).

**Layout e estrutura:** lista de endpoints à esquerda, editor de detalhe do endpoint selecionado à direita (método/path, parâmetros, request/response schema em formato OpenAPI).

**Componentes de interface:** `EndpointList`, `EndpointForm`, `ParameterEditor` (nome, tipo, obrigatório, descrição), `SchemaEditor` (JSON Schema), `AddEndpointButton`.

**Estados:** loading, vazio (nenhum endpoint definido ainda), erro (schema JSON inválido — validação inline), sucesso.

**Ações disponíveis:** adicionar/editar/remover endpoint, definir schema de request/response, testar schema com exemplo de payload.

**Fluxos de navegação:** Editar API → Endpoints → Exemplos (associar exemplos a este endpoint) → Documentação (gerada a partir daqui).

**Permissões:** owner e colaboradores com permissão `manage_endpoints`; apenas em versões `Draft`/`Beta` (ver regra de imutabilidade em 2.5).

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/versions/{v}/endpoints`
- `POST /creator/apis/{id}/versions/{v}/endpoints`
- `PATCH .../endpoints/{endpointId}`

**Estrutura do backend:** schema armazenado em formato OpenAPI 3.1 (JSON), usado tanto para gerar documentação como para validação de pedidos em runtime (2.7 e o gateway partilham a mesma fonte de verdade).

**Modelos de dados:** `Endpoint(id, api_version_id, method, path, summary, request_schema_json, response_schema_json, requires_auth)`.

**Regras de negócio:** path + método devem ser únicos dentro da versão; schema inválido bloqueia a promoção da versão para `Beta`/`Public`.

**Casos de utilização:** criador adiciona um novo parâmetro opcional `format=svg|png` ao endpoint de logotipos.

**Boas práticas UX/UI:** validação de schema em tempo real com mensagens de erro claras por campo.

**Responsividade:** lista/editor em tabs verticais em mobile.

**Escalabilidade:** schema compilado/cacheado para validação de alta performance em runtime.

**Segurança:** o próprio schema serve de allowlist de inputs aceites, prevenindo mass-assignment/parâmetros inesperados.

**Performance:** validação de request usando schema compilado (ex: JSON Schema compiled validators), não parsing repetido.

---

### 2.8 Configuração de Autenticação

**Objetivo:** Definir o mecanismo de autenticação que os consumidores devem usar para aceder à API (API Key, OAuth2, JWT).

**Layout e estrutura:** seletor de tipo de autenticação com formulário de configuração específico por tipo.

**Componentes de interface:** `AuthTypeSelector` (API Key / OAuth2 / JWT / None), `ApiKeyAuthConfigForm` (header name, formato do prefixo), `OAuthConfigForm` (scopes, endpoints de token), `TestAuthButton`.

**Estados:** loading, vazio (autenticação não configurada — bloqueia publicação), erro (teste de auth falha), sucesso.

**Ações disponíveis:** escolher tipo de autenticação, configurar detalhes, testar fluxo de autenticação antes de publicar.

**Fluxos de navegação:** Editar API → Autenticação; ligado à Documentação (secção de auth é gerada automaticamente a partir daqui).

**Permissões:** owner e colaboradores com permissão `manage_auth` (tipicamente restrito, dado o impacto de segurança).

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/auth-config`
- `PUT /creator/apis/{id}/auth-config`

**Estrutura do backend:** configuração de auth interpretada pelo gateway de API para decidir como validar cada pedido recebido (delegando para o serviço central de API Keys quando aplicável).

**Modelos de dados:** `AuthConfig(api_id, type, header_name, config_json)`.

**Regras de negócio:** mudar o tipo de autenticação de uma API já `Public` exige criar nova versão (breaking change).

**Casos de utilização:** criador configura a API para aceitar a key tanto no header `Authorization` como em query param `api_key` (para compatibilidade).

**Boas práticas UX/UI:** explicação clara do impacto de cada escolha nos consumidores existentes.

**Responsividade:** formulário simples, funcional em qualquer largura.

**Segurança:** validação de que a configuração não permite bypass (ex: não permitir "None" em APIs monetizadas).

**Performance:** configuração cacheada no gateway, refresh via invalidação de cache ao publicar alteração.

**Escalabilidade:** suporte a múltiplos mecanismos de auth simultâneos por API se necessário (ex: transição gradual de API Key para OAuth2).

---

### 2.9 Gestão de Exemplos

**Objetivo:** Fornecer exemplos de código prontos a usar (request + resposta) para cada endpoint, em múltiplas linguagens.

**Layout e estrutura:** lista de endpoints à esquerda; para o endpoint selecionado, tabs de linguagem (cURL, JS, Python, PHP, Go) com editor de código e preview da resposta associada.

**Componentes de interface:** `EndpointSelector`, `LanguageTabs`, `CodeEditor`, `ResponseExampleEditor`, `GenerateFromSchemaButton` (gera esboço automático a partir do schema do endpoint).

**Estados:** loading, vazio (endpoint sem exemplos), erro, sucesso.

**Ações disponíveis:** adicionar/editar exemplo por linguagem, gerar automaticamente esboço a partir do schema, marcar exemplo como "principal" (mostrado por defeito na documentação).

**Fluxos de navegação:** Editar API → Exemplos → Documentação (exemplos aparecem lá automaticamente).

**Permissões:** owner e colaboradores com permissão `manage_docs`/`manage_examples`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/endpoints/{eid}/examples`
- `PUT /creator/apis/{id}/endpoints/{eid}/examples/{lang}`

**Estrutura do backend:** exemplos armazenados como texto associado ao endpoint+linguagem; geração automática usa o `request_schema_json`/`response_schema_json` como base.

**Modelos de dados:** `CodeExample(id, endpoint_id, language, request_code, response_example_json, is_primary)`.

**Regras de negócio:** pelo menos um exemplo (cURL) é obrigatório antes de promover a versão para `Public`.

**Casos de utilização:** criador adiciona exemplo em Python para o endpoint de upload de assets.

**Boas práticas UX/UI:** syntax highlighting fiel à linguagem, botão de "testar este exemplo" que abre o Playground pré-preenchido.

**Responsividade:** tabs de linguagem com scroll horizontal em mobile.

**Escalabilidade:** n/a (conteúdo estático de baixo volume).

**Segurança:** sanitização de código de exemplo antes de renderizar (evitar HTML/script injection na página pública).

**Performance:** exemplos servidos junto com a documentação estática (mesma estratégia de cache/CDN).

---

### 2.10 Gestão de SDKs

**Objetivo:** Disponibilizar e gerir SDKs oficiais (ou gerados automaticamente) para facilitar a integração da API em diferentes linguagens.

**Layout e estrutura:** lista de SDKs disponíveis/geráveis por linguagem, com estado (Não gerado, Gerado, Publicado) e link para repositório/pacote.

**Componentes de interface:** `SdkList`, `GenerateSdkButton` (a partir do schema OpenAPI), `SdkVersionHistory`, `PublishToRegistryModal` (npm, PyPI, etc.).

**Estados:** loading (geração de SDK pode ser assíncrona — estado "A gerar..."), vazio (nenhum SDK ainda), erro (falha na geração — log de erro visível), sucesso.

**Ações disponíveis:** gerar SDK a partir do schema atual, descarregar SDK gerado, publicar em registo público, associar repositório próprio (para SDKs mantidos manualmente).

**Fluxos de navegação:** Editar API → SDKs; ligado à Documentação (link de instalação do SDK aparece lá).

**Permissões:** owner e colaboradores com permissão `manage_sdks`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/sdks`
- `POST /creator/apis/{id}/sdks/generate?lang=`
- `POST /creator/apis/{id}/sdks/{lang}/publish`

**Estrutura do backend:** geração de SDK via ferramenta baseada em OpenAPI (ex: openapi-generator) executada em worker assíncrono (job queue), não bloqueando o request HTTP.

**Modelos de dados:** `Sdk(id, api_id, language, version, status, package_url, generated_at)`.

**Regras de negócio:** SDK gerado é sempre atrelado a uma versão específica da API; regeneração necessária a cada nova versão publicada.

**Casos de utilização:** criador gera e publica um SDK em TypeScript no npm após lançar a v2 da API.

**Boas práticas UX/UI:** feedback claro de progresso durante geração assíncrona (job status polling ou websocket).

**Responsividade:** lista simples adaptável.

**Escalabilidade:** geração de SDK isolada em workers dedicados, escaláveis independentemente da API principal.

**Segurança:** publicação em registos externos (npm/PyPI) autenticada com credenciais geridas de forma segura (secrets vault), nunca expostas ao frontend.

**Performance:** cache do SDK gerado até haver nova alteração de schema.

---

### 2.11 Publicação / Estado da API

**Objetivo:** Controlar as transições de estado da API (Draft → Beta → Public → Deprecated → Archived) com as devidas validações.

**Layout e estrutura:** painel de estado atual com checklist de requisitos para avançar de estado (ex: "documentação completa", "pelo menos 1 exemplo", "autenticação configurada").

**Componentes de interface:** `StatusTimeline`, `PublishChecklist` (itens com check/cross), `PromoteButton` (desabilitado até checklist completo), `RollbackButton`.

**Estados:** loading, vazio (n/a), erro (checklist incompleto — lista itens em falta), sucesso (transição efetuada + notificação a colaboradores).

**Ações disponíveis:** promover para o próximo estado, reverter para estado anterior (se ainda não houver consumidores ativos), agendar publicação para data futura.

**Fluxos de navegação:** Editar API → Publicação; resultado reflete-se imediatamente no Catálogo (1.2) e Marketplace (2.17).

**Permissões:** apenas owner (transições para `Public` tipicamente restritas ao owner, não a todos os colaboradores).

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/versions/{v}/publish-checklist`
- `POST /creator/apis/{id}/versions/{v}/promote`

**Estrutura do backend:** máquina de estados explícita (state machine) validando transições permitidas (não é possível saltar de Draft direto para Deprecated, por exemplo).

**Modelos de dados:** reutiliza `ApiVersion.status`; adiciona `PublishAudit(version_id, from_status, to_status, actor_id, at)`.

**Regras de negócio:** transição para `Public` dispara indexação no catálogo/pesquisa e entrada automática no Changelog; transição para `Deprecated` exige definir `sunset_at`.

**Casos de utilização:** criador completa checklist e promove a v2 de Beta para Public, gerando automaticamente uma entrada no changelog.

**Boas práticas UX/UI:** checklist com links diretos para resolver cada item em falta (ex: clicar "Falta autenticação" leva à tab 2.8).

**Responsividade:** checklist em lista vertical simples.

**Escalabilidade:** invalidação de cache de catálogo/pesquisa disparada por evento assíncrono na publicação.

**Segurança:** auditoria completa de quem promoveu/reverteu cada versão (accountability).

**Performance:** propagação de estado para o gateway de rate-limiting/auth em <1 min.

---

### 2.12 Analytics da API

**Objetivo:** Métricas de desempenho e adoção da API do ponto de vista do criador (quem a consome, quanto, e quão bem).

**Layout e estrutura:** semelhante ao Analytics do consumidor (1.8), mas com dimensão adicional "por consumidor/cliente" (agregado e anonimizado) e "por endpoint".

**Componentes de interface:** `UsageTimeSeriesChart`, `TopConsumersTable` (anonimizado, ex: "Cliente #4821"), `EndpointPopularityChart`, `ConversionFunnel` (visitas à doc → key gerada → primeiro request).

**Estados:** loading, vazio (API recém-publicada sem tráfego), erro, sucesso.

**Ações disponíveis:** filtrar por período/versão/endpoint, exportar relatório, comparar versões (v1 vs v2 adoção).

**Fluxos de navegação:** Editar API → Analytics → Logs (drill-down em anomalias) → Monetização (relação entre uso e receita).

**Permissões:** owner e colaboradores com permissão `view_analytics`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/analytics?from=&to=&version=`

**Estrutura do backend:** mesma pipeline de agregação transversal (ver secção de Arquitetura), filtrada por `api_id` em vez de `project_id`.

**Modelos de dados:** reutiliza `UsageMetric`.

**Regras de negócio:** dados de consumidores individuais nunca expõem informação pessoal identificável ao criador — apenas identificadores anonimizados/agregados, preservando privacidade.

**Casos de utilização:** criador identifica que 80% do tráfego usa um único endpoint e prioriza otimizá-lo.

**Boas práticas UX/UI:** funil de conversão visualmente claro para identificar pontos de abandono na adoção.

**Responsividade:** gráficos e tabelas adaptáveis.

**Escalabilidade:** mesma estratégia de pré-agregação da secção 1.8.

**Segurança:** anonimização obrigatória de dados de consumidores para conformidade com privacidade (GDPR).

**Performance:** cache de queries de analytics por combinação de filtros.

---

### 2.13 Logs

**Objetivo:** Consultar logs técnicos detalhados de pedidos à API para diagnóstico e debugging.

**Layout e estrutura:** tabela de logs com filtros (endpoint, status code, período, consumidor anonimizado), painel de detalhe ao clicar numa linha (headers, request/response body truncado, latência).

**Componentes de interface:** `LogsTable`, `LogFilterBar`, `LogDetailDrawer`, `ExportLogsButton`.

**Estados:** loading, vazio (sem logs no filtro), erro, sucesso.

**Ações disponíveis:** filtrar, ver detalhe de um log, exportar seleção, criar alerta a partir de um padrão de erro recorrente.

**Fluxos de navegação:** Analytics → Logs (drill-down); Logs → Gestão de Erros (agrupamento de erros recorrentes).

**Permissões:** owner e colaboradores com permissão `view_logs`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/logs?status=&endpoint=&from=&to=`

**Estrutura do backend:** logs armazenados em sistema otimizado para escrita/leitura de grande volume (ex: ClickHouse/OpenSearch) com retenção configurável por plano do criador.

**Modelos de dados:** `RequestLog(id, api_id, endpoint, method, status_code, latency_ms, consumer_hash, created_at, request_body_truncated, response_body_truncated)`.

**Regras de negócio:** corpos de request/response sensíveis (ex: contendo dados pessoais) truncados/mascarados automaticamente conforme regras de PII detection.

**Casos de utilização:** criador investiga porque um endpoint específico está a devolver 500 para um subconjunto de pedidos.

**Boas práticas UX/UI:** cores semânticas para status codes (2xx verde, 4xx amarelo, 5xx vermelho), busca rápida por request ID.

**Responsividade:** tabela com colunas prioritárias em mobile, detalhe em modal full-screen.

**Escalabilidade:** logs indexados por tempo, com particionamento/retenção automática (ex: 30-90 dias).

**Segurança:** mascaramento de dados sensíveis (API keys nunca aparecem em claro nos logs, mesmo ao criador).

**Performance:** queries de logs com paginação cursor e limites de intervalo de datas para evitar scans massivos.

---

### 2.14 Monitorização

**Objetivo:** Visão de saúde operacional em tempo real da API (uptime, latência atual, taxa de erro corrente) com alertas configuráveis.

**Layout e estrutura:** dashboard estilo "status page" com indicadores em tempo real e histórico de incidentes.

**Componentes de interface:** `UptimeIndicator`, `RealtimeLatencyGauge`, `ErrorRateGauge`, `IncidentTimeline`, `AlertRulesList` + `CreateAlertRuleModal`.

**Estados:** loading, vazio (sem incidentes históricos — bom sinal, mostrado positivamente), erro (falha ao obter métricas real-time — fallback para últimos dados conhecidos com timestamp), sucesso.

**Ações disponíveis:** configurar regras de alerta (ex: "avisar se latência p95 > 500ms por 5 min"), reconhecer/anotar incidente, ver histórico de disponibilidade.

**Fluxos de navegação:** Editar API → Monitorização → Notificações (quando alerta dispara) → Logs (investigar causa).

**Permissões:** owner e colaboradores com permissão `view_monitoring`/`manage_alerts`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/health/realtime` (via WebSocket/SSE)
- `GET /creator/apis/{id}/incidents`
- `POST /creator/apis/{id}/alert-rules`

**Estrutura do backend:** métricas de saúde calculadas em janelas curtas (ex: 1 min) a partir do stream de logs/eventos; motor de regras avalia condições continuamente e dispara notificações/webhooks.

**Modelos de dados:** `AlertRule(id, api_id, metric, condition, threshold, window, channels[])`, `Incident(id, api_id, started_at, resolved_at, severity, summary)`.

**Regras de negócio:** incidentes com impacto em consumidores geram automaticamente uma entrada visível (opcional) na página de status pública da API.

**Casos de utilização:** criador é alertado via webhook e email quando a taxa de erro de um endpoint ultrapassa 10% durante 5 minutos.

**Boas práticas UX/UI:** indicadores visuais imediatos (verde/amarelo/vermelho) sem necessitar interpretação de números.

**Responsividade:** gauges reorganizam-se em coluna única em mobile.

**Escalabilidade:** motor de alertas desacoplado (stream processing), não impacta a latência da API monitorizada.

**Segurança:** regras de alerta e destinatários configuráveis apenas por quem tem permissão explícita (evita exfiltração de dados via canais de alerta não autorizados).

**Performance:** dados em tempo real via WebSocket/SSE em vez de polling frequente.

---

### 2.15 Gestão de Erros

**Objetivo:** Agrupar e priorizar erros recorrentes da API para facilitar a correção (semelhante a um Sentry dedicado à API).

**Layout e estrutura:** lista de "grupos de erro" (mesmo tipo/stack/endpoint agrupados), ordenados por frequência/impacto, com estado (Novo, Reconhecido, Resolvido, Ignorado).

**Componentes de interface:** `ErrorGroupList`, `ErrorGroupDetail` (stack trace/contexto, frequência ao longo do tempo, exemplos de request que causaram o erro), `StatusDropdown`, `AssignToCollaboratorSelector`.

**Estados:** loading, vazio ("Sem erros — bom trabalho!"), erro (falha ao carregar grupo específico), sucesso.

**Ações disponíveis:** marcar como reconhecido/resolvido/ignorado, atribuir a um colaborador, ver todos os requests associados a este grupo de erro (link para Logs filtrados).

**Fluxos de navegação:** Monitorização/Logs → Gestão de Erros → Logs (drill-down) → Notificações (quando novo grupo crítico surge).

**Permissões:** owner e colaboradores com permissão `manage_errors`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/error-groups?status=`
- `PATCH /creator/apis/{id}/error-groups/{id}`

**Estrutura do backend:** agrupamento automático de erros por fingerprint (ex: hash de endpoint + tipo de erro + stack simplificado), calculado em near-real-time a partir do stream de logs.

**Modelos de dados:** `ErrorGroup(id, api_id, fingerprint, title, first_seen, last_seen, occurrence_count, status, assigned_to)`.

**Regras de negócio:** um grupo de erro `Resolvido` que reaparece é automaticamente reaberto como `Novo` com notificação.

**Casos de utilização:** criador vê que 200 requests falharam com o mesmo erro de validação de schema e corrige o endpoint correspondente.

**Boas práticas UX/UI:** ordenação por defeito por impacto (frequência × recência), não apenas cronológica.

**Responsividade:** lista/detalhe em navegação master-detail, colapsando em mobile para navegação sequencial.

**Escalabilidade:** fingerprinting e agrupamento feitos em stream processing, não em queries ad-hoc sobre logs brutos.

**Segurança:** stack traces nunca expõem segredos/credenciais (sanitização antes de armazenar).

**Performance:** contagem de ocorrências incrementada de forma assíncrona (não bloqueia o pedido original que gerou o erro).

---

### 2.16 Gestão de Permissões e Colaboradores

**Objetivo:** Convidar e gerir colaboradores com diferentes níveis de permissão sobre uma ou várias APIs.

**Layout e estrutura:** lista de colaboradores com role/permissões granulares, botão de convite por email.

**Componentes de interface:** `CollaboratorList`, `InviteCollaboratorModal` (email, role predefinido ou permissões customizadas), `PermissionMatrixEditor` (checkboxes por área: docs, endpoints, auth, monetização, analytics, erros).

**Estados:** loading, vazio (só o owner), erro (convite falhado — email inválido), sucesso (convite pendente visível na lista).

**Ações disponíveis:** convidar, reenviar convite, alterar permissões, remover colaborador, transferir propriedade da API.

**Fluxos de navegação:** Editar API → Permissões; afeta o acesso a todas as outras tabs para esse colaborador.

**Permissões:** apenas owner pode gerir colaboradores e transferir propriedade.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/collaborators`
- `POST /creator/apis/{id}/collaborators/invite`
- `PATCH /creator/apis/{id}/collaborators/{userId}`
- `DELETE /creator/apis/{id}/collaborators/{userId}`

**Estrutura do backend:** permissões granulares implementadas como bitmask/lista de scopes por colaborador, verificadas em cada endpoint do backend do Criador (não apenas escondendo UI no frontend).

**Modelos de dados:** `ApiCollaborator(api_id, user_id, permissions[], invited_by, status)`.

**Regras de negócio:** convite expira em X dias se não aceite; remover um colaborador revoga imediatamente o seu acesso, incluindo sessões já iniciadas nessa API.

**Casos de utilização:** criador convida um colega apenas para gerir documentação e exemplos, sem acesso a monetização.

**Boas práticas UX/UI:** matriz de permissões visualmente clara (grid de checkboxes), presets comuns (ex: "Editor de Documentação", "Developer").

**Responsividade:** matriz de permissões em accordion por categoria em mobile.

**Escalabilidade:** verificação de permissão via cache de scopes por utilizador/API.

**Segurança:** toda a verificação de permissão feita server-side; nunca confiar apenas na ocultação de UI.

**Performance:** lista de colaboradores paginada apenas para APIs com número elevado (raro).

---

### 2.17 Marketplace de APIs

**Objetivo:** Vitrine pública onde as APIs publicadas competem por visibilidade, permitindo ao criador entender o seu posicionamento e otimizar a apresentação da sua API.

**Layout e estrutura:** do ponto de vista do criador, uma vista de "como a minha API aparece no marketplace" + métricas de posicionamento (ranking na categoria, impressões, cliques, taxa de conversão para "primeira key gerada").

**Componentes de interface:** `MarketplacePreviewCard`, `RankingPositionIndicator`, `ImpressionsClicksChart`, `OptimizationTipsList` (sugestões automáticas, ex: "adiciona mais exemplos para melhorar conversão").

**Estados:** loading, vazio (API ainda em Draft — não aplicável), erro, sucesso.

**Ações disponíveis:** editar elementos que afetam a apresentação (nome, descrição curta, ícone — atalho para 2.4), ver como concorre face a APIs semelhantes (benchmarks anonimizados).

**Fluxos de navegação:** Dashboard/Editar API → Marketplace; liga de volta à edição de metadados da API.

**Permissões:** owner e colaboradores com permissão `view_analytics`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/marketplace-insights`

**Estrutura do backend:** cálculo de impressões/cliques a partir de eventos de tracking no Catálogo/Explorar (1.2/1.3), agregados por API.

**Modelos de dados:** `MarketplaceEvent(api_id, type[impression|click|key_created], date, count)`.

**Regras de negócio:** ranking considera fatores como rating, taxa de erro, tempo de resposta médio e frescura da documentação (não apenas popularidade bruta), para incentivar qualidade.

**Casos de utilização:** criador percebe baixa taxa de conversão de impressões→keys e melhora a descrição/exemplos da API.

**Boas práticas UX/UI:** sugestões acionáveis e específicas, não apenas números abstratos.

**Responsividade:** cards e gráficos adaptáveis.

**Escalabilidade:** tracking de eventos assíncrono, não bloqueando a navegação do consumidor no catálogo.

**Segurança:** benchmarks de concorrência sempre anonimizados/agregados (nunca expõe dados de outra API individual).

**Performance:** insights atualizados diariamente (batch), não necessitam de tempo real.

---

### 2.18 Feedback e Avaliações

**Objetivo:** Consultar e responder a avaliações/feedback deixado por consumidores da API.

**Layout e estrutura:** resumo de rating médio e distribuição (histograma 1-5 estrelas) no topo, lista de reviews individuais abaixo.

**Componentes de interface:** `RatingSummaryCard`, `RatingDistributionChart`, `ReviewList`, `ReviewItem` (com opção de resposta pública do criador), `ReportReviewButton` (para reviews abusivas).

**Estados:** loading, vazio (API sem reviews ainda), erro, sucesso.

**Ações disponíveis:** responder publicamente a uma review, reportar review para moderação (spam/abuso), filtrar por rating/data.

**Fluxos de navegação:** Dashboard/Editar API → Feedback; review pode linkar ao contexto de uso (versão da API na altura da review).

**Permissões:** owner e colaboradores com permissão `respond_feedback`.

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/reviews`
- `POST /creator/apis/{id}/reviews/{id}/reply`
- `POST /creator/apis/{id}/reviews/{id}/report`

**Estrutura do backend:** reviews só podem ser deixadas por consumidores com uso verificado (pelo menos N requests realizados), para prevenir reviews falsas.

**Modelos de dados:** `Review(id, api_id, consumer_id, rating, comment, api_version_at_review, created_at)`, `ReviewReply(review_id, body, created_at)`.

**Regras de negócio:** apenas uma resposta pública por review (editável), sem troca infinita de mensagens (isso vai para Suporte se necessário).

**Casos de utilização:** criador responde publicamente a uma review de 2 estrelas explicando uma correção já lançada, potencialmente convertendo a perceção.

**Boas práticas UX/UI:** resposta do criador claramente identificada visualmente (badge "Resposta do Criador").

**Responsividade:** lista de reviews em cards, totalmente funcional em mobile.

**Escalabilidade:** paginação de reviews para APIs populares.

**Segurança:** moderação (automática + manual) para reviews com conteúdo ofensivo/spam antes de publicação pública.

**Performance:** rating médio pré-calculado (não recalculado a cada leitura sobre todas as reviews).

---

### 2.19 Configuração de Monetização

**Objetivo:** Definir o modelo de preços da API (gratuito, por uso, planos com quotas) e acompanhar a receita gerada.

**Layout e estrutura:** editor de planos de preços associados à API, seguido de resumo de receita e configuração de payout do criador.

**Componentes de interface:** `PricingModelSelector` (Free / Pay-as-you-go / Tiered plans), `PricingTierEditor` (preço por 1000 requests, quotas incluídas), `RevenueChart`, `PayoutSettingsForm` (dados bancários/conta de pagamento).

**Estados:** loading, vazio (API ainda não monetizada — modelo Free por defeito), erro (configuração de payout incompleta bloqueia ativação de planos pagos), sucesso.

**Ações disponíveis:** definir/alterar modelo de preços, ativar/desativar monetização, configurar conta de recebimento de pagamentos, consultar histórico de payouts.

**Fluxos de navegação:** Editar API → Monetização; ligado a Analytics da API (correlação uso↔receita) e Dashboard do Criador (resumo agregado).

**Permissões:** apenas owner pode alterar modelo de preços e dados de payout (dado o impacto financeiro e legal).

**Integrações com APIs / Endpoints:**
- `GET /creator/apis/{id}/pricing`
- `PUT /creator/apis/{id}/pricing`
- `GET /creator/payouts`
- `POST /creator/payout-settings`

**Estrutura do backend:** integração com processador de pagamentos que suporta marketplace/split payments (ex: Stripe Connect), calculando comissão da plataforma automaticamente em cada transação.

**Modelos de dados:** `ApiPricing(api_id, model, tiers_json)`, `Payout(creator_id, period, gross_amount, platform_fee, net_amount, status)`.

**Regras de negócio:** alteração de preços de uma API `Public` aplica-se apenas a novos ciclos de faturação dos consumidores, nunca retroativamente; comissão da plataforma definida globalmente (ex: 20%) e claramente visível ao criador em cada payout.

**Casos de utilização:** criador muda de modelo Free para Tiered depois de atingir X consumidores ativos, definindo um plano gratuito limitado e planos pagos com mais quota.

**Boas práticas UX/UI:** simulador de receita ("se tiveres X requests/mês, ganhas aproximadamente Y").

**Responsividade:** formulários em coluna única em mobile.

**Escalabilidade:** cálculo de comissões e payouts processado em batch periódico (ex: diário/mensal), não em tempo real por transação individual visível ao criador.

**Segurança:** dados bancários geridos exclusivamente pelo processador de pagamentos (tokenizados), nunca armazenados diretamente pela LogoHub.

**Performance:** dashboard de receita usa agregados pré-calculados, não somatórios em tempo real sobre transações brutas.

---

## Arquitetura de Backend Transversal

A plataforma assenta em serviços partilhados entre os perfis Consumidor e Criador:

- **Auth Service** — autenticação (JWT + refresh tokens), 2FA, gestão de sessões, SSO opcional para planos Enterprise.
- **API Key Service** — geração, hashing, validação e revogação de keys, com cache distribuído para validação de baixa latência no gateway.
- **API Gateway / Edge** — ponto único de entrada para todas as chamadas às APIs de terceiros, responsável por: autenticação, rate limiting, roteamento por versão, validação de schema, logging estruturado.
- **Usage Metering Pipeline** — captura eventos de cada pedido (stream), agrega em janelas de tempo (1 min / 1h / 1 dia) para alimentar dashboards, analytics e billing.
- **Billing Service** — integração com processador de pagamentos externo, gestão de subscrições, faturas e payouts a criadores (marketplace/split payments).
- **Notification Service** — motor de eventos que gera notificações in-app, email e webhooks a partir de eventos de domínio (quota, erros, feedback, billing).
- **Support Service** — tickets, FAQ, e integração opcional com chat ao vivo.
- **Catalog/Search Service** — índice de pesquisa das APIs publicadas, sincronizado por eventos de publicação/atualização.
- **Docs/Content Service** — armazenamento versionado de documentação markdown/MDX, servido via CDN.
- **Monitoring/Alerting Engine** — avaliação contínua de regras de alerta sobre métricas em near-real-time.

Todos os serviços comunicam preferencialmente por eventos assíncronos (message queue/event bus) para desacoplamento, com APIs síncronas apenas onde a experiência do utilizador exige resposta imediata (ex: criar API key, autenticação).

---

## Modelos de Dados Globais

Resumo dos principais agregados (schema ilustrativo, a mapear para Prisma):

- `User`, `Organization`, `OrganizationMember`
- `Project`, `ProjectMember`, `ApiKey`
- `Api`, `ApiVersion`, `Endpoint`, `AuthConfig`, `ApiDocVersion`, `ApiDocRevision`, `CodeExample`, `Sdk`
- `ApiCollaborator`
- `UsageMetric`, `LatencySample`, `RequestLog`, `ErrorGroup`
- `Subscription`, `PricingTier`, `ApiPricing`, `Invoice`, `Payout`
- `Notification`, `Webhook`
- `Ticket`, `TicketMessage`
- `ChangelogEntry`
- `Review`, `ReviewReply`
- `Session`, `TwoFactorSecret`
- `AlertRule`, `Incident`
- `MarketplaceEvent`

---

## Regras de Negócio Transversais

1. Nenhum valor financeiro é calculado no frontend — o backend é sempre a fonte de verdade.
2. Versões `Public` de uma API são imutáveis em termos de schema/comportamento; qualquer mudança exige nova versão.
3. Segredos (API key secrets, credenciais de payout, secrets de webhook) nunca são armazenados em claro nem reenviados após a criação.
4. Toda a verificação de permissão é feita server-side, independentemente do que a UI mostra/esconde.
5. Ações destrutivas (eliminar conta, projeto, revogar key) exigem confirmação explícita e, quando aplicável, reautenticação.
6. Dados de consumidores individuais nunca são expostos a criadores sem agregação/anonimização (conformidade com privacidade).

---

## Segurança, Performance e Escalabilidade

- **Segurança:** autenticação forte (JWT + 2FA opcional/obrigatório), hashing de segredos, proteção SSRF em webhooks/proxy do Playground, sanitização de todo o conteúdo gerado por utilizador (markdown, código), auditoria de ações sensíveis, conformidade com PCI-DSS (delegado ao processador de pagamentos) e GDPR (anonimização, direito ao apagamento).
- **Performance:** cache distribuído (Redis) para validação de API keys e rate limiting; agregações pré-computadas para dashboards e analytics; CDN para documentação e assets estáticos; queries com paginação cursor-based.
- **Escalabilidade:** arquitetura orientada a eventos para desacoplar métricas, notificações e webhooks do caminho crítico de cada pedido; workers assíncronos para tarefas pesadas (geração de SDKs, processamento de payouts); particionamento/retenção configurável de logs de alto volume.
