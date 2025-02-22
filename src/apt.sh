#!/usr/bin/env bash

if [ ! -f "/etc/apt/sources.list.d/julians-package-repo.list" ]; then
  curl -s https://julianfairfax.codeberg.page/package-repo/pub.gpg | gpg --dearmor | sudo dd of=/usr/share/keyrings/julians-package-repo.gpg
  echo 'deb [ signed-by=/usr/share/keyrings/julians-package-repo.gpg ] https://julianfairfax.codeberg.page/package-repo/debs packages main' | sudo tee /etc/apt/sources.list.d/julians-package-repo.list
fi

if [ ! -f "/etc/apt/sources.list.d/microsoft-prod.list" ]; then
  wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
  sudo dpkg -i packages-microsoft-prod.deb
  rm packages-microsoft-prod.deb
fi

if ! command -v nala /dev/null 2>&1; then
  sudo apt update
  sudo apt upgrade
  sudo apt install nala
fi
