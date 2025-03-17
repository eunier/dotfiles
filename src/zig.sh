#!/usr/bin/env bash

if ! command -v zvm >/dev/null 2>&1; then
  curl https://raw.githubusercontent.com/tristanisham/zvm/master/install.sh | bash

  export ZVM_INSTALL="$HOME/.zvm/self"
  export PATH="$PATH:$HOME/.zvm/bin"
  export PATH="$PATH:$ZVM_INSTALL/"
else
  zvm upgrade
fi

zvm install --zls 0.14.0
zvm use 0.14.0

if test -f "$HOME/.dotfiles/zvm.tar"; then
  rm "$HOME/.dotfiles/zvm.tar"
fi

touch ~/.dotfiles/src/zig/zig-version-list-before.txt
zvm list --all >~/.dotfiles/src/zig/zig-version-list-after.txt
