const std = @import("std");

const shell = @import("shell.zig");

pub fn refresh(allocator: std.mem.Allocator) !void {
    _ = try shell.execFile(allocator, "node/node.sh");
}
