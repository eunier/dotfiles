#!/usr/bin/env bash

echo "Diffing flatpak-list..."
diff --color ~/.dotfiles/src/flatpak/flatpak-list-before.txt ~/.dotfiles/src/flatpak/flatpak-list-after.txt
diff --color ~/.dotfiles/src/flatpak-progress-before.txt ~/.dotfiles/src/flatpak-progress-after.txt
