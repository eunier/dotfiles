#!/usr/bin/env bash

cd ~/.dotfiles
git add .
git commit -m "sync"
git push
git status