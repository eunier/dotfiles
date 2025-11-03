const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.code);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try addReposync(alc);
    try addUtils(alc);
}

fn addReposync(alc: mem.Allocator) !void {
    log.info("adding reposync", .{});

    _ = try shell.symLink(
        alc,
        "~/code/com.gitlab.yunieralvarez.reposync/reposync",
        "~/code/reposync",
    );
}

fn addUtils(alc: mem.Allocator) !void {
    log.info("adding utils", .{});

    _ = try shell.symLink(
        alc,
        "~/code/com.gitlab.yunieralvarez.utils/utils",
        "~/code/utils",
    );
}
