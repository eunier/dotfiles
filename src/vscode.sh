code --install-extension aswinkumar863.sort-editors
code --install-extension biomejs.biome
code --install-extension chrisdias.vscode-opennewinstance
code --install-extension esbenp.prettier-vscode
code --install-extension Gruntfuggly.todo-tree
code --install-extension JannisX11.batch-rename-extension
code --install-extension maattdd.gitless
code --install-extension maptz.regionfolder
code --install-extension PKief.material-icon-theme
code --install-extension richie5um2.vscode-sort-json
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension zhuangtongfa.Material-theme
code --install-extension ziglang.vscode-zig
 
code --update-extensions
code --list-extensions > ~/.dotfiles/src/vscode/vscode-extensions-after.txt
cp ~/.config/Code/User/settings.json ~/.dotfiles/src/vscode/vscode-settings-after.jsonc
cp ~/.config/Code/User/keybindings.json ~/.dotfiles/src/vscode/vscode-keybindings-after.jsonc

