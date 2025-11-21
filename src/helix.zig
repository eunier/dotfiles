const std = @import("std");
const mem = std.mem;
const fmt = std.fmt;

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

    _ = try sh.symLink(
        alc,
        "~/.dotfiles/src/helix/languages.toml",
        "~/.config/helix/languages.toml",
    );
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});
    try snapHealth(alc);
}

fn snapHealth(alc: mem.Allocator) !void {
    log.info("snapping health", .{});
    try snapHealthCategory(alc, "javascript");
    try snapHealthCategory(alc, "lua");
    try snapHealthCategory(alc, "markdown");
    try snapHealthCategory(alc, "rust");
    try snapHealthCategory(alc, "toml");
    try snapHealthCategory(alc, "typescript");
    try snapHealthCategory(alc, "zig");
}

fn snapHealthCategory(alc: mem.Allocator, category: []const u8) !void {
    log.info("snapping health category {s}", .{category});

    const path = try fmt.allocPrint(
        alc,
        "~/.dotfiles/src/helix/{s}_heath.snap",
        .{category},
    );

    defer alc.free(path);
    _ = try sh.disableSpellchecker(alc, path);

    _ = try sh.spawnAndWait(
        alc,
        "hx --health zig | sed -r 's/\\x1B\\[[0-9;]*[A-Za-z]//g' >> {s}",
        .{path},
    );
}
