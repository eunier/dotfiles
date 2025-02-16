touch ~/.dotfiles/src/tree/tree-filen-before.txt
tree -aDgNpqsu ~/.config/@filen >> ~/.dotfiles/src/tree/tree-filen-after.txt

tree . -I -a "node_modules" > ~/.dotfiles/src/tree/tree-output.txt

