# 🏗️ Arquitetura da Aplicação - Dashboard Logística

## Visão Geral

A aplicação segue um padrão modularizado com separação clara de responsabilidades, facilitando manutenção, testes e escalabilidade.

## 📦 Estrutura de Módulos

```
app/
├── config.js              # Configuração centralizada
├── logger.js              # Sistema de logging
├── api-service.js         # Camada de API (fetch, timeouts, retry)
├── dom-service.js         # Manipulação de DOM
├── data-service.js        # Lógica de dados e negócio
├── ui-service.js          # Renderização de componentes
├── menu-service.js        # Gerenciamento do menu
├── app.js                 # Orquestração principal
├── index.html             # HTML semântico
├── style.css              # CSS com mobile-first
└── db.json                # Dados (json-server)
```

## 🔄 Fluxo de Dependências

```
config.js
   ↓
logger.js
   ↓
api-service.js ←→ logger.js
   ↓
dom-service.js ←→ logger.js
   ↓
data-service.js
   ↓
ui-service.js ←→ dom-service.js, data-service.js, logger.js
   ↓
menu-service.js ←→ dom-service.js, logger.js
   ↓
app.js ←→ [todos os serviços]
```

## 📄 Documentação dos Módulos

### 1. **config.js** - Configuração Centralizada

**Responsabilidade**: Gerenciar todas as variáveis de ambiente e constantes

**Classe**: `Config`

**Propriedades**:
- `api.url` - URL base da API
- `api.timeout` - Timeout de requisição (ms)
- `api.endpoints` - Mapa de endpoints
- `app.itemsPerPage` - Itens por página
- `app.environment` - Ambiente (development/production)
- `app.debugMode` - Modo debug ativo
- `logging.level` - Nível de log

**Métodos**:
```javascript
getEnv(key, defaultValue)        // Retorna variável de ambiente
getEnvNumber(key, defaultValue)  // Converte para número
getEnvBoolean(key, defaultValue) // Converte para boolean
getApiUrl(endpoint)              // Monta URL completa
isDevelopment()                  // Verifica se é dev
isProduction()                   // Verifica se é produção
```

**Uso**:
```javascript
const url = config.getApiUrl(config.api.endpoints.entregas);
```

---

### 2. **logger.js** - Sistema de Logging

**Responsabilidade**: Centralizar toda saída de logs com níveis de severidade

**Classe**: `Logger`

**Níveis**:
- `error` (0) - Erros críticos
- `warn` (1) - Avisos
- `info` (2) - Informações
- `debug` (3) - Debug (apenas em dev)

**Métodos**:
```javascript
logger.error(message, data)   // Log de erro
logger.warn(message, data)    // Log de aviso
logger.info(message, data)    // Log informativo
logger.debug(message, data)   // Log de debug (dev only)
```

**Uso**:
```javascript
logger.info('Aplicação iniciada');
logger.debug('Dados carregados', { count: 10 });
logger.error('Erro na API', error);
```

---

### 3. **api-service.js** - Camada de API

**Responsabilidade**: Gerenciar comunicação com API

**Classe**: `ApiService`

**Funcionalidades**:
- Abstração de `fetch`
- Timeout automático
- Tratamento de erros
- Logging automático

**Métodos**:
```javascript
async get(endpoint, options)      // GET request
async post(endpoint, data, opts)  // POST request
```

**Tratamento de Erros**:
- `ApiError` - Erro customizado
- Timeout → Status 504
- Network → Error handler

**Uso**:
```javascript
try {
  const data = await apiService.get('/entregas');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(`Erro ${error.status}: ${error.message}`);
  }
}
```

---

### 4. **dom-service.js** - Manipulação de DOM

**Responsabilidade**: Centralizar operações com DOM

**Métodos Estáticos**:
```javascript
selectById(id)                      // querySelector por ID
selectAll(selector)                 // querySelectorAll
setText(id, text)                   // Atualizar textContent
setHTML(id, html)                   // Atualizar innerHTML
addClass(id, className)             // Adicionar classe
removeClass(id, className)          // Remover classe
toggleClass(id, className)          // Toggle classe
setStyle(id, property, value)       // Atualizar style
addEventListener(id, event, fn)    // Adicionar listener
removeEventListener(id, event, fn)  // Remover listener
setDisabled(id, disabled)           // Desabilitar elemento
```

**Vantagens**:
- Sem repetição de `getElementById`
- Logging de warnings (elemento não encontrado)
- API consistente

**Uso**:
```javascript
DOMService.setText('kpi-total', '100');
DOMService.addClass('loader', 'active');
DOMService.setStyle('kpi-atraso', 'color', '#dc2626');
```

---

### 5. **data-service.js** - Lógica de Dados

**Responsabilidade**: Processar e calcular dados

**Métodos Estáticos**:
```javascript
calcularMetricas(entregas)           // KPIs (total, atraso, etc)
obterMelhorPerformance(entregas)     // Melhor transportadora
obterPiorPerformance(entregas)       // Pior transportadora
obterRegiaoCritica(entregas)         // Região com mais atraso
filtrarEntregas(entregas, termo)     // Filtro por termo
paginar(entregas, pagina, itemsPerPage) // Paginação
```

**Exemplo de Saída**:
```javascript
const metricas = DataService.calcularMetricas(entregas);
// {
//   total: 10,
//   atrasadas: 4,
//   dentroPrazo: 6,
//   taxaAtraso: 40
// }

const pag = DataService.paginar(entregas, 1, 10);
// {
//   dados: [...],
//   total: 100,
//   paginas: 10
// }
```

---

### 6. **ui-service.js** - Renderização de Componentes

**Responsabilidade**: Renderizar componentes na tela

**Métodos Estáticos**:
```javascript
renderizarKPIs(metricas)                 // KPI cards
renderizarTabela(entregas, pag, items)   // Table rows
renderizarInsights(entregas)             // Insight cards
mostrarLoader(mostrar)                   // Show/hide loader
atualizarPaginacao(total, atual, qtd)    // Pagination UI
```

**Tratamento de Erros**: Tenta/catch em cada método

**Uso**:
```javascript
const metricas = DataService.calcularMetricas(data);
UIService.renderizarKPIs(metricas);  // Renderiza KPIs
```

---

### 7. **menu-service.js** - Gerenciamento de Menu

**Responsabilidade**: Controlar menu hambúrguer

**Classe**: `MenuService`

**Métodos**:
```javascript
inicializar()   // Setup event listeners
alternar()      // Toggle menu
abrir()         // Abrir menu
fechar()        // Fechar menu
```

**Uso**:
```javascript
menuService.inicializar();
```

---

### 8. **app.js** - Orquestração Principal

**Responsabilidade**: Coordenar toda a aplicação

**Classe**: `LogisticaDashboard`

**Métodos**:
```javascript
inicializar()                 // Setup inicial
carregarDados()              // Fetch da API
atualizarDashboard()         // Atualizar UI completa
configurarEventListeners()   // Setup listeners
handleFiltro(event)          // Processar filtro
paginaAnterior()             // Página anterior
proximaPagina()              // Próxima página
tratarErro(msg, erro)        // Tratamento de erro
```

**Fluxo de Inicialização**:
1. Mostrar loader
2. Inicializar menu
3. Carregar dados da API
4. Renderizar dashboard completo
5. Configurar event listeners
6. Esconder loader

---

## 🚀 Ordem de Carregamento

Os scripts devem ser carregados nesta ordem no HTML:

```html
<script src="config.js"></script>           <!-- Config global -->
<script src="logger.js"></script>           <!-- Logger (usa config) -->
<script src="api-service.js"></script>      <!-- API (usa config, logger) -->
<script src="dom-service.js"></script>      <!-- DOM (usa logger) -->
<script src="data-service.js"></script>     <!-- Data (independente) -->
<script src="ui-service.js"></script>       <!-- UI (usa dom, data, logger) -->
<script src="menu-service.js"></script>     <!-- Menu (usa dom, logger) -->
<script src="app.js"></script>              <!-- Main (usa todos) -->
```

---

## 🛡️ Tratamento de Erros

### Hierarquia de Erros

```
Error
  ├── ApiError          (api-service.js)
  │   ├── Status 404/500
  │   ├── Timeout 504
  │   └── Network error
  └── Generic Error     (try/catch)
      └── DOM/Parsing errors
```

### Estratégia de Erro

1. **API**: `ApiError` customizado com status
2. **DOM**: Logger warning se elemento não encontrado
3. **Dados**: Validação de tipos
4. **UI**: Try/catch em cada renderização
5. **App**: Catch e fallback com mensagem

---

## 📈 Escalabilidade

### Adicionar Nova Feature

1. **Criar novo serviço** (ex: `report-service.js`)
```javascript
class ReportService {
  static gerar(entregas) { ... }
  static exportar(dados) { ... }
}
```

2. **Injetar no app.js**
```javascript
async inicializar() {
  await this.carregarDados();
  this.relatorio = ReportService.gerar(this.entregasCompletas);
}
```

3. **Reutilizar em múltiplos lugares**
- Sem duplicação de código
- Sem efeitos colaterais
- Fácil de testar

---

## 🧪 Testabilidade

Cada serviço pode ser testado isoladamente:

```javascript
// Testar DataService sem DOM/API
const metricas = DataService.calcularMetricas(mockData);
assert(metricas.taxaAtraso === 40);

// Testar UIService com stubs
DOMService.selectById = () => mockElement;
UIService.renderizarKPIs(mockMetricas);

// Testar ApiService com jest/mock
jest.mock('fetch');
await apiService.get('/entregas');
```

---

## 🔧 Configuração de Ambiente

### .env (Desenvolvimento)
```
VITE_API_URL=http://localhost:3000
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### .env.production (Produção)
```
VITE_API_URL=https://api.production.com
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

---

## 📊 Métricas de Qualidade

| Métrica | Alvo | Status |
|---------|------|--------|
| Coesão | Alta | ✅ |
| Acoplamento | Baixo | ✅ |
| Testabilidade | Alta | ✅ |
| Reusabilidade | Alta | ✅ |
| Manutenibilidade | Alta | ✅ |
| Cyclomatic Complexity | <10 | ✅ |

---

## 🎓 Padrões Utilizados

- **Singleton**: Config, Logger, Services
- **Facade**: UIService (abstrai complexidade)
- **MVC**: Data (model) → UI (view) → App (controller)
- **Dependency Injection**: config → logger → api
- **Observer**: Event listeners em menu

---

**Versão**: 2.0 (Modularizada)
**Status**: Production Ready ✅
