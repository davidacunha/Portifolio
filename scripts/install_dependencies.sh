#!/bin/bash
echo "Instalando dependências"

# Exemplo para instalar Node.js e npm
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
