/**
 * Dashboard Logística - Aplicação Principal
 * Orquestra todos os serviços modularizados
 */

class LogisticaDashboard {
  constructor() {
    this.paginaAtual = 1;
    this.entregasCompletas = [];
    this.entregasFiltradas = [];
    this.inicializado = false;

    logger.info('Inicializando Dashboard...');
  }

  async inicializar() {
    try {
      UIService.mostrarLoader(true);

      menuService.inicializar();

      await this.carregarDados();

      // Preencher opções de filtro
      const opcoes = filterService.obterOpções(this.entregasCompletas);
      UIService.preencherFiltros(opcoes);

      this.inicializado = true;
      logger.info('Dashboard inicializado com sucesso');
    } catch (error) {
      this.tratarErro('Erro ao inicializar dashboard', error);
    } finally {
      UIService.mostrarLoader(false);
    }
  }

  async carregarDados() {
    try {
      logger.info('Carregando dados da API...');

      const endpoint = config.api.endpoints.entregas;
      this.entregasCompletas = await apiService.get(endpoint);

      if (!Array.isArray(this.entregasCompletas)) {
        throw new Error('Dados inválidos: esperado um array');
      }

      this.entregasFiltradas = [...this.entregasCompletas];
      this.paginaAtual = 1;

      logger.info(`${this.entregasCompletas.length} entregas carregadas`);
    } catch (error) {
      if (error instanceof ApiError) {
        logger.error(`Erro API (${error.status}): ${error.message}`);
      } else {
        logger.error('Erro ao carregar dados:', error);
      }
      throw error;
    }
  }

  atualizarDashboard() {
    try {
      const metricas = DataService.calcularMetricas(this.entregasCompletas);
      UIService.renderizarKPIs(metricas);

      UIService.renderizarTabela(
        this.entregasFiltradas,
        this.paginaAtual,
        config.app.itemsPerPage
      );

      UIService.renderizarInsights(this.entregasCompletas);

      const paginacao = DataService.paginar(
        this.entregasFiltradas,
        this.paginaAtual,
        config.app.itemsPerPage
      );
      UIService.atualizarPaginacao(
        paginacao.paginas,
        this.paginaAtual,
        paginacao.total
      );
    } catch (error) {
      this.tratarErro('Erro ao atualizar dashboard', error);
    }
  }

  atualizarDashboard() {
    try {
      const metricas = DataService.calcularMetricas(this.entregasCompletas);
      UIService.renderizarKPIs(metricas);

      UIService.renderizarTabela(
        this.entregasFiltradas,
        this.paginaAtual,
        config.app.itemsPerPage
      );

      UIService.renderizarInsights(this.entregasCompletas);

      // Renderizar gráficos com dados filtrados
      UIService.renderizarGraficos(this.entregasFiltradas);

      const paginacao = DataService.paginar(
        this.entregasFiltradas,
        this.paginaAtual,
        config.app.itemsPerPage
      );
      UIService.atualizarPaginacao(
        paginacao.paginas,
        this.paginaAtual,
        paginacao.total
      );
    } catch (error) {
      this.tratarErro('Erro ao atualizar dashboard', error);
    }
  }

  configurarEventListeners() {
    try {
      const filtroInput = DOMService.selectById('filtro-busca');
      if (filtroInput) {
        filtroInput.addEventListener('input', (e) => this.handleFiltro(e));
      }

      // Filtros avançados
      const filterTransp = DOMService.selectById('filter-transportadora');
      if (filterTransp) {
        filterTransp.addEventListener('change', (e) => this.handleFiltroAvancado());
      }

      const filterRegiao = DOMService.selectById('filter-regiao');
      if (filterRegiao) {
        filterRegiao.addEventListener('change', (e) => this.handleFiltroAvancado());
      }

      const filterStatus = DOMService.selectById('filter-status');
      if (filterStatus) {
        filterStatus.addEventListener('change', (e) => this.handleFiltroAvancado());
      }

      const filterMinDias = DOMService.selectById('filter-min-dias');
      if (filterMinDias) {
        filterMinDias.addEventListener('change', (e) => this.handleFiltroAvancado());
      }

      const filterMaxDias = DOMService.selectById('filter-max-dias');
      if (filterMaxDias) {
        filterMaxDias.addEventListener('change', (e) => this.handleFiltroAvancado());
      }

      const clearBtn = DOMService.selectById('clear-filters-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.handleLimparFiltros());
      }

      // Paginação
      const prevBtn = DOMService.selectById('prev-btn');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.paginaAnterior());
      }

      const nextBtn = DOMService.selectById('next-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.proximaPagina());
      }

      logger.debug('Event listeners configurados');
    } catch (error) {
      logger.error('Erro ao configurar event listeners', error);
    }
  }

  handleFiltroAvancado() {
    try {
      const transportadora = document.getElementById('filter-transportadora')?.value;
      const regiao = document.getElementById('filter-regiao')?.value;
      const status = document.getElementById('filter-status')?.value;
      const minDias = document.getElementById('filter-min-dias')?.value;
      const maxDias = document.getElementById('filter-max-dias')?.value;

      filterService.setTransportadora(transportadora || null);
      filterService.setRegiao(regiao || null);
      filterService.setStatus(status || null);
      filterService.setIntervalo(
        minDias ? parseInt(minDias) : null,
        maxDias ? parseInt(maxDias) : null
      );

      this.entregasFiltradas = filterService.aplicarFiltros(this.entregasCompletas);
      this.paginaAtual = 1;
      this.atualizarDashboard();

      logger.debug('Filtros avançados aplicados');
    } catch (error) {
      logger.error('Erro ao aplicar filtros avançados', error);
    }
  }

  handleLimparFiltros() {
    try {
      filterService.limpar();
      document.getElementById('filter-transportadora').value = '';
      document.getElementById('filter-regiao').value = '';
      document.getElementById('filter-status').value = '';
      document.getElementById('filter-min-dias').value = '';
      document.getElementById('filter-max-dias').value = '';
      document.getElementById('filtro-busca').value = '';

      this.entregasFiltradas = [...this.entregasCompletas];
      this.paginaAtual = 1;
      this.atualizarDashboard();

      logger.debug('Filtros limpados');
    } catch (error) {
      logger.error('Erro ao limpar filtros', error);
    }
  }

  handleFiltro(event) {
    try {
      const termo = event.target.value;
      this.entregasFiltradas = DataService.filtrarEntregas(
        this.entregasCompletas,
        termo
      );
      this.paginaAtual = 1;
      this.atualizarDashboard();
      logger.debug(`Filtro aplicado: "${termo}" (${this.entregasFiltradas.length} resultados)`);
    } catch (error) {
      logger.error('Erro ao aplicar filtro', error);
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarDashboard();
      document.querySelector('table')?.focus();
    }
  }

  proximaPagina() {
    const paginacao = DataService.paginar(
      this.entregasFiltradas,
      this.paginaAtual + 1,
      config.app.itemsPerPage
    );
    if (this.paginaAtual < paginacao.paginas) {
      this.paginaAtual++;
      this.atualizarDashboard();
      document.querySelector('table')?.focus();
    }
  }

  tratarErro(mensagem, erro) {
    logger.error(mensagem, erro);

    const tbody = DOMService.selectById('corpo-tabela');
    if (tbody) {
      DOMService.setHTML(
        'corpo-tabela',
        '<tr><td colspan="6" style="text-align:center; color:#dc2626; padding: 2rem;">⚠️ ' +
        (config.app.debugMode ? erro?.message : 'Erro ao carregar dados') +
        '</td></tr>'
      );
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const dashboard = new LogisticaDashboard();
    await dashboard.inicializar();

    if (config.app.debugMode) {
      window.__dashboard = dashboard;
      logger.debug('Dashboard disponível em window.__dashboard');
    }
  } catch (error) {
    logger.error('Falha crítica na inicialização', error);
    console.error('Falha ao inicializar aplicação:', error);
  }
});
