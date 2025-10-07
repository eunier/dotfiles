#!/usr/bin/env bash

sudo systemctl start ollama
ollama pull codellama:7b-instruct
ollama pull codellama:7b-code
