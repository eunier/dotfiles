const std = @import("std");
const mem = std.mem;
const fmt = std.fmt;

const distrobox = @import("distrobox.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.fastfetch);

pub fn show(allocator: mem.Allocator) !void {
    log.info("syncing", .{});
    _ = try shell.exec(allocator, "fastfetch --logo opensuse");
    _ = try distrobox.exec(allocator, "fastfetch");
}

pub fn capture(allocator: mem.Allocator, host: distrobox.Host, path: []const u8) !void {
    log.info("capturing", .{});

    const cmd = try fmt.allocPrint(allocator,
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
    , .{ path, path });

    defer allocator.free(cmd);

    _ = switch (host) {
        .local => try shell.exec(allocator, cmd),
        .arch_container => try distrobox.exec(allocator, cmd),
    };
}
