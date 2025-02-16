# touch ~/.dotfiles/src/tree/tree-filen-before.txt
# tree -a ~/.config/@filen > ~/.dotfiles/src/tree/tree-filen-after.txt
# tree -aDgNpqsu ~/.config/@filen >> ~/.dotfiles/src/tree/tree-filen-after.txt

tree . -a -I "node_modules" > ~/.dotfiles/src/tree/tree-output.txt

