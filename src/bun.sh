#!/usr/bin/env bash

if command -v mutt 2>&1 >/dev/null; then
  echo "Installing bun..."
  curl -fsSL https://bun.sh/install | bash
else
  echo "Upgrading bun and global packages..."
  bun upgrade
  bun update -g
fi

bun add --global --exact @biomejs/biome
bun add --global --exact bash-language-server