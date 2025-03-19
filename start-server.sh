#!/bin/bash

start_server() {
  local NODE_PATH=$1

  if [ -x "$NODE_PATH" ]; then
    "$NODE_PATH" server.js
    exit 0
  fi

  return 1
}

if command -v nvm &> /dev/null; then
  echo "nvm is installed"

  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

  nvm use 23.10.0 &> /dev/null || nvm use default &> /dev/null
  if command -v node &> /dev/null; then
    node server.js
    exit 0
  fi
fi

if start_server "$HOME/.nvm/versions/node/v23.10.0/bin/node"; then
  exit 0
fi
if start_server "$HOME/.local/share/nvm/v23.10.0/bin/node"; then
  exit 0
fi

# Проверяем системный node
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo "Node.js: $NODE_VERSION"
  node server.js
  exit 0
fi

echo "Error: Required Node.js version 23.x not found. Please install it using nvm."
exit 1
