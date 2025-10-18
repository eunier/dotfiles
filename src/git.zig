const std = @import("std");
const mem = std.mem;
const fmt = std.fmt;
const array_list = std.array_list;
const meta = std.meta;
const time = std.time;

const dmi = @import("dmi.zig");
const shell = @import("shell.zig");
const repo_mod = @import("repo.zig");

const log = std.log.scoped(.git);

pub fn refresh(allocator: mem.Allocator, user: []u8) !void {
    const product_name = try dmi.allocProductName(allocator);
    defer allocator.free(product_name);

    const git_config_src_path = try fmt.allocPrint(
        allocator,
        "/home/{s}/.gitconfig",
        .{user},
    );

    defer allocator.free(git_config_src_path);
    log.debug("Git confgi source path: {s}", .{git_config_src_path});

    const git_config_dest_folder = try fmt.allocPrint(
        allocator,
        "/home/{s}/{s}/src/files/{s}/home/~",
        .{ user, repo_mod.repo_folder_name, product_name },
    );

    defer allocator.free(git_config_dest_folder);
    log.debug("Git config dest folder: {s}", .{git_config_dest_folder});
    try shell.makeDir(allocator, git_config_dest_folder);

    const git_config_dest_path = try fmt.allocPrint(
        allocator,
        "{s}/.gitconfig.txt",
        .{git_config_dest_folder},
    );

    defer allocator.free(git_config_dest_path);
    log.debug("Git config dest path: {s}", .{git_config_dest_path});
    try shell.copy(allocator, git_config_src_path, git_config_dest_path);

    const home = try shell.getEnvVarOwned(
        allocator,
        shell.EnvVar.home.toOwnedSlice(),
    );

    defer allocator.free(home);
    try cloneRepos(allocator, home);
    try captureGitRepos(allocator, user, product_name);
    try syncRemotes(allocator, user);
    try symbLink(allocator);
}

pub fn syncRepo(allocator: mem.Allocator, user: []u8) !void {
    const path = try fmt.allocPrint(
        allocator,
        "/home/{s}/{s}/src/git/git_sync_repo.sh",
        .{ user, repo_mod.repo_folder_name },
    );

    _ = try shell.execFile(allocator, path);
}

const Repo = enum {
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
    playground,
    pwbh_sdl,
    qmkl,
    raylib_zig,
    raylib,
    repo_resources,
    repo,
    sdl,
    sdlwiki,
    top_down_game,
    zap,
    zflecs,
    zig_ecs,
    zig_gamedev,
    zig,

    fn toOwnedUrl(self: @This(), allocator: mem.Allocator, home_path: []u8) ![]u8 {
        var list = array_list.Aligned(u8, null).empty;
        defer list.deinit(allocator);
        var parts: []const []const u8 = &.{};

        switch (self) {
            .coyote_ecs => parts = &.{
                "https://github.com/linuxy/coyote-ecs.git ",
                home_path,
                "/Projects/com.github.linuxy.coyote-ecs/coyote-ecs",
            },
            .dotfiles => parts = &.{
                "git@github.com:eunier/dotfiles.git ",
                home_path,
                "/Projects/com.github.eunier.dotfiles/dotfiles",
            },
            .ecs_ts => parts = &.{
                "git@gitlab.com:yunieralvarez/ecs-ts.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.ecs-ts/ecs-ts",
            },
            .ecs_zig => parts = &.{
                "git@gitlab.com:yunieralvarez/ecs-zig.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.ecs-zig/ecs-zig",
            },
            .expense_tracker => parts = &.{
                "git@gitlab.com:yunieralvarez/expense-tracker.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.expense-tracker/expense-tracker",
            },
            .flecs => parts = &.{
                "https://github.com/SanderMertens/flecs.git ",
                home_path,
                "/Projects/com.github.SanderMertens.flecs/flecs",
            },
            .game_top_down_shooter_rs => parts = &.{
                "git@gitlab.com:yunieralvarez/game-top-down-shooter-rs.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.game-top-down-shooter-rs/game-top-dow-shooter-rs",
            },
            .game_tracker => parts = &.{
                "git@gitlab.com:yunieralvarez/game-tracker.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.game-tracker/game-tracker",
            },
            .gnome_calendar => parts = &.{
                "https://gitlab.gnome.org/GNOME/gnome-calendar.git ",
                home_path,
                "/Projects/org.gitlab.gnome.GNOME.gnome-calendar/gnome-calendar",
            },
            .godot_first_person_shooter_demo => parts = &.{
                "git@gitlab.com:yunieralvarez/godot-first-person-shooter-demo.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.godot-first-person-shooter-demo/godot-first-person-shooter-demo",
            },
            .playground => parts = &.{
                "git@gitlab.com:yunieralvarez/playground.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.playground/playground",
            },
            .pwbh_sdl => parts = &.{
                "https://github.com/pwbh/SDL.git ",
                home_path,
                "/Projects/com.github.pwbh.SDL/SDL",
            },
            .qmkl => parts = &.{
                "git@gitlab.com:yunieralvarez/qmkl.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.qmkl/qmkl",
            },
            .raylib => parts = &.{
                "https://github.com/raysan5/raylib.git ",
                home_path,
                "/Projects/ocm.github.raysan5.raylib/raylib",
            },
            .raylib_zig => parts = &.{
                "https://github.com/Not-Nik/raylib-zig.git ",
                home_path,
                "/Projects/com.github.Not-Nik.raylib-zig/raylib-zig",
            },
            .repo => parts = &.{
                "git@gitlab.com:yunieralvarez/repo.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.repo/repo",
            },
            .repo_resources => parts = &.{
                "git@gitlab.com:yunieralvarez/repo-resources.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.repo-resources/repo-resources",
            },
            .sdl => parts = &.{
                "https://github.com/libsdl-org/SDL.git ",
                home_path,
                "/Projects/com.github.libsdl-org.SDL/SDL",
            },
            .sdlwiki => parts = &.{
                "https://github.com/libsdl-org/sdlwiki.git ",
                home_path,
                "/Projects/com.github.libsdl-org.sdlwiki/libsdl-org",
            },
            .top_down_game => parts = &.{
                "git@gitlab.com:yunieralvarez/top-down-game.git ",
                home_path,
                "/Projects/com.gitlab.yunieralvarez.top-down-game/top-down-game",
            },
            .zap => parts = &.{
                "https://github.com/zigzap/zap.git ",
                home_path,
                "/Projects/com.github.zigzap.zap/zap",
            },
            .zflecs => parts = &.{
                "https://github.com/zig-gamedev/zflecs.git ",
                home_path,
                "/Projects/com.github.zig-gamedev.zflecs/zflecs",
            },
            .zig => parts = &.{
                "https://github.com/ziglang/zig.git ",
                home_path,
                "/Projects/com.github.ziglang.zig/zig",
            },
            .zig_ecs => parts = &.{
                "https://github.com/prime31/zig-ecs.git ",
                home_path,
                "/Projects/com.github.prime31.zig-ecs/zig-ecs",
            },
            .zig_gamedev => parts = &.{
                "https://github.com/zig-gamedev/zig-gamedev.git ",
                home_path,
                "/Projects/com.github.zig-gamedev.zig-gamedev/zig-gamedev",
            },
        }

        for (parts) |p| try list.appendSlice(allocator, p);
        return try list.toOwnedSlice(allocator);
    }
};

fn cloneRepos(allocator: mem.Allocator, home_path: []u8) !void {
    const projects_path = try fmt.allocPrint(allocator, "{s}/Projects", .{home_path});
    _ = try shell.makeDir(allocator, projects_path);

    inline for (meta.fields(Repo)) |field| {
        const repo = @field(Repo, field.name);
        const url = try repo.toOwnedUrl(allocator, home_path);
        defer allocator.free(url);
        const cmd = try fmt.allocPrint(allocator, "git clone {s}", .{url});
        _ = try shell.exec(allocator, cmd);
    }
}

fn captureGitRepos(allocator: mem.Allocator, user: []u8, product_name: []u8) !void {
    const git_repos_tree_path = try fmt.allocPrint(
        allocator,
        "/home/{s}/{s}/src/git/git_repos_{s}__auto.txt",
        .{ user, repo_mod.repo_folder_name, product_name },
    );

    defer allocator.free(git_repos_tree_path);
    log.debug("Git repo path: {s}", .{git_repos_tree_path});

    const cmd = try fmt.allocPrint(allocator, "tree -n /home/{s}/Projects -L 2 -a >{s}", .{
        user,
        git_repos_tree_path,
    });

    _ = try shell.exec(allocator, cmd);
}

fn syncRemotes(allocator: mem.Allocator, user: []u8) !void {
    const path = try fmt.allocPrint(
        allocator,
        "/home/{s}/{s}/src/git/git_sync_remote.sh",
        .{ user, repo_mod.repo_folder_name },
    );

    _ = try shell.execFile(allocator, path);
}

fn symbLink(allocator: mem.Allocator) !void {
    _ = try shell.exec(allocator, "ln -sf ~/.dotfiles/src/git/.gitconfig ~/.gitconfig");
}
