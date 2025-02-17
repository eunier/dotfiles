#!/usr/bin/env bash

touch ~/.dotfiles/src/dconf/dconf-before.conf
dconf dump / > ~/.dotfiles/src/dconf/dconf-after.conf
