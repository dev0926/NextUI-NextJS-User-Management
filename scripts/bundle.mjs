import { execSync } from "child_process";
import { resolve } from "path";

const author = execSync("git config --get user.email").toString().trim();
const commits = execSync(`git log --author=${author}`).toString().trim();

if (!commits) {
  process.stderr.write(
    'ERR: No commits on branch "master". Please commit and try again.\n'
  );
  process.exit(1);
} else {
  execSync("git bundle create submission.bundle HEAD master");
  process.stdout.write(
    `\nBundle written to ${resolve(
      "./submission.bundle"
    )}\nPlease zip this file and submit it as per the instructions in the README.\n\n`
  );
}
