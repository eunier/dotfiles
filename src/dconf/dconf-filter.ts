import { $ } from "bun";

type Data = [string, string[]][];

const data: Data = (
  await $`cat ~/.dotfiles/src/dconf/dconf-raw-after.conf`.text()
)
  .split("\n\n")
  .map((chunk) => {
    const key = chunk.slice(0, chunk.indexOf("]") + 1);

    const settings = chunk
      .slice(chunk.indexOf("]") + 1)
      .split("\n")
      .filter((line) => !!line);

    return [key, settings];
  });

const ignoreMap = new Map<string, string[]>();

ignoreMap.set("[org/gnome/boxes]", [
  "first-run=",
  "view=",
  "window-maximized=",
  "window-position=",
]);

ignoreMap.set("[org/gnome/builder]", ["window-maximized="]);

ignoreMap.set("[org/gnome/calculator]", [
  "angle-units=",
  "base=",
  "button-mode=",
  "number-format=",
  "show-thousands=",
  "show-zeroes=",
  "source-currency=",
  "source-units=",
  "target-currency=",
  "target-units=",
  "window-maximized=",
  "accuracy=",
]);

ignoreMap.set("[org/gnome/control-center]", ["last-panel=", "window-state="]);

ignoreMap.set("[org/gnome/evince/default]", [
  "sidebar-page=",
  "window-ratio=",
  "dual-page-odd-left=",
]);

ignoreMap.set("[org/gnome/gitlab/cheywood/Iotas]", [
  "editor-formatting-bar-visibility=",
  "first-start=",
  "last-launched-version=",
  "nextcloud-prune-threshold",
  "window-size=",
]);

ignoreMap.set("[org/gnome/gnome-system-monitor/proctree]", ["sort-col="]);

ignoreMap.set("[org/gnome/nautilus/window-state]", [
  "initial-size=",
  "initial-size-file-chooser=",
]);

ignoreMap.set("[org/gnome/portal/filechooser/org.nickvision.money]", [
  "last-folder-path=",
]);

ignoreMap.set("[org/gnome/rhythmbox]", ["position="]);

ignoreMap.set("[org/gnome/rhythmbox/player]", ["volume="]);

ignoreMap.set("[org/gnome/shell/extensions/caffeine]", [
  "indicator-position-max=",
  "toggle-state=",
  "user-enabled=",
]);

ignoreMap.set("[org/gnome/software]", [
  "check-timestamp=",
  "flatpak-purge-timestamp=",
  "toggle-state=",
  "user-enabled=",
  "update-notification-timestamp=",
]);

ignoreMap.set("[org/gtk/settings/file-chooser]", ["window-position="]);

ignoreMap.set("*", [
  "current-tab=",
  "sidebar-width=",
  "sort-order=",
  "was-maximized=",
  "window-height=",
  "window-size=",
  "window-width=",
]);

ignoreMap.set("[org/gnome/epiphany/state]", ["is-maximized="]);

const outputArr: string[] = [];

keyLoop: for (const [key, settings] of data) {
  outputArr.push(key);

  const ignoredSettings = ignoreMap.get(key);

  for (const setting of settings) {
    const isSettingGloballyIgnored = ignoreMap
      .get("*")
      ?.find((s) => setting.startsWith(s));

    if (isSettingGloballyIgnored) {
      continue keyLoop;
    }

    if (ignoredSettings) {
      const shouldIgnoreThisSettings = ignoredSettings.find((s) =>
        setting.startsWith(s),
      );

      if (!shouldIgnoreThisSettings) {
        outputArr.push(setting);
      }
    } else {
      outputArr.push(setting);
    }
  }
}

const output = outputArr.reduce((acc, line) => {
  if (line.startsWith("[") && acc !== "") {
    return `${acc}\n\n${line}`;
  }

  return `${acc}${acc === "" ? "" : "\n"}${line}`;
}, "");

await $`echo ${output} > ~/.dotfiles/src/dconf/dconf-after.conf`.quiet();
