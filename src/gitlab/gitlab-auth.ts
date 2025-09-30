import { $ } from "bun";

// COMPUTER_MODEL=$(sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
// REPO_PATH=~/.dotfiles

const repoPath = "~/.dotfiles";

let computerModel =
  await $`sudo dmidecode -s system-product-name | tr '[:upper:]' '[:lower:]' | tr ' ' '-'`.text();

computerModel = computerModel.replace("\n", "");

const status =
  await $`cat ${repoPath}/src/gitlab/gitlab-auth-status_${computerModel}.txt`.text();

await $`echo "#!/usr/bin/env bash" > ${repoPath}/src/gitlab/gitlab-auth.sh`;

if (status.includes("Unauthorized")) {
  await $`echo "glab auth login" >> ${repoPath}/src/gitlab/gitlab-auth.sh`;
} else {
  await $`echo 'echo "Already logged in to GitLab CLI."' >> ${repoPath}/src/gitlab/gitlab-auth.sh`;
}
