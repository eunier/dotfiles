const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.backup);

pub fn sync(allocator: mem.Allocator) !void {
    log.info("syncing", .{});
    try mountBackupDisk(allocator);
    try backupKeePass(allocator);
    try backupDotfiles(allocator);
}

fn mountBackupDisk(allocator: mem.Allocator) !void {
    log.info("mounting backup disk", .{});
    _ = try shell.exec(allocator, "udisksctl mount -b /dev/disk/by-label/External");
}

fn backupKeePass(allocator: mem.Allocator) !void {
    log.info("backing up keepass", .{});
    try shell.makeDir(allocator, "/run/media/$USER/External/KeePass");

    _ = try shell.exec(allocator,
        \\rsync --archive --verbose --human-readable --progress \
        \\  ~/Documents/Applications/KeePass \
        \\  /run/media/$USER/External/
    );
}

fn backupDotfiles(allocator: mem.Allocator) !void {
    log.info("backing up dotfiles", .{});
    _ = try shell.exec(allocator, "udisksctl mount -b /dev/sda");
    try shell.makeDir(allocator, "/run/media/$USER/External/Dotfiles");

    _ = try shell.exec(allocator,
        \\rsync --archive --verbose --human-readable --progress --exclude=".zig-cache" \
        \\  ~/.dotfiles/ \
        \\  /run/media/$USER/External/Dotfiles
    );
}
