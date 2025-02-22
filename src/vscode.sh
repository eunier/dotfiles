#!/usr/bin/env bash

code --update-extensions

code --install-extension aswinkumar863.sort-editors
code --install-extension biomejs.biome
code --install-extension chrisdias.vscode-opennewinstance
code --install-extension coddx.coddx-alpha
code --install-extension Continue.continue
code --install-extension DavidAnson.vscode-markdownlint
code --install-extension EditorConfig.EditorConfig
code --install-extension egirlcatnip.adwaita-github-theme
code --install-extension esbenp.prettier-vscode
code --install-extension evan-buss.font-switcher
code --install-extension Gruntfuggly.todo-tree
code --install-extension iciclesoft.workspacesort
code --install-extension JannisX11.batch-rename-extension
code --install-extension maattdd.gitless
code --install-extension mads-hartmann.bash-ide-vscode
code --install-extension maptz.regionfolder
code --install-extension MariusAlchimavicius.json-to-ts
code --install-extension mkhl.shfmt
code --install-extension ms-vscode.cpptools-extension-pack
code --install-extension orhun.last-commit
code --install-extension oven.bun-vscode
code --install-extension pflannery.vscode-versionlens
code --install-extension piousdeer.adwaita-theme
code --install-extension PKief.copy-branch-name
code --install-extension PKief.material-icon-theme
code --install-extension richie5um2.vscode-sort-json
code --install-extension rob-bennett.workspaceWizard
code --install-extension rpinski.shebang-snippets
code --install-extension rust-lang.rust-analyzer
code --install-extension stkb.rewrap
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension timonwong.shellcheck
code --install-extension vadimcn.vscode-lldb
code --install-extension zhuangtongfa.Material-theme
code --install-extension ziglang.vscode-zig

touch ~/.dotfiles/src/vscode/vscode-extensions-before.txt
code --list-extensions >~/.dotfiles/src/vscode/vscode-extensions-after.txt

sh ~/.dotfiles/src/vscode/vscode-font-switch.sh

touch ~/.dotfiles/src/vscode/vscode-settings-before.jsonc
cp ~/.config/Code/User/settings.json ~/.dotfiles/src/vscode/vscode-settings-after.jsonc

touch ~/.dotfiles/src/vscode/vscode-keybindings-before.jsonc
cp ~/.config/Code/User/keybindings.json ~/.dotfiles/src/vscode/vscode-keybindings-after.jsonc
