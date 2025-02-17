#!/usr/bin/env bash

curl https://raw.githubusercontent.com/tristanisham/zvm/master/install.sh | bash
zvm i --zls master

touch ~/.dotfiles/src/zig/zig-version-list-before.txt
zvm list --all > ~/.dotfiles/src/zig/zig-version-list-after.txt