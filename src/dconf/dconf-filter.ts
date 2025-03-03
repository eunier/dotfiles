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

ignoreMap.set("[com/raggesilver/BlackBox]", [
	"was-maximized=",
	"window-height=",
	"window-width=",
]);

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
]);

ignoreMap.set("[org/gnome/control-center]", ["last-panel="]);

ignoreMap.set("[org/gnome/gitlab/cheywood/Iotas]", [
	"editor-formatting-bar-visibility=",
	"first-start=",
	"last-launched-version=",
	"nextcloud-prune-threshold",
	"window-size=",
]);

ignoreMap.set("[org/gnome/builder]", ["window-maximized="])

const outputArr: string[] = [];

for (const [key, settings] of data) {
	outputArr.push(key);

	const ignoredSettings = ignoreMap.get(key);

	for (const setting of settings) {
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
