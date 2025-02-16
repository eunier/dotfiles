tree . -I -a "node_modules" > ~/.dotfiles/src/tree/tree-output.txt

touch ~/.dotfiles/src/tree/tree-filen-before.txt
tree -aDgNpqsu ~/.config/autostart >> ~/.dotfiles/src/tree/tree-filen-after.txt
