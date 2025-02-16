sh ~/.dotfiles/src/apt/apt-julians-package-repo.sh
sh ~/.dotfiles/src/apt/apt-mullvad-vpn.sh

if ! command -v nala 2>&1 >/dev/null; then
  sudo apt update
  sudo apt upgrade
  sudo apt install nala
fi
