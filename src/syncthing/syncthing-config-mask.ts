import { $ } from "bun";

const keys = ["apiKey", "deviceID", "encryptionPassword", "password", "user"];
const path = "~/.dotfiles/src/syncthing/syncthing-config-after.json";

const data: Record<PropertyKey, unknown> =
  await $`cat ~/.dotfiles/src/syncthing/syncthing-config-after.json`.json();

const masked = JSON.stringify(data, (key, val) =>
  keys.includes(key) ? "***" : val,
);

await $`echo ${masked} > ${path}`;
await $`biome format --write ${path}`.quiet();
