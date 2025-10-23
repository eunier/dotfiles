const std = @import("std");
const fmt = std.fmt;
const mem = std.mem;
const time = std.time;

const shell = @import("shell.zig");

const log = std.log.scoped(.backup);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try mountBackupDisk(alc);
    try backupKeePass(alc);
    try backupDotfiles(alc);
}

fn mountBackupDisk(alc: mem.Allocator) !void {
    log.info("mounting backup disk", .{});
    _ = try shell.exec(alc, "udisksctl mount -b /dev/disk/by-label/External");
}

fn backupKeePass(alc: mem.Allocator) !void {
    log.info("backing up keepass", .{});
    try shell.makeDir(alc, "/run/media/$USER/External/KeePass");
    const now = try fmt.allocPrint(alc, "{d}", .{time.microTimestamp()});
    defer alc.free(now);

    const dest = try fmt.allocPrint(
        alc,
        "/run/media/$USER/External/KeePass/Safe_{s}.kdbx",
        .{now},
    );

    defer alc.free(dest);

    _ = try shell.execFmt(
        alc,
        "sudo cp ~/Documents/Applications/KeePass/Safe.kdbx {s}",
        .{dest},
    );

    _ = try shell.exec(alc,
        \\rsync --archive --verbose --human-readable --progress \
        \\  ~/Documents/Applications/KeePass \
        \\  /run/media/$USER/External/
    );
}

fn backupDotfiles(alc: mem.Allocator) !void {
    log.info("backing up dotfiles", .{});
    _ = try shell.exec(alc, "udisksctl mount -b /dev/sda");
    try shell.makeDir(alc, "/run/media/$USER/External/Dotfiles");

    _ = try shell.exec(alc,
        \\rsync --archive --verbose --human-readable --progress --exclude=".zig-cache" \
        \\  ~/.dotfiles/ \
        \\  /run/media/$USER/External/Dotfiles
    );
}
