#!/bin/bash

# Script de setup e start do Dashboard

echo "📦 Instalando dependências..."
npm install

echo ""
echo "🚀 Iniciando servidores..."
echo "  • json-server na porta 3000"
echo "  • http-server na porta 8000"
echo ""
echo "Acesse: http://localhost:8000"
echo ""

# Iniciar json-server em background
npx json-server db.json --port 3000 &
JSON_PID=$!

# Iniciar http-server
npx http-server -p 8000 -c-1

# Cleanup ao sair
trap "kill $JSON_PID" EXIT
