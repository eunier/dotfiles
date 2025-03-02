#!/usr/bin/env bash

flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak update

cd ~/.dotfiles || exit
bun run flatpak:install
sh ~/.dotfiles/src/flatpak/flatpak-uninstall.auto.sh
sh ~/.dotfiles/src/flatpak/flatpak-install.auto.sh

touch ~/.dotfiles/src/flatpak/flatpak-list-before.txt
flatpak list >~/.dotfiles/src/flatpak/flatpak-list-after.txt

flatpak search io.github.smolblackcat.Progress >>~/.dotfiles/src/nala/nala-app-progress-tracker-after.txt

# com.mardojai.ForgeSparks token github com.mardojai.ForgeSparks expires 2026-02-18
