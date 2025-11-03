const std = @import("std");
const mem = std.mem;

const distrobox = @import("distrobox.zig");

pub fn sync(alc: mem.Allocator) !void {
    try distrobox.exec(alc, "fnm install 25", .{});
    try distrobox.exec(alc, "fnm use 25", .{});
}
