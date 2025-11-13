const std = @import("std");
const array_list = std.array_list;
const mem = std.mem;

pub const Repo = enum {
    coyote_ecs,
    dotfiles,
    ecs_ts,
    ecs_zig,
    expense_tracker,
    flecs,
    game_top_down_shooter_rs,
    game_tracker,
    gnome_calendar,
    godot_first_person_shooter_demo,
    paru,
    pikaur,
    playground,
    pwbh_sdl,
    qmkl,
    raylib_zig,
    raylib,
    repo_resources,
    repo,
    reposync,
    sdl,
    sdlwiki,
    top_down_game,
    utils,
    utils_github,
    zap,
    zflecs,
    zig_ecs,
    zig_gamedev,
    zig,
    ziglings,

    pub fn toOwnedUrl(self: @This(), alc: mem.Allocator) ![]u8 {
        var list = array_list.Aligned(u8, null).empty;
        defer list.deinit(alc);
        var parts: []const []const u8 = &.{};

        switch (self) {
            .coyote_ecs => parts = &.{
                "https://github.com/linuxy/coyote-ecs.git ",
                "~/code/com.github.linuxy.coyote-ecs/coyote-ecs",
            },
            .dotfiles => parts = &.{
                "git@github.com:eunier/dotfiles.git ",
                "~/code/com.github.eunier.dotfiles/dotfiles",
            },
            .ecs_ts => parts = &.{
                "git@gitlab.com:yunieralvarez/ecs-ts.git ",
                "~/code/com.gitlab.yunieralvarez.ecs-ts/ecs-ts",
            },
            .ecs_zig => parts = &.{
                "git@gitlab.com:yunieralvarez/ecs-zig.git ",
                "~/code/com.gitlab.yunieralvarez.ecs-zig/ecs-zig",
            },
            .expense_tracker => parts = &.{
                "git@gitlab.com:yunieralvarez/expense-tracker.git ",
                "~/code/com.gitlab.yunieralvarez.expense-tracker/expense-tracker",
            },
            .flecs => parts = &.{
                "https://github.com/SanderMertens/flecs.git ",
                "~/code/com.github.SanderMertens.flecs/flecs",
            },
            .game_top_down_shooter_rs => parts = &.{
                "git@gitlab.com:yunieralvarez/game-top-down-shooter-rs.git ",
                "~/code/com.gitlab.yunieralvarez.game-top-down-shooter-rs/game-top-dow-shooter-rs",
            },
            .game_tracker => parts = &.{
                "git@gitlab.com:yunieralvarez/game-tracker.git ",
                "~/code/com.gitlab.yunieralvarez.game-tracker/game-tracker",
            },
            .gnome_calendar => parts = &.{
                "https://gitlab.gnome.org/GNOME/gnome-calendar.git ",
                "~/code/org.gitlab.gnome.GNOME.gnome-calendar/gnome-calendar",
            },
            .godot_first_person_shooter_demo => parts = &.{
                "git@gitlab.com:yunieralvarez/godot-first-person-shooter-demo.git ",
                "~/code/com.gitlab.yunieralvarez.godot-first-person-shooter-demo/godot-first-person-shooter-demo",
            },
            .paru => parts = &.{
                "https://aur.archlinux.org/paru.git --depth 1 ",
                "~/code/org.archlinux.aur.paru/paru",
            },
            .pikaur => parts = &.{
                "https://aur.archlinux.org/pikaur.git ",
                "~/code/org.archlinux.aur.pikaur/pikaur",
            },
            .playground => parts = &.{
                "git@gitlab.com:yunieralvarez/playground.git ",
                "~/code/com.gitlab.yunieralvarez.playground/playground",
            },
            .pwbh_sdl => parts = &.{
                "https://github.com/pwbh/SDL.git ",
                "~/code/com.github.pwbh.SDL/SDL",
            },
            .qmkl => parts = &.{
                "git@gitlab.com:yunieralvarez/qmkl.git ",
                "~/code/com.gitlab.yunieralvarez.qmkl/qmkl",
            },
            .raylib => parts = &.{
                "https://github.com/raysan5/raylib.git ",
                "~/code/ocm.github.raysan5.raylib/raylib",
            },
            .raylib_zig => parts = &.{
                "https://github.com/Not-Nik/raylib-zig.git ",
                "~/code/com.github.Not-Nik.raylib-zig/raylib-zig",
            },
            .repo => parts = &.{
                "git@gitlab.com:yunieralvarez/repo.git ",
                "~/code/com.gitlab.yunieralvarez.repo/repo",
            },
            .reposync => parts = &.{
                "git@gitlab.com:yunieralvarez/reposync.git ",
                "~/code/com.gitlab.yunieralvarez.reposync/reposync",
            },
            .repo_resources => parts = &.{
                "git@gitlab.com:yunieralvarez/repo-resources.git ",
                "~/code/com.gitlab.yunieralvarez.repo-resources/repo-resources",
            },
            .sdl => parts = &.{
                "https://github.com/libsdl-org/SDL.git ",
                "~/code/com.github.libsdl-org.SDL/SDL",
            },
            .sdlwiki => parts = &.{
                "https://github.com/libsdl-org/sdlwiki.git ",
                "~/code/com.github.libsdl-org.sdlwiki/libsdl-org",
            },
            .top_down_game => parts = &.{
                "git@gitlab.com:yunieralvarez/top-down-game.git ",
                "~/code/com.gitlab.yunieralvarez.top-down-game/top-down-game",
            },
            .utils => parts = &.{
                "git@gitlab.com:yunieralvarez/utils.git ",
                "~/code/com.gitlab.yunieralvarez.utils/utils",
            },
            .utils_github => parts = &.{
                "git@github.com:eunier/utils.git ",
                "~/code/com.github.eunier.utils/utils",
            },
            .zap => parts = &.{
                "https://github.com/zigzap/zap.git ",
                "~/code/com.github.zigzap.zap/zap",
            },
            .zflecs => parts = &.{
                "https://github.com/zig-gamedev/zflecs.git ",
                "~/code/com.github.zig-gamedev.zflecs/zflecs",
            },
            .zig => parts = &.{
                "https://github.com/ziglang/zig.git ",
                "~/code/com.github.ziglang.zig/zig",
            },
            .zig_ecs => parts = &.{
                "https://github.com/prime31/zig-ecs.git ",
                "~/code/com.github.prime31.zig-ecs/zig-ecs",
            },
            .zig_gamedev => parts = &.{
                "https://github.com/zig-gamedev/zig-gamedev.git ",
                "~/code/com.github.zig-gamedev.zig-gamedev/zig-gamedev",
            },
            .ziglings => parts = &.{
                "https://codeberg.org/ziglings/exercises.git ",
                "~/code/com.codeberg.ziglings/ziglings",
            },
        }

        for (parts) |p| try list.appendSlice(alc, p);
        return try list.toOwnedSlice(alc);
    }
};
