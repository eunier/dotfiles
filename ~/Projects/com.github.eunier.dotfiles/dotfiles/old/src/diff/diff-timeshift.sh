#!/usr/bin/env bash

echo "Diffing timeshift..."
diff --color ~/.dotfiles/src/timeshift/timeshift-before.json ~/.dotfiles/src/timeshift/timeshift-after.json
