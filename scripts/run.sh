#!/usr/bin/env zsh

clear && zig build run > ~/.dotfiles/logs/"$(date +%Y%m%d_%H%M%S).log"