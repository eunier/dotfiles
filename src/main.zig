const std = @import("std");
const heap = std.heap;

const backup = @import("backup.zig");
const dotfiles = @import("dotfiles.zig");
const fastfetch = @import("fastfetch.zig");
const opensuse = @import("opensuse.zig");

pub fn main() !void {
    var gpa = heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    try opensuse.sync(allocator);
    try dotfiles.sync(allocator);
    try backup.sync(allocator);
    try fastfetch.show(allocator);
}
