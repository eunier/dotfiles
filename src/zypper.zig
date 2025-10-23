const std = @import("std");
const fmt = std.fmt;
const mem = std.mem;

const fastfetch = @import("fastfetch.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.zypper);

pub fn sync(allocator: mem.Allocator) !void {
    log.info("syncing", .{});
    try addRepos(allocator);
    try update(allocator);
    try installPackages(allocator);
    try captureRepos(allocator);
    try captureInstalled(allocator);
    try captureSysInfo(allocator);
}

fn addRepos(allocator: mem.Allocator) !void {
    log.info("adding repos", .{});
    try addCodiumRepo(allocator);
    try addBraveRepo(allocator);
}

// TODO do i need the alias?
fn addRepo(allocator: mem.Allocator, uri: []const u8, alias: []const u8) !void {
    log.debug("adding repo with uri: {s}, and alias: {s}", .{ uri, alias });

    _ = try shell.execFmt(
        allocator,
        "sudo zypper addrepo --check --refresh {s} {s}",
        .{ uri, alias },
    );
}

fn addCodeRepo(allocator: mem.Allocator) !void {
    log.info("adding vscode repo", .{});

    try addRepo(
        allocator,
        "https://download.opensuse.org/repositories/devel:/tools:/ide:/vscode/openSUSE_Tumbleweed",
        "devel_tools_ide_vscode",
    );
}

fn addCodiumRepo(allocator: mem.Allocator) !void {
    log.info("adding vscodium repo", .{});

    _ = try shell.exec(
        allocator,
        "sudo rpmkeys --import https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/-/raw/master/pub.gpg",
    );

    _ = try shell.exec(
        allocator,
        "printf \"[gitlab.com_paulcarroty_vscodium_repo]\\nname=gitlab.com_paulcarroty_vscodium_repo\\nbaseurl=https://download.vscodium.com/rpms/\\nenabled=1\\ngpgcheck=1\\nrepo_gpgcheck=1\\ngpgkey=https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/-/raw/master/pub.gpg\\nmetadata_expire=1h\\n\" | sudo tee -a /etc/zypp/repos.d/vscodium.repo",
    );
}

fn addBraveRepo(allocator: mem.Allocator) !void {
    log.info("Adding brave repo", .{});

    _ = try shell.exec(
        allocator,
        "sudo zypper addrepo https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo",
    );
}

fn update(allocator: mem.Allocator) !void {
    log.info("updating", .{});
    _ = try shell.exec(allocator, "sudo zypper refresh");
    _ = try shell.exec(allocator, "sudo zypper dist-upgrade --details");
}

fn installPackages(allocator: mem.Allocator) !void {
    log.info("installing packages", .{});

    _ = try shell.exec(allocator,
        \\sudo zypper install --details \
        \\  brave-browser \
        \\  codium \
        \\  distrobox \
        \\  fastfetch \
        \\  fish \
        \\  foot \
        \\  ghostty \
        \\  git \
        \\  jujutsu \
        \\  podman \
        \\  river \
        \\  saja-cascadia-code-fonts \
        \\  zsh \
        \\  zvm
    );

    _ = try shell.exec(allocator, "sudo zypper install-new-recommends");
}

fn captureRepos(allocator: mem.Allocator) !void {
    log.info("capturing repos", .{});

    _ = try shell.exec(
        allocator,
        "zypper repos > ~/.dotfiles/src/zypper/zypper_repos__auto.txt",
    );

    _ = try shell.disableSpellchecker(
        allocator,
        "~/.dotfiles/src/zypper/zypper_repos__auto.txt",
    );
}

fn captureInstalled(allocator: mem.Allocator) !void {
    _ = try shell.exec(
        allocator,
        "zypper se --installed-only > ~/.dotfiles/src/zypper/zypper_installed__auto.txt",
    );

    _ = try shell.disableSpellchecker(
        allocator,
        "~/.dotfiles/src/zypper/zypper_installed__auto.txt",
    );
}

fn captureSysInfo(allocator: mem.Allocator) !void {
    log.info("capturing system info", .{});

    try fastfetch.capture(
        allocator,
        fastfetch.Host.local,
        "~/.dotfiles/src/zypper/zypper_fastfetch__auto.txt",
    );
}
