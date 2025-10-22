const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

pub fn sync(allocator: mem.Allocator) !void {
    try symLink(allocator);
    try source(allocator);
}

fn symLink(allocator: mem.Allocator) !void {
    _ = try shell.exec(allocator, "ln -sf ~/.dotfiles/src/bash/.profile ~/.profile");
    _ = try shell.exec(allocator, "ln -sf ~/.dotfiles/src/bash/.bashrc ~/.bashrc");
}

fn source(allocator: mem.Allocator) !void {
    _ = try shell.exec(allocator, "source ~/.profile");
    _ = try shell.exec(allocator, "source ~/.bashrc");
}
