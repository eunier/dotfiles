#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

if ! dnf repolist | grep -q "Brave Browser"; then
	sudo dnf config-manager addrepo --from-repofile=https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo
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

# if ! dnf repolist | grep -q "terra"; then
# 	sudo dnf install --nogpgcheck --repofrompath 'terra,https://repos.fyralabs.com/terra$releasever' terra-release
# fi

if dnf repolist all | grep -q "^terra"; then
	sudo rm /etc/yum.repos.d/terra.repo

	# Check packages from terra repo
	# dnf repoquery --installed --repoid=terra

	# Sync packages installed from terra repo with fedora repo
	sudo dnf distro-sync
fi

if ! dnf repolist | grep -q "copr:copr.fedorainfracloud.org:ilyaz:LACT"; then
	sudo dnf copr enable ilyaz/LACT
fi

if ! dnf copr list | grep -q "copr.fedorainfracloud.org/pgdev/ghostty"; then
	sudo dnf copr enable pgdev/ghostty
fi

if ! dnf copr list | grep -q "dusansimic/themes"; then
	sudo dnf copr enable dusansimic/themes
fi

if ! dnf copr list | grep -q "scottames/ghostty"; then
	sudo dnf copr enable scottames/ghostty
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

if ! rpm -q rpmfusion-free-release &>/dev/null; then
	# shellcheck disable=SC2046
	sudo dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
	sudo dnf group upgrade core
fi

if ! rpm -q rpmfusion-nonfree-release &>/dev/null; then
	# shellcheck disable=SC2046
	sudo dnf install https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
	sudo dnf group upgrade core
fi

sudo dnf upgrade
sudo dnf autoremove

# https://dbeaver.io/

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
	discord \
	dotnet-sdk-9.0 \
	epiphany \
	fastfetch \
	fira-code-fonts \
	fish \
	flatpak \
	flatseal \
	geary \
	ghostty \
	git \
	gitg \
	glab \
	gnome-boxes \
	gnome-builder \
	gnome-tweaks \
	google-chrome-stable \
	httpie \
	jetbrains-mono-fonts \
	jetbrains-mono-nl-fonts \
	keepassxc \
	kodi \
	lact-libadwaita \
	libadwaita-demo \
	libatomic \
	libdecor \
	libdecor-devel \
	librewolf \
	libX11 \
	libX11-devel \
	libXcursor-devel \
	libXext \
	libXext-devel \
	libXfixes-devel \
	libXi-devel \
	libXinerama-devel \
	libxkbcommon \
	libxkbcommon-devel \
	libXrandr \
	libXrandr-devel \
	mesa-dri-drivers \
	mesa-libGL \
	mesa-libGL-devel \
	minecraft-launcher \
	morewaita-icon-theme \
	mullvad-vpn \
	opendoas \
	picard \
	podman-compose \
	polari \
	postgresql \
	postgresql-contrib \
	postgresql-server \
	remove-retired-packages \
	rust \
	ShellCheck \
	shfmt \
	steam \
	syncthing \
	texlive-cascadia-code \
	timeshift \
	tree \
	vim \
	wayland-devel \
	wayland-protocols-devel \
	zed

sudo systemctl enable --now lactd

mkdir -p "$REPO_PATH/src/files/$COMPUTER_MODEL/etc/dnf"
cp /etc/dnf/dnf.conf $REPO_PATH/src/files/"$COMPUTER_MODEL"/etc/dnf/dnf.conf

DNF_INFO_INSTALLED_TXT_PATH="$REPO_PATH"/src/dnf/dnf-info-installed_"$COMPUTER_MODEL".txt
dnf repoquery --info --installed >"$DNF_INFO_INSTALLED_TXT_PATH"

DNF_REPO_LIST_TXT_PATH=~/.dotfiles/src/dnf/dnf-repo-list_"$COMPUTER_MODEL".txt
dnf repolist >"$DNF_REPO_LIST_TXT_PATH"

DNF_COPR_LIST_TXT_PATH=~/.dotfiles/src/dnf/dnf-copr-list_"$COMPUTER_MODEL".txt
dnf copr list >"$DNF_COPR_LIST_TXT_PATH"
