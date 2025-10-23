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

pub fn sync(alc: mem.Allocator) !void {
    try bash.sync(alc);
    try zypper.sync(alc);
    try zig.sync(alc);
    try distrobox.sync(alc);
    try node.sync(alc);
    try bun.sync(alc);

    try codium.sync(alc);
    try ghostty.sync(alc);
    try git.sync(alc);
    try river.sync(alc);

    try git.syncRemotes(alc);
}
