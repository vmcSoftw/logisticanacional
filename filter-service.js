/**
 * Filter Service - Gerenciamento de filtros avançados
 * Filtros por transportadora, região, status e período
 */

class FilterService {
  constructor() {
    this.filtros = {
      transportadora: null,
      regiao: null,
      status: null,  // null, 'atrasado', 'no-prazo'
      minDias: null,
      maxDias: null
    };
  }

  aplicarFiltros(entregas) {
    let resultado = [...entregas];

    if (this.filtros.transportadora) {
      resultado = resultado.filter(e =>
        e.transportadora === this.filtros.transportadora
      );
    }

    if (this.filtros.regiao) {
      resultado = resultado.filter(e =>
        e.regiao === this.filtros.regiao
      );
    }

    if (this.filtros.status) {
      resultado = resultado.filter(e => {
        const isAtrasado = e.real > e.prazo;
        return this.filtros.status === 'atrasado' ? isAtrasado : !isAtrasado;
      });
    }

    if (this.filtros.minDias !== null) {
      resultado = resultado.filter(e => (e.real - e.prazo) >= this.filtros.minDias);
    }

    if (this.filtros.maxDias !== null) {
      resultado = resultado.filter(e => (e.real - e.prazo) <= this.filtros.maxDias);
    }

    logger.debug('Filtros aplicados', this.filtros);
    return resultado;
  }

  setTransportadora(transportadora) {
    this.filtros.transportadora = transportadora || null;
  }

  setRegiao(regiao) {
    this.filtros.regiao = regiao || null;
  }

  setStatus(status) {
    this.filtros.status = status || null;
  }

  setIntervalo(min, max) {
    this.filtros.minDias = min;
    this.filtros.maxDias = max;
  }

  limpar() {
    this.filtros = {
      transportadora: null,
      regiao: null,
      status: null,
      minDias: null,
      maxDias: null
    };
    logger.debug('Filtros limpados');
  }

  obterTransportadoras(entregas) {
    return [...new Set(entregas.map(e => e.transportadora))].sort();
  }

  obterRegioes(entregas) {
    return [...new Set(entregas.map(e => e.regiao))].sort();
  }

  obterOpções(entregas) {
    return {
      transportadoras: this.obterTransportadoras(entregas),
      regioes: this.obterRegioes(entregas),
      status: ['no-prazo', 'atrasado']
    };
  }
}

const filterService = new FilterService();
