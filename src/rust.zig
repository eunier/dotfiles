const std = @import("std");
const mem = std.mem;

const sh = @import("shell.zig");

const log = std.log.scoped(.rust);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try install(alc);
    try update(alc);
    try snap(alc);
}

fn install(alc: mem.Allocator) !void {
    log.info("installing", .{});
    _ = try sh.exec(alc, "rustup toolchain install stable", .{});
}

fn update(alc: mem.Allocator) !void {
    log.info("updating", .{});
    _ = try sh.exec(alc, "rustup update", .{});
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});
    _ = try sh.exec(alc, "rustup toolchain list > ~/.dotfiles/src/rust/rust.snap", .{});
}

fn cargoInstall(alc: mem.Allocator)!void {
    log.info("cargo installing", .{});
    _ = try sh.exec(alc, "cargo install bob-nvim", .{});
}