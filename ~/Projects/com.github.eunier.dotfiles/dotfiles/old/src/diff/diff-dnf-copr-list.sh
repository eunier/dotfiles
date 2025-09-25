#!/usr/bin/env bash

echo "Diffing dnf-copr-list..."

diff --color \
  ~/.dotfiles/src/dnf/dnf-copr-list-before.txt \
  ~/.dotfiles/src/dnf/dnf-copr-list-after.txt
