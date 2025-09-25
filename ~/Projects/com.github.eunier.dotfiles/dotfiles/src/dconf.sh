#!/usr/bin/env bash

touch ~/.dotfiles/src/dconf/dconf-before.conf
dconf dump / > ~/.dotfiles/src/dconf/dconf-raw-after.conf
cd ~/.dotfiles || exit
bun run dconf:dconf-filter