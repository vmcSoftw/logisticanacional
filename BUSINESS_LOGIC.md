# 📋 Lógica de Negócio - Cálculo de Atrasos

## Definição de Atraso

Uma entrega está **atrasada** quando:
```
dias_reais > prazo_dias
```

Uma entrega está **no prazo** quando:
```
dias_reais ≤ prazo_dias
```

---

## Dados Utilizados

| Campo | Descrição |
|-------|-----------|
| `id` | ID da entrega |
| `transportadora` | Nome da transportadora |
| `regiao` | Região de entrega |
| `prazo` | Dias prometidos para entrega |
| `real` | Dias reais de entrega |

**Propriedades no código:**
- Na tabela visualizada: `prazo_dias` e `dias_reais`
- No código JavaScript: `prazo` e `real`

---

## Métricas Calculadas

### 1. Taxa de Atraso
```javascript
const entregasAtrasadas = entregas.filter(e => e.real > e.prazo);
taxaAtraso = (entregasAtrasadas.length / total) * 100
```

**Exemplo:**
- Total: 10 entregas
- Atrasadas: 7
- **Taxa: 70%**

---

### 2. Melhor Performance
- **Critério:** Entrega com menor diferença entre `real` e `prazo` (em valor absoluto)
- **Fórmula:** `min(|real - prazo|)`

**Exemplo:**
- 301: |7 - 3| = 4
- 302: |5 - 5| = **0** ← Melhor
- 303: |9 - 4| = 5

---

### 3. Pior Performance
- **Critério:** Entrega com maior atraso (maior valor de `real - prazo`)
- **Fórmula:** `max(real - prazo)` onde `real > prazo`

**Exemplo:**
- 301: 7 - 3 = 4
- 303: 9 - 4 = 5
- 306: 12 - 5 = **7** ← Pior

---

### 4. Região Crítica
- **Critério:** Região com maior taxa de atraso
- **Fórmula:** `max(atrasadas_regiao / total_regiao)`

**Exemplo:**
| Região | Total | Atrasadas | Taxa |
|--------|-------|-----------|------|
| Centro-Oeste | 1 | 1 | 100% |
| Nordeste | 2 | 2 | **100%** ← Crítica |
| Norte | 2 | 0 | 0% |
| Sudeste | 2 | 2 | 100% |
| Sul | 3 | 2 | 67% |

---

## Dados de Teste (10 Entregas)

| ID | Transportadora | Região | Prazo | Real | Status | Diff |
|----|---|---|------|------|--------|------|
| 301 | RotaMax | Sudeste | 3 | 7 | Atrasado | +4 |
| 302 | ViaCargo | Sul | 5 | 5 | No Prazo | 0 |
| 303 | FlashLog | Nordeste | 4 | 9 | Atrasado | +5 |
| 304 | RotaMax | Norte | 6 | 4 | No Prazo | -2 |
| 305 | ViaCargo | Centro-Oeste | 2 | 6 | Atrasado | +4 |
| 306 | FlashLog | Sul | 5 | 12 | Atrasado | +7 |
| 307 | RotaMax | Sul | 6 | 9 | Atrasado | +3 |
| 308 | ViaCargo | Sudeste | 3 | 4 | Atrasado | +1 |
| 309 | FlashLog | Norte | 5 | 5 | No Prazo | 0 |
| 310 | ViaCargo | Nordeste | 4 | 8 | Atrasado | +4 |

**Resumo:**
- ✅ No Prazo: **3** (302, 304, 309)
- ❌ Atrasadas: **7** (301, 303, 305, 306, 307, 308, 310)
- 📊 Taxa de Atraso: **70%**

---

## Performance por Transportadora

| Transportadora | Total | Atrasadas | Taxa |
|---|---|---|---|
| RotaMax | 3 | 2 | 67% |
| ViaCargo | 4 | 3 | 75% |
| FlashLog | 3 | 2 | 67% |

---

## Performance por Região

| Região | Total | Atrasadas | Taxa |
|---|---|---|---|
| Centro-Oeste | 1 | 1 | 100% |
| Nordeste | 2 | 2 | 100% |
| Norte | 2 | 0 | 0% |
| Sudeste | 2 | 2 | 100% |
| Sul | 3 | 2 | 67% |

---

## Insights

- 🏆 **Melhor Performance:** ViaCargo (entrega #302, Sul, 0 dias de diferença)
- ⚠️ **Maior Atraso:** FlashLog (entrega #306, Sul, +7 dias)
- 📍 **Região Crítica:** Nordeste (100% de atraso - ambas entregas atrasadas)

