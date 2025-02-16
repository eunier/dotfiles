flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
flatpak update

flatpak install flathub \
  com.github.libresprite.LibreSprite \
  com.github.tchx84.Flatseal \
  com.spotify.Client \
  io.github.ronniedroid.concessio \
  md.obsidian.Obsidian

flatpak list > ~/.dotfiles/src/flatpak/flatpak-list-after.txt

# TODO add ts script to remove any app not on the install list and remove data