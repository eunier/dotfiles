#!/usr/bin/env bash

if ! command -v brew >/dev/null 2>&1; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  echo >>/home/yunieralvarez/.bashrc
  # shellcheck disable=SC2016
  echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >>/home/yunieralvarez/.bashrc
  eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
fi

brew update
brew upgrade

brew install gcc

touch ~/.dotfiles/src/homebrew/homebrew-list-before.txt
brew list >~/.dotfiles/src/homebrew/homebrew-list-after.txt
