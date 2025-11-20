const std = @import("std");
const mem = std.mem;

const bash = @import("bash.zig");
const sh = @import("shell.zig");

const log = std.log.scoped(.homebrew);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try add(alc);
    try addPkgs(alc);
    try snap(alc);
}

fn add(alc: mem.Allocator) !void {
    log.info("add", .{});

    if (!(try sh.isCmdAvailable(alc, "brew"))) {
        log.info("homebrew is not added, adding", .{});

        _ = try sh.spawnAndWait(
            alc,
            "/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"",
            .{},
        );

        try bash.source(alc);
        _ = try sh.spawnAndWait(alc, "brew analytics off", .{});
        _ = try sh.spawnAndWait(alc, "brew install gcc", .{});
    } else log.info("homebrew is already added", .{});
}

fn addPkgs(alc: mem.Allocator) !void {
    log.info("add pkgs", .{});
    _ = try sh.spawnAndWait(alc, "brew install --cask font-caskaydia-cove-nerd-font", .{});
    _ = try sh.spawnAndWait(alc, "brew install --cask font-caskaydia-mono-nerd-font", .{});
    _ = try sh.spawnAndWait(alc, "brew install --cask font-jetbrains-mono-nerd-font", .{});
    _ = try sh.spawnAndWait(alc, "brew install --cask font-ubuntu-mono-nerd-font", .{});
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});
    const path = "~/.dotfiles/src/homebrew/homebrew_added.snap";
    _ = try sh.spawnAndWait(alc, "echo \"spell-checker: disable\" > {s}", .{path});
    _ = try sh.spawnAndWait(alc, "brew list --versions >> {s}", .{path});
}
