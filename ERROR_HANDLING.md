# 🛡️ Guia de Tratamento de Erros e Variáveis de Ambiente

## Variáveis de Ambiente

### Arquivo: `.env`

Configurações por ambiente. **NUNCA commitar `.env`**, usar `.env.example` como template.

```bash
# Copiar e editar
cp .env.example .env
```

### Variáveis Disponíveis

#### API
```env
# URL base da API
VITE_API_URL=http://localhost:3000

# Timeout em milissegundos
VITE_API_TIMEOUT=10000
```

#### Aplicação
```env
# Itens por página na tabela
VITE_ITEMS_PER_PAGE=10

# Ambiente: development | production
VITE_ENVIRONMENT=development

# Modo debug (mais logs e dados expostos)
VITE_DEBUG_MODE=true
```

#### Logging
```env
# Nível de log: error, warn, info, debug
VITE_LOG_LEVEL=debug
```

### Exemplo: Configurar Produção

```env
# .env (produção)
VITE_API_URL=https://api.production.com
VITE_API_TIMEOUT=5000
VITE_ITEMS_PER_PAGE=20
VITE_ENVIRONMENT=production
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

---

## Tratamento de Erros

### Hierarquia de Erros

```
┌─────────────────────────────────────┐
│ Error Handling Strategy             │
├─────────────────────────────────────┤
│ 1. ApiError (API failures)          │
│    ├─ Network error                 │
│    ├─ Timeout (504)                 │
│    ├─ Status error (4xx, 5xx)       │
│    └─ Invalid data                  │
├─────────────────────────────────────┤
│ 2. DOM Error (UI manipulation)      │
│    ├─ Element not found (warning)   │
│    └─ Update failure (try/catch)    │
├─────────────────────────────────────┤
│ 3. Data Error (calculation)         │
│    └─ Invalid types (validation)    │
├─────────────────────────────────────┤
│ 4. Critical Error (app crash)       │
│    └─ Fallback UI (graceful)        │
└─────────────────────────────────────┘
```

### 1. ApiError - Camada de API

**Arquivo**: `api-service.js`

**Classe**: `ApiError`

```javascript
class ApiError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;        // HTTP status
    this.details = details;      // Extra info
  }
}
```

**Lançamento de Erros**:
```javascript
// Erro de timeout
if (error.name === 'AbortError') {
  throw new ApiError(`Request timeout after ${this.timeout}ms`, 504);
}

// Erro de resposta
if (!response.ok) {
  throw new ApiError(
    `API Error: ${response.statusText}`,
    response.status,
    await response.json().catch(() => null)
  );
}
```

**Captura no App**:
```javascript
try {
  const data = await apiService.get('/entregas');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 504) {
      logger.error('Timeout: API demorou demais');
    } else if (error.status >= 500) {
      logger.error('Erro no servidor');
    } else {
      logger.error('Erro na requisição', error.details);
    }
  }
  this.tratarErro('Falha ao carregar dados', error);
}
```

---

### 2. DOM Service - Elementos Não Encontrados

**Arquivo**: `dom-service.js`

**Estratégia**: Warning em vez de erro

```javascript
static selectById(id) {
  const element = document.getElementById(id);
  if (!element) {
    logger.warn(`Element not found: #${id}`);
    return null;  // Não quebra a app
  }
  return element;
}
```

**Verificação na Renderização**:
```javascript
const tbody = DOMService.selectById('corpo-tabela');
if (!tbody) {
  logger.error('Tabela não encontrada');
  return;  // Safe return
}
tbody.innerHTML = '...';
```

---

### 3. Data Service - Validação

**Arquivo**: `data-service.js`

**Validação de Entrada**:
```javascript
static calcularMetricas(entregas) {
  // Validar tipo e conteúdo
  if (!Array.isArray(entregas) || entregas.length === 0) {
    return {
      total: 0,
      atrasadas: 0,
      dentroPrazo: 0,
      taxaAtraso: 0
    };
  }

  // Operações seguras
  const entregasAtrasadas = entregas.filter(e => e.real > e.prazo);
  // ...
}
```

---

### 4. UI Service - Try/Catch Wrapper

**Arquivo**: `ui-service.js`

**Pattern**: Cada método com seu try/catch

```javascript
static renderizarKPIs(metricas) {
  try {
    DOMService.setText('kpi-total', metricas.total);
    DOMService.setText('kpi-atraso', `${metricas.taxaAtraso}%`);
    // ... outras operações
    logger.debug('KPIs renderizados', metricas);
  } catch (error) {
    logger.error('Erro ao renderizar KPIs', error);
    // Não relança - UI continua funcionando
  }
}
```

---

### 5. App - Tratamento Centralizado

**Arquivo**: `app.js`

**Classe**: `LogisticaDashboard`

```javascript
async inicializar() {
  try {
    UIService.mostrarLoader(true);
    menuService.inicializar();
    
    await this.carregarDados();  // Pode lançar
    this.atualizarDashboard();   // Safe (try/catch interno)
    this.configurarEventListeners();

    this.inicializado = true;
  } catch (error) {
    this.tratarErro('Erro ao inicializar', error);
  } finally {
    UIService.mostrarLoader(false);
  }
}

tratarErro(mensagem, erro) {
  logger.error(mensagem, erro);
  
  // Mostrar erro na tela
  const tbody = DOMService.selectById('corpo-tabela');
  if (tbody) {
    const msg = config.app.debugMode 
      ? erro?.message 
      : 'Erro ao carregar dados';
    
    DOMService.setHTML(
      'corpo-tabela',
      `<tr><td colspan="6" style="text-align:center; color:#dc2626">⚠️ ${msg}</td></tr>`
    );
  }
}
```

---

## Cenários de Erro

### Cenário 1: API Offline

```javascript
try {
  await apiService.get('/entregas');
} catch (error) {
  // error.message: "Network error: fetch failed"
  logger.error('API offline', error);
  
  // Fallback: Mostrar mensagem amigável
  DOMService.setHTML('corpo-tabela', 
    '<tr><td colspan="6">API não disponível</td></tr>'
  );
}
```

### Cenário 2: Timeout

```javascript
// ApiService com timeout de 10s
const controller = new AbortController();
const timeoutId = setTimeout(
  () => controller.abort(),
  this.timeout
);

// Se timeout:
// error.name === 'AbortError'
// → throw new ApiError(..., 504)

// No catch:
if (error instanceof ApiError && error.status === 504) {
  logger.warn('Requisição expirou');
}
```

### Cenário 3: Dados Inválidos

```javascript
this.entregasCompletas = await apiService.get('/entregas');

if (!Array.isArray(this.entregasCompletas)) {
  throw new Error('Dados inválidos: esperado um array');
  // Capturado em app.js → tratarErro()
}
```

### Cenário 4: Elemento DOM Faltando

```javascript
// safe - retorna null, não quebra
const element = DOMService.selectById('elemento-inexistente');

// com verificação
if (element) {
  DOMService.setText('elemento-inexistente', 'texto');
}
```

### Cenário 5: Modo Debug vs Produção

```javascript
// Development
{
  "debugMode": true,
  "message": "TypeError: e.real is not a number"  // Detalhado
}

// Production
{
  "debugMode": false,
  "message": "Erro ao carregar dados"  // Genérico
}
```

---

## Logger - Usando em Desenvolvimento

### Configuração Dev

```env
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

### Saída de Logs

```javascript
logger.error('[ERROR] Falha na API', { status: 500 });
logger.warn('[WARN] Elemento não encontrado', '#corpo-tabela');
logger.info('[INFO] Dashboard iniciado', { version: '2.0' });
logger.debug('[DEBUG] Filtro aplicado', { count: 5 });
```

### Acessar Dashboard em Dev

```javascript
// No console do navegador
window.__dashboard

// Inspecionar estado
console.log(window.__dashboard.entregasCompletas);
console.log(window.__dashboard.paginaAtual);
```

---

## Checklist de Implementação

- ✅ **API Service**: ApiError com tratamento
- ✅ **Logger**: 4 níveis (error, warn, info, debug)
- ✅ **DOM Service**: Warnings em vez de erros
- ✅ **Data Service**: Validação de tipos
- ✅ **UI Service**: Try/catch em cada método
- ✅ **App.js**: Try/catch/finally na inicialização
- ✅ **Config**: Variáveis de ambiente centralizadas
- ✅ **Debug Mode**: Mostrar/esconder detalhes de erro
- ✅ **.env.example**: Template para novos devs

---

## Best Practices

### ✅ Fazer

```javascript
// 1. Validar entrada
if (!Array.isArray(data)) return [];

// 2. Logar contexto
logger.error('Erro ao processar', { operation: 'filter', count: 10 });

// 3. Retornar valor padrão
return null;  // ou []

// 4. Usar try/catch para I/O
try {
  await fetch();
} catch (error) {
  logger.error('Fetch falhou', error);
}

// 5. Diferenciar erros
if (error instanceof ApiError) { ... }
```

### ❌ Evitar

```javascript
// 1. Console.log em produção
console.log('debug');  // Use logger.debug()

// 2. Ignorar erros
try { ... } catch (e) {}  // Sempre logar!

// 3. Quebrar a app
throw error;  // Em UI - tratarErro() em vez disso

// 4. Mensagens genéricas
logger.error('Erro');  // Adicione contexto

// 5. Hardcoded values
const url = 'http://localhost:3000';  // Use config.api.url
```

---

**Status**: Production Ready ✅
**Última atualização**: 2024-06-15
