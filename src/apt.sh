sh ~/.dotfiles/src/apt/apt-julians-package-repo.sh
sh ~/.dotfiles/src/apt/apt-mullvad-vpn.sh # TODO test this out on debian, see correct `$(lsb_release -cs)` value

if ! command -v nala 2>&1 >/dev/null; then
  sudo apt update
  sudo apt upgrade
  sudo apt install nala
fi
