const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.river);

pub fn sync(allocator: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(allocator);
}

fn symLink(allocator: mem.Allocator) !void {
    log.info("sym linking", .{});

    try shell.makeExecutable(allocator, "~/.dotfiles/src/river/river_init");

    _ = try shell.symLink(
        allocator,
        "~/.dotfiles/src/river/river_init",
        "~/.config/river/init",
    );
}
