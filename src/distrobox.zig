const std = @import("std");
const enums = std.enums;
const fmt = std.fmt;
const mem = std.mem;
const process = std.process;

const fastfetch = @import("fastfetch.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.distrobox);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try addArchBox(alc);
    try installPikaur(alc);
    try update(alc);
    try installPackages(alc);
    try exportPackages(alc);
    try captureSystemInfo(alc);
    try captureInstalled(alc);
}

pub fn exec(alc: mem.Allocator, cmd: []const u8) !process.Child.Term {
    return try shell.execFmt(alc,
        \\distrobox enter --name arch -- bash -lc '
        \\  {s}
        \\'
    , .{cmd});
}

fn addArchBox(alc: mem.Allocator) !void {
    log.info("adding Arch box to distrobox", .{});

    _ = try shell.exec(alc,
        \\if ! distrobox list | grep -q "arch"; then
        \\  distrobox create --image archlinux:latest --name arch
        \\fi
    );

    _ = try shell.exec(alc,
        \\distrobox enter arch -- bash -lc '
        \\  sudo pacman --sync --refresh --sysupgrade --needed --noconfirm \
        \\      base-devel \
        \\      git \
        \\      vim
        \\'
    );
}

fn installPikaur(alc: mem.Allocator) !void {
    log.info("installing pikaur", .{});

    _ = try shell.exec(
        alc,
        "git clone https://aur.archlinux.org/pikaur.git ~/Projects/org.archlinux.aur.pikaur/pikaur",
    );

    _ = try shell.exec(alc,
        \\cd ~/Projects/org.archlinux.aur.pikaur/pikaur &&
        \\git pull
    );

    _ = try exec(alc,
        \\if ! command -v pikaur >/dev/null 2>&1; then
        \\  cd ~/Projects/org.archlinux.aur.pikaur/pikaur
        \\  git reset --hard
        \\  git clean -xfd
        \\  makepkg -fsri --noconfirm
        \\fi
    );
}

fn update(alc: mem.Allocator) !void {
    log.info("updating", .{});
    _ = try exec(alc, "pikaur --sync --refresh --sysupgrade --devel --noconfirm");
}

fn installPackages(alc: mem.Allocator) !void {
    log.info("installing packages", .{});

    _ = try exec(alc,
        \\pikaur --sync --needed --noconfirm \
        \\  bun-bin \
        \\  cmatrix \
        \\  fastfetch \
        \\  filen-cli-bin \
        \\  fnm-bin \
        \\  keepassxc \
        \\  pnpm-bin
    );
}

const ExportableCli = enum { bun, cmatrix, fnm, pnpm };
const ExportableApp = enum { keepassxc };

fn exportPackages(alc: mem.Allocator) !void {
    log.info("exporting packages", .{});

    for (enums.values(ExportableCli)) |cli| {
        const name = @tagName(cli);

        if (try shell.isCmdAvailable(alc, name)) {
            log.info("cli {s} already exported, skipping", .{name});
            continue;
        }

        log.info("exporting cli {s}.", .{name});

        _ = try shell.execFmt(alc,
            \\distrobox enter arch -- bash -lc '
            \\  distrobox-export --bin "$(which {s})"
            \\'
        , .{name});
    }

    for (enums.values(ExportableApp)) |app| {
        const name = @tagName(app);
        log.info("exporting app {s}", .{name});

        _ = try shell.execFmt(alc,
            \\distrobox enter arch -- bash -lc '
            \\  distrobox-export --app {s} --export-label "none"
            \\'
        , .{name});
    }
}

fn captureSystemInfo(alc: mem.Allocator) !void {
    log.info("capturing system info", .{});

    try fastfetch.capture(
        alc,
        fastfetch.Host.arch_container,
        "~/.dotfiles/src/distrobox/distrobox_fastfetch__auto.txt",
    );
}

fn captureInstalled(alc: mem.Allocator) !void {
    log.info("Capturing installed", .{});
    const path = "~/.dotfiles/src/distrobox/distrobox_installed__auto.txt";
    _ = try shell.execFmt(alc, "echo \"spellchecker: disable\" > {s}", .{path});

    const cmd = try fmt.allocPrint(
        alc,
        "pikaur --query --info >> {s}",
        .{path},
    );

    defer alc.free(cmd);
    _ = try exec(alc, cmd);
}
