#!/usr/bin/env bash

sh ~/.dotfiles/src/git/git-sync-repo.sh

sh ~/.dotfiles/src/bun.sh
sh ~/.dotfiles/src/node.sh
sh ~/.dotfiles/src/pnpm.sh

sh ~/.dotfiles/src/dnf.sh
sh ~/.dotfiles/src/flatpak.sh
sh ~/.dotfiles/src/ollama.sh
sh ~/.dotfiles/src/zig.sh
sh ~/.dotfiles/src/git.sh
sh ~/.dotfiles/src/homebrew.sh

# sh ~/.dotfiles/src/autostart.sh
# sh ~/.dotfiles/src/bash.sh
# sh ~/.dotfiles/src/dconf.sh
# sh ~/.dotfiles/src/doas.sh
# sh ~/.dotfiles/src/fish.sh
# sh ~/.dotfiles/src/font.sh
# sh ~/.dotfiles/src/gitlab.sh
# sh ~/.dotfiles/src/sync.sh
# sh ~/.dotfiles/src/syncthing.sh
# sh ~/.dotfiles/src/timeshift.sh
# sh ~/.dotfiles/src/tree.sh
# sh ~/.dotfiles/src/vscode.sh

# sh ~/.dotfiles/src/fastfetch.sh

# sh ~/.dotfiles/src/fmt.sh
# sudo timeshift --check

# sh ~/.dotfiles/src/diff.sh
sh ~/.dotfiles/src/git/git-sync-repo.sh

fastfetch
