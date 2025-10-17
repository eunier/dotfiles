const std = @import("std");
const mem = std.mem;

const bun = @import("bun.zig");
const fastfetch = @import("fastfetch.zig");
const git = @import("git.zig");
const node = @import("node.zig");
const shell = @import("shell.zig");
const zypper = @import("zypper.zig");

pub fn refresh(allocator: mem.Allocator) !void {
    const user = try shell.getEnvVarOwned(
        allocator,
        shell.EnvVar.user.toOwnedSlice(),
    );

    defer allocator.free(user);

    try zypper.refresh(allocator, user);
    try bun.refresh(allocator);
    try node.refresh(allocator);
    try git.refresh(allocator, user);
    try git.syncRepo(allocator, user);
    try fastfetch.show(allocator);
}
