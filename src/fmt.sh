#!/usr/bin/env bash

cd ~/.dotfiles || exit

prettier --write .
biome format --write . > /dev/null 2>&1
