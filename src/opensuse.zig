const std = @import("std");
const mem = std.mem;

const autostart = @import("autostart.zig");
const bash = @import("bash.zig");
const bun = @import("bun.zig");
const code = @import("code.zig");
const codium = @import("codium.zig");
const distrobox = @import("distrobox.zig");
const fastfetch = @import("fastfetch.zig");
const fonts = @import("fonts.zig");
const ghostty = @import("ghostty.zig");
const git = @import("git.zig");
const gitlab = @import("gitlab.zig");
const homebrew = @import("homebrew.zig");
const jj = @import("jj.zig");
const node = @import("node.zig");
const river = @import("river.zig");
const zig = @import("zig.zig");
const zsh = @import("zsh.zig");
const zypper = @import("zypper.zig");

pub fn sync(alc: mem.Allocator) !void {
    try bash.sync(alc);
    try zypper.sync(alc);
    try zsh.sync(alc);
    try homebrew.sync(alc);
    try gitlab.sync(alc);
    try git.sync(alc);
    try zig.sync(alc);
    try code.sync(alc);
    try distrobox.sync(alc);
    try node.sync(alc);
    try bun.sync(alc);
    try jj.sync(alc);
    try codium.sync(alc);
    try ghostty.sync(alc);
    try river.sync(alc);
    try autostart.sync(alc);
    try fonts.sync(alc);
    try fastfetch.sync(alc);
}
