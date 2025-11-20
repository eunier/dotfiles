const std = @import("std");
const fmt_mod = std.fmt;
const mem = std.mem;
const process = std.process;

const antidote = @import("antidote.zig");
const ohmyposh = @import("ohmyposh.zig");
const sh = @import("shell.zig");

const log = std.log.scoped(.zsh);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try backup(alc);
    try symLink(alc);
    try ensureShell(alc);
    try antidote.sync(alc);
    try ohmyposh.sync(alc);
    try source(alc);
}

fn backup(alc: mem.Allocator) !void {
    log.info("backing", .{});
    try sh.ensureBackupExists(alc, "~/.zshrc");
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});
    try sh.symLink(alc, "~/.dotfiles/src/zsh/.zshrc", "~/.zshrc");
}

fn ensureShell(alc: mem.Allocator) !void {
    log.info("ensuring shell", .{});

    _ = try sh.spawnAndWait(
        alc,
        "[[ \"$SHELL\" != \"/usr/bin/zsh\" ]] && chsh -s /usr/bin/zsh",
        .{},
    );
}

pub fn source(alc: mem.Allocator) !void {
    log.info("sourcing", .{});
    _ = try exec(alc, "source ~/.zshrc", .{});
}

fn exec(alc: mem.Allocator, comptime fmt: []const u8, args: anytype) !process.Child.Term {
    const cmd = try fmt_mod.allocPrint(alc, fmt, args);
    defer alc.free(cmd);

    var process_child = process.Child.init(
        &[_][]const u8{ "zsh", "-c", cmd },
        alc,
    );

    log.debug("{s}", .{cmd});
    return try process_child.spawnAndWait();
}
