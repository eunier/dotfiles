const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.helix);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(alc);
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});

    _ = try shell.symLink(
        alc,
        "~/.dotfiles/src/helix/config.toml",
        "~/.config/helix/config.toml",
    );
}
