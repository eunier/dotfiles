const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.zig);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try add(alc);
    try use(alc);
    try initScript(alc);
    try snapVersion(alc);
}

fn add(alc: mem.Allocator) !void {
    log.info("adding", .{});
    _ = try shell.exec(alc, "zvm install --zls 0.15.2", .{});
}

fn use(alc: mem.Allocator) !void {
    log.info("using", .{});
    _ = try shell.exec(alc, "zvm use 0.15.2", .{});
}

fn initScript(alc: mem.Allocator) !void {
    log.info("init script", .{});

    _ = try shell.exec(
        alc,
        "echo \"#!/usr/bin/env bash\" > ~/.dotfiles/scripts/init.sh",
        .{},
    );

    _ = try shell.exec(
        alc,
        "echo \"sudo zypper install zvm\" >> ~/.dotfiles/scripts/init.sh",
        .{},
    );

    _ = try shell.exec(
        alc,
        "echo \"zvm install --zls 0.15.2\" >> ~/.dotfiles/scripts/init.sh",
        .{},
    );

    _ = try shell.exec(
        alc,
        "echo \"zvm use 0.15.2\" >> ~/.dotfiles/scripts/init.sh",
        .{},
    );
}

fn snapVersion(alc: mem.Allocator) !void {
    log.info("snapping version", .{});

    _ = try shell.exec(
        alc,
        "zvm ls --all > ~/.dotfiles/src/zig/zig_versions.snap",
        .{},
    );
}
