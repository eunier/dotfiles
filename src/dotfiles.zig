const std = @import("std");
const mem = std.mem;

const git = @import("git.zig");

const log = std.log.scoped(.dotfiles);

pub fn sync(allocator: mem.Allocator) !void {
    log.info("syncing", .{});
    try syncCodium(allocator);
    try syncAutoGenFiles(allocator);
}

fn syncCodium(allocator: mem.Allocator) !void {
    log.info("syncing codium", .{});

    _ = try git.addAndCommitFile(
        allocator,
        "~/.dotfiles/src/codium/codium-settings.json",
        "Codium settings",
    );
}

fn syncAutoGenFiles(allocator: mem.Allocator) !void {
    log.info("syncing auto gen files", .{});

    _ = try git.addAndCommitFile(
        allocator,
        "*__auto.txt",
        "Auto gen files",
    );
}
