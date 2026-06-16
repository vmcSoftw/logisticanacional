# 🚀 Guia de Deployment - Dashboard Logística

## ⚠️ REQUISITO CRÍTICO
O dashboard deve estar **publicamente acessível** com link permanente e sem necessidade de autenticação.

---

## 📋 Opção 1: GitHub Pages (RECOMENDADO)

### Vantagens:
✅ Hosting gratuito e permanente  
✅ Domínio incluído (username.github.io)  
✅ Sem limite de uptime  
✅ Fácil manutenção com Git  

### Passos:

#### 1. Preparar repositório GitHub
```bash
# Criar novo repositório público chamado "logistica-dashboard"
# No GitHub: New Repository → logistica-dashboard → Public
```

#### 2. Inicializar repositório local
```bash
cd "C:\Users\vinic\OneDrive\Desktop\19DEVSPRINT"
git init
git add .
git commit -m "Initial commit: Logistics dashboard with data visualization"
git branch -M main
git remote add origin https://github.com/SEU_USERNAME/logistica-dashboard.git
git push -u origin main
```

#### 3. Ativar GitHub Pages
```
Ir em: GitHub → Settings → Pages
Source: Branch: main → Folder: / (root)
Save
```

#### 4. Link resultante
```
https://SEU_USERNAME.github.io/logistica-dashboard/
```

✅ Dashboard acessível em 2-3 minutos

---

## 📋 Opção 2: Netlify (ALTERNATIVA FÁCIL)

### Vantagens:
✅ Interface visual intuitiva  
✅ Deployment automático via GitHub  
✅ Domínio customizado opcional  

### Passos:

#### 1. Conectar repositório
```
Ir em: netlify.com → Sign up (GitHub)
New site from Git → Authorize GitHub
Select repository: logistica-dashboard
```

#### 2. Configuração de build
```
Build command: (deixar em branco para site estático)
Publish directory: . (root)
Deploy
```

#### 3. Link resultante
```
https://[seu-site].netlify.app
```

✅ Dashboard online em 1 minuto

---

## 📋 Opção 3: Vercel (AINDA MAIS FÁCIL)

### Passos:

#### 1. Conectar
```
Ir em: vercel.com → GitHub
Import Project → logistica-dashboard
Deploy
```

#### 2. Link resultante
```
https://logistica-dashboard.vercel.app
```

✅ Deployment automático em cada push ao Git

---

## 📋 Opção 4: Servidor Python (LOCAL/VPS)

Se preferir hospedar em servidor próprio:

```bash
# Rodar servidor
python server.py

# Acesso local
http://localhost:8000

# Para VPS/servidor remoto:
# Configurar firewall e domínio DNS
```

---

## ✅ Checklist Pré-Deployment

- [ ] Todos os arquivos estão commitados
- [ ] `index.html` aponta para `config.js` correto
- [ ] `config.api.url` está configurado para o endpoint correto
- [ ] `db.json` ou API endpoint está acessível
- [ ] Browser console sem erros (F12)
- [ ] Todos os charts carregam corretamente
- [ ] Filtros funcionam
- [ ] Paginação funciona
- [ ] Responsividade testada em mobile

---

## 🔧 Configuração de API para Production

### Opção A: json-server remoto (Heroku/Render)

```bash
# Deploy db.json para json-server remoto
# Usar: https://json-server-example.herokuapp.com/db
```

### Opção B: Backend API próprio
```javascript
// Em config.js
this.api = {
  url: 'https://seu-backend.com/api',
  endpoints: {
    entregas: '/entregas'
  }
};
```

### Opção C: Dados estáticos (DEMO)
Se usando demo.html ou dados embutidos, nenhuma configuração necessária.

---

## 📞 Troubleshooting

| Problema | Solução |
|----------|---------|
| "404 Not Found" | Verificar branch (main), pasta (root), arquivo index.html |
| CORS error | API deve permitir Origin `*` ou seu domínio |
| Dados não carregam | Verificar URL da API em config.js |
| Charts em branco | Verificar se chart.js CDN está acessível |
| Modo debug ativo | Desativar em production: `DEBUG_MODE=false` |

---

## 📊 Próximos Passos

1. Escolher plataforma (GitHub Pages ← RECOMENDADO)
2. Fazer push do repositório
3. Ativar GitHub Pages
4. Testar link público
5. Enviar link para avaliadores
6. Manter link ativo até fim do desafio

**Tempo estimado: 15 minutos**

---

## 🔗 Links de Referência

- GitHub Pages: https://pages.github.com/
- Netlify: https://netlify.com
- Vercel: https://vercel.com
- json-server deployment: https://github.com/typicode/json-server#deploy

