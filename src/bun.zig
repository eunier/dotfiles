const std = @import("std");

const shell = @import("shell.zig");

pub fn sync(allocator: std.mem.Allocator) !void {
    const installed = try shell.isCmdAvailable(
        allocator,
        "bun",
    );

    if (!installed) {
        _ = try shell.execFile(
            allocator,
            "bun/bun_install.sh",
        );
    } else {
        _ = try shell.execFile(
            allocator,
            "bun/bun_upgrade.sh",
        );
    }

    for (&[_][]const u8{
        "bun/bun_add_global.sh",
        "bun/bun_update.sh",
    }) |script| {
        _ = try shell.execFile(allocator, script);
    }
}
