const std = @import("std");
const fmt = std.fmt;
const mem = std.mem;
const time = std.time;

const sh = @import("shell.zig");

const log = std.log.scoped(.backup);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try mountBackupDisk(alc);
    try backupKeePass(alc);
    try backupDotfiles(alc);
    try backupUtils(alc);
    try runReposync(alc);
}

fn mountBackupDisk(alc: mem.Allocator) !void {
    log.info("mounting backup disk", .{});
    _ = try sh.spawnAndWait(alc, "udisksctl mount -b /dev/disk/by-label/External", .{});
}

fn backupKeePass(alc: mem.Allocator) !void {
    log.info("backing up keepass", .{});
    try sh.makeDir(alc, "/run/media/$USER/External/KeePass");
    const now = try fmt.allocPrint(alc, "{d}", .{time.microTimestamp()});
    defer alc.free(now);

    const dest = try fmt.allocPrint(
        alc,
        "/run/media/$USER/External/KeePass/Backups/Safe_{s}.kdbx",
        .{now},
    );

    defer alc.free(dest);

    _ = try sh.spawnAndWait(
        alc,
        "sudo cp ~/Documents/Applications/KeePass/Safe.kdbx {s}",
        .{dest},
    );

    _ = try sh.spawnAndWait(alc,
        \\rsync --archive --verbose --human-readable --progress \
        \\  ~/Documents/Applications/KeePass \
        \\  /run/media/$USER/External/
    , .{});
}

fn backupDotfiles(alc: mem.Allocator) !void {
    log.info("backing up dotfiles", .{});
    _ = try sh.spawnAndWait(alc, "udisksctl mount -b /dev/sda", .{});
    try sh.makeDir(alc, "/run/media/$USER/External/Dotfiles");

    _ = try sh.spawnAndWait(alc,
        \\rsync --archive --verbose --human-readable --progress \
        \\  --exclude=".zig-cache" --exclude="zig-out" \
        \\  ~/.dotfiles/ \
        \\  /run/media/$USER/External/Dotfiles
    , .{});

    _ = try sh.spawnAndWait(alc,
        \\cd ~/code/com.github.eunier.dotfiles/dotfiles
        \\find . -mindepth 1 -name .git -prune -o -exec rm -rf {{}} +
    , .{});

    _ = try sh.spawnAndWait(alc,
        \\rsync --archive --verbose --human-readable --progress \
        \\  --exclude=".zig-cache" --exclude="zig-out" --exclude=".git" \
        \\  ~/.dotfiles/ \
        \\  ~/code/com.github.eunier.dotfiles/dotfiles
    , .{});
}

fn backupUtils(alc: mem.Allocator) !void {
    log.info("backing up utils", .{});

    _ = try sh.spawnAndWait(alc,
        \\cd ~/code/com.github.eunier.utils/utils
        \\find . -mindepth 1 -name .git -prune -o -exec rm -rf {{}} +
    , .{});

    _ = try sh.spawnAndWait(alc,
        \\rsync --archive --verbose --human-readable --progress \
        \\  --exclude=".zig-cache" --exclude="zig-out" --exclude=".git" \
        \\  ~/code/utils/ \
        \\  ~/code/com.github.eunier.utils/utils
    , .{});
}

fn runReposync(alc: mem.Allocator) !void {
    log.info("running reposync", .{});

    _ = try sh.spawnAndWait(alc,
        \\  cd ~/code/reposync
        \\  zig build run
    , .{});
}
