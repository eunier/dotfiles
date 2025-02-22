#!/usr/bin/env bash

sudo nala update
sudo nala upgrade
sudo nala autopurge

if command -v mutt /dev/null 2>&1; then
    sudo nala purge mutt
fi

if command -v shotwell /dev/null 2>&1; then
    sudo nala purge shotwell
fi

sudo nala install libreoffice

# https://cdn.fastly.steamstatic.com/client/installer/steam.deb
# https://cdn.filen.io/@filen/desktop/release/latest/Filen_linux_amd64.deb
# https://github.com/Beaver-Notes/Beaver-Notes/releases/download/3.9.0/Beaver-notes_3.9.0_amd64.deb
# https://github.com/smolBlackCat/progress-tracker/releases
# https://www.google.com/chrome/

sudo nala install \
    beaver-notes \
    blackbox-terminal \
    code \
    curl \
    dconf-editor \
    discord \
    dotnet-sdk-9.0 \
    epiphany-browser \
    fastfetch \
    filen \
    fish \
    flatpak \
    fonts-cascadia-code \
    fonts-firacode \
    fonts-monoid \
    fonts-ubuntu \
    freetube \
    geary \
    git \
    gitg \
    gnome-boxes \
    gnome-builder \
    gnome-shell-extension-manager \
    gnome-software-plugin-flatpak \
    google-chrome-stable \
    keepassxc \
    libgl1-mesa-dev \
    libglx-dev \
    libxcursor-dev \
    libxi-dev \
    libxinerama-dev \
    libxrandr-dev \
    mesa-utils \
    morewaita \
    mullvad-vpn \
    nethogs \
    picard \
    progress-tracker \
    rust-all \
    rust-src \
    shellcheck \
    shfmt \
    sqlite3 \
    steam-launcher \
    sudo \
    syncthing-gtk \
    timeshift \
    tree \
    update-glx \
    vim \
    yadm \
    zen-browser

touch ~/.dotfiles/src/nala/nala-list-installed-before.txt

nala list \
    --all-versions \
    --full \
    --installed \
    --verbose \
    >~/.dotfiles/src/nala/nala-list-installed-after.txt

touch ~/.dotfiles/src/nala/nala-app-progress-tracker-before.txt
nala show progress-tracker >~/.dotfiles/src/nala/nala-app-progress-tracker-after.txt
