if ! [ -f "$HOME/.config/fastfetch/config.jsonc" ]; then
  fastfetch --gen-config
fi

cp ~/.config/fastfetch/config.jsonc ~/.dotfiles/src/fastfetch/fastfetch-config-after.jsonc

fastfetch --logo none --structure os > ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure kernel >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure packages >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure display >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure de >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure wm >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure wmtheme >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure icons >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure font >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure cursor >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure gpu >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
fastfetch --logo none --structure locale >> ~/.dotfiles/src/fastfetch/fastfetch-output-after.txt
