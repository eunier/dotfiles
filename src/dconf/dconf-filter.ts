import { $ } from "bun";

type Data = [string, string[]][];

const data: Data = (await $`cat ~/.dotfiles/src/dconf/dconf-after.conf`.text())
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

ignoreMap.set("[apps/seahorse/windows/key-manager]", ["height=476"]);
ignoreMap.set("[com/raggesilver/BlackBox]", ["was-maximized="]);

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
