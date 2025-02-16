flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak update

flatpak install flathub \
  com.github.libresprite.LibreSprite \
  com.github.tchx84.Flatseal \
  com.spotify.Client \
  dev.geopjr.Calligraphy \
  io.github.fabrialberio.pinapp \
  io.github.josephmawa.Egghead \
  io.github.revisto.drum-machine \
  io.github.ronniedroid.concessio \
  md.obsidian.Obsidian

touch ~/.dotfiles/src/flatpak/flatpak-list-before.txt
flatpak list > ~/.dotfiles/src/flatpak/flatpak-list-after.txt
