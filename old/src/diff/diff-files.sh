#!/usr/bin/env bash

echo "Diffing files..."
diff --color ~/.dotfiles/src/files/before/home/~/.bash_profile ~/.dotfiles/src/files/after/home/~/.bash_profile
diff --color ~/.dotfiles/src/files/before/home/~/.bashrc ~/.dotfiles/src/files/after/home/~/.bashrc
diff --color ~/.dotfiles/src/files/before/home/~/.config/Code/User/keybindings.json ~/.dotfiles/src/files/after/home/~/.config/Code/User/keybindings.json
diff --color ~/.dotfiles/src/files/before/home/~/.config/Code/User/settings.json ~/.dotfiles/src/files/after/home/~/.config/Code/User/settings.json
diff --color ~/.dotfiles/src/files/before/home/~/.config/fish/config.fish ~/.dotfiles/src/files/after/home/~/.config/fish/config.fish
diff --color ~/.dotfiles/src/files/before/home/~/.gitconfig ~/.dotfiles/src/files/after/home/~/.gitconfig
diff --color ~/.dotfiles/src/files/before/etc/dnf/dnf.conf ~/.dotfiles/src/files/after/etc/dnf/dnf.conf