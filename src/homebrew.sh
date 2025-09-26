#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

if ! command -v brew >/dev/null 2>&1; then
	/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

	echo >>/home/tron/.bashrc
	# shellcheck disable=SC2016
	echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >>/home/tron/.bashrc
	eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

	set -Ux HOMEBREW_PREFIX /home/linuxbrew/.linuxbrew
	set -Ux HOMEBREW_CELLAR /home/linuxbrew/.linuxbrew/Cellar
	set -Ux HOMEBREW_REPOSITORY /home/linuxbrew/.linuxbrew/Homebrew
	set -Ux PATH /home/linuxbrew/.linuxbrew/bin /home/linuxbrew/.linuxbrew/sbin "$PATH"
fi

brew update
brew upgrade

brew install gcc
brew install git-cliff

brew list >"$REPO_PATH"/src/homebrew/homebrew-list_"$COMPUTER_MODEL".txt
