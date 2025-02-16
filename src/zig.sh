curl https://raw.githubusercontent.com/tristanisham/zvm/master/install.sh | bash
zvm i --zls 0.13.0

touch ~/.dotfiles/src/zig/zig-version-list-before.txt
zvm list --all > ~/.dotfiles/src/zig/zig-version-list-after.txt