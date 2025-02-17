#!/usr/bin/env bash

echo "Diffing autostart..."

diff --color \
  ~/.dotfiles/src/autostart/autostart-before.txt \
  ~/.dotfiles/src/autostart/autostart-after.txt
