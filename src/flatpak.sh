#!/usr/bin/env bash

flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak update

flatpak install --assumeyes \
    flathub org.flathub.flatpak-external-data-checker \
    flathub me.kozec.syncthingtk

cd ~/.dotfiles || exit
bun run flatpak:install
sh ~/.dotfiles/src/flatpak/flatpak-uninstall.auto.sh
sh ~/.dotfiles/src/flatpak/flatpak-install.auto.sh

touch ~/.dotfiles/src/flatpak/flatpak-list-before.txt
flatpak list >~/.dotfiles/src/flatpak/flatpak-list-after.txt


# com.mardojai.ForgeSparks token github com.mardojai.ForgeSparks expires 2026-02-18
