#!/usr/bin/env bash

time=$(date +"%H")

if [ "$time" -ge 18 ] || [ "$time" -lt 7 ]; then
  echo "Syncing secondary git repos..."

  cd ~/Projects/com.github.eunier.dotfiles/dotfiles || exit
  git reset --hard

  find ~/Projects/com.github.eunier.dotfiles/dotfiles -mindepth 1 -not -path '*/.git/*' -not -name '.git' -exec rm -rf {} +

  rsync \
    --archive \
    --exclude=node_modules \
    --exclude=.git \
    ~/.dotfiles/ ~/Projects/com.github.eunier.dotfiles/dotfiles/

  git add .
  git commit -m "auto sync from primary repo"
  git push
else
  echo "Not syncing secondary git repo due to time. Current hour: $time"
fi
