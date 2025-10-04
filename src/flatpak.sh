#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak update

flatpak install --assumeyes \
	flathub org.flathub.flatpak-external-data-checker \
	flathub me.kozec.syncthingtk

cd $REPO_PATH || exit
bun run flatpak:install
sh $REPO_PATH/src/flatpak/flatpak-uninstall.auto.local.sh
sh $REPO_PATH/src/flatpak/flatpak-install.auto.local.sh

FLATPAK_LIST_TXT_PATH=$REPO_PATH/src/flatpak/flatpak-list_$COMPUTER_MODEL.txt
flatpak list >"$FLATPAK_LIST_TXT_PATH"
