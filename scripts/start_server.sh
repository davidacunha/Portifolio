#!/bin/bash
echo "Iniciando servidor da aplicação"

# Navegar até o diretório da aplicação e iniciar o servidor
cd /var/www/html
npm install
npm start
