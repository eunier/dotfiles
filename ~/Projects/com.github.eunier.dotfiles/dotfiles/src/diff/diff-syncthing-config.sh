#!/usr/bin/env bash

echo "Diffing syncthing-config..."
diff --color ~/.dotfiles/src/syncthing/syncthing-config-before.json ~/.dotfiles/src/syncthing/syncthing-config-after.json
