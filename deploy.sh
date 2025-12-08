#!/bin/bash

# Script de deploy do frontend Pataforma

echo "🚀 Iniciando deploy do frontend Pataforma..."

# Ir para o diretório do frontend
cd "$(dirname "$0")"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Parar container anterior se existir
echo "🛑 Parando container anterior (se existir)..."
cd ..
docker-compose -f docker-compose.pataforma-frontend.yml down 2>/dev/null || true

# Iniciar container nginx
echo "▶️ Iniciando container nginx com arquivos estáticos..."
docker-compose -f docker-compose.pataforma-frontend.yml up -d

# Aguardar container iniciar
sleep 2

# Verificar status
if docker ps | grep -q pataforma-frontend; then
    echo "✅ Deploy concluído!"
    echo "📊 Status do container:"
    docker ps | grep pataforma-frontend
    echo ""
    echo "📝 Logs: docker logs pataforma-frontend"
else
    echo "❌ Erro ao iniciar container. Verifique os logs:"
    docker logs pataforma-frontend
    exit 1
fi

