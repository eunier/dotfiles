const std = @import("std");
const mem = std.mem;

const bash = @import("bash.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.homebrew);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try add(alc);
    try addPkgs(alc);
    try snap(alc);
}

fn add(alc: mem.Allocator) !void {
    log.info("add", .{});

    if (!(try shell.isCmdAvailable(alc, "brew"))) {
        log.info("homebrew is not added, adding", .{});

        _ = try shell.exec(
            alc,
            "/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"",
            .{},
        );

        try bash.source(alc);
        _ = try shell.exec(alc, "brew analytics off", .{});
        _ = try shell.exec(alc, "brew install gcc", .{});
    } else log.info("homebrew is already added", .{});
}

fn addPkgs(alc: mem.Allocator) !void {
    log.info("add pkgs", .{});
    _ = try shell.exec(alc, "brew install --cask font-caskaydia-cove-nerd-font", .{});
    _ = try shell.exec(alc, "brew install --cask font-caskaydia-mono-nerd-font", .{});
    _ = try shell.exec(alc, "brew install --cask font-jetbrains-mono-nerd-font", .{});
    _ = try shell.exec(alc, "brew install --cask font-ubuntu-mono-nerd-font", .{});
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});
    const path = "~/.dotfiles/src/homebrew/homebrew_added.snap";
    _ = try shell.exec(alc, "echo \"spell-checker: disable\" > {s}", .{path});
    _ = try shell.exec(alc, "brew list --versions >> {s}", .{path});
}
