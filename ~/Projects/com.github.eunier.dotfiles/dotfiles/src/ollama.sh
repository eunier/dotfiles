#!/usr/bin/env bash

if ! command -v ollama >/dev/null 2>&1; then
	curl -fsSL https://ollama.com/install.sh | sh
fi

ollama pull codellama:7b-instruct
ollama pull codellama:7b-code
