const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.zig);

pub fn sync(allocator: mem.Allocator) !void {
    log.info("syncing", .{});
    try install(allocator);
    try use(allocator);
    try initScript(allocator);
    try captureVersion(allocator);
}

fn install(allocator: mem.Allocator) !void {
    _ = try shell.exec(allocator, "zvm install --zls 0.15.2");
}

fn use(allocator: mem.Allocator) !void {
    _ = try shell.exec(allocator, "zvm use 0.15.2");
}

fn initScript(allocator: mem.Allocator) !void {
    _ = try shell.exec(allocator, "echo \"#!/usr/bin/env bash\" > ~/.dotfiles/scripts/init.sh");
    _ = try shell.exec(allocator, "echo \"sudo zypper install zvm\" >> ~/.dotfiles/scripts/init.sh");
    _ = try shell.exec(allocator, "echo \"zvm install --zls 0.15.2\" >> ~/.dotfiles/scripts/init.sh");
    _ = try shell.exec(allocator, "echo \"zvm use 0.15.2\" >> ~/.dotfiles/scripts/init.sh");
}

fn captureVersion(allocator: mem.Allocator) !void {
    _ = try shell.makeDir(allocator, "~/.dotfiles/src/zig");
    _ = try shell.exec(allocator, "zvm ls --all > ~/.dotfiles/src/zig/zig-versions.txt");
}
