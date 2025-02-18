#!/usr/bin/env bash

echo "Diffing flatpak..."
diff --color ~/.dotfiles/src/flatpak/flatpak-list-before.txt ~/.dotfiles/src/flatpak/flatpak-list-after.txt
