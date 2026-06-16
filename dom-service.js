/**
 * DOM Service - Manipulação de elementos DOM
 * Centraliza operações com DOM para evitar repetição
 */

class DOMService {
  static selectById(id) {
    const element = document.getElementById(id);
    if (!element) {
      logger.warn(`Element not found: #${id}`);
      return null;
    }
    return element;
  }

  static selectAll(selector) {
    return document.querySelectorAll(selector);
  }

  static setText(elementId, text) {
    const element = this.selectById(elementId);
    if (element) element.textContent = text;
  }

  static setHTML(elementId, html) {
    const element = this.selectById(elementId);
    if (element) element.innerHTML = html;
  }

  static addClass(elementId, className) {
    const element = this.selectById(elementId);
    if (element) element.classList.add(className);
  }

  static removeClass(elementId, className) {
    const element = this.selectById(elementId);
    if (element) element.classList.remove(className);
  }

  static toggleClass(elementId, className) {
    const element = this.selectById(elementId);
    if (element) element.classList.toggle(className);
  }

  static setStyle(elementId, property, value) {
    const element = this.selectById(elementId);
    if (element) element.style[property] = value;
  }

  static addEventListener(elementId, event, handler) {
    const element = this.selectById(elementId);
    if (element) element.addEventListener(event, handler);
  }

  static removeEventListener(elementId, event, handler) {
    const element = this.selectById(elementId);
    if (element) element.removeEventListener(event, handler);
  }

  static setDisabled(elementId, disabled = true) {
    const element = this.selectById(elementId);
    if (element) element.disabled = disabled;
  }
}
