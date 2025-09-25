#!/usr/bin/env bash

cd ~/.dotfiles || exit

prettier --write . >/dev/null 2>&1
biome format --write . >/dev/null 2>&1
