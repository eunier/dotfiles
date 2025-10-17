//! Module for retrieving DMI (Desktop Management Interface) information.
const std = @import("std");
const fs = std.fs;
const mem = std.mem;
const ascii = std.ascii;
const math = std.math;

const shell = @import("shell.zig");
const repo = @import("repo.zig");

const log = std.log.scoped(.dmi);

pub fn allocProductName(allocator: mem.Allocator) ![]u8 {
    log.info("Getting system product name", .{});

    _ = try shell.exec(
        allocator,
        "sudo dmidecode -s system-product-name >~/.dotfiles/src/dmi/dmi_product_name.local.txt",
    );

    const home = try shell.getEnvVarOwned(allocator, shell.EnvVar.home.toOwnedSlice());
    log.debug("Home dir: {s}", .{home});
    defer allocator.free(home);

    const path = try fs.path.join(allocator, &.{
        home,
        repo.repo_folder_name,
        "src",
        "dmi",
        "dmi_product_name.local.txt",
    });

    defer allocator.free(path);
    log.debug("Dmi product name relative file path: {s}", .{path});

    const file = try fs.openFileAbsolute(path, .{});
    defer file.close();

    const contents = try file.readToEndAlloc(allocator, math.maxInt(usize));
    defer allocator.free(contents);

    const trimmed = mem.trim(u8, contents, " \n\r\t");
    const name = try ascii.allocLowerString(allocator, trimmed);
    mem.replaceScalar(u8, name, ' ', '_');
    log.info("System Product Name: {s}", .{name});
    return name;
}
