#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

if ! command -v zvm >/dev/null 2>&1; then
	curl https://raw.githubusercontent.com/tristanisham/zvm/master/install.sh | bash

	export ZVM_INSTALL="$HOME/.zvm/self"
	export PATH="$PATH:$HOME/.zvm/bin"
	export PATH="$PATH:$ZVM_INSTALL/"
else
	zvm upgrade
fi

zvm install --zls 0.15.1
zvm use 0.15.1

if test -f "$HOME/.dotfiles/zvm.tar"; then
	rm "$HOME/.dotfiles/zvm.tar"
fi

ZIG_VERSION_LIST_TXT_PATH=$REPO_PATH/src/zig/zig-version-list_$COMPUTER_MODEL.txt
zvm list --all >"$ZIG_VERSION_LIST_TXT_PATH"
