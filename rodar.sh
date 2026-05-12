#!/bin/bash
# Script para carregar o NVM e rodar o projeto
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Garante que o Node 22 está sendo usado
nvm use 22 || nvm install 22

# Ativa o corepack para garantir que o pnpm funcione
corepack enable

# Roda o projeto
pnpm dev
