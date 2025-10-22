const std = @import("std");
const enums = std.enums;
const fmt = std.fmt;
const mem = std.mem;
const process = std.process;

const fastfetch = @import("fastfetch.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.distrobox);

pub fn sync(allocator: mem.Allocator) !void {
    log.info("syncing", .{});
    try addArchBox(allocator);
    try installPikaur(allocator);
    try update(allocator);
    try installPackages(allocator);
    try exportPackages(allocator);
    try captureSystemInfo(allocator);
}

pub fn exec(allocator: mem.Allocator, cmd: []const u8) !process.Child.Term {
    return try shell.execFmt(allocator,
        \\distrobox enter --name arch -- bash -lc '
        \\  {s}
        \\'
    , .{cmd});
}

fn addArchBox(allocator: mem.Allocator) !void {
    log.info("adding Arch box to distrobox", .{});

    _ = try shell.exec(allocator,
        \\if ! distrobox list | grep -q "arch"; then
        \\  distrobox create --image archlinux:latest --name arch
        \\fi
    );

    _ = try shell.exec(allocator,
        \\distrobox enter arch -- bash -lc '
        \\  sudo pacman --sync --refresh --sysupgrade --needed --noconfirm \
        \\      base-devel \
        \\      git \
        \\      vim
        \\'
    );
}

fn installPikaur(allocator: mem.Allocator) !void {
    log.info("installing pikaur", .{});

    _ = try shell.exec(
        allocator,
        "git clone https://aur.archlinux.org/pikaur.git ~/Projects/org.archlinux.aur.pikaur/pikaur",
    );

    _ = try shell.exec(allocator,
        \\cd ~/Projects/org.archlinux.aur.pikaur/pikaur &&
        \\git pull
    );

    _ = try exec(allocator,
        \\if ! command -v pikaur >/dev/null 2>&1; then
        \\  cd ~/Projects/org.archlinux.aur.pikaur/pikaur
        \\  git reset --hard
        \\  git clean -xfd
        \\  makepkg -fsri --noconfirm
        \\fi
    );
}

fn update(allocator: mem.Allocator) !void {
    log.info("updating", .{});
    _ = try exec(allocator, "pikaur --sync --refresh --sysupgrade --devel --noconfirm");
}

fn installPackages(allocator: mem.Allocator) !void {
    log.info("installing packages", .{});

    _ = try exec(allocator,
        \\pikaur --sync --needed --noconfirm \
        \\  bun-bin \
        \\  cmatrix \
        \\  fastfetch \
        \\  fnm-bin \
        \\  keepassxc \
        \\  pnpm-bin
    );
}

const ExportableCli = enum { bun, cmatrix, fnm, pnpm };
const ExportableApp = enum { keepassxc };

fn exportPackages(allocator: mem.Allocator) !void {
    log.info("exporting packages", .{});

    for (enums.values(ExportableCli)) |cli| {
        const name = @tagName(cli);

        if (try shell.isCmdAvailable(allocator, name)) {
            log.info("cli {s} already exported, skipping", .{name});
            continue;
        }

        log.info("exporting cli {s}.", .{name});

        _ = try shell.execFmt(allocator,
            \\distrobox enter arch -- bash -lc '
            \\  distrobox-export --bin "$(which {s})"
            \\'
        , .{name});
    }

    for (enums.values(ExportableApp)) |app| {
        const name = @tagName(app);
        log.info("exporting app {s}", .{name});

        _ = try shell.execFmt(allocator,
            \\distrobox enter arch -- bash -lc '
            \\  distrobox-export --app {s} --export-label "none"
            \\'
        , .{name});
    }
}

fn captureSystemInfo(allocator: mem.Allocator) !void {
    log.info("capturing system info", .{});

    try fastfetch.capture(
        allocator,
        fastfetch.Host.arch_container,
        "~/.dotfiles/src/distrobox/distrobox_fastfetch__auto.txt",
    );
}
