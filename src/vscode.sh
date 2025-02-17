#!/usr/bin/env bash

code --update-extensions

code --install-extension aswinkumar863.sort-editors
code --install-extension biomejs.biome
code --install-extension chrisdias.vscode-opennewinstance
code --install-extension EditorConfig.EditorConfig
code --install-extension esbenp.prettier-vscode
code --install-extension Gruntfuggly.todo-tree
code --install-extension JannisX11.batch-rename-extension
code --install-extension maattdd.gitless
code --install-extension mads-hartmann.bash-ide-vscode
code --install-extension maptz.regionfolder
code --install-extension mkhl.shfmt
code --install-extension ms-vscode.cpptools-extension-pack
code --install-extension orhun.last-commit
code --install-extension PKief.material-icon-theme
code --install-extension richie5um2.vscode-sort-json
code --install-extension rpinski.shebang-snippets
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension timonwong.shellcheck
code --install-extension zhuangtongfa.Material-theme
code --install-extension ziglang.vscode-zig

touch ~/.dotfiles/src/vscode/vscode-extensions-before.txt
code --list-extensions >~/.dotfiles/src/vscode/vscode-extensions-after.txt

touch ~/.dotfiles/src/vscode/vscode-settings-before.jsonc
cp ~/.config/Code/User/settings.json ~/.dotfiles/src/vscode/vscode-settings-after.jsonc

touch ~/.dotfiles/src/vscode/vscode-keybindings-before.jsonc
cp ~/.config/Code/User/keybindings.json ~/.dotfiles/src/vscode/vscode-keybindings-after.jsonc
