#!/usr/bin/env bash

if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
else
  bun upgrade
fi

bun add --global --exact \
  @biomejs/biome \
  bash-language-server \
  prettier

bun update --latest
bun update --global --latest

# TODO add to diffing
