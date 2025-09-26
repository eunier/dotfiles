#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

DEST="$REPO_PATH/src/files/$COMPUTER_MODEL/home/~/.gitconfig.txt"
mkdir -p "$(dirname "$DEST")"
cp ~/.gitconfig $REPO_PATH/src/files/"$COMPUTER_MODEL"/home/~/.gitconfig

echo "Cloning git repos..."

repos=(
	"git@github.com:eunier/dotfiles.git ~/Projects/com.github.eunier.dotfiles/dotfiles"
	"git@gitlab.com:yunieralvarez/expense-tracker.git ~/Projects/com.gitlab.yunieralvarez.expense-tracker/expense-tracker"
	"git@gitlab.com:yunieralvarez/game-top-down-shooter-rs.git ~/Projects/com.gitlab.yunieralvarez.game-top-down-shooter-rs/game-top-dow-shooter-rs"
	"git@gitlab.com:yunieralvarez/game-tracker.git ~/Projects/com.gitlab.yunieralvarez.game-tracker/game-tracker"
	"git@gitlab.com:yunieralvarez/godot-first-person-shooter-demo.git ~/Projects/com.gitlab.yunieralvarez.godot-first-person-shooter-demo/godot-first-person-shooter-demo"
	"git@gitlab.com:yunieralvarez/playground.git ~/Projects/com.gitlab.yunieralvarez.playground/playground"
	"git@gitlab.com:yunieralvarez/qmkl.git ~/Projects/com.gitlab.yunieralvarez.qmkl/qmkl"
	"git@gitlab.com:yunieralvarez/repo-resources.git ~/Projects/com.gitlab.yunieralvarez.repo-resources/repo-resources"
	"git@gitlab.com:yunieralvarez/repo.git ~/Projects/com.gitlab.yunieralvarez.repo/repo"
	"git@gitlab.com:yunieralvarez/top-down-game.git ~/Projects/com.gitlab.yunieralvarez.top-down-game/top-down-game"
	"https://github.com/libsdl-org/SDL.git ~/Projects/com.github.libsdl-org.SDL/SDL"
	"https://github.com/libsdl-org/sdlwiki.git ~/Projects/com.github.libsdl-org.sdlwiki/libsdl-org"
	"https://github.com/linuxy/coyote-ecs.git ~/Projects/com.github.linuxy.coyote-ecs/coyote-ecs"
	"https://github.com/Not-Nik/raylib-zig.git ~/Projects/com.github.Not-Nik.raylib-zig/raylib-zig"
	"https://github.com/prime31/zig-ecs.git ~/Projects/com.github.prime31.zig-ecs/zig-ecs"
	"https://github.com/pwbh/SDL.git ~/Projects/com.github.pwbh.SDL/SDL"
	"https://github.com/raysan5/raylib.git ~/Projects/ocm.github.raysan5.raylib/raylib"
	"https://github.com/SanderMertens/flecs.git ~/Projects/com.github.SanderMertens.flecs/flecs"
	"https://github.com/zig-gamedev/zflecs.git ~/Projects/com.github.zig-gamedev.zflecs/zflecs"
	"https://github.com/zig-gamedev/zig-gamedev.git ~/Projects/com.github.zig-gamedev.zig-gamedev/zig-gamedev"
	"https://github.com/ziglang/zig.git ~/Projects/com.github.ziglang.zig/zig"
	"https://github.com/zigzap/zap.git ~/Projects/com.github.zigzap.zap/zap"
	"https://gitlab.gnome.org/GNOME/gnome-calendar.git ~/Projects/org.gitlab.gnome.GNOME.gnome-calendar/gnome-calendar"
)

for entry in "${repos[@]}"; do
	url=$(echo "$entry" | awk '{print $1}')
	path=$(echo "$entry" | awk '{print $2}')y
	expanded_path=$(eval echo "$path")

	if [ ! -d "$expanded_path" ]; then
		git clone "$url" "$expanded_path"
	else
		echo "Skipping $expanded_path (already exists)"
	fi
done

echo ""
tree ~/Projects -L 2 -a >$REPO_PATH/src/git/git-repos_"$COMPUTER_MODEL".txt
sh $REPO_PATH/src/git/git-sync-remote.sh
