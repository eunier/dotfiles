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

### Postgres

Run this after initial installation

```bash
sudo postgresql-setup --initdb
```

### Increase File Watch Limit

- Check the current limit

```bash
cat /proc/sys/fs/inotify/max_user_watches
```

- Increase the limit

```bash
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
```

- Apply the changes

```bash
sudo sysctl -p
```

## Fedora Upgrade

### Pre-Upgrade Steps

1. Backup your data: Always back up your important files before upgrading.

2. Update your current system:

   ```bash
   sudo dnf upgrade --refresh
   ```

### Upgrading Fedora version, replace 123 with target version

```bash
sudo dnf system-upgrade download --releasever=123
```

1. Resolve any issues:

   - If dependencies are missing, run:

     ```bash
     sudo dnf system-upgrade download --allowerasing
     ```

   - Use --best to force the best versions:

     ```bash
     sudo dnf system-upgrade download --best
     ```

2. Trigger the upgrade process: Reboot into the upgrade environment:

   ```bash
   sudo dnf system-upgrade reboot
   ```

### Post-Upgrade Tasks

1. Clean up retired packages: After upgrading, remove old or retired packages:

   ```bash
   sudo dnf install remove-retired-packages
   remove-retired-packages
   ```

2. Remove old packages: Remove old or duplicate packages:

   ```bash
   sudo dnf remove --duplicates
   sudo dnf autoremove
   ```

3. Update GRUB (if using BIOS): Update the bootloader

   ```bash
   sudo grub2-install /dev/sda
   ```

4. Rebuild RPM database (if issues occur): If you encounter RPM/DNF issues

   ```bash
   sudo rpm --rebuilddb
   ```

5. Relabel SELinux policies (if necessary): If there are SELinux permission issues

   ```bash
   sudo fixfiles -B onboot
   ```
