const std = @import("std");
const heap = std.heap;

const bun = @import("bun.zig");
const fastfetch = @import("fastfetch.zig");
const git = @import("git.zig");
const node = @import("node.zig");
const shell = @import("shell.zig");

pub fn main() !void {
    var gpa = heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const user = try shell.getEnvVarOwned(
        allocator,
        shell.EnvVar.user.toOwnedSlice(),
    );

    defer allocator.free(user);

    try bun.sync(allocator);
    try node.sync(allocator);
    try git.sync(allocator, user);
    try git.syncRepo(allocator, user);
    try fastfetch.show(allocator);
}
