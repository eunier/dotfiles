const std = @import("std");
const mem = std.mem;

const git = @import("git.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.ghostty);

pub fn sync(alc: mem.Allocator) !void {
    log.info("synching", .{});
    try symLink(alc);
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});

    _ = try shell.symLink(
        alc,
        "~/.dotfiles/src/ghostty/ghostty_config",
        "~/.config/ghostty/config",
    );
}
