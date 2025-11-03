const std = @import("std");
const fmt = std.fmt;
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.autostart);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    const files = [_][]const u8{ "arch-filen-desktop", "syncthing" };
    try makeExecutable(alc, files);
    try symLink(alc);
    try snap(alc);
}

fn makeExecutable(alc: mem.Allocator, files: [2][]const u8) !void {
    log.info("making executable", .{});

    for (files) |file| {
        const path = try fmt.allocPrint(
            alc,
            "~/.dotfiles/src/autostart/{s}.desktop",
            .{file},
        );

        defer alc.free(path);
        try shell.makeExecutable(alc, file);
    }
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});
    _ = try shell.exec(alc, "rm -rf ~/.config/autostart", .{});
    try shell.symLink(alc, "~/.dotfiles/src/autostart/config", "~/.config/autostart");
}

fn snap(alc: mem.Allocator) !void {
    log.info("snap autostart", .{});

    _ = try shell.exec(
        alc,
        "tree -n ~/.config/autostart > ~/.dotfiles/src/autostart/autostart.snap",
        .{},
    );
}
