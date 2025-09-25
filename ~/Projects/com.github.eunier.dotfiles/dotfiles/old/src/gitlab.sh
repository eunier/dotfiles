#!/usr/bin/env bash

cd ~/.dotfiles || exit
echo "#!/usr/bin/env bash" >~/.dotfiles/src/gitlab/gitlab-auth.sh
glab auth status >~/.dotfiles/src/gitlab/gitlab-auth-status.txt 2>&1 || true
bun run gitlab:auth
sh ~/.dotfiles/src/gitlab/gitlab-auth.sh
