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
    try cloneRepos(alc);
    try captureGitRepos(alc);
    try symLink(alc);
}

pub fn syncRemotes(alc: mem.Allocator) !void {
    log.info("syncing remotes", .{});
    _ = try shell.exec(alc, "sh ~/.dotfiles/src/git/git_sync_remote.sh");
}

fn cloneRepos(alc: mem.Allocator) !void {
    _ = try shell.makeDir(alc, "~/Projects");

    inline for (meta.fields(Repo)) |field| {
        const repo = @field(Repo, field.name);
        const url = try repo.toOwnedUrl(alc);
        defer alc.free(url);
        const cmd = try fmt.allocPrint(alc, "git clone {s}", .{url});
        _ = try shell.exec(alc, cmd);
    }
}

fn captureGitRepos(alc: mem.Allocator) !void {
    _ = try shell.exec(
        alc,
        "tree -n ~/Projects -L 2 -a > ~/.dotfiles/src/git/git_repos__auto.txt",
    );
}

fn symLink(alc: mem.Allocator) !void {
    _ = try shell.symLink(alc, "~/.dotfiles/src/git/.gitconfig", "~/.gitconfig");
}
