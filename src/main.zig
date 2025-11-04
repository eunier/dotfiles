const std = @import("std");
const heap = std.heap;

const backup = @import("backup.zig");
const fastfetch = @import("fastfetch.zig");
const opensuse = @import("opensuse.zig");

pub fn main() !void {
    var gpa = heap.GeneralPurposeAllocator(.{}){};
    const alc = gpa.allocator();
    try opensuse.sync(alc);
    try backup.sync(alc);
    try fastfetch.show(alc);
}
