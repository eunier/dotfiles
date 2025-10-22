const std = @import("std");
const array_list = std.array_list;
const fmt = std.fmt;
const mem = std.mem;
const meta = std.meta;
const time = std.time;

const Repo = @import("git/Repo.zig").Repo;
const shell = @import("shell.zig");

const log = std.log.scoped(.git);

pub fn sync(allocator: mem.Allocator) !void {
    try cloneRepos(allocator);
    try captureGitRepos(allocator);
    try symLink(allocator);
}

pub fn syncDotfiles(allocator: mem.Allocator) !void {
    try addAndCommitFile(
        allocator,
        "~/.dotfiles/.vscode/settings.json",
        "Settings",
    );
}

pub fn addAndCommitFile(allocator: mem.Allocator, file: []const u8, msg: []const u8) !void {
    _ = try shell.execFmt(allocator, "git add {s}", .{file});
    _ = try shell.execFmt(allocator, "git commit --message \"{s}\"", .{msg});
}

pub fn syncRemotes(allocator: mem.Allocator) !void {
    log.info("syncing remotes", .{});
    _ = try shell.exec(allocator, "sh ~/.dotfiles/src/git/git_sync_remote.sh");
}

fn cloneRepos(allocator: mem.Allocator) !void {
    _ = try shell.makeDir(allocator, "~/Projects");

    inline for (meta.fields(Repo)) |field| {
        const repo = @field(Repo, field.name);
        const url = try repo.toOwnedUrl(allocator);
        defer allocator.free(url);
        const cmd = try fmt.allocPrint(allocator, "git clone {s}", .{url});
        _ = try shell.exec(allocator, cmd);
    }
}

fn captureGitRepos(allocator: mem.Allocator) !void {
    _ = try shell.exec(
        allocator,
        "tree -n ~/Projects -L 2 -a > ~/.dotfiles/src/git/git_repos__auto.txt",
    );
}

fn symLink(allocator: mem.Allocator) !void {
    _ = try shell.symLink(
        allocator,
        "~/.dotfiles/src/git/.gitconfig",
        "~/.gitconfig",
    );
}
