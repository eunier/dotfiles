const std = @import("std");
const mem = std.mem;

const git = @import("git.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.codium);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(alc);
    try capture(alc);
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});
    try symLinkSettings(alc);
    try symLinkKeybindings(alc);
}

fn symLinkSettings(alc: mem.Allocator) !void {
    log.info("sym linking settings", .{});

    try shell.symLink(
        alc,
        "~/.dotfiles/src/codium/codium-settings.json",
        "~/.config/VSCodium/User/settings.json",
    );
}

fn symLinkKeybindings(alc: mem.Allocator) !void {
    log.info("sym linking keybindings", .{});

    try shell.symLink(
        alc,
        "~/.dotfiles/src/codium/codium-keybindings.json",
        "~/.config/VSCodium/User/keybindings.json",
    );
}

fn capture(alc: mem.Allocator) !void {
    log.info("capturing", .{});
    try captureExtensions(alc);
}

fn captureExtensions(alc: mem.Allocator) !void {
    log.info("capturing extensions", .{});
    _ = try shell.makeDir(alc, "~/.dotfiles/src/codium");

    _ = try shell.exec(
        alc,
        "codium --list-extensions --show-versions > ~/.dotfiles/src/codium/codium_extensions__auto.txt",
    );
}
