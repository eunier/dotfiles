import { $ } from "bun";

try {
	const apps = [
		// spell-checker: disable
		"com.belmoussaoui.Authenticator",
		"com.brave.Browser",
		"com.github.Anuken.Mindustry",
		"com.github.libresprite.LibreSprite",
		"com.github.tchx84.Flatseal",
		"com.mardojai.ForgeSparks",
		"com.orama_interactive.Pixelorama",
		"com.rafaelmardojai.Blanket",
		"com.spotify.Client",
		"de.haeckerfelix.AudioSharing",
		"de.philippun1.turtle",
		"dev.geopjr.Calligraphy",
		"dev.tchx84.Gameeky",
		"io.github.fabrialberio.pinapp",
		"io.github.josephmawa.Egghead",
		"io.github.MakovWait.Godots",
		"io.github.revisto.drum-machine",
		"io.github.ronniedroid.concessio",
		"io.github.ungoogled_software.ungoogled_chromium",
		"io.github.zhrexl.thisweekinmylife",
		"io.gitlab.news_flash.NewsFlash",
		"io.missioncenter.MissionCenter",
		"md.obsidian.Obsidian",
		"org.cryptomator.Cryptomator",
		"org.flathub.flatpak-external-data-checker",
		"org.gnome.design.Palette",
		"org.gnome.Solanum",
		"re.sonny.Commit",
		// spell-checker: enable
	];

	const toInstall: string[] = [];
	const toRemove: string[] = [];

	const installedApps = (
		await $`flatpak list --app --columns=application`.text()
	)
		.split("\n")
		.filter((app) => !!app);

	const wantedApps = apps;

	for (const app of installedApps) {
		const isInstalledAppWanted = (wantedApps as string[]).includes(app);

		if (!isInstalledAppWanted) {
			toRemove.push(app);
		}
	}

	for (const app of wantedApps) {
		const isWantedAppInstalled = installedApps.includes(app);

		if (!isWantedAppInstalled) {
			toInstall.push(app);
		}
	}

	const removeCmd = toRemove.length ? toInstall.join(" ") : "";
	const installCmd = toInstall.length ? toInstall.join(" ") : "";

	await $`echo "#!/usr/bin/env bash" > ~/.dotfiles/src/flatpak/flatpak-uninstall.auto.sh`;
	await $`echo "" >> ~/.dotfiles/src/flatpak/flatpak-uninstall.auto.sh`;

	await $`echo "#!/usr/bin/env bash" > ~/.dotfiles/src/flatpak/flatpak-install.auto.sh`;
	await $`echo "" >> ~/.dotfiles/src/flatpak/flatpak-install.auto.sh`;

	if (removeCmd) {
		await $`echo "flatpak uninstall ${removeCmd}" >> ~/.dotfiles/src/flatpak/flatpak-uninstall.auto.sh`;
	}

	if (installCmd) {
		await $`echo "flatpak install flathub ${installCmd}" >> ~/.dotfiles/src/flatpak/flatpak-uninstall.auto.sh`;
	}
} catch (err) {
	console.error(err);
}
