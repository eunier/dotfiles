import { $ } from "bun";

try {
  const apps = [
    // spell-checker: disable
    "app.drey.KeyRack",
    "app.zen_browser.zen",
    "codes.merritt.adventurelist",
    "com.belmoussaoui.Authenticator",
    "com.github.Anuken.Mindustry",
    "com.github.jeromerobert.pdfarranger",
    "com.github.libresprite.LibreSprite",
    "com.github.vikdevelop.timer",
    "com.jeffser.Alpaca",
    "com.lynnmichaelmartin.TimeTracker",
    "com.mardojai.ForgeSparks",
    "com.mattjakeman.ExtensionManager",
    "com.orama_interactive.Pixelorama",
    "com.rafaelmardojai.Blanket",
    "com.spotify.Client",
    "de.haeckerfelix.AudioSharing",
    "de.haeckerfelix.Fragments",
    "de.haeckerfelix.Shortwave",
    "dev.geopjr.Calligraphy",
    "dev.restfox.Restfox",
    "edu.stanford.Almond",
    "garden.jamie.Morphosis",
    "im.bernard.Memorado",
    "io.freetubeapp.FreeTube",
    "io.github.bytezz.IPLookup",
    "io.github.diegoivan.pdf_metadata_editor",
    "io.github.fabrialberio.pinapp",
    "io.github.finefindus.Hieroglyphic",
    "io.github.Foldex.AdwSteamGtk",
    "io.github.getnf.embellish",
    "io.github.josephmawa.Bella",
    "io.github.josephmawa.Egghead",
    "io.github.MakovWait.Godots",
    "io.github.mimoguz.TriPeaks-GDX",
    "io.github.nokse22.inspector",
    "io.github.nokse22.minitext",
    "io.github.nokse22.ultimate-tic-tac-toe",
    "io.github.philippkosarev.bmi",
    "io.github.ronniedroid.concessio",
    "io.github.smolblackcat.Progress",
    "io.github.zhrexl.thisweekinmylife",
    "io.gitlab.elescoute.password",
    "io.gitlab.liferooter.TextPieces",
    "io.gitlab.news_flash.NewsFlash",
    "io.httpie.Httpie",
    "io.missioncenter.MissionCenter",
    "io.podman_desktop.PodmanDesktop",
    "md.obsidian.Obsidian",
    "me.iepure.devtoolbox",
    "me.iepure.Ticketbooth",
    "net.codelogistics.webapps",
    "nl.emphisia.icon",
    "org.cvfosammmm.Lemma",
    "org.gnome.design.AppIconPreview",
    "org.gnome.design.Emblem",
    "org.gnome.design.Lorem",
    "org.gnome.design.Palette",
    "org.gnome.gitlab.cheywood.Buffer",
    "org.gnome.Solanum",
    "org.gnome.World.Iotas",
    "org.gnome.World.PikaBackup",
    "org.gnome.World.Secrets",
    "org.nickvision.cavalier",
    "org.nickvision.money",
    "org.nickvision.tagger",
    "org.nickvision.tubeconverter",
    "org.pgadmin.pgadmin4",
    "page.codeberg.libre_menu_editor.LibreMenuEditor",
    "re.sonny.Commit",
    "se.sjoerd.Graphs",
    "us.zoom.Zoom",
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
