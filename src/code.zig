const std = @import("std");
const mem = std.mem;

const sh = @import("shell.zig");

const log = std.log.scoped(.code);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try addDotfiles(alc);
    try addReposync(alc);
    try addUtils(alc);
}

fn addDotfiles(alc: mem.Allocator) !void {
    log.info("adding dotfiles", .{});
    _ = try sh.symLink(alc, "~/.dotfiles", "~/.code/dotfiles");
}

fn addReposync(alc: mem.Allocator) !void {
    log.info("adding reposync", .{});

    _ = try sh.symLink(
        alc,
        "~/code/com.gitlab.yunieralvarez.reposync/reposync",
        "~/code/reposync",
    );
}

fn addUtils(alc: mem.Allocator) !void {
    log.info("adding utils", .{});

    _ = try sh.symLink(
        alc,
        "~/code/com.gitlab.yunieralvarez.utils/utils",
        "~/code/utils",
    );
}
