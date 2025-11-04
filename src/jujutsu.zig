const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.jj);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLin(alc);
}

fn symLin(alc: mem.Allocator) !void {
    log.info("sym linking", .{});

    try shell.symLink(
        alc,
        "~/.dotfiles/src/jujutsu/jujutsu_config.toml",
        "~/.config/jj/config.toml",
    );
}
