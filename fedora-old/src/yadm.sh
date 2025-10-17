#!/usr/bin/env bash

yadm add ~/.bashrc
yadm add ~/.config/Code/User/keybindings.json
yadm add ~/.config/Code/User/settings.json
yadm add ~/.config/fish/config.fish
yadm add ~/.config/syncthing-gtk/config.json
yadm add ~/.config/syncthing/config.xml
yadm add ~/.gitconfig

cd ~ || exit
yadm ls-files >~/.dotfiles/src/yadm/yadm-ls-files.txt
cd ~/.dotfiles || exit

yadm add ~/.dotfiles
yadm commit -m "sync"
