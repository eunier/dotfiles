const std = @import("std");
const mem = std.mem;

const git = @import("git.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.codium);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(alc);
    try snap(alc);
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});
    try symLinkSettings(alc);
    try symLinkKeybindings(alc);
    try addExts(alc);
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

fn addExts(alc: mem.Allocator) !void {
    log.info("adding exts", .{});

    const exts = [_][]const u8{
        "arrrrny.zed-one-theme",
        "esbenp.prettier-vscode",
        "evan-buss.font-switcher",
        "gruntfuggly.todo-tree",
        "jannisx11.batch-rename-extension",
        "pkief.copy-branch-name",
        "pkief.material-icon-theme",
        "richie5um2.vscode-sort-json",
        "streetsidesoftware.code-spell-checker",
        "tamasfe.even-better-toml",
        "ziglang.vscode-zig",
    };

    for (exts) |ext| try addExt(alc, ext);
}

fn addExt(alc: mem.Allocator, ext: []const u8) !void {
    log.info("adding ext {s}", .{ext});
    _ = try shell.exec(alc, "codium --install-extension {s}", .{ext});
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});
    try snapExtensions(alc);
}

fn snapExtensions(alc: mem.Allocator) !void {
    log.info("snapping extensions", .{});

    _ = try shell.exec(
        alc,
        "codium --list-extensions --show-versions > ~/.dotfiles/src/codium/codium_extensions.snap",
        .{},
    );
}
