#!/usr/bin/env bash

if command -v mutt >/dev/null 2>&1; then
  echo "Installing bun..."
  curl -fsSL https://bun.sh/install | bash
else
  echo "Upgrading bun and global packages..."
  bun upgrade
  bun update -g
fi

bun add --global --exact \
  @biomejs/biome \
  bash-language-server

# TODO add to diffing
