#!/usr/bin/env bash

if ! command -v ollama >/dev/null 2>&1; then
  curl -fsSL https://ollama.com/install.sh | sh
# else
#   bun upgrade
fi

ollama pull codellama:7b-instruct
ollama pull codellama:7b-code

# bun add --global --exact \
#   @biomejs/biome \
#   bash-language-server \
#   prettier

# bun update --latest
# bun update --global --latest

# TODO add to diffing
