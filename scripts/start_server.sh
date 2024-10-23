#!/bin/bash
echo "Iniciando servidor da aplicação"

# Navegar até o diretório da aplicação e iniciar o servidor
cd home/ec2-user/Portifolio/my-app/backend
npm install
node index.js 
