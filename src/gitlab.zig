const std = @import("std");
const mem = std.mem;

const sh = @import("shell.zig");

const log = std.log.scoped(.gitlab);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try snap(alc);
    try login(alc);
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});

    _ = try sh.spawnAndWait(
        alc,
        "glab auth status > ~/.dotfiles/src/gitlab/gitlab_auth_status.snap 2>&1",
        .{},
    );
}

fn login(alc: mem.Allocator) !void {
    const logged = !(try sh.doesFileContains(
        alc,
        "~/.dotfiles/src/gitlab/gitlab_auth_status.snap",
        "ERROR",
    ));

    if (logged) {
        log.info("already logged", .{});
    } else {
        log.info("not logged, login", .{});
        _ = try sh.spawnAndWait(alc, "glab auth login", .{});
        try snap(alc);
    }
}
