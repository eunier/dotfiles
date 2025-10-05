#!/usr/bin/env bash

# https://gitlab.gnome.org/GNOME/adwaita-fonts
# gsettings set org.gnome.desktop.interface font-name "Adwaita Sans 11"
# gsettings set org.gnome.desktop.interface monospace-font-name "Cascadia Code 10"

# restoring to default
gsettings reset org.gnome.desktop.interface font-name
gsettings reset org.gnome.desktop.interface monospace-font-name
