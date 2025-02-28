import { $ } from "bun";

const data = (await $`cat ~/.dotfiles/src/dconf/dconf-after.conf`.text()).split(
	"\n\n",
);

console.log("data", data);
