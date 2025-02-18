#!/usr/bin/env bash

yadm add ~/.bashrc
yadm add ~/.config/fish/config.fish
yadm add ~/.gitconfig
yadm add ~/.config/Code/User/settings.json
yadm add ~/.config/Code/User/keybindings.json
yadm add ~/.dotfiles
cd ~ || exit
yadm ls-files >~/Projects/.dotfiles/src/yadm/yadm-ls-files.txt
cd ~/Projects/.dotfiles || exit
yadm commit -m "sync"
