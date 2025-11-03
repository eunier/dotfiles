const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.ohmyposh);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try add(alc);
    try update(alc);
}

fn add(alc: mem.Allocator) !void {
    log.info("adding", .{});

    if (!(try shell.isCmdAvailable(alc, "oh-my-posh"))) {
        _ = try shell.exec(
            alc,
            "curl -s https://ohmyposh.dev/install.sh | bash -s",
            .{},
        );
    }
}

fn update(alc: mem.Allocator) !void {
    log.info("updating", .{});
    _ = try shell.exec(alc, "oh-my-posh upgrade", .{});
}
