#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

if ! [ -f "$HOME/.config/fastfetch/config.jsonc" ]; then
	fastfetch --gen-config
fi

cp ~/.config/fastfetch/config.jsonc $REPO_PATH/src/fastfetch/fastfetch-config_"$COMPUTER_MODEL".jsonc

fastfetch_output_output_path=$REPO_PATH/src/fastfetch/fastfetch-output_$COMPUTER_MODEL.txt
touch "$fastfetch_output_output_path"

fastfetch --logo none --structure os >"$fastfetch_output_output_path"

{
	fastfetch --logo none --structure kernel
	fastfetch --logo none --structure packages
	fastfetch --logo none --structure display
	fastfetch --logo none --structure de
	fastfetch --logo none --structure wm
	fastfetch --logo none --structure wmtheme
	fastfetch --logo none --structure icons
	fastfetch --logo none --structure font
	fastfetch --logo none --structure cursor
	fastfetch --logo none --structure gpu
	fastfetch --logo none --structure locale
} >>"$fastfetch_output_output_path"
