const std = @import("std");
const mem = std.mem;

const sh = @import("shell.zig");

const log = std.log.scoped(.nix);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try add(alc);
}

fn add(alc: mem.Allocator) !void {
    if (!(try sh.isCmdAvailable(alc, "nix"))) {
        log.info("adding", .{});

        _ = try sh.exec(
            alc,
            "sh <(curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install) --no-daemon",
            .{},
        );
    }
}
