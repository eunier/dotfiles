#!/usr/bin/bash

wget -O thorium-latest.rpm "$(curl -s https://api.github.com/repos/Alex313031/Thorium/releases/latest | grep -oP '(?<="browser_download_url": ")[^"]*AVX2\.rpm' | head -n 1)"

sudo dnf install ~/.dotfiles/thorium-latest.rpm

rm thorium-latest.rpm
