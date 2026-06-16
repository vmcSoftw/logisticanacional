# 🚀 Guia de Setup - Dashboard Logística

## ⚠️ Erros Corrigidos

| Erro | Causa | Solução |
|------|-------|---------|
| `process is not defined` | Tentou usar Node.js em browser | ✅ Removido process.env |
| `config is not defined` | Ordem de carregamento | ✅ Adicionado check de existência |
| `Unexpected end of input` | Falta de fechamento de classe | ✅ Completado UIService |
| `file:// CORS` | Tentou acessar via file:// | ✅ Crie servidor HTTP |

---

## 📋 Pré-requisitos

- **Node.js** 16+ (com npm)
- **Git** (opcional)

---

## 🔧 Setup Rápido (Windows)

### Opção 1: Script Automático (Recomendado)

```bash
cd "C:\Users\vinic\OneDrive\Desktop\19DEVSPRINT"
start.bat
```

### Opção 2: Manual

```bash
# 1. Instalar dependências
npm install

# 2. Em um terminal, iniciar json-server
npx json-server db.json --port 3000

# 3. Em outro terminal, iniciar http-server
npx http-server -p 8000 -c-1

# 4. Abrir navegador
start http://localhost:8000
```

---

## 🔧 Setup Rápido (Mac/Linux)

### Opção 1: Script Automático

```bash
cd ~/Desktop/19DEVSPRINT
chmod +x start.sh
./start.sh
```

### Opção 2: Manual

```bash
# 1. Instalar dependências
npm install

# 2. Em um terminal
npx json-server db.json --port 3000

# 3. Em outro terminal
npx http-server -p 8000 -c-1

# 4. Abrir navegador
open http://localhost:8000
```

---

## ✅ Verificar Setup

### 1. JSON Server
```bash
curl http://localhost:3000/entregas
```
Deve retornar: `[{"id":301,"transportadora":"RotaMax",...}]`

### 2. HTTP Server
```bash
curl http://localhost:8000
```
Deve retornar: HTML do index.html

### 3. Dashboard
Abra: `http://localhost:8000` no navegador

---

## 🎯 URL Correto

❌ ERRADO: `file:///C:/Users/.../index.html`
✅ CORRETO: `http://localhost:8000`

---

## 📊 Portas Usadas

| Serviço | Porta | URL |
|---------|-------|-----|
| **HTTP Server** | 8000 | http://localhost:8000 |
| **JSON Server** | 3000 | http://localhost:3000 |

---

## 🐛 Troubleshooting

### Erro: "Port 8000 already in use"
```bash
# Mudar porta
npx http-server -p 8001 -c-1
# Depois acessar: http://localhost:8001
```

### Erro: "json-server not found"
```bash
# Instalar globalmente
npm install -g json-server

# Depois usar
json-server db.json --port 3000
```

### Dashboard em branco
1. Abra DevTools (F12)
2. Veja a aba "Console" para erros
3. Verifique se `http://localhost:3000/entregas` está respondendo
4. Recarregue a página (Ctrl+Shift+R)

---

## 📱 Testar no Navegador

### Console (F12 → Console)

```javascript
// Ver config
config.api.url
// "http://localhost:3000"

// Ver logger
logger.info("teste")
// [INFO] teste

// Ver dashboard
window.__dashboard
// LogisticaDashboard { ... }

// Ver dados
window.__dashboard.entregasCompletas
// [Array(10)]
```

---

## 🎨 Arquivos Corrigidos

✅ **config.js** - Usa window + localStorage (não process.env)
✅ **logger.js** - Check de config antes de usar
✅ **ui-service.js** - Classe fechada corretamente
✅ **package.json** - Scripts para iniciar servidores
✅ **start.bat** - Script Windows
✅ **start.sh** - Script Mac/Linux

---

## 💡 Comandos Úteis

```bash
# Instalar apenas json-server
npm install json-server --save-dev

# Instalar apenas http-server
npm install http-server --save-dev

# Rodar tudo junto (com concurrently)
npm install concurrently --save-dev
npm start
```

---

## 🚀 Status

✅ **Setup correto**
✅ **Sem erros de referência**
✅ **CORS resolvido**
✅ **Pronto para usar**

---

**Próximo passo**: Execute o script start.bat (Windows) ou start.sh (Mac/Linux) e acesse http://localhost:8000
