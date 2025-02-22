#!/usr/bin/env bash

if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
else
  bun upgrade
  bun update -g
fi

bun add --global --exact \
  @biomejs/biome \
  bash-language-server \
  prettier

# TODO add to diffing
