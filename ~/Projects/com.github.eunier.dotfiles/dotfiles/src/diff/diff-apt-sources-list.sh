#!/usr/bin/env bash

echo "Diffing apt-sources-list-..."

diff --color \
  ~/.dotfiles/src/apt/apt-sources-list-before.txt \
  ~/.dotfiles/src/apt/apt-sources-list-after.txt
