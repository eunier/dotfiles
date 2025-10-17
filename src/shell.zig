const std = @import("std");
const mem = std.mem;
const fmt_mod = std.fmt;
const process = std.process;

pub const getEnvVarOwned = process.getEnvVarOwned;
const log = std.log.scoped(.exec);

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

pub fn exec(
    allocator: mem.Allocator,
    cmd: []const u8,
) !process.Child.Term {
    var process_child = process.Child.init(
        &[_][]const u8{ "bash", "-c", cmd },
        allocator,
    );

    log.debug("{s}", .{cmd});
    return try process_child.spawnAndWait();
}

pub fn execFmt(allocator: mem.Allocator, comptime fmt: []const u8, args: anytype) !process.Child.Term {
    const cmd = try fmt_mod.allocPrint(allocator, fmt, args);
    defer allocator.free(cmd);
    return try exec(allocator, cmd);
}

pub fn execFile(allocator: mem.Allocator, path: []const u8) !process.Child.Term {
    var process_child = process.Child.init(
        &[_][]const u8{ "sh", path },
        allocator,
    );

    process_child.cwd = "/home/tron/.dotfiles/src";
    log.debug("sh {s}", .{path});
    return try process_child.spawnAndWait();
}

pub fn isCmdAvailable(allocator: mem.Allocator, cmd: []const u8) !bool {
    const cmd_str = try fmt_mod.allocPrint(
        allocator,
        "which {s} >/dev/null 2>&1",
        .{cmd},
    );

    defer allocator.free(cmd_str);

    const result = try exec(allocator, cmd_str);

    const available = switch (result) {
        .Exited => |code| code == 0,
        else => false,
    };

    log.debug(
        "Command '{s}' available: {s}",
        .{ cmd, if (available) "true" else "false" },
    );

    return available;
}

pub fn copy(allocator: mem.Allocator, src: []u8, dest: []u8) !void {
    const cmd_str = try fmt_mod.allocPrint(
        allocator,
        "cp {s} {s}",
        .{ src, dest },
    );

    defer allocator.free(cmd_str);
    _ = try exec(allocator, cmd_str);
}

pub fn makeDir(allocator: mem.Allocator, dir: []u8) !void {
    const cmd_str = try fmt_mod.allocPrint(
        allocator,
        "mkdir -p {s}",
        .{dir},
    );

    defer allocator.free(cmd_str);
    _ = try exec(allocator, cmd_str);
}

test "exec" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const term = try exec(
        &[_][]const u8{ "echo", "Hello, World!" },
        allocator,
    );

    switch (term) {
        .Exited => |code| {
            try std.testing.expect(code == 0);
        },
        else => {
            // The process did not exit normally
            try std.testing.expect(false);
        },
    }
}

test "isCmdAvailable" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    const bashAvailable = try isCmdAvailable(
        "bash",
        allocator,
    );

    const nonExistentCmdAvailable = try isCmdAvailable(
        "non_existent_command_xyz",
        allocator,
    );

    try std.testing.expect(bashAvailable);
    try std.testing.expect(!nonExistentCmdAvailable);
}
