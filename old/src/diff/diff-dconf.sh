#!/usr/bin/env bash

echo "Diffing dconf..."
diff --color ~/.dotfiles/src/dconf/dconf-before.conf ~/.dotfiles/src/dconf/dconf-after.conf
