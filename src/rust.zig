const std = @import("std");
const mem = std.mem;

const sh = @import("shell.zig");

const log = std.log.scoped(.rust);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try update(alc);
}

fn update(alc: mem.Allocator) !void {
    log.info("updating", .{});
    _ = try sh.exec(alc, "rustup update", .{});
}
