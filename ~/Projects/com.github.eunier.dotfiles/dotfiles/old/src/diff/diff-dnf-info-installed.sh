#!/usr/bin/env bash

echo "Diffing dnf-info-installed..."

diff --color \
  ~/.dotfiles/src/dnf/dnf-info-installed-before.txt \
  ~/.dotfiles/src/dnf/dnf-info-installed-after.txt
