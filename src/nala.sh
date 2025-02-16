sudo nala --install-completion
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

sudo nala install libreoffice

sudo nala install \
    code \
    curl \
    dconf-editor \
    epiphany-browser \
    fastfetch \
    filen \
    fish \
    flatpak \
    fonts-cascadia-code \
    geary \
    git \
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
    picard \
    steam-launcher \
    timeshift \
    tree \
    update-glx \
    yadm \
    zen-browser

nala list \
    --all-versions \
    --full \
    --installed \
    --verbose \
        > ~/.dotfiles/src/nala/nala-list-installed-after.txt

# TODO add ts script to remove anything not here, careful not to delete important apps