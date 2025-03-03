#!/usr/bin/env bash

if [ ! -e "$HOME/Projects/com.gitlab.yunieralvarez.repo/repo/zig/top-down-game/TODO.md" ]; then
  cp
  ~/.dotfiles/src/git/todos/com.gitlab.yunieralvarez.repo/repo/zig/top-down-game/TODO.md \
    ~/Projects/com.gitlab.yunieralvarez.repo/repo/zig/top-down-game/TODO.md
fi

cp \
  ~/Projects/com.gitlab.yunieralvarez.repo/repo/zig/top-down-game/TODO.md \
  ~/.dotfiles/src/git/todos/com.gitlab.yunieralvarez.repo/repo/zig/top-down-game/TODO.md
