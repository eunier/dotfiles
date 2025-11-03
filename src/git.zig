const std = @import("std");
const array_list = std.array_list;
const fmt = std.fmt;
const mem = std.mem;
const meta = std.meta;
const time = std.time;

const Repo = @import("git/Repo.zig").Repo;
const shell = @import("shell.zig");

const log = std.log.scoped(.git);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try cloneRepos(alc);
    try snap(alc);
    try symLink(alc);
}

fn cloneRepos(alc: mem.Allocator) !void {
    log.info("cloning repos", .{});
    try shell.makeDir(alc, "~/code");

    inline for (meta.fields(Repo)) |field| {
        const repo = @field(Repo, field.name);
        const url = try repo.toOwnedUrl(alc);
        defer alc.free(url);
        _ = try shell.exec(alc, "git clone {s}", .{url});
    }
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping repos", .{});

    _ = try shell.exec(
        alc,
        "tree -n ~/code -L 2 -a > ~/.dotfiles/src/git/git_repos.snap",
        .{},
    );
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});
    _ = try shell.symLink(alc, "~/.dotfiles/src/git/.gitconfig", "~/.gitconfig");
}
