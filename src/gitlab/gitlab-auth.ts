import { $ } from "bun";

const status =
  await $`cat ~/.dotfiles/src/gitlab/gitlab-auth-status.txt`.text();

await $`echo "#!/usr/bin/env bash" > ~/.dotfiles/src/gitlab/gitlab-auth.sh`;

if (status.includes("Unauthorized")) {
  await $`echo "glab auth login" >> ~/.dotfiles/src/gitlab/gitlab-auth.sh`;
} else {
  await $`echo 'echo "Already logged in to GitLab CLI."' >> ~/.dotfiles/src/gitlab/gitlab-auth.sh`;
}
