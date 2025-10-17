#!/usr/bin/env bash

REPO_PATH=~/.dotfiles

# adwaitaMono="Adwaita Mono"
cascadiaCode="Cascadia Code"
# firaCode="Fira Code"
# jetBrainsMono="JetBrains Mono"
# monoid="Monoid"
# notoMono="Noto Mono"
# ubuntuMono="Ubuntu Mono"

# Need to hard restart VsCode after new font installed.
# "Reload Window" won't work.
cd $REPO_PATH || exit
font="${1:-"$cascadiaCode"}"
bun run vscode:font:switch "$font"
