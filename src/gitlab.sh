#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

cd $REPO_PATH || exit
echo "#!/usr/bin/env bash" >$REPO_PATH/src/gitlab/gitlab-auth.sh
glab auth status >$REPO_PATH/src/gitlab/gitlab-auth-status_"$COMPUTER_MODEL".txt 2>&1 || true
bun run gitlab:auth
sh $REPO_PATH/src/gitlab/gitlab-auth.sh
