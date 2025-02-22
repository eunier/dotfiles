#!/usr/bin/env bash

git clone git@github.com:eunier/dotfiles.git ~/Projects/com.github.eunier.dotfiles/dotfiles
git clone git@gitlab.com:yunieralvarez/game-top-down-shooter.git ~/Projects/com.gitlab.yunieralvarez.game-top-down-shooter/game-top-dow-shooter
git clone git@gitlab.com:yunieralvarez/godot-first-person-shooter-demo.git ~/Projects/com.gitlab.yunieralvarez.godot-first-person-shooter-demo/godot-first-person-shooter-demo
git clone git@gitlab.com:yunieralvarez/qmkl.git ~/Projects/com.gitlab.yunieralvarez.qmkl/qmkl
git clone git@gitlab.com:yunieralvarez/repo-resources.git ~/Projects/com.gitlab.yunieralvarez.repo-resources/repo-resources
git clone git@gitlab.com:yunieralvarez/repo.git ~/Projects/com.gitlab.yunieralvarez.repo/repo
git clone https://github.com/libsdl-org/SDL.git ~/Projects/com.github.libsdl-org.SDL/SDL
git clone https://github.com/libsdl-org/sdlwiki.git ~/Projects/com.github.libsdl-org.sdlwiki/libsdl-org
git clone https://github.com/linuxy/coyote-ecs.git ~/Projects/com.github.linuxy.coyote-ecs/coyote-ecs
git clone https://github.com/Not-Nik/raylib-zig.git ~/Projects/com.github.Not-Nik.raylib-zig/raylib-zig
git clone https://github.com/prime31/zig-ecs.git ~/Projects/com.github.prime31.zig-ecs/zig-ecs
git clone https://github.com/pwbh/SDL.git ~/Projects/com.github.pwbh.SDL/SDL
git clone https://github.com/SanderMertens/flecs.git ~/Projects/com.github.SanderMertens.flecs/flecs
git clone https://github.com/zig-gamedev/zflecs.git ~/Projects/com.github.zig-gamedev.zflecs/zflecs
git clone https://github.com/zig-gamedev/zig-gamedev.git ~/Projects/com.github.zig-gamedev.zig-gamedev/zig-gamedev
git clone https://github.com/ziglang/zig.git ~/Projects/com.github.ziglang.zig/zig
git clone https://gitlab.gnome.org/GNOME/gnome-calendar.git ~/Projects/org.gitlab.gnome.GNOME.gnome-calendar/gnome-calendar

touch ~/.dotfiles/src/git/git-repos-before.txt
tree ~/Projects -L 2 -a >~/.dotfiles/src/git/git-repos-after.txt
sh ~/.dotfiles/src/git/git-sync-remote.sh
sh ~/.dotfiles/src/git/git-todo.sh
