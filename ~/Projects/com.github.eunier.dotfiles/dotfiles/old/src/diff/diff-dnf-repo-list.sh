#!/usr/bin/env bash

echo "Diffing dnf-repo-list..."

diff --color \
  ~/.dotfiles/src/dnf/dnf-repo-list-before.txt \
  ~/.dotfiles/src/dnf/dnf-repo-list-after.txt
