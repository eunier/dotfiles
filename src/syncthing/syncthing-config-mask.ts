import { $ } from "bun";

let computerModel =
  await $`sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-'`.text();

computerModel = computerModel.replace("\n", "");

const repoPath = "~/.dotfiles";

const keys = ["apiKey", "deviceID", "encryptionPassword", "password", "user"];
const path = `${repoPath}/src/syncthing/syncthing-config_${computerModel}.json`;

const data: Record<PropertyKey, unknown> =
  await $`cat ${repoPath}/src/syncthing/syncthing-config_${computerModel}.json`.json();

const masked = JSON.stringify(data, (key, val) =>
  keys.includes(key) ? "***" : val
);

await $`echo ${masked} > ${path}`;
await $`biome format --write ${path}`.quiet();
