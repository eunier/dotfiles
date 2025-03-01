#!/usr/bin/env bash

flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak update

flatpak install --assumeyes flathub \
  com.belmoussaoui.Authenticator \
  com.brave.Browser \
  com.github.Anuken.Mindustry \
  com.github.libresprite.LibreSprite \
  com.github.tchx84.Flatseal \
  com.mardojai.ForgeSparks \
  com.orama_interactive.Pixelorama \
  com.rafaelmardojai.Blanket \
  com.spotify.Client \
  de.haeckerfelix.AudioSharing \
  de.philippun1.turtle \
  dev.geopjr.Calligraphy \
  dev.tchx84.Gameeky \
  io.github.fabrialberio.pinapp \
  io.github.josephmawa.Egghead \
  io.github.MakovWait.Godots \
  io.github.revisto.drum-machine \
  io.github.ronniedroid.concessio \
  io.github.zhrexl.thisweekinmylife \
  io.gitlab.news_flash.NewsFlash \
  io.missioncenter.MissionCenter \
  md.obsidian.Obsidian \
  org.cryptomator.Cryptomator \
  org.flathub.flatpak-external-data-checker \
  org.gnome.design.Palette \
  org.gnome.Solanum \
  re.sonny.Commit

touch ~/.dotfiles/src/flatpak/flatpak-list-before.txt
flatpak list >~/.dotfiles/src/flatpak/flatpak-list-after.txt

flatpak search io.github.smolblackcat.Progress >>~/.dotfiles/src/nala/nala-app-progress-tracker-after.txt

# com.mardojai.ForgeSparks token github com.mardojai.ForgeSparks expires 2026-02-18
