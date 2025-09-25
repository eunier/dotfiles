#!/usr/bin/env bash

echo "Diffing homebrew..."

diff --color \
  ~/.dotfiles/src/homebrew/homebrew-list-before.txt \
  ~/.dotfiles/src/homebrew/homebrew-list-after.txt
