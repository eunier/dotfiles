const std = @import("std");
const mem = std.mem;

const git = @import("git.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.ghostty);

pub fn sync(allocator: mem.Allocator) !void {
    log.info("synching", .{});
    try symLink(allocator);
}

fn symLink(allocator: mem.Allocator) !void {
    log.info("sym linking", .{});

    _ = try shell.symLink(
        allocator,
        "~/.dotfiles/src/ghostty/ghostty_config",
        "~/.config/ghostty/config",
    );

    _ = try git.addAndCommitFile(
        allocator,
        "~/.dotfiles/src/ghostty/ghostty_config",
        "Ghostty config",
    );
}
