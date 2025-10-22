const std = @import("std");
const mem = std.mem;

const git = @import("git.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.codium);

pub fn sync(allocator: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(allocator);
    try capture(allocator);
}

fn symLink(allocator: mem.Allocator) !void {
    log.info("sym linking", .{});
    try symLinkSettings(allocator);
    try symLinkKeybindings(allocator);
}

fn symLinkSettings(allocator: mem.Allocator) !void {
    log.info("sym linking settings", .{});
    try shell.symLink(allocator, "~/.dotfiles/src/codium/codium-settings.json", "~/.config/VSCodium/User/settings.json");
    try git.addAndCommitFile(allocator, "~/.dotfiles/src/codium/codium-settings.json", "Codium settings");
}

fn symLinkKeybindings(allocator: mem.Allocator) !void {
    log.info("sym linking keybindings", .{});
    try shell.symLink(allocator, "~/.dotfiles/src/codium/codium-keybindings.json", "~/.config/VSCodium/User/keybindings.json");
    try git.addAndCommitFile(allocator, "~/.dotfiles/src/codium/codium-keybindings.json", "Codium keybindings");
}

fn capture(allocator: mem.Allocator) !void {
    log.info("capturing", .{});
    try captureExtensions(allocator);
}

fn captureExtensions(allocator: mem.Allocator) !void {
    log.info("capturing extensions", .{});
    _ = try shell.makeDir(allocator, "~/.dotfiles/src/codium");
    _ = try shell.exec(allocator, "codium --list-extensions --show-versions > ~/.dotfiles/src/codium/codium_extensions__auto.txt");
}
