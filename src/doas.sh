#!/usr/bin/env bash

echo "Creating doas config..."
sudo touch /etc/doas.conf
echo "permit yunieralvarez as root" | sudo tee /etc/doas.conf > /dev/null

touch ~/.dotfiles/src/doas/doas-before.conf
sudo cp /etc/doas.conf ~/.dotfiles/src/doas/doas-after.conf