# Dotfiles

## Git SSH Setup

### Generating a New SSH Key and Adding it to the `ssh-agent`

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

```bash
eval "$(ssh-agent -s)"
```

```bash
ssh-add ~/.ssh/id_ed25519
```

### Adding a new SSH key to the Git Web Platform

```bash
cat ~/.ssh/id_ed25519.pub
```

Add output to the git web platform corresponding settings.
