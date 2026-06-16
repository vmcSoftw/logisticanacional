/**
 * Configurações da Aplicação
 * Centraliza todas as variáveis de ambiente e constantes
 */

class Config {
  constructor() {
    this.api = {
      url: this.getEnv('API_URL', 'http://localhost:3001'),
      timeout: this.getEnvNumber('API_TIMEOUT', 10000),
      endpoints: {
        entregas: '/entregas'
      }
    };

    this.app = {
      itemsPerPage: this.getEnvNumber('ITEMS_PER_PAGE', 10),
      environment: this.getEnv('ENVIRONMENT', 'development'),
      debugMode: this.getEnvBoolean('DEBUG_MODE', true)
    };

    this.logging = {
      level: this.getEnv('LOG_LEVEL', 'info')
    };
  }

  getEnv(key, defaultValue = '') {
    // Tenta window, depois localStorage, depois default
    if (window[key] !== undefined) {
      return window[key];
    }
    const stored = localStorage.getItem(key);
    return stored || defaultValue;
  }

  getEnvNumber(key, defaultValue = 0) {
    const value = this.getEnv(key, '');
    return value ? parseInt(value, 10) : defaultValue;
  }

  getEnvBoolean(key, defaultValue = false) {
    const value = this.getEnv(key, '');
    return value ? value.toLowerCase() === 'true' : defaultValue;
  }

  getApiUrl(endpoint = '') {
    return `${this.api.url}${endpoint}`;
  }

  isDevelopment() {
    return this.app.environment === 'development';
  }

  isProduction() {
    return this.app.environment === 'production';
  }
}

const config = new Config();

