/**
 * UI Service - Renderização de componentes
 * Centraliza todas as operações de UI
 */

class UIService {
  static renderizarKPIs(metricas) {
    try {
      DOMService.setText('kpi-total', metricas.total);
      DOMService.setText('kpi-atraso', `${metricas.taxaAtraso}%`);
      DOMService.setText('kpi-dentro-prazo', metricas.dentroPrazo);
      DOMService.setText('kpi-atrasadas', metricas.atrasadas);

      const corAtraso = metricas.taxaAtraso > 50 ? '#dc2626' : '#059669';
      DOMService.setStyle('kpi-atraso', 'color', corAtraso);

      logger.debug('KPIs renderizados', metricas);
    } catch (error) {
      logger.error('Erro ao renderizar KPIs', error);
    }
  }

  static renderizarTabela(entregas, pagina, itemsPorPagina) {
    try {
      const tbody = DOMService.selectById('corpo-tabela');
      if (!tbody) throw new Error('Tabela não encontrada');

      const paginacao = DataService.paginar(entregas, pagina, itemsPorPagina);

      if (paginacao.dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#475569; padding: 2rem;">Nenhum resultado encontrado</td></tr>';
        return;
      }

      tbody.innerHTML = paginacao.dados.map((e, idx) => {
        const isAtrasado = e.real > e.prazo;
        const diasDiferenca = Math.abs(e.real - e.prazo);
        const statusClass = isAtrasado ? 'atrasado' : 'ok';
        const statusTexto = isAtrasado ? 'Atrasado' : 'No Prazo';
        const tooltipTexto = isAtrasado
          ? `+${diasDiferenca} dias atrasado`
          : `${diasDiferenca} dias adiantado`;

        return `
          <tr style="animation-delay: ${idx * 0.05}s" tabindex="0">
            <td>#${e.id}</td>
            <td>${e.transportadora}</td>
            <td>${e.regiao}</td>
            <td>${e.prazo} dias</td>
            <td>${e.real} dias</td>
            <td>
              <span class="status-pill ${statusClass}" title="${tooltipTexto}">
                ${statusTexto}
              </span>
            </td>
          </tr>
        `;
      }).join('');

      logger.debug(`Tabela renderizada: ${paginacao.dados.length} itens`);
    } catch (error) {
      logger.error('Erro ao renderizar tabela', error);
      DOMService.setHTML('corpo-tabela', '<tr><td colspan="6" style="text-align:center; color:#dc2626">⚠️ Erro ao renderizar tabela</td></tr>');
    }
  }

  static renderizarInsights(entregas) {
    try {
      const melhor = DataService.obterMelhorPerformance(entregas);
      const pior = DataService.obterPiorPerformance(entregas);
      const regiaoCritica = DataService.obterRegiaoCritica(entregas);

      if (melhor) {
        DOMService.setText('best-performer', melhor.transportadora);
        DOMService.setText('best-detail', `${melhor.regiao} • ${Math.abs(melhor.real - melhor.prazo)} dias`);
      }

      if (pior) {
        DOMService.setText('worst-performer', pior.transportadora);
        DOMService.setText('worst-detail', `${pior.regiao} • +${pior.real - pior.prazo} dias`);
      }

      if (regiaoCritica) {
        const taxa = Math.round((regiaoCritica[1].atrasadas / regiaoCritica[1].total) * 100);
        DOMService.setText('critical-region', regiaoCritica[0]);
        DOMService.setText('region-detail', `${taxa}% de atraso`);
      }

      logger.debug('Insights renderizados');
    } catch (error) {
      logger.error('Erro ao renderizar insights', error);
    }
  }

  static mostrarLoader(mostrar = true) {
    const loader = DOMService.selectById('loader');
    if (loader) {
      if (mostrar) {
        DOMService.addClass('loader', 'active');
      } else {
        DOMService.removeClass('loader', 'active');
      }
    }
  }

  static renderizarGraficos(entregas) {
    try {
      // Gráfico 1: Taxa de Atraso
      const configTaxa = ChartService.graficoTaxaAtraso(entregas);
      ChartService.iniciarGrafico('chart-taxa-atraso', configTaxa);

      // Gráfico 2: Performance por Transportadora
      const configTransp = ChartService.graficoPerformanciaTransportadora(entregas);
      ChartService.iniciarGrafico('chart-transportadora', configTransp);

      // Gráfico 3: Entregas por Região
      const configRegiao = ChartService.graficoEntregasPorRegiao(entregas);
      ChartService.iniciarGrafico('chart-regiao', configRegiao);

      // Gráfico 4: Tendência de Dias
      const configTendencia = ChartService.graficoTendenciaDias(entregas);
      ChartService.iniciarGrafico('chart-tendencia', configTendencia);

      logger.debug('Gráficos renderizados');
    } catch (error) {
      logger.error('Erro ao renderizar gráficos', error);
    }
  }

  static preencherFiltros(opcoes) {
    try {
      // Transportadora
      const selectTransp = DOMService.selectById('filter-transportadora');
      if (selectTransp) {
        opcoes.transportadoras.forEach(t => {
          const option = document.createElement('option');
          option.value = t;
          option.textContent = t;
          selectTransp.appendChild(option);
        });
      }

      // Região
      const selectRegiao = DOMService.selectById('filter-regiao');
      if (selectRegiao) {
        opcoes.regioes.forEach(r => {
          const option = document.createElement('option');
          option.value = r;
          option.textContent = r;
          selectRegiao.appendChild(option);
        });
      }

      logger.debug('Filtros preenchidos');
    } catch (error) {
      logger.error('Erro ao preencher filtros', error);
    }
  }

  static atualizarPaginacao(totalPaginas, paginaAtual, totalResultados) {
    try {
      DOMService.setDisabled('prev-btn', paginaAtual === 1);
      DOMService.setDisabled('next-btn', paginaAtual === totalPaginas);
      DOMService.setText('pag-info', `Página ${paginaAtual} de ${totalPaginas} (${totalResultados} resultados)`);
    } catch (error) {
      logger.error('Erro ao atualizar paginação', error);
    }
  }
}
