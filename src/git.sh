#!/usr/bin/env bash

echo "Cloning git repos..."

git clone git@gitlab.com:yunieralvarez/dotfiles.git /run/media/tron/External/Dotfiles || printf "."

git clone git@github.com:eunier/dotfiles.git ~/Projects/com.github.eunier.dotfiles/dotfiles || printf "."
git clone git@gitlab.com:yunieralvarez/game-top-down-shooter-rs.git ~/Projects/com.gitlab.yunieralvarez.game-top-down-shooter-rs/game-top-dow-shooter-rs || printf "."
git clone git@gitlab.com:yunieralvarez/godot-first-person-shooter-demo.git ~/Projects/com.gitlab.yunieralvarez.godot-first-person-shooter-demo/godot-first-person-shooter-demo || printf "."
git clone git@gitlab.com:yunieralvarez/qmkl.git ~/Projects/com.gitlab.yunieralvarez.qmkl/qmkl || printf "."
git clone git@gitlab.com:yunieralvarez/repo-resources.git ~/Projects/com.gitlab.yunieralvarez.repo-resources/repo-resources || printf "."
git clone git@gitlab.com:yunieralvarez/repo.git ~/Projects/com.gitlab.yunieralvarez.repo/repo || printf "."
git clone git@gitlab.com:yunieralvarez/top-down-game.git ~/Projects/com.gitlab.yunieralvarez.top-down-game/top-dow-game || printf "."
git clone https://github.com/libsdl-org/SDL.git ~/Projects/com.github.libsdl-org.SDL/SDL || printf "."
git clone https://github.com/libsdl-org/sdlwiki.git ~/Projects/com.github.libsdl-org.sdlwiki/libsdl-org || printf "."
git clone https://github.com/linuxy/coyote-ecs.git ~/Projects/com.github.linuxy.coyote-ecs/coyote-ecs || printf "."
git clone https://github.com/Not-Nik/raylib-zig.git ~/Projects/com.github.Not-Nik.raylib-zig/raylib-zig || printf "."
git clone https://github.com/prime31/zig-ecs.git ~/Projects/com.github.prime31.zig-ecs/zig-ecs || printf "."
git clone https://github.com/pwbh/SDL.git ~/Projects/com.github.pwbh.SDL/SDL || printf "."
git clone https://github.com/raysan5/raylib.git ~/Projects/ocm.github.raysan5.raylib/raylib || printf "."
git clone https://github.com/SanderMertens/flecs.git ~/Projects/com.github.SanderMertens.flecs/flecs || printf "."
git clone https://github.com/zig-gamedev/zflecs.git ~/Projects/com.github.zig-gamedev.zflecs/zflecs || printf "."
git clone https://github.com/zig-gamedev/zig-gamedev.git ~/Projects/com.github.zig-gamedev.zig-gamedev/zig-gamedev || printf "."
git clone https://github.com/ziglang/zig.git ~/Projects/com.github.ziglang.zig/zig || printf "."
git clone https://gitlab.gnome.org/GNOME/gnome-calendar.git ~/Projects/org.gitlab.gnome.GNOME.gnome-calendar/gnome-calendar || printf "."

echo ""
touch ~/.dotfiles/src/git/git-repos-before.txt
tree ~/Projects -L 2 -a >~/.dotfiles/src/git/git-repos-after.txt
sh ~/.dotfiles/src/git/git-sync-remote.sh
sh ~/.dotfiles/src/git/git-todo.sh
