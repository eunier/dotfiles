#!/usr/bin/env bash

flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak update

flatpak install -y flathub \
  com.github.libresprite.LibreSprite \
  com.github.tchx84.Flatseal \
  com.mardojai.ForgeSparks \
  com.orama_interactive.Pixelorama \
  com.spotify.Client \
  dev.geopjr.Calligraphy \
  dev.tchx84.Gameeky \
  flathub de.philippun1.turtle \
  io.github.fabrialberio.pinapp \
  io.github.josephmawa.Egghead \
  io.github.revisto.drum-machine \
  io.github.ronniedroid.concessio \
  md.obsidian.Obsidian \
  org.flathub.flatpak-external-data-checker 

touch ~/.dotfiles/src/flatpak/flatpak-list-before.txt
flatpak list >~/.dotfiles/src/flatpak/flatpak-list-after.txt


  # org.gnome.Platform \
  # org.gnome.Sdk \
  # org.gnome.Sdk.Docs