#!/usr/bin/env bash

font="Cascadia Code"
echo "Switching VsCode font to ${font}"
cd ~/.dotfiles || exit
bun run vscode-font-switch "$font"
