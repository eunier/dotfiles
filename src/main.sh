#!/usr/bin/env bash

sh ~/.dotfiles/src/fastfetch.sh
fastfetch
sh ~/.dotfiles/src/yadm.sh

sudo timeshift --check

sh ~/.dotfiles/src/apt.sh
sh ~/.dotfiles/src/nala.sh
sh ~/.dotfiles/src/flatpak.sh

sh ~/.dotfiles/src/bun.sh
sh ~/.dotfiles/src/node.sh
sh ~/.dotfiles/src/ollama.sh
sh ~/.dotfiles/src/zig.sh

sh ~/.dotfiles/src/autostart.sh
sh ~/.dotfiles/src/beaver-notes.sh
sh ~/.dotfiles/src/dconf.sh
sh ~/.dotfiles/src/doas.sh
sh ~/.dotfiles/src/fonts.sh
sh ~/.dotfiles/src/syncthing.sh
sh ~/.dotfiles/src/timeshift.sh
sh ~/.dotfiles/src/tree.sh
sh ~/.dotfiles/src/vscode.sh

sh ~/.dotfiles/src/gitlab.sh
sh ~/.dotfiles/src/git.sh

sudo timeshift --check

sh ~/.dotfiles/src/diff.sh
sh ~/.dotfiles/src/yadm.sh
yadm push
yadm status

fastfetch
