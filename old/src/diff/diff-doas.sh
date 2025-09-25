#!/usr/bin/env bash

echo "Diffing doas..."
diff --color ~/.dotfiles/src/doas/doas-before.conf ~/.dotfiles/src/doas/doas-after.conf
