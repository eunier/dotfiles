HISTFILE=~/.histfile
HISTSIZE=1000
SAVEHIST=1000

setopt autocd beep extendedglob nomatch notify
bindkey -v

export BUN_INSTALL="$HOME/.bun"
export EDITOR=nvim
export HOMEBREW_NO_ANALYTICS=1
export VISUAL=nvim
export VSCODE_GALLERY_CACHE_URL="https://vscode.blob.core.windows.net/gallery/index"
export VSCODE_GALLERY_CONTROL_URL=""
export VSCODE_GALLERY_ITEM_URL="https://marketplace.visualstudio.com/items"
export VSCODE_GALLERY_SERVICE_URL="https://marketplace.visualstudio.com/_apis/public/gallery"
export ZVM_INSTALL="$HOME/.zvm/self"

export PATH="$BUN_INSTALL/bin:$PATH"
export PATH="$PATH:$HOME/.zvm/bin"
export PATH="$PATH:$ZVM_INSTALL/"

# eval "$(oh-my-posh init zsh --config 'atomic')"
# eval "$(oh-my-posh init zsh --config 'atomicBit')"
# eval "$(oh-my-posh init zsh --config 'blue-owl')"
# eval "$(oh-my-posh init zsh --config 'cobalt2')"
# eval "$(oh-my-posh init zsh --config 'darkblood')"
# eval "$(oh-my-posh init zsh --config 'gruvbox')"
# eval "$(oh-my-posh init zsh --config 'json')"
# eval "$(oh-my-posh init zsh --config 'powerline')"
# eval "$(oh-my-posh init zsh --config 'quick-term')"
# eval "$(oh-my-posh init zsh --config 'takuya')"
# eval "$(oh-my-posh init zsh --config 'tiwahu')"
# eval "$(oh-my-posh init zsh)"
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
eval "$(fnm env --use-on-cd --shell zsh)"
eval "$(oh-my-posh init zsh --config 'stelbent-compact.minimal')"
eval "$(zellij setup --generate-auto-start zsh)"

# shellcheck disable=SC1091,SC2086
source ${ZDOTDIR:-~}/.antidote/antidote.zsh
antidote load

zstyle :compinstall filename '/home/tron/.zshrc'
autoload -Uz compinit
compinit
