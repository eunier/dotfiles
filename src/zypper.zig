const std = @import("std");
const fmt = std.fmt;
const mem = std.mem;

const distrobox = @import("distrobox.zig");
const fastfetch = @import("fastfetch.zig");
const shell = @import("shell.zig");

const log = std.log.scoped(.zypper);

pub fn sync(alc: mem.Allocator) !void {
    log.info("syncing", .{});
    try addRepos(alc);
    try update(alc);
    try addPkgs(alc);
    try snapRepos(alc);
    try snapAdded(alc);
    try snapSysInfo(alc);
}

fn addRepos(alc: mem.Allocator) !void {
    log.info("adding repos", .{});
    try addBraveRepo(alc);
    try addCodiumRepo(alc);
    try addLibrewolfRepo(alc);
    try addLuarocksRepo(alc);
}

fn addBraveRepo(alc: mem.Allocator) !void {
    log.info("adding brave repo", .{});

    _ = try shell.exec(
        alc,
        "sudo zypper addrepo https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo",
        .{},
    );
}

fn addCodiumRepo(alc: mem.Allocator) !void {
    log.info("adding vscodium repo", .{});

    _ = try shell.exec(
        alc,
        "sudo rpmkeys --import https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/-/raw/master/pub.gpg",
        .{},
    );

    _ = try shell.exec(
        alc,
        "printf \"[gitlab.com_paulcarroty_vscodium_repo]\\nname=gitlab.com_paulcarroty_vscodium_repo\\nbaseurl=https://download.vscodium.com/rpms/\\nenabled=1\\ngpgcheck=1\\nrepo_gpgcheck=1\\ngpgkey=https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/-/raw/master/pub.gpg\\nmetadata_expire=1h\\n\" | sudo tee -a /etc/zypp/repos.d/vscodium.repo",
        .{},
    );
}

fn addCodeRepo(alc: mem.Allocator) !void {
    log.info("adding vscode repo", .{});

    try addRepo(
        alc,
        "https://download.opensuse.org/repositories/devel:/tools:/ide:/vscode/openSUSE_Tumbleweed",
    );
}

fn addLibrewolfRepo(alc: mem.Allocator) !void {
    log.info("adding librewolf repo", .{});

    _ = try shell.exec(alc,
        \\sudo rpm --import https://rpm.librewolf.net/pubkey.gpg
        \\sudo zypper ar -ef https://rpm.librewolf.net librewolf
    , .{});
}

fn addLuarocksRepo(alc: mem.Allocator) !void {
    log.info("adding luarocks repo", .{});

    try addRepo(
        alc,
        "https://download.opensuse.org/repositories/home:malkavi/openSUSE_Tumbleweed/home:malkavi.repo",
    );
}

fn addRepo(alc: mem.Allocator, uri: []const u8) !void {
    log.debug("adding repo {s}", .{uri});

    _ = try shell.exec(
        alc,
        "sudo zypper addrepo --check --refresh --enable {s}",
        .{uri},
    );
}

fn update(alc: mem.Allocator) !void {
    log.info("updating", .{});
    _ = try shell.exec(alc, "sudo zypper refresh", .{});
    _ = try shell.exec(alc, "sudo zypper dist-upgrade --details", .{});
}

fn addPkgs(alc: mem.Allocator) !void {
    log.info("adding pkgs", .{});

    _ = try shell.exec(alc,
        \\sudo zypper install --details \
        \\  brave-browser \
        \\  codium \
        \\  distrobox \
        \\  fastfetch \
        \\  fd \
        \\  fish \
        \\  foot \
        \\  ghostty \
        \\  git \
        \\  glab \
        \\  gnome-boxes \
        \\  helix \
        \\  htop \
        \\  jujutsu \
        \\  librewolf \
        \\  lldb \
        \\  luajit-luarocks \
        \\  lua-language-server \
        \\  podman \
        \\  ripgrep \
        \\  river \
        \\  rustup \
        \\  taplo \
        \\  zellij \
        \\  zsh \
        \\  zvm
    , .{});

    _ = try shell.exec(alc, "sudo zypper install-new-recommends", .{});
    _ = try shell.exec(alc, "sudo zypper install --type pattern devel_C_C++", .{});
}

fn snapRepos(alc: mem.Allocator) !void {
    log.info("snapping repos", .{});
    try shell.disableSpellchecker(alc, "~/.dotfiles/src/zypper/zypper_repos.snap");

    _ = try shell.exec(
        alc,
        "zypper repos >> ~/.dotfiles/src/zypper/zypper_repos.snap",
        .{},
    );
}

fn snapAdded(alc: mem.Allocator) !void {
    log.info("snapping added", .{});
    try shell.disableSpellchecker(alc, "~/.dotfiles/src/zypper/zypper_added.snap");

    _ = try shell.exec(
        alc,
        "zypper search --details --installed-only >> ~/.dotfiles/src/zypper/zypper_added.snap",
        .{},
    );
}

fn snapSysInfo(alc: mem.Allocator) !void {
    log.info("snapping system info", .{});

    try fastfetch.snap(
        alc,
        distrobox.Host.local,
        "~/.dotfiles/src/zypper/zypper_fastfetch.snap",
    );
}
