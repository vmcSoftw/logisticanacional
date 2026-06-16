/**
 * API Service - Camada de comunicação com API
 * Gerencia fetch, timeouts, retry e tratamento de erros
 */

class ApiError extends Error {
  constructor(message, status = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

class ApiService {
  constructor(baseUrl, timeout = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async get(endpoint, options = {}) {
    return this._request(endpoint, {
      ...options,
      method: 'GET'
    });
  }

  async post(endpoint, data, options = {}) {
    return this._request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      logger.debug(`Fetching: ${url}`, options);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `API Error: ${response.statusText}`,
          response.status,
          await response.json().catch(() => null)
        );
      }

      const data = await response.json();
      logger.debug(`Response received`, { endpoint, dataLength: data?.length });

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new ApiError(`Request timeout after ${this.timeout}ms`, 504);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        `Network error: ${error.message}`,
        null,
        error
      );
    }
  }
}

const apiService = new ApiService(
  config.api.url,
  config.api.timeout
);
