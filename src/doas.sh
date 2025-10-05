#!/usr/bin/env bash

COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
REPO_PATH=~/.dotfiles

echo "Creating doas config..."
sudo touch /etc/doas.conf
echo "permit $USER as root" | sudo tee /etc/doas.conf >/dev/null

sudo cp /etc/doas.conf $REPO_PATH/src/doas/doas_"$COMPUTER_MODEL".conf
