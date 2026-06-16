#!/usr/bin/env python3
"""
Servidor de desenvolvimento para Dashboard Logística
Serve arquivos na porta 8000 e simula JSON API na porta 3001
"""

import http.server
import socketserver
import json
import threading
import time
from pathlib import Path

# Dados das entregas
ENTREGAS = [
    {"id": 301, "transportadora": "RotaMax", "regiao": "Sudeste", "prazo": 3, "real": 7},
    {"id": 302, "transportadora": "ViaCargo", "regiao": "Sul", "prazo": 5, "real": 5},
    {"id": 303, "transportadora": "FlashLog", "regiao": "Nordeste", "prazo": 4, "real": 9},
    {"id": 304, "transportadora": "RotaMax", "regiao": "Norte", "prazo": 6, "real": 4},
    {"id": 305, "transportadora": "ViaCargo", "regiao": "Centro-Oeste", "prazo": 2, "real": 6},
    {"id": 306, "transportadora": "FlashLog", "regiao": "Sul", "prazo": 5, "real": 12},
    {"id": 307, "transportadora": "RotaMax", "regiao": "Sul", "prazo": 6, "real": 9},
    {"id": 308, "transportadora": "ViaCargo", "regiao": "Sudeste", "prazo": 3, "real": 4},
    {"id": 309, "transportadora": "FlashLog", "regiao": "Norte", "prazo": 5, "real": 5},
    {"id": 310, "transportadora": "ViaCargo", "regiao": "Nordeste", "prazo": 4, "real": 8}
]

class JSONHandler(http.server.SimpleHTTPRequestHandler):
    """Handler que serve arquivos estáticos e simula API JSON"""

    def do_GET(self):
        # API JSON na porta 3001
        if self.path == '/entregas':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(ENTREGAS).encode())
            return

        # Servir arquivos estáticos
        try:
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        except Exception as e:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-type')
        self.end_headers()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def start_server(port, name):
    """Inicia servidor em thread"""
    handler = JSONHandler
    httpd = socketserver.TCPServer(("", port), handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    print(f"✅ {name} rodando em http://localhost:{port}")
    return httpd

def main():
    print("🚀 Iniciando servidores...")
    print()

    # Trocar para diretório do projeto
    project_dir = Path(__file__).parent
    import os
    os.chdir(project_dir)

    # Iniciar servidor de arquivos (porta 8000)
    server_files = start_server(8000, "📄 HTTP Server (arquivos)")

    # Iniciar servidor de API (porta 3001)
    server_api = start_server(3001, "📊 JSON API Server")

    print()
    print("=" * 50)
    print("📊 DASHBOARD PRONTO!")
    print("=" * 50)
    print()
    print("🌐 Abra no navegador: http://localhost:8000")
    print()
    print("📍 URLs disponíveis:")
    print("   • Dashboard:    http://localhost:8000")
    print("   • API:          http://localhost:3001/entregas")
    print()
    print("⏹️  Pressione Ctrl+C para sair")
    print()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n👋 Encerrando...")
        server_files.shutdown()
        server_api.shutdown()

if __name__ == '__main__':
    main()
