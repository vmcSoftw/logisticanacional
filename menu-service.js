/**
 * Menu Service - Gerenciamento do menu hambúrguer
 */

class MenuService {
  constructor() {
    this.hamburger = DOMService.selectById('hamburger');
    this.navMenu = DOMService.selectById('navMenu');
    this.ativo = false;
  }

  inicializar() {
    if (this.hamburger) {
      DOMService.addEventListener('hamburger', 'click', () => this.alternar());
    }

    const navLinks = DOMService.selectAll('.nav-link');
    navLinks.forEach((link, idx) => {
      link.addEventListener('click', () => this.fechar());
    });

    logger.debug('MenuService inicializado');
  }

  alternar() {
    this.ativo ? this.fechar() : this.abrir();
  }

  abrir() {
    if (this.hamburger && this.navMenu) {
      this.hamburger.classList.add('active');
      this.navMenu.classList.add('active');
      this.ativo = true;
      logger.debug('Menu aberto');
    }
  }

  fechar() {
    if (this.hamburger && this.navMenu) {
      this.hamburger.classList.remove('active');
      this.navMenu.classList.remove('active');
      this.ativo = false;
      logger.debug('Menu fechado');
    }
  }
}

const menuService = new MenuService();
