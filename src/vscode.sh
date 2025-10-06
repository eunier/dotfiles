#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

# code --update-extensions
# echo "Installing code extensions..."

extensions=(
	#spell-checker: disable
	"akamud.vscode-theme-onelight"
	"Angular.ng-template"
	"aswinkumar863.sort-editors"
	"bierner.markdown-mermaid"
	"bpruitt-goddard.mermaid-markdown-syntax-highlighting"
	"bradlc.vscode-tailwindcss"
	"chrisdias.vscode-opennewinstance"
	"coddx.coddx-alpha"
	"codezombiech.gitignore"
	"csharpier.csharpier-vscode"
	"DavidAnson.vscode-markdownlint"
	"eamodio.gitlens"
	"EditorConfig.EditorConfig"
	"egirlcatnip.adwaita-github-theme"
	"esbenp.prettier-vscode"
	"evan-buss.font-switcher"
	"GitHub.github-vscode-theme"
	"Gruntfuggly.todo-tree"
	"hossaini.bootstrap-intellisense"
	"humao.rest-client"
	"iciclesoft.workspacesort"
	"inferrinizzard.prettier-sql-vscode"
	"JannisX11.batch-rename-extension"
	"mads-hartmann.bash-ide-vscode"
	"mani-sh-reddy.atom-one-light-modern"
	"maptz.regionfolder"
	"MariusAlchimavicius.json-to-ts"
	"meganrogge.template-string-converter"
	"mkhl.shfmt"
	"ms-dotnettools.blazorwasm-companion"
	"ms-vscode.cpptools-extension-pack"
	"olifink.fedora-gnome-light-dark"
	"orhun.last-commit"
	"Orta.vscode-jest"
	"oven.bun-vscode"
	"patcx.vscode-nuget-gallery"
	"pflannery.vscode-versionlens"
	"piousdeer.adwaita-theme"
	"PKief.copy-branch-name"
	"PKief.material-icon-theme"
	"pranaygp.vscode-css-peek"
	"richie5um2.vscode-sort-json"
	"ritwickdey.LiveServer"
	"rjmacarthy.twinny"
	"rob-bennett.workspaceWizard"
	"rpinski.shebang-snippets"
	"rust-lang.rust-analyzer"
	"stkb.rewrap"
	"streetsidesoftware.code-spell-checker"
	"tamasfe.even-better-toml"
	"timonwong.shellcheck"
	"usernamehw.errorlens"
	"vadimcn.vscode-lldb"
	"vsls-contrib.gistfs"
	"wk-j.vscode-httpie"
	"wraith13.zoombar-vscode"
	"yoavbls.pretty-ts-errors"
	"zhuangtongfa.Material-theme"
	"ziglang.vscode-zig"
	"Zignd.html-css-class-completion"
	#spell-checker: enable
)

# FATAL ERROR: v8::ToLocalChecked Empty MaybeLocal
# for ext in "${extensions[@]}"; do
# 	code --install-extension "$ext"
# done

echo ""
code --list-extensions >$REPO_PATH/src/vscode/vscode-extensions_"$COMPUTER_MODEL".txt

sh $REPO_PATH/src/vscode/vscode-font-switch.sh

touch ~/.config/Code/User/settings.json
cp ~/.config/Code/User/settings.json $REPO_PATH/src/vscode/vscode-settings-"$COMPUTER_MODEL".jsonc

touch ~/.config/Code/User/keybindings.json
cp ~/.config/Code/User/keybindings.json $REPO_PATH/src/vscode/vscode-keybindings-"$COMPUTER_MODEL".jsonc
