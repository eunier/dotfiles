#!/usr/bin/env bash

if [ ! -e "$HOME/Projects/com.gitlab.yunieralvarez.top-down-game/top-down-game/todo.md" ]; then
  cp \
    ~/.dotfiles/src/git/todos/com.gitlab.yunieralvarez.top-down-game/top-down-game/todo.md \
    ~/Projects/com.gitlab.yunieralvarez.top-down-game/top-down-game
fi

cp \
  ~/Projects/com.gitlab.yunieralvarez.top-down-game/top-down-game/todo.md \
  ~/.dotfiles/src/git/todos/com.gitlab.yunieralvarez.top-down-game/top-down-game/todo.md
