import { $ } from "bun";

try {
	const apps = [
		// spell-checker: disable
		"app.zen_browser.zen",
		"com.belmoussaoui.Authenticator",
		"com.discordapp.Discord",
		"com.github.Anuken.Mindustry",
		"com.github.libresprite.LibreSprite",
		"com.mardojai.ForgeSparks",
		"com.orama_interactive.Pixelorama",
		"com.rafaelmardojai.Blanket",
		"com.spotify.Client",
		"de.haeckerfelix.AudioSharing",
		"dev.geopjr.Calligraphy",
		"io.freetubeapp.FreeTube",
		"io.github.fabrialberio.pinapp",
		"io.github.josephmawa.Egghead",
		"io.github.MakovWait.Godots",
		"io.github.ronniedroid.concessio",
		"io.github.smolblackcat.Progress",
		"io.github.zhrexl.thisweekinmylife",
		"io.gitlab.news_flash.NewsFlash",
		"io.missioncenter.MissionCenter",
		"md.obsidian.Obsidian",
		"org.gnome.design.Palette",
		"org.gnome.Solanum",
		"org.gnome.World.Iotas",
		"org.gnome.World.PikaBackup",
		"page.codeberg.libre_menu_editor.LibreMenuEditor",
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
