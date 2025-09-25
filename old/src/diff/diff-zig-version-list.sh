#!/usr/bin/env bash

echo "Diffing zig-version-list..."
diff --color ~/.dotfiles/src/zig/zig-version-list-before.txt ~/.dotfiles/src/zig/zig-version-list-after.txt
