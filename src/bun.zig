const std = @import("std");
const mem = std.mem;

const distrobox = @import("distrobox.zig");
const sh = @import("shell.zig");

const log = std.log.scoped(.bun);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try updateGlobalPkgs(alc);
    try addGlobalPkgs(alc);
    try snapGlobalPkgs(alc);
}

fn updateGlobalPkgs(alc: mem.Allocator) !void {
    log.info("updating global pkgs", .{});
    _ = try sh.spawnAndWait(alc, "bun update --global --latest", .{});
}

fn addGlobalPkgs(alc: mem.Allocator) !void {
    log.info("adding global pkgs", .{});

    _ = try sh.spawnAndWait(alc,
        \\bun add --global \
        \\  typescript
    , .{});
}

fn snapGlobalPkgs(alc: mem.Allocator) !void {
    log.info("snapping global pkgs", .{});

    _ = try sh.spawnAndWait(
        alc,
        "bun pm ls -g --no-color > ~/.dotfiles/src/bun/bun_added.snap",
        .{},
    );
}
