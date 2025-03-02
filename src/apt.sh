#!/usr/bin/env bash

# TODO keep track of this files in /etc/apt/sources.list.d

# TODO switch brave from flatpak to this
# if [ ! -e "/etc/apt/sources.list.d/brave-browser-release.list" ]; then
#   sudo curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg

#   echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg] https://brave-browser-apt-release.s3.brave.com/ stable main" | sudo tee /etc/apt/sources.list.d/brave-browser-release.list
# fi

# TODO note this is for ghostty
# if [ ! -e "/etc/apt/sources.list.d/home:clayrisser:bookworm.list" ]; then
#   echo 'deb http://download.opensuse.org/repositories/home:/clayrisser:/sid/Debian_Unstable/ /' | sudo tee /etc/apt/sources.list.d/home:clayrisser:sid.list
#   curl -fsSL https://download.opensuse.org/repositories/home:clayrisser:sid/Debian_Unstable/Release.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/home_clayrisser_sid.gpg > /dev/null
# fi

if [ ! -f "/etc/apt/sources.list.d/home:ungoogled_chromium.list" ]; then
  echo 'deb http://download.opensuse.org/repositories/home:/ungoogled_chromium/Debian_Sid/ /' | sudo tee /etc/apt/sources.list.d/home:ungoogled_chromium.list
  curl -fsSL https://download.opensuse.org/repositories/home:ungoogled_chromium/Debian_Sid/Release.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/home_ungoogled_chromium.gpg > /dev/null
fi

if [ ! -f "/etc/apt/sources.list.d/julians-package-repo.list" ]; then
  curl -s https://julianfairfax.codeberg.page/package-repo/pub.gpg | gpg --dearmor | sudo dd of=/usr/share/keyrings/julians-package-repo.gpg
  echo 'deb [ signed-by=/usr/share/keyrings/julians-package-repo.gpg ] https://julianfairfax.codeberg.page/package-repo/debs packages main' | sudo tee /etc/apt/sources.list.d/julians-package-repo.list
fi

if [ ! -f "/etc/apt/sources.list.d/microsoft-prod.list" ]; then
  wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
  sudo dpkg -i packages-microsoft-prod.deb
  rm packages-microsoft-prod.deb
fi

if [ ! -e "/etc/apt/sources.list.d/wakemeops.list" ]; then
  curl -sSL https://raw.githubusercontent.com/upciti/wakemeops/main/assets/install_repository | sudo bash
fi

if ! command -v nala /dev/null 2>&1; then
  sudo apt update
  sudo apt upgrade
  sudo apt install nala
fi
