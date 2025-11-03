const std = @import("std");
const enums = std.enums;
const fmt_mod = std.fmt;
const mem = std.mem;

const fastfetch = @import("fastfetch.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.distrobox);

pub const Host = enum { local, arch_container };

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try addArchBox(alc);
    try addPikaur(alc);
    try update(alc);
    try addPkgs(alc);
    try exportPackages(alc);
    try snapSysInfo(alc);
    try snapAdded(alc);
}

pub fn exec(alc: mem.Allocator, comptime fmt: []const u8, args: anytype) !void {
    const box_cmd = try fmt_mod.allocPrint(alc, fmt, args);
    defer alc.free(box_cmd);

    _ = try shell.exec(alc,
        \\distrobox enter --name arch -- bash -lc '
        \\  {s}
        \\'
    , .{box_cmd});
}

fn addArchBox(alc: mem.Allocator) !void {
    log.info("adding Arch box to distrobox", .{});

    _ = try shell.exec(alc,
        \\if ! distrobox list | grep -q "arch"; then
        \\  distrobox create --image archlinux:latest --name arch
        \\fi
    , .{});

    _ = try exec(alc,
        \\sudo pacman --sync --refresh --sysupgrade --needed --noconfirm \
        \\  base-devel \
        \\  git \
        \\  vim
    , .{});
}

fn addPikaur(alc: mem.Allocator) !void {
    log.info("add pikaur", .{});

    _ = try shell.exec(alc,
        \\cd ~/code/org.archlinux.aur.pikaur/pikaur &&
        \\git pull
    , .{});

    try exec(alc,
        \\if ! command -v pikaur >/dev/null 2>&1; then
        \\  cd ~/code/org.archlinux.aur.pikaur/pikaur
        \\  git reset --hard
        \\  git clean -xfd
        \\  makepkg -fsri --noconfirm
        \\fi
    , .{});
}

fn update(alc: mem.Allocator) !void {
    log.info("updating", .{});
    try exec(alc, "pikaur --sync --refresh --sysupgrade --devel --noconfirm", .{});
}

fn addPkgs(alc: mem.Allocator) !void {
    log.info("add pkgs", .{});

    try exec(alc,
        \\pikaur --sync --refresh --sysupgrade --needed --noconfirm \
        \\  bash-language-server \
        \\  blanket \
        \\  bun-bin \
        \\  cmatrix \
        \\  extension-manager \
        \\  fastfetch \
        \\  filen-desktop-bin \
        \\  fish \
        \\  fnm-bin \
        \\  gnome-font-viewer \
        \\  keepassxc \
        \\  meow-nvim \
        \\  neovim-nightly-bin \
        \\  obsidian \
        \\  pnpm-bin \
        \\  prettier \
        \\  shellcheck \
        \\  shfmt \
        \\  syncthing \
        \\  zsh
    , .{});
}

/// `distrobox-export --delete --bin/--app "$(which cli-or-app-name)"` to manually remove exported
/// cli or app
fn exportPackages(alc: mem.Allocator) !void {
    log.info("exporting pkgs", .{});
    try exportClis(alc);
    try exportApps(alc);
}

const ExportableCli = enum {
    bash_language_server,
    bun,
    cmatrix,
    fnm,
    meow,
    pnpm,
    prettier,
    shellcheck,
    shfmt,
    syncthing,
};

fn exportClis(alc: mem.Allocator) !void {
    log.info("exporting clis", .{});

    for (enums.values(ExportableCli)) |cli| {
        const tag = @tagName(cli);

        const name = switch (cli) {
            .bash_language_server => "bash-language-server",
            else => tag,
        };

        if (try shell.isCmdAvailable(alc, name)) {
            log.info("cli {s} already exported, skipping", .{name});
            continue;
        }

        log.info("exporting cli {s}.", .{name});
        try exec(alc, "distrobox-export --bin \"$(which {s})\"", .{name});
    }
}

const ExportableApp = enum {
    blanket,
    extension_manager,
    filen_desktop_bin,
    gnome_font_viewer,
    keepassxc,
    obsidian,
};

fn exportApps(alc: mem.Allocator) !void {
    log.info("exporting apps", .{});

    for (enums.values(ExportableApp)) |app| {
        const tag = @tagName(app);

        const name = switch (app) {
            .extension_manager => "extension-manager",
            .filen_desktop_bin => "filen-desktop",
            .gnome_font_viewer => "gnome-font-viewer",
            else => tag,
        };

        log.info("exporting app {s}", .{name});
        try exec(alc, "distrobox-export --app {s} --export-label \"none\"", .{name});
    }
}

fn snapSysInfo(alc: mem.Allocator) !void {
    log.info("snapping system info", .{});

    try fastfetch.snap(
        alc,
        Host.arch_container,
        "~/.dotfiles/src/distrobox/distrobox_fastfetch",
    );
}

fn snapAdded(alc: mem.Allocator) !void {
    log.info("snapping added", .{});
    const path = "~/.dotfiles/src/distrobox/distrobox_added.snap";
    try shell.disableSpellchecker(alc, path);
    try exec(alc, "pikaur --query --info >> {s}", .{path});
}
