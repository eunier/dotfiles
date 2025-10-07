#!/usr/bin/env bash

SERVICE_DIR="$HOME/.config/systemd/user"
SERVICE_FILE="$SERVICE_DIR/ollama.service"

mkdir -p "$SERVICE_DIR"

cat >"$SERVICE_FILE" <<EOF
[Unit]
Description=Ollama LLM Service

[Service]
ExecStart=/usr/bin/ollama serve
Restart=always

[Install]
WantedBy=default.target
EOF

systemctl --user enable ollama
systemctl --user start ollama
ollama pull codellama:7b-instruct
ollama pull codellama:7b-code
