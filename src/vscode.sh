#!/usr/bin/env bash

cp ~/.config/Code/User/keybindings.json ~/.dotfiles/src/files/after/home/~/.config/Code/User/keybindings.json
cp ~/.config/Code/User/settings.json ~/.dotfiles/src/files/after/home/~/.config/Code/User/settings.json

code --update-extensions
echo "Installing code extensions..."

#spell-checker: disable
code --install-extension aswinkumar863.sort-editors >/dev/null 2>&1 && printf "."
code --install-extension biomejs.biome >/dev/null 2>&1 && printf "."
code --install-extension bradlc.vscode-tailwindcss >/dev/null 2>&1 && printf "."
code --install-extension chrisdias.vscode-opennewinstance >/dev/null 2>&1 && printf "."
code --install-extension coddx.coddx-alpha >/dev/null 2>&1 && printf "."
code --install-extension DavidAnson.vscode-markdownlint >/dev/null 2>&1 && printf "."
code --install-extension EditorConfig.EditorConfig >/dev/null 2>&1 && printf "."
code --install-extension egirlcatnip.adwaita-github-theme >/dev/null 2>&1 && printf "."
code --install-extension esbenp.prettier-vscode >/dev/null 2>&1 && printf "."
code --install-extension evan-buss.font-switcher >/dev/null 2>&1 && printf "."
code --install-extension Gruntfuggly.todo-tree >/dev/null 2>&1 && printf "."
code --install-extension humao.rest-client >/dev/null 2>&1 && printf "."
code --install-extension iciclesoft.workspacesort >/dev/null 2>&1 && printf "."
code --install-extension JannisX11.batch-rename-extension >/dev/null 2>&1 && printf "."
code --install-extension maattdd.gitless >/dev/null 2>&1 && printf "."
code --install-extension mads-hartmann.bash-ide-vscode >/dev/null 2>&1 && printf "."
code --install-extension maptz.regionfolder >/dev/null 2>&1 && printf "."
code --install-extension MariusAlchimavicius.json-to-ts >/dev/null 2>&1 && printf "."
code --install-extension mkhl.shfmt >/dev/null 2>&1 && printf "."
code --install-extension ms-vscode.cpptools-extension-pack >/dev/null 2>&1 && printf "."
code --install-extension orhun.last-commit >/dev/null 2>&1 && printf "."
code --install-extension oven.bun-vscode >/dev/null 2>&1 && printf "."
code --install-extension pflannery.vscode-versionlens >/dev/null 2>&1 && printf "."
code --install-extension piousdeer.adwaita-theme >/dev/null 2>&1 && printf "."
code --install-extension PKief.copy-branch-name >/dev/null 2>&1 && printf "."
code --install-extension PKief.material-icon-theme >/dev/null 2>&1 && printf "."
code --install-extension pranaygp.vscode-css-peek >/dev/null 2>&1 && printf "."
code --install-extension richie5um2.vscode-sort-json >/dev/null 2>&1 && printf "."
code --install-extension rjmacarthy.twinny >/dev/null 2>&1 && printf "."
code --install-extension rob-bennett.workspaceWizard >/dev/null 2>&1 && printf "."
code --install-extension rpinski.shebang-snippets >/dev/null 2>&1 && printf "."
code --install-extension rust-lang.rust-analyzer >/dev/null 2>&1 && printf "."
code --install-extension stkb.rewrap >/dev/null 2>&1 && printf "."
code --install-extension streetsidesoftware.code-spell-checker >/dev/null 2>&1 && printf "."
code --install-extension timonwong.shellcheck >/dev/null 2>&1 && printf "."
code --install-extension usernamehw.errorlens >/dev/null 2>&1 && printf "."
code --install-extension vadimcn.vscode-lldb >/dev/null 2>&1 && printf "."
code --install-extension wk-j.vscode-httpie >/dev/null 2>&1 && printf "."
code --install-extension zhuangtongfa.Material-theme >/dev/null 2>&1 && printf "."
code --install-extension ziglang.vscode-zig >/dev/null 2>&1 && printf "."
code --install-extension Zignd.html-css-class-completion >/dev/null 2>&1 && printf "."
code --install-extension meganrogge.template-string-converter >/dev/null 2>&1 && printf "."
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
