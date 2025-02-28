#!/usr/bin/env bash

touch ~/.dotfiles/src/timeshift/timeshift-before.json
cp /etc/timeshift/timeshift.json ~/.dotfiles/src/timeshift/timeshift-after.json
