#!/usr/bin/env bash

cd ~/.dotfiles || exit
git add *__auto.txt
git add src/files/
git commit -m "sync"
git push
git status