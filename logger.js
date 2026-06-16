/**
 * Logger - Sistema de Logging
 * Centraliza toda a saída de logs com níveis de severidade
 */

class Logger {
  constructor(level = 'info') {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    this.level = this.levels[level] || this.levels.info;
    this.isDev = (typeof config !== 'undefined') ? config.isDevelopment() : true;
  }

  error(message, data = null) {
    if (this.level >= this.levels.error) {
      console.error(`[ERROR] ${message}`, data || '');
      this._trackError(message, data);
    }
  }

  warn(message, data = null) {
    if (this.level >= this.levels.warn) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  info(message, data = null) {
    if (this.level >= this.levels.info) {
      console.info(`[INFO] ${message}`, data || '');
    }
  }

  debug(message, data = null) {
    if (this.level >= this.levels.debug && this.isDev) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }

  _trackError(message, data) {
    // Em produção, enviar para serviço de tracking
    if (!this.isDev) {
      // Exemplo: sendToErrorTracking({ message, data, timestamp: new Date() })
    }
  }
}

const logger = new Logger(typeof config !== 'undefined' ? config.logging.level : 'info');

