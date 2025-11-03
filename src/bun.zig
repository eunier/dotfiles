const std = @import("std");
const mem = std.mem;

const distrobox = @import("distrobox.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.bun);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try updateGlobalPkgs(alc);
    try snapGlobalPkgs(alc);
}

fn updateGlobalPkgs(alc: mem.Allocator) !void {
    log.info("updating global pkgs", .{});
    _ = try shell.exec(alc, "bun update --global --latest", .{});
}

fn addGlobalPkgs(alc: mem.Allocator) !void {
    log.info("adding global pkgs", .{});

    _ = try shell.exec(alc,
        \\bun add --global \
        \\  @filen/cli
    );
}

fn snapGlobalPkgs(alc: mem.Allocator) !void {
    log.info("snapping global pkgs", .{});

    _ = try shell.exec(
        alc,
        "bun pm ls -g --no-color > ~/.dotfiles/src/bun/bun_added.snap",
        .{},
    );
}
