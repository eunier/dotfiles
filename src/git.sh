git clone git@github.com:eunier/dotfiles.git ~/Projects/com/github/eunier/dotfiles
git clone git@gitlab.com:yunieralvarez/repo-resources.git ~/Projects/com/gitlab/yunieralvarez/repo-resources
git clone git@gitlab.com:yunieralvarez/repo.git ~/Projects/com/gitlab/yunieralvarez/repo

tree ~/Projects -L 4 -a > ~/.dotfiles/src/git/git-repos-after.txt
sh ~/.dotfiles/src/git/git-sync-remote.sh