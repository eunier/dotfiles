const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.fonts);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try snap(alc);
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});
    try shell.disableSpellchecker(alc, "~/.dotfiles/src/fonts/fonts.snap");

    _ = try shell.exec(
        alc,
        "fc-list : family | sort | uniq >> ~/.dotfiles/src/fonts/fonts.snap",
        .{},
    );
}
