/**
 * Data Service - Processamento e cálculo de dados
 * Contém toda a lógica de negócio
 */

class DataService {
  static calcularMetricas(entregas) {
    if (!Array.isArray(entregas) || entregas.length === 0) {
      return {
        total: 0,
        atrasadas: 0,
        dentroPrazo: 0,
        taxaAtraso: 0
      };
    }

    const entregasAtrasadas = entregas.filter(e => e.real > e.prazo);
    const total = entregas.length;
    const taxaAtraso = Math.round((entregasAtrasadas.length / total) * 100);

    return {
      total,
      atrasadas: entregasAtrasadas.length,
      dentroPrazo: total - entregasAtrasadas.length,
      taxaAtraso
    };
  }

  static obterMelhorPerformance(entregas) {
    if (!Array.isArray(entregas) || entregas.length === 0) {
      return null;
    }

    return entregas.reduce((prev, current) => {
      const prevDiff = Math.abs(prev.real - prev.prazo);
      const currentDiff = Math.abs(current.real - current.prazo);
      return currentDiff < prevDiff ? current : prev;
    });
  }

  static obterPiorPerformance(entregas) {
    if (!Array.isArray(entregas) || entregas.length === 0) {
      return null;
    }

    return entregas.reduce((prev, current) => {
      const prevDelay = prev.real - prev.prazo;
      const currentDelay = current.real - current.prazo;
      return currentDelay > prevDelay ? current : prev;
    });
  }

  static obterRegiaoCritica(entregas) {
    if (!Array.isArray(entregas) || entregas.length === 0) {
      return null;
    }

    const regionStats = {};
    entregas.forEach(e => {
      if (!regionStats[e.regiao]) {
        regionStats[e.regiao] = { total: 0, atrasadas: 0 };
      }
      regionStats[e.regiao].total++;
      if (e.real > e.prazo) regionStats[e.regiao].atrasadas++;
    });

    return Object.entries(regionStats).reduce((prev, [region, stats]) => {
      const prevTaxa = (prev[1].atrasadas / prev[1].total) || 0;
      const currentTaxa = (stats.atrasadas / stats.total) || 0;
      return currentTaxa > prevTaxa ? [region, stats] : prev;
    });
  }

  static filtrarEntregas(entregas, termo) {
    if (!termo) return entregas;

    const termoLower = termo.toLowerCase();
    return entregas.filter(e =>
      e.transportadora.toLowerCase().includes(termoLower) ||
      e.regiao.toLowerCase().includes(termoLower) ||
      e.id.toString().includes(termoLower)
    );
  }

  static paginar(entregas, pagina, itemsPorPagina) {
    const inicio = (pagina - 1) * itemsPorPagina;
    const fim = inicio + itemsPorPagina;
    return {
      dados: entregas.slice(inicio, fim),
      total: entregas.length,
      paginas: Math.ceil(entregas.length / itemsPorPagina)
    };
  }
}
