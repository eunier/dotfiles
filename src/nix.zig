const std = @import("std");
const mem = std.mem;

const sh = @import("shell.zig");
const zsh = @import("zsh.zig");

const log = std.log.scoped(.nix);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try add(alc);
    try update(alc);
    try symLink(alc);
    try snap(alc);
}

fn add(alc: mem.Allocator) !void {
    if (!(try sh.isCmdAvailable(alc, "nix"))) {
        log.info("adding", .{});

        _ = try sh.exec(
            alc,
            "sh <(curl --proto '=https' --tlsv1.2 -L https://nixos.org/nix/install) --no-daemon",
            .{},
        );

        try zsh.source(alc);
    }
}

fn update(alc: mem.Allocator) !void {
    log.info("updating", .{});

    _ = try sh.exec(alc,
        \\nix-channel --add https://nixos.org/channels/nixpkgs-unstable nixpkgs
        \\nix-channel --update
    , .{});

    _ = try sh.exec(alc, "nix upgrade-nix", .{});
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});
    _ = try sh.makeDir(alc, "~/.config/nix");
    try sh.symLink(alc, "~/.dotfiles/src/nix/config", "~/.config/nix/nix.conf");
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});

    _ = try sh.exec(
        alc,
        \\nix-channel --list > ~/.dotfiles/src/nix/channels.snap"
        \\nix --version > ~/.dotfiles/src/nix/version.snap
    ,
        .{},
    );
}
