const std = @import("std");
const mem = std.mem;
const fmt = std.fmt;

const distrobox = @import("distrobox.zig");
const sh = @import("shell.zig");

const log = std.log.scoped(.fastfetch);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(alc);
}

pub fn show(alc: mem.Allocator) !void {
    log.info("showing", .{});
    try distrobox.exec(alc, "fastfetch", .{});
    _ = try sh.spawnAndWait(alc, "fastfetch --logo opensuse", .{});
}

pub fn snap(alc: mem.Allocator, host: distrobox.Host, path: []const u8) !void {
    log.info("snapping", .{});

    const cmd_fmt =
        \\fastfetch --logo none --structure os >{s}
        \\{{
        \\  fastfetch --logo none --structure kernel
        \\  fastfetch --logo none --structure packages
        \\  fastfetch --logo none --structure display
        \\  fastfetch --logo none --structure de
        \\  fastfetch --logo none --structure wm
        \\  fastfetch --logo none --structure wmtheme
        \\  fastfetch --logo none --structure icons
        \\  fastfetch --logo none --structure font
        \\  fastfetch --logo none --structure cursor
        \\  fastfetch --logo none --structure gpu
        \\  fastfetch --logo none --structure locale
        \\}} >>{s}
    ;

    const cmd_args = .{ path, path };

    _ = switch (host) {
        .local => try sh.spawnAndWait(alc, cmd_fmt, cmd_args),
        .arch_container => try distrobox.exec(alc, cmd_fmt, cmd_args),
    };
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});

    try sh.symLink(
        alc,
        "~/.dotfiles/src/fastfetch/fastfetch_config.jsonc",
        "~/.config/fastfetch/config.jsonc",
    );
}
