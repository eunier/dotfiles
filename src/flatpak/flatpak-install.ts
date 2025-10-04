import { $ } from "bun";

try {
  const apps = [
    // spell-checker: disable
    "app.drey.KeyRack",
    "app.zen_browser.zen",
    "be.alexandervanhee.gradia",
    "ca.vlacroix.Tally",
    "codes.merritt.adventurelist",
    "com.belmoussaoui.Authenticator",
    "com.belmoussaoui.Decoder",
    "com.github.Anuken.Mindustry",
    "com.github.hugolabe.Wike",
    "com.github.jeromerobert.pdfarranger",
    "com.github.libresprite.LibreSprite",
    "com.github.vikdevelop.timer",
    "com.jeffser.Alpaca.Plugins.AMD",
    "com.jeffser.Alpaca.Plugins.Ollama",
    "com.jeffser.Alpaca",
    "com.lynnmichaelmartin.TimeTracker",
    "com.mardojai.ForgeSparks",
    "com.mattjakeman.ExtensionManager",
    "com.odnoyko.valot",
    "com.orama_interactive.Pixelorama",
    "com.rafaelmardojai.Blanket",
    "com.snes9x.Snes9x",
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
    "io.github.fizzyizzy05.binary",
    "io.github.flattool.Ignition",
    "io.github.Foldex.AdwSteamGtk",
    "io.github.getnf.embellish",
    "io.github.josephmawa.Bella",
    "io.github.josephmawa.Egghead",
    "io.github.kelvinnovais.Kasasa",
    "io.github.MakovWait.Godots",
    "io.github.mimoguz.TriPeaks-GDX",
    "io.github.mpobaschnig.Vaults",
    "io.github.nokse22.inspector",
    "io.github.nokse22.minitext",
    "io.github.nokse22.ultimate-tic-tac-toe",
    "io.github.philippkosarev.bmi",
    "io.github.pieterdd.RcloneShuttle",
    "io.github.ronniedroid.concessio",
    "io.github.seadve.Mousai",
    "io.github.smolblackcat.Progress",
    "io.github.zhrexl.thisweekinmylife",
    "io.gitlab.adhami3310.Impression",
    "io.gitlab.elescoute.password",
    "io.gitlab.liferooter.TextPieces",
    "io.gitlab.news_flash.NewsFlash",
    "io.httpie.Httpie",
    "io.missioncenter.MissionCenter",
    "io.podman_desktop.PodmanDesktop",
    "md.obsidian.Obsidian",
    "me.iepure.devtoolbox",
    "me.iepure.Ticketbooth",
    "me.kozec.syncthingtk",
    "net.codelogistics.webapps",
    "nl.emphisia.icon",
    "org.cvfosammmm.Lemma",
    "org.flathub.flatpak-external-data-checker",
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
    "re.sonny.Eloquent",
    "se.sjoerd.Graphs",
    "us.zoom.Zoom",
    "xyz.ketok.Speedtest",
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
    const isInstalledAppWanted = wantedApps.includes(app);

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

  const removeCmd = toRemove.length ? toRemove.join(" ") : "";
  const installCmd = toInstall.length ? toInstall.join(" ") : "";

  await $`echo "#!/usr/bin/env bash" > ~/.dotfiles/src/flatpak/flatpak-uninstall.auto.local.sh`;
  await $`echo "" >> ~/.dotfiles/src/flatpak/flatpak-uninstall.auto.local.sh`;

  await $`echo "#!/usr/bin/env bash" > ~/.dotfiles/src/flatpak/flatpak-install.auto.local.sh`;
  await $`echo "" >> ~/.dotfiles/src/flatpak/flatpak-install.auto.local.sh`;

  if (removeCmd) {
    await $`echo "flatpak uninstall ${removeCmd}" >> ~/.dotfiles/src/flatpak/flatpak-uninstall.auto.local.sh`;
  }

  if (installCmd) {
    await $`echo "flatpak install flathub ${installCmd}" >> ~/.dotfiles/src/flatpak/flatpak-uninstall.auto.local.sh`;
  }
} catch (err) {
  console.error(err);
}
