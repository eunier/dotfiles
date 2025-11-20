const std = @import("std");
const fmt_mod = std.fmt;
const mem = std.mem;
const process = std.process;
pub const getEnvVarOwned = process.getEnvVarOwned;

const utils = @import("utils");
const shell = utils.shell;
pub const exec = shell.exec;
pub const execInter = shell.execInteractive;

const log = std.log.scoped(.shell);

pub const EnvVar = enum {
    home,
    user,

    pub fn toOwnedSlice(self: @This()) []const u8 {
        return switch (self) {
            .home => "HOME",
            .user => "USER",
        };
    }
};

/// Spawns a child process, waits for it, collecting stdout and stderr, and then returns. If it
/// succeeds, the caller owns result.stdout and result.stderr memory.
pub fn run(
    alc: mem.Allocator,
    comptime fmt: []const u8,
    args: anytype,
) process.Child.RunError!process.Child.RunResult {
    const cmd = try fmt_mod.allocPrint(alc, fmt, args);
    defer alc.free(cmd);
    log.debug("running {s}", .{cmd});

    return process.Child.run(
        .{
            .allocator = alc,
            .argv = &[_][]const u8{ "bash", "-c", cmd },
        },
    );
}

// TODO: remove, update this fn usage for utils.exec
pub fn spawnAndWait(alc: mem.Allocator, comptime fmt: []const u8, args: anytype) !process.Child.Term {
    const cmd = try fmt_mod.allocPrint(alc, fmt, args);
    defer alc.free(cmd);

    var process_child = process.Child.init(
        &[_][]const u8{ "bash", "-c", cmd },
        alc,
    );

    log.debug("{s}", .{cmd});
    return try process_child.spawnAndWait();
}

pub fn ensureBackupExists(alc: mem.Allocator, file: []const u8) !void {
    const fileExist = try doesFileExist(alc, file);

    if (!fileExist) {
        const dest = try fmt_mod.allocPrint(alc, "{s}.bak", .{file});
        defer alc.free(dest);
        log.info("{s} does not exist, making backup", .{file});
        try copy(alc, file, dest);
    } else {
        log.info("{s} already exist, skipping backup", .{file});
    }
}

pub fn doesFileExist(alc: mem.Allocator, file: []const u8) !bool {
    const res = try exec(alc, "[ -e {s} ] && echo 1 || echo 0", .{file});
    defer alc.free(res.stderr);
    defer alc.free(res.stdout);
    const out = std.mem.trim(u8, res.stdout, " \r\n\t");
    const exist = out.len > 0 and out[0] == '1';
    log.debug("file \"{s}\" does {s} exist", .{ file, if (exist) "" else "not" });
    return exist;
}

pub fn doesFileContains(
    alc: mem.Allocator,
    comptime file: []const u8,
    comptime substr: []const u8,
) !bool {
    const res = try run(
        alc,
        "grep -q \"{s}\" {s} && echo 1 || echo 0",
        .{ substr, file },
    );

    defer alc.free(res.stderr);
    defer alc.free(res.stdout);
    const out = std.mem.trim(u8, res.stdout, " \r\n\t");
    const contains = out.len > 0 and out[0] == '1';

    log.debug(
        "file \"{s}\" does {s} contains",
        .{ file, if (contains) "" else "not" },
    );

    return contains;
}

pub fn makeExecutable(alc: mem.Allocator, path: []const u8) !void {
    log.info("making file {s} executable", .{path});
    _ = try spawnAndWait(alc, "chmod +x {s}", .{path});
}

pub fn isCmdAvailable(alc: mem.Allocator, cmd: []const u8) !bool {
    const result = try spawnAndWait(alc, "which {s} >/dev/null 2>&1", .{cmd});

    const available = switch (result) {
        .Exited => |code| code == 0,
        else => false,
    };

    log.debug(
        "command '{s}' available: {s}",
        .{ cmd, if (available) "true" else "false" },
    );

    return available;
}

pub fn copy(alc: mem.Allocator, src: []const u8, dest: []const u8) !void {
    log.debug("coping {s} {s}", .{ src, dest });
    _ = try spawnAndWait(alc, "cp {s} {s}", .{ src, dest });
}

pub fn makeDir(alc: mem.Allocator, dir: []const u8) !void {
    log.debug("making dir {s}", .{dir});
    _ = try spawnAndWait(alc, "mkdir -p {s}", .{dir});
}

pub fn symLink(alc: mem.Allocator, target: []const u8, dir: []const u8) !void {
    log.debug("sym linking {s} {s}", .{ target, dir });

    _ = try spawnAndWait(
        alc,
        "ln --symbolic --force --no-dereference --no-target-directory {s} {s}",
        .{ target, dir },
    );
}

pub fn disableSpellchecker(alc: mem.Allocator, path: []const u8) !void {
    log.debug("disabling spell checker {s}", .{path});
    _ = try spawnAndWait(alc, "echo \"spellchecker: disable\" > {s}", .{path});
}

test "exec" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const alc = gpa.alc();

    const term = try spawnAndWait(
        &[_][]const u8{ "echo", "Hello, World!" },
        alc,
    );

    switch (term) {
        .Exited => |code| {
            try std.testing.expect(code == 0);
        },
        else => {
            try std.testing.expect(false);
        },
    }
}

test "isCmdAvailable" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const alc = gpa.alc();
    const bashAvailable = try isCmdAvailable("bash", alc);

    const nonExistentCmdAvailable = try isCmdAvailable(
        "non_existent_command_xyz",
        alc,
    );

    try std.testing.expect(bashAvailable);
    try std.testing.expect(!nonExistentCmdAvailable);
}

test "fileExist" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const alc = gpa.alc();
    const should_exist = try doesFileExist(alc, "~/.dotfiles/src/shell.zig");
    try std.testing.expect(should_exist);
    const should_not_exist = try doesFileExist(alc, "~/.dotfiles/src/z.zig");
    try std.testing.expect(!should_not_exist);
}
