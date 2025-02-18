#!/usr/bin/env bash

git clone git@github.com:eunier/dotfiles.git ~/Projects/com/github/eunier/dotfiles
git clone git@gitlab.com:yunieralvarez/qmkl.git ~/Projects/com/gitlab/yunieralvarez/qmkl
git clone git@gitlab.com:yunieralvarez/repo-resources.git ~/Projects/com/gitlab/yunieralvarez/repo-resources
git clone git@gitlab.com:yunieralvarez/repo.git ~/Projects/com/gitlab/yunieralvarez/repo
git clone https://github.com/libsdl-org/SDL.git ~/Projects/com/github/libsdl-org/SDL
git clone https://github.com/libsdl-org/sdlwiki.git ~/Projects/com/github/libsdl-org/sdlwiki
git clone https://github.com/linuxy/coyote-ecs.git ~/Projects/com/github/linuxy/coyote-ecs
git clone https://github.com/Not-Nik/raylib-zig.git ~/Projects/com/github/Not-Nik/raylib-zig
git clone https://github.com/prime31/zig-ecs.git ~/Projects/com/github/prime31/zig-ecs
git clone https://github.com/pwbh/SDL.git ~/Projects/com/github/pwbh/SDL
git clone https://github.com/zig-gamedev/zflecs.git ~/Projects/com/github/zig-gamedev/zflecs
git clone https://github.com/zig-gamedev/zig-gamedev.git ~/Projects/com/github/zig-gamedev/zig-gamedev
git clone https://github.com/ziglang/zig.git ~/Projects/com/github/ziglang/zig
git clone https://gitlab.gnome.org/GNOME/gnome-calendar.git ~/Projects/org/gitlab/gnome/GNOME/gnome-calendar

touch ~/.dotfiles/src/git/git-repos-before.txt
tree ~/Projects -L 4 -a >~/.dotfiles/src/git/git-repos-after.txt
sh ~/.dotfiles/src/git/git-sync-remote.sh
