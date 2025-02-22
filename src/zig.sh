#!/usr/bin/env bash

if ! command -v zvm >/dev/null 2>&1; then
  curl https://raw.githubusercontent.com/tristanisham/zvm/master/install.sh | bash
else
  zvm upgrade
fi

zvm install --zls 0.13.0
zvm use 0.13.0

if test -f "$HOME/.dotfiles/zvm.tar"; then
  rm "$HOME/.dotfiles/zvm.tar"
fi

touch ~/.dotfiles/src/zig/zig-version-list-before.txt
zvm list --all >~/.dotfiles/src/zig/zig-version-list-after.txt
