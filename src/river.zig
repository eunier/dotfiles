const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.river);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(alc);
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});

    try shell.makeExecutable(alc, "~/.dotfiles/src/river/river_init");

    _ = try shell.symLink(
        alc,
        "~/.dotfiles/src/river/river_init",
        "~/.config/river/init",
    );
}
