const std = @import("std");
const heap = std.heap;

const bun = @import("bun.zig");
const fastfetch = @import("fastfetch.zig");
const git = @import("git.zig");
const node = @import("node.zig");

pub fn main() !void {
    var gpa = heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    try bun.sync(allocator);
    try node.sync(allocator);
    try git.sync(allocator);
    try fastfetch.show(allocator);
}
