#!/usr/bin/env bash

if ! command -v pnpm &>/dev/null; then
	curl -fsSL https://get.pnpm.io/install.sh | sh -
else
	pnpm self-update
fi
