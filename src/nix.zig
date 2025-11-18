const std = @import("std");
const mem = std.mem;

const sh = @import("shell.zig");

const log = std.log.scoped(.nix);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try add(alc);
    try update(alc);
    try symLink(alc);
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

fn update(alc: mem.Allocator) !void {
    log.info("updating", .{});
    _ = try sh.exec(alc, "nix upgrade-nix", .{});
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});
    _ = try sh.makeDir(alc, "~/.config/nix");
    // _ = try sh.exec(alc, "touch ~/.config/nix/nix.conf", .{});
    try sh.symLink(alc, "~/.dotfiles/src/nix/nix.conf", "~/.config/nix/nix.conf");
}
