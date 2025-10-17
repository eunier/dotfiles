const std = @import("std");
const heap = std.heap;

const opensuse = @import("opensuse.zig");

pub fn main() !void {
    var gpa = heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    try opensuse.refresh(allocator);
}
