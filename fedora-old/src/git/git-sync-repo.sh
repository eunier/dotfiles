#!/usr/bin/env bash

cd ~/.dotfiles || exit
git add .
git commit -m "sync"
git push
git status