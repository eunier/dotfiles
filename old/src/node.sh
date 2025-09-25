#!/usr/bin/env bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

export NVM_DIR="$HOME/.nvm"

# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# shellcheck disable=SC1091
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

nvm install --lts
