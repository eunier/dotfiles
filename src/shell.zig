const std = @import("std");
const fmt_mod = std.fmt;
const mem = std.mem;
const process = std.process;
pub const getEnvVarOwned = process.getEnvVarOwned;

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

pub fn exec(alc: mem.Allocator, cmd: []const u8) !process.Child.Term {
    var process_child = process.Child.init(
        &[_][]const u8{ "bash", "-c", cmd },
        alc,
    );

    log.debug("{s}", .{cmd});
    return try process_child.spawnAndWait();
}

pub fn execFmt(alc: mem.Allocator, comptime fmt: []const u8, args: anytype) !process.Child.Term {
    const cmd = try fmt_mod.allocPrint(alc, fmt, args);
    defer alc.free(cmd);
    return try exec(alc, cmd);
}

pub fn makeExecutable(alc: mem.Allocator, path: []const u8) !void {
    log.info("making file {s} executable", .{path});
    _ = try execFmt(alc, "chmod +x {s}", .{path});
}

pub fn isCmdAvailable(alc: mem.Allocator, cmd: []const u8) !bool {
    const cmd_str = try fmt_mod.allocPrint(
        alc,
        "which {s} >/dev/null 2>&1",
        .{cmd},
    );

    defer alc.free(cmd_str);
    const result = try exec(alc, cmd_str);

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

pub fn copy(alc: mem.Allocator, src: []const u8, dest: []u8) !void {
    const cmd_str = try fmt_mod.allocPrint(
        alc,
        "cp {s} {s}",
        .{ src, dest },
    );

    defer alc.free(cmd_str);
    _ = try exec(alc, cmd_str);
}

pub fn makeDir(alc: mem.Allocator, dir: []const u8) !void {
    const cmd_str = try fmt_mod.allocPrint(alc, "mkdir -p {s}", .{dir});
    defer alc.free(cmd_str);
    _ = try exec(alc, cmd_str);
}

pub fn symLink(alc: mem.Allocator, target: []const u8, dir: []const u8) !void {
    _ = try execFmt(alc, "ln -sf {s} {s}", .{ target, dir });
}

pub fn disableSpellchecker(alc: mem.Allocator, path: []const u8) !void {
    _ = try execFmt(alc, "sed -i '1i spellchecker: disable' {s}", .{path});
}

test "exec" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const alc = gpa.alc();

    const term = try exec(
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
