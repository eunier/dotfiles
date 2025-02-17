#!/usr/bin/env bash

touch ~/.dotfiles/src/autostart/autostart-before.txt
tree ~/.config/autostart > ~/.dotfiles/src/autostart/autostart-after.txt
tree -aDgNpqsu ~/.config/autostart >> ~/.dotfiles/src/autostart/autostart-after.txt
