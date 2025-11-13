const std = @import("std");
const mem = std.mem;

const sh = @import("shell.zig");

const log = std.log.scoped(.helix);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(alc);
    try snap(alc);
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});

    _ = try sh.symLink(
        alc,
        "~/.dotfiles/src/helix/config.toml",
        "~/.config/helix/config.toml",
    );
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});
    try snapHealth(alc);
}

fn snapHealth(alc: mem.Allocator) !void {
    log.info("snapping health", .{});

    _ = try sh.disableSpellchecker(alc, "~/.dotfiles/src/helix/heath.snap");

    _ = try sh.exec(
        alc,
        "hx --health | sed -r 's/\\x1B\\[[0-9;]*[A-Za-z]//g' >> ~/.dotfiles/src/helix/heath.snap",
        .{},
    );
}
