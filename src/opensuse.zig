const std = @import("std");
const mem = std.mem;

const bash = @import("bash.zig");
const bun = @import("bun.zig");
const codium = @import("codium.zig");
const distrobox = @import("distrobox.zig");
const ghostty = @import("ghostty.zig");
const git = @import("git.zig");
const node = @import("node.zig");
const river = @import("river.zig");
const zig = @import("zig.zig");
const zypper = @import("zypper.zig");

pub fn sync(allocator: mem.Allocator) !void {
    try bash.sync(allocator);
    try zypper.sync(allocator);
    try zig.sync(allocator);
    try distrobox.sync(allocator);
    try node.sync(allocator);
    try bun.sync(allocator);

    try codium.sync(allocator);
    try ghostty.sync(allocator);
    try git.sync(allocator);
    try river.sync(allocator);

    try git.syncRemotes(allocator);
    try git.syncDotfiles(allocator);
}
