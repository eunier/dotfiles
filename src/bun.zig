const std = @import("std");
const mem = std.mem;

const distrobox = @import("distrobox.zig");
const shell = @import("shell.zig");

pub fn sync(allocator: mem.Allocator) !void {
    try updateGlobalPackages(allocator);
    try installGlobalPackages(allocator);
}

fn updateGlobalPackages(allocator: mem.Allocator) !void {
    _ = try distrobox.exec(allocator, "bun update --global --latest");
}

fn installGlobalPackages(allocator: mem.Allocator) !void {
    _ = try distrobox.exec(allocator,
        \\bun add --global --exact \
        \\  cli-task-manager
    );
}
