time=$(date +"%H")

if [ "$time" -ge 19 ]; then
  echo "Syncing secondary git repos..."

  cd ~/Projects/com/github/eunier/dotfiles
  git reset --hard

  find ~/Projects/com/github/eunier/dotfiles -mindepth 1 -not -path '*/.git/*' -not -name '.git' -exec rm -rf {} +

  rsync \
    --archive \
    --exclude=node_modules \
    --exclude=.git \
    ~/.dotfiles/ ~/Projects/com/github/eunier/dotfiles/
  
  git add .
  git commit -m "auto sync from primary repo"
  git push
else
  echo "It's not time yet. Current hour: $time"
fi
