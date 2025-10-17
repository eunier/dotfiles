#!/usr/bin/env bash

REPO_PATH=~/.dotfiles
cd $REPO_PATH || exit
prettier --write . >/dev/null 2>&1
