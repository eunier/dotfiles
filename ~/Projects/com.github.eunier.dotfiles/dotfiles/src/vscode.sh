#!/usr/bin/env bash

cp ~/.config/Code/User/keybindings.json ~/.dotfiles/src/files/after/home/~/.config/Code/User/keybindings.json
cp ~/.config/Code/User/settings.json ~/.dotfiles/src/files/after/home/~/.config/Code/User/settings.json

code --update-extensions
echo "Installing code extensions..."

#spell-checker: disable
code --install-extension akamud.vscode-theme-onelight
code --install-extension Angular.ng-template
code --install-extension aswinkumar863.sort-editors
code --install-extension bierner.markdown-mermaid
code --install-extension bpruitt-goddard.mermaid-markdown-syntax-highlighting
code --install-extension bradlc.vscode-tailwindcss
code --install-extension chrisdias.vscode-opennewinstance
code --install-extension coddx.coddx-alpha
code --install-extension codezombiech.gitignore
code --install-extension csharpier.csharpier-vscode
code --install-extension DavidAnson.vscode-markdownlint
code --install-extension EditorConfig.EditorConfig
code --install-extension egirlcatnip.adwaita-github-theme
code --install-extension esbenp.prettier-vscode
code --install-extension evan-buss.font-switcher
code --install-extension GitHub.github-vscode-theme
code --install-extension Gruntfuggly.todo-tree
code --install-extension hossaini.bootstrap-intellisense
code --install-extension humao.rest-client
code --install-extension iciclesoft.workspacesort
code --install-extension inferrinizzard.prettier-sql-vscode
code --install-extension JannisX11.batch-rename-extension
code --install-extension maattdd.gitless
code --install-extension mads-hartmann.bash-ide-vscode
code --install-extension mani-sh-reddy.atom-one-light-modern
code --install-extension maptz.regionfolder
code --install-extension MariusAlchimavicius.json-to-ts
code --install-extension meganrogge.template-string-converter
code --install-extension mkhl.shfmt
code --install-extension ms-dotnettools.blazorwasm-companion
code --install-extension ms-vscode.cpptools-extension-pack
code --install-extension olifink.fedora-gnome-light-dark
code --install-extension orhun.last-commit
code --install-extension Orta.vscode-jest
code --install-extension oven.bun-vscode
code --install-extension patcx.vscode-nuget-gallery
code --install-extension pflannery.vscode-versionlens
code --install-extension piousdeer.adwaita-theme
code --install-extension PKief.copy-branch-name
code --install-extension PKief.material-icon-theme
code --install-extension pranaygp.vscode-css-peek
code --install-extension richie5um2.vscode-sort-json
code --install-extension ritwickdey.LiveServer
code --install-extension rjmacarthy.twinny
code --install-extension rob-bennett.workspaceWizard
code --install-extension rpinski.shebang-snippets
code --install-extension rust-lang.rust-analyzer
code --install-extension stkb.rewrap
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension timonwong.shellcheck
code --install-extension usernamehw.errorlens
code --install-extension vadimcn.vscode-lldb
code --install-extension vsls-contrib.gistfs
code --install-extension wk-j.vscode-httpie
code --install-extension wraith13.zoombar-vscode
code --install-extension yoavbls.pretty-ts-errors
code --install-extension zhuangtongfa.Material-theme
code --install-extension ziglang.vscode-zig
code --install-extension Zignd.html-css-class-completion
#spell-checker: enable

echo ""
touch ~/.dotfiles/src/vscode/vscode-extensions-before.txt
code --list-extensions >~/.dotfiles/src/vscode/vscode-extensions-after.txt

font="${1:-"Cascadia Code"}"
sh ~/.dotfiles/src/vscode/vscode-font-switch.sh "$font" # is not passing the passed value

touch ~/.config/Code/User/settings.json
touch ~/.dotfiles/src/vscode/vscode-settings-before.jsonc
cp ~/.config/Code/User/settings.json ~/.dotfiles/src/vscode/vscode-settings-after.jsonc

touch ~/.config/Code/User/keybindings.json
touch ~/.dotfiles/src/vscode/vscode-keybindings-before.jsonc
cp ~/.config/Code/User/keybindings.json ~/.dotfiles/src/vscode/vscode-keybindings-after.jsonc
