const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

pub fn show(allocator: mem.Allocator) !void {
    _ = try shell.exec(allocator, "fastfetch");
}
