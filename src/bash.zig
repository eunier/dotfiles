const std = @import("std");
const fmt = std.fmt;
const mem = std.mem;

const sh = @import("shell.zig");

const log = std.log.scoped(.bash);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(alc);
    try backup(alc);
    try source(alc);
}

pub fn source(alc: mem.Allocator) !void {
    log.info("sourcing", .{});
    _ = try sh.spawnAndWait(alc, "source ~/.profile", .{});
    _ = try sh.spawnAndWait(alc, "source ~/.bashrc", .{});
}

fn backup(alc: mem.Allocator) !void {
    log.info("backing up", .{});
    const files = &[_][]const u8{ "~/.profile.bak", "~/.bashrc.bak" };
    for (files) |file| try sh.ensureBackupExists(alc, file);
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});
    try sh.symLink(alc, "~/.dotfiles/src/bash/.profile", "~/.profile");
    try sh.symLink(alc, "~/.dotfiles/src/bash/.bashrc", "~/.bashrc");
}
