/**
 * Chart Service - Gerenciamento de gráficos
 * Criar e atualizar gráficos usando Chart.js
 */

class ChartService {
  static charts = {};

  static iniciarGrafico(canvasId, config) {
    try {
      const canvas = DOMService.selectById(canvasId);
      if (!canvas) {
        logger.warn(`Canvas não encontrado: #${canvasId}`);
        return null;
      }

      const ctx = canvas.getContext('2d');

      // Destruir gráfico anterior se existir
      if (this.charts[canvasId]) {
        this.charts[canvasId].destroy();
      }

      this.charts[canvasId] = new Chart(ctx, config);
      logger.debug(`Gráfico ${canvasId} criado`);
      return this.charts[canvasId];
    } catch (error) {
      logger.error(`Erro ao criar gráfico ${canvasId}`, error);
      return null;
    }
  }

  static graficoTaxaAtraso(entregas) {
    const entregasAtrasadas = entregas.filter(e => e.real > e.prazo).length;
    const entregasDentroPrazo = entregas.length - entregasAtrasadas;

    return {
      type: 'doughnut',
      data: {
        labels: ['No Prazo', 'Atrasado'],
        datasets: [{
          data: [entregasDentroPrazo, entregasAtrasadas],
          backgroundColor: ['#059669', '#dc2626'],
          borderColor: ['#047857', '#b91c1c'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { size: 12 }, padding: 15 }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        }
      }
    };
  }

  static graficoPerformanciaTransportadora(entregas) {
    const transportadoras = {};

    entregas.forEach(e => {
      if (!transportadoras[e.transportadora]) {
        transportadoras[e.transportadora] = { total: 0, atrasadas: 0 };
      }
      transportadoras[e.transportadora].total++;
      if (e.real > e.prazo) transportadoras[e.transportadora].atrasadas++;
    });

    const labels = Object.keys(transportadoras);
    const taxas = labels.map(t =>
      Math.round((transportadoras[t].atrasadas / transportadoras[t].total) * 100)
    );

    return {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Taxa de Atraso (%)',
          data: taxas,
          backgroundColor: taxas.map(t => t > 50 ? '#dc2626' : '#059669'),
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.x}% de atraso`
            }
          }
        },
        scales: {
          x: { max: 100, ticks: { callback: (v) => `${v}%` } }
        }
      }
    };
  }

  static graficoEntregasPorRegiao(entregas) {
    const regioes = {};

    entregas.forEach(e => {
      regioes[e.regiao] = (regioes[e.regiao] || 0) + 1;
    });

    const labels = Object.keys(regioes).sort();
    const dados = labels.map(r => regioes[r]);

    return {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Número de Entregas',
          data: dados,
          backgroundColor: '#3730a3',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'x',
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    };
  }

  static graficoTendenciaDias(entregas) {
    const dados = entregas.map(e => ({
      id: e.id,
      diferenca: e.real - e.prazo
    }));

    return {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Diferença (Real - Prazo)',
          data: dados.map((d, i) => ({ x: i + 1, y: d.diferenca })),
          backgroundColor: dados.map(d => d.diferenca > 0 ? '#dc2626' : '#059669'),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: (context) => {
                const dias = context.parsed.y;
                const texto = dias > 0 ? `+${dias} dias` : `${dias} dias`;
                return `${texto}`;
              }
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Entrega' } },
          y: { title: { display: true, text: 'Dias' } }
        }
      }
    };
  }

  static destruirGrafico(canvasId) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].destroy();
      delete this.charts[canvasId];
      logger.debug(`Gráfico ${canvasId} destruído`);
    }
  }
}
