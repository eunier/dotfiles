const std = @import("std");
const mem = std.mem;

const git = @import("git.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.ghostty);

pub fn sync(alc: mem.Allocator) !void {
    log.info("synching", .{});
    try symLink(alc);
    try snap(alc);
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});

    try shell.symLink(
        alc,
        "~/.dotfiles/src/ghostty/ghostty_config",
        "~/.config/ghostty/config",
    );
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});

    const fonts = "~/.dotfiles/src/ghostty/ghostty_fonts.snap";
    try shell.disableSpellchecker(alc, fonts);
    _ = try shell.exec(alc, "ghostty +list-fonts >> {s}", .{fonts});

    const keybinds = "~/.dotfiles/src/ghostty/ghostty_keybinds.snap";
    try shell.disableSpellchecker(alc, keybinds);
    _ = try shell.exec(alc, "ghostty +list-keybinds >> {s}", .{keybinds});
}
