const std = @import("std");
const mem = std.mem;

const sh = @import("shell.zig");

const log = std.log.scoped(.helix);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try symLink(alc);
    try snap(alc);
}

fn symLink(alc: mem.Allocator) !void {
    log.info("sym linking", .{});

    _ = try sh.symLink(
        alc,
        "~/.dotfiles/src/helix/config.toml",
        "~/.config/helix/config.toml",
    );

    _ = try sh.symLink(
        alc,
        "~/.dotfiles/src/helix/languages.toml",
        "~/.config/helix/languages.toml",
    );
}

fn snap(alc: mem.Allocator) !void {
    log.info("snapping", .{});
    try snapHealth(alc);
}

fn snapHealth(alc: mem.Allocator) !void {
    log.info("snapping health", .{});

    _ = try sh.disableSpellchecker(alc, "~/.dotfiles/src/helix/javascript_heath.snap");

    _ = try sh.spawnAndWait(
        alc,
        "hx --health javascript | sed -r 's/\\x1B\\[[0-9;]*[A-Za-z]//g' >> ~/.dotfiles/src/helix/javascript_heath.snap",
        .{},
    );

    _ = try sh.disableSpellchecker(alc, "~/.dotfiles/src/helix/lua_heath.snap");

    _ = try sh.spawnAndWait(
        alc,
        "hx --health lua | sed -r 's/\\x1B\\[[0-9;]*[A-Za-z]//g' >> ~/.dotfiles/src/helix/lua_heath.snap",
        .{},
    );

    _ = try sh.disableSpellchecker(alc, "~/.dotfiles/src/helix/markdown_heath.snap");

    _ = try sh.spawnAndWait(
        alc,
        "hx --health markdown | sed -r 's/\\x1B\\[[0-9;]*[A-Za-z]//g' >> ~/.dotfiles/src/helix/markdown_heath.snap",
        .{},
    );

    _ = try sh.disableSpellchecker(alc, "~/.dotfiles/src/helix/rust_heath.snap");

    _ = try sh.spawnAndWait(
        alc,
        "hx --health rust | sed -r 's/\\x1B\\[[0-9;]*[A-Za-z]//g' >> ~/.dotfiles/src/helix/rust_heath.snap",
        .{},
    );

    _ = try sh.disableSpellchecker(alc, "~/.dotfiles/src/helix/toml_heath.snap");

    _ = try sh.spawnAndWait(
        alc,
        "hx --health toml | sed -r 's/\\x1B\\[[0-9;]*[A-Za-z]//g' >> ~/.dotfiles/src/helix/toml_heath.snap",
        .{},
    );

    _ = try sh.disableSpellchecker(alc, "~/.dotfiles/src/helix/typescript_heath.snap");

    _ = try sh.spawnAndWait(
        alc,
        "hx --health typescript | sed -r 's/\\x1B\\[[0-9;]*[A-Za-z]//g' >> ~/.dotfiles/src/helix/typescript_heath.snap",
        .{},
    );

    _ = try sh.disableSpellchecker(alc, "~/.dotfiles/src/helix/zig_heath.snap");

    _ = try sh.spawnAndWait(
        alc,
        "hx --health zig | sed -r 's/\\x1B\\[[0-9;]*[A-Za-z]//g' >> ~/.dotfiles/src/helix/zig_heath.snap",
        .{},
    );
}
