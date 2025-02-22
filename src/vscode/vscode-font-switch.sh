#!/usr/bin/env bash

# shellcheck disable=SC2034
cascadiaCode="Cascadia Code"
firaCode="Fira Code"
jetBrainsMono="JetBrains Mono"
monoid="Monoid"
notoMono="Noto Mono"
ubuntuMono="Ubuntu Mono"

# Need to hard restart VsCode after new font installed.
# "Reload Window" won't work.
cd ~/.dotfiles || exit
bun run vscode:font:switch "$cascadiaCode"
