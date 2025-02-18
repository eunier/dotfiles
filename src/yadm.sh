#!/usr/bin/env bash

yadm add ~/.bashrc
yadm add ~/.config/fish/config.fish
yadm add ~/.gitconfig
yadm add ~/.config/Code/User/settings.json
yadm add ~/.config/Code/User/keybindings.json
yadm add ~/.dotfiles
yadm add ~/Projects/com/gitlab/yunieralvarez/repo/zig/top-down-game/TODO.md

cd ~ || exit
yadm ls-files >~/.dotfiles/src/yadm/yadm-ls-files.txt
cd ~/.dotfiles || exit

yadm commit -m "sync"
