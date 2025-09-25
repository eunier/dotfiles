#!/usr/bin/env bash

echo "Diffing nala-installed-list..."
diff --color ~/.dotfiles/src/nala/nala-list-installed-before.txt ~/.dotfiles/src/nala/nala-list-installed-after.txt
