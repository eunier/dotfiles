const std = @import("std");
const mem = std.mem;

const distrobox = @import("distrobox.zig");

pub fn sync(allocator: mem.Allocator) !void {
    _ = try distrobox.exec(allocator, "fnm install 25");
    _ = try distrobox.exec(allocator, "fnm use 25");
}
