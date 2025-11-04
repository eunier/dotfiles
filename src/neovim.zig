const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.neovim);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(alc);
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});
    _ = try shell.exec(alc, "rm -rf ~/.config/nvim", .{});
    try shell.symLink(alc, "~/.dotfiles/src/neovim/config", "~/.config/nvim");
}
