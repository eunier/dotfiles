const std = @import("std");
const mem = std.mem;

const shell = @import("shell.zig");

const log = std.log.scoped(.antidote);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try add(alc);
    try symLinkPluginsFile(alc);
}

fn add(alc: mem.Allocator) !void {
    log.info("adding", .{});

    _ = try shell.exec(alc,
        \\  git clone --depth=1 https://github.com/mattmc3/antidote.git ${{ZDOTDIR:-~}}/.antidote
        \\  cd ${{ZDOTDIR:-~}}/.antidote
        \\  git pull
    , .{});
}

fn symLinkPluginsFile(alc: mem.Allocator) !void {
    log.info("sync linking plugins file", .{});

    try shell.symLink(
        alc,
        "~/.dotfiles/src/antidote/.zsh_plugins.txt",
        "~/.zsh_plugins.txt",
    );
}
