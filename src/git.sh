#!/usr/bin/env bash

cp ~/.gitconfig ~/.dotfiles/src/files/after/home/~/.gitconfig

echo "Cloning git repos..."

git clone git@gitlab.com:yunieralvarez/dotfiles.git /run/media/tron/External/Dotfiles
[ $? -eq 128 ] && printf "."

git clone git@github.com:eunier/dotfiles.git ~/Projects/com.github.eunier.dotfiles/dotfiles
[ $? -eq 128 ] && printf "."
git clone git@gitlab.com:yunieralvarez/expense-tracker.git ~/Projects/com.gitlab.yunieralvarez.expense-tracker/expense-tracker
[ $? -eq 128 ] && printf "."
git clone git@gitlab.com:yunieralvarez/game-top-down-shooter-rs.git ~/Projects/com.gitlab.yunieralvarez.game-top-down-shooter-rs/game-top-dow-shooter-rs
[ $? -eq 128 ] && printf "."
git clone git@gitlab.com:yunieralvarez/godot-first-person-shooter-demo.git ~/Projects/com.gitlab.yunieralvarez.godot-first-person-shooter-demo/godot-first-person-shooter-demo
[ $? -eq 128 ] && printf "."
git clone git@gitlab.com:yunieralvarez/playground.git ~/Projects/com.gitlab.yunieralvarez.playground/playground
[ $? -eq 128 ] && printf "."
git clone git@gitlab.com:yunieralvarez/qmkl.git ~/Projects/com.gitlab.yunieralvarez.qmkl/qmkl
[ $? -eq 128 ] && printf "."
git clone git@gitlab.com:yunieralvarez/repo-resources.git ~/Projects/com.gitlab.yunieralvarez.repo-resources/repo-resources
[ $? -eq 128 ] && printf "."
git clone git@gitlab.com:yunieralvarez/repo.git ~/Projects/com.gitlab.yunieralvarez.repo/repo
[ $? -eq 128 ] && printf "."
git clone git@gitlab.com:yunieralvarez/top-down-game.git ~/Projects/com.gitlab.yunieralvarez.top-down-game/top-down-game
[ $? -eq 128 ] && printf "."
git clone https://github.com/libsdl-org/SDL.git ~/Projects/com.github.libsdl-org.SDL/SDL
[ $? -eq 128 ] && printf "."
git clone https://github.com/libsdl-org/sdlwiki.git ~/Projects/com.github.libsdl-org.sdlwiki/libsdl-org
[ $? -eq 128 ] && printf "."
git clone https://github.com/linuxy/coyote-ecs.git ~/Projects/com.github.linuxy.coyote-ecs/coyote-ecs
[ $? -eq 128 ] && printf "."
git clone https://github.com/Not-Nik/raylib-zig.git ~/Projects/com.github.Not-Nik.raylib-zig/raylib-zig
[ $? -eq 128 ] && printf "."
git clone https://github.com/prime31/zig-ecs.git ~/Projects/com.github.prime31.zig-ecs/zig-ecs
[ $? -eq 128 ] && printf "."
git clone https://github.com/pwbh/SDL.git ~/Projects/com.github.pwbh.SDL/SDL
[ $? -eq 128 ] && printf "."
git clone https://github.com/raysan5/raylib.git ~/Projects/ocm.github.raysan5.raylib/raylib
[ $? -eq 128 ] && printf "."
git clone https://github.com/SanderMertens/flecs.git ~/Projects/com.github.SanderMertens.flecs/flecs
[ $? -eq 128 ] && printf "."
git clone https://github.com/zig-gamedev/zflecs.git ~/Projects/com.github.zig-gamedev.zflecs/zflecs
[ $? -eq 128 ] && printf "."
git clone https://github.com/zig-gamedev/zig-gamedev.git ~/Projects/com.github.zig-gamedev.zig-gamedev/zig-gamedev
[ $? -eq 128 ] && printf "."
git clone https://github.com/ziglang/zig.git ~/Projects/com.github.ziglang.zig/zig
[ $? -eq 128 ] && printf "."
git clone https://github.com/zigzap/zap.git ~/Projects/com.github.zigzap.zap/zap
[ $? -eq 128 ] && printf "."
git clone https://gitlab.gnome.org/GNOME/gnome-calendar.git ~/Projects/org.gitlab.gnome.GNOME.gnome-calendar/gnome-calendar
[ $? -eq 128 ] && printf "."

echo ""
touch ~/.dotfiles/src/git/git-repos-before.txt
tree ~/Projects -L 2 -a >~/.dotfiles/src/git/git-repos-after.txt
sh ~/.dotfiles/src/git/git-sync-remote.sh
sh ~/.dotfiles/src/git/git-todo.sh
