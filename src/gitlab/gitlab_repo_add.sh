#!/usr/bin/env bash

name=$1
dir=$2

cd "$dir" || exit
glab repo create "$name" --private
git remote add origin git@gitlab.com:yunieralvarez/"$name".git
git add .
git commit -m "init"
git push --set-upstream origin main
