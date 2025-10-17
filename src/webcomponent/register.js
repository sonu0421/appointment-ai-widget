import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from '../components/ChatWidget';

// Simple custom element mounting React component
class DRChatWidgetElement extends HTMLElement {
  constructor() {
    super();
    this._root = null;
  }

  connectedCallback() {
    // Detect asset base (where the script is served from) so images resolve in embeds
    if (!window.DR_WIDGET_ASSET_BASE) {
      try {
        const currentScript = document.currentScript || (function(){
          const scripts = document.getElementsByTagName('script');
          return scripts[scripts.length - 1];
        })();
        if (currentScript && currentScript.src) {
          const url = new URL(currentScript.src);
          window.DR_WIDGET_ASSET_BASE = url.origin + url.pathname.replace(/[^/]+$/, '');
        }
      } catch (_) {}
    }

    // Create container
    if (!this._container) {
      this._container = document.createElement('div');
      this.appendChild(this._container);
    }

    // Inject stylesheet once
    try {
      if (!document.getElementById('dr-chat-widget-style')) {
        const link = document.createElement('link');
        link.id = 'dr-chat-widget-style';
        link.rel = 'stylesheet';
        const base = window.DR_WIDGET_ASSET_BASE || '';
        link.href = base + 'dr-chat-widget.css';
        document.head.appendChild(link);
      }
    } catch (_) {}

    // Mount React
    if (!this._root) {
      this._root = ReactDOM.createRoot(this._container);
      this._root.render(React.createElement(ChatWidget, { assetBase: window.DR_WIDGET_ASSET_BASE }));
    }
  }

  disconnectedCallback() {
    try {
      if (this._root) {
        this._root.unmount();
      }
    } catch (_) {}
  }
}

if (!customElements.get('dr-chat-widget')) {
  customElements.define('dr-chat-widget', DRChatWidgetElement);
}


