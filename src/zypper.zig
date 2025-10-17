const std = @import("std");
const mem = std.mem;
const fmt = std.fmt;

const shell = @import("shell.zig");
const dotfiles_repo = @import("repo.zig");

pub fn refresh(allocator: mem.Allocator, user: []u8) !void {
    try addRepos(allocator);
    try installPackages(allocator);
    try update(allocator);
    try captureRepos(allocator, user);
}

fn addRepo(allocator: mem.Allocator, uri: []const u8, alias: []const u8) !void {
    _ = try shell.execFmt(
        allocator,
        "sudo zypper addrepo --check --refresh {s} {s}",
        .{ uri, alias },
    );
}

fn installPackages(allocator: mem.Allocator) !void {
    // zig (zvm) availalbe in zypper
    _ = try shell.exec(allocator,
        \\sudo zypper install \
        \\  code \
        \\  fastfetch \
        \\  git
    );
}

fn update(allocator: mem.Allocator) !void {
    _ = try shell.exec(allocator, "sudo zypper dist-upgrade");
}

fn captureRepos(allocator: mem.Allocator, user: []u8) !void {
    const path = try fmt.allocPrint(
        allocator,
        "/home/{s}/{s}/src/zypper/zypper_repos__auto.txt",
        .{ user, dotfiles_repo.repo_folder_name },
    );

    defer allocator.free(path);
    _ = try shell.execFmt(allocator, "zypper repos >{s}", .{path});
}

fn addRepos(allocator: mem.Allocator) !void {
    try addCodeRepo(allocator);
}

fn addCodeRepo(allocator: mem.Allocator) !void {
    try addRepo(
        allocator,
        "https://download.opensuse.org/repositories/devel:/tools:/ide:/vscode/openSUSE_Tumbleweed",
        "devel_tools_ide_vscode",
    );
}
