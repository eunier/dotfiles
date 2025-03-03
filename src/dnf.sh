#!/usr/bin/env bash

if ! dnf repolist | grep -q "Brave Browser"; then
    sudo dnf config-manager addrepo --from-repofile=https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo
fi

if ! dnf copr list | grep -q 'copr.fedorainfracloud.org/phracek/PyCharm'; then
    sudo dnf copr enable dusansimic/themes
fi

if ! dnf repolist | grep -q "LibreWolf Software Repository"; then
    sudo curl -fsSL https://repo.librewolf.net/librewolf.repo | pkexec tee /etc/yum.repos.d/librewolf.repo
fi

if ! dnf repolist | grep -q "Mullvad VPN"; then
    sudo dnf config-manager addrepo --from-repofile=https://repository.mullvad.net/rpm/stable/mullvad.repo
fi

if ! dnf repolist | grep -q "Visual Studio Code"; then
    sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
    echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\nautorefresh=1\ntype=rpm-md\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" | sudo tee /etc/yum.repos.d/vscode.repo >/dev/null
fi

if ! command -v beaver-notes /dev/null 2>&1; then
    echo -e "\e[31mDownload 'beaver-notes' from 'https://beavernotes.com/#/Download'\e[0m"
fi

if ! command -v google-chrome-stable /dev/null 2>&1; then
    echo -e "\e[31mDownload 'google-chrome-stable' from 'https://www.google.com/chrome\e[0m"
fi

if ! command -v @filendesktop /dev/null 2>&1; then
    echo -e "\e[31mDownload '@filendesktop' from 'https://filen.io/products/desktop\e[0m and installed with dnf"
fi

sudo dnf upgrade
# sudo dnf autoremove

sudo dnf install \
    alsa-lib-devel \
    Beaver-notes \
    brave-browser \
    cargo \
    cascadia-code-fonts \
    cascadia-code-nf-fonts \
    cascadia-code-pl-fonts \
    code \
    dconf-editor \
    epiphany \
    fastfetch \
    fira-code-fonts \
    fish \
    flatpak \
    flatseal \
    geary \
    git \
    gitg \
    glab \
    gnome-boxes \
    gnome-builder \
    gnome-tweaks \
    google-chrome-stable \
    jetbrains-mono-fonts \
    jetbrains-mono-nl-fonts \
    keepassxc \
    libatomic \
    librewolf \
    libX11 \
    libX11-devel \
    libXcursor-devel \
    libXext \
    libXext-devel \
    libXfixes-devel \
    libXi-devel \
    libXinerama-devel \
    libXrandr \
    libXrandr-devel \
    mesa-dri-drivers \
    mesa-libGL \
    mesa-libGL-devel \
    morewaita-icon-theme \
    mullvad-vpn \
    opendoas \
    picard \
    polari \
    rust \
    ShellCheck \
    shfmt \
    steam \
    syncthing \
    texlive-cascadia-code \
    timeshift \
    tree \
    vim

touch ~/.dotfiles/src/dnf/dnf-info-installed-before.txt
dnf repoquery --info --installed >~/.dotfiles/src/dnf/dnf-info-installed-after.txt

touch ~/.dotfiles/src/dnf/dnf-repo-list-before.txt
dnf repolist >~/.dotfiles/src/dnf/dnf-repo-list-after.txt

touch ~/.dotfiles/src/dnf/dnf-copr-list-before.txt
dnf copr list >~/.dotfiles/src/dnf/dnf-copr-list-after.txt
