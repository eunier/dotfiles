#!/usr/bin/env bash

REPO_PATH=~/.dotfiles

time=$(date +"%H")
day_of_week=$(date +%u) # 6=Saturday, 7=Sunday

if [ "$time" -ge 18 ] || [ "$time" -lt 7 ] || [ "$day_of_week" -ge 6 ]; then
	echo "Syncing secondary git repos..."
	cd ~/Projects/com.github.eunier.dotfiles/dotfiles || exit
	git reset --hard
	find ~/Projects/com.github.eunier.dotfiles/dotfiles -mindepth 1 -not -path '*/.git/*' -not -name '.git' -exec rm -rf {} +

	rsync \
		--archive \
		--exclude=node_modules \
		--exclude=.git \
		$REPO_PATH/ ~/Projects/com.github.eunier.dotfiles/dotfiles/

	git add .
	git commit -m "auto sync from primary repo"
	git push
else
	echo "Not syncing secondary git repo due to time. Current hour: $time"
fi
