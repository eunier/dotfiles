#!/usr/bin/env bash

sudo nala update
sudo nala upgrade
sudo nala autopurge

if command -v mutt 2>&1 >/dev/null; then
    sudo nala purge mutt
fi

if command -v shotwell 2>&1 >/dev/null; then
    sudo nala purge shotwell
fi

# nala install https://cdn.fastly.steamstatic.com/client/installer/steam.deb
# nala install https://cdn.filen.io/@filen/desktop/release/latest/Filen_linux_amd64.deb
# nala install https://github.com/Beaver-Notes/Beaver-Notes/releases/download/3.9.0/Beaver-notes_3.9.0_amd64.deb

sudo nala install libreoffice

# TODO install and use sudo

## testing
##    shfmt \
##  shellcheck \

sudo nala install \
    beaver-notes \
    blackbox-terminal \
    code \
    curl \
    dconf-editor \
    sudo \
    epiphany-browser \
    fastfetch \
    filen \
    fish \
    flatpak \
    fonts-cascadia-code \
    geary \
    git \
    gitg \
    shfmt \
    shellcheck \
    gnome-boxes \
    gnome-shell-extension-manager \
    gnome-software-plugin-flatpak \
    keepassxc \
    libglx-dev \
    libxcursor-dev \
    libxi-dev \
    libxinerama-dev \
    libxrandr-dev \
    mesa-utils \
    morewaita \
    mullvad-vpn \
    picard \
    sqlite3 \
    steam-launcher \
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
