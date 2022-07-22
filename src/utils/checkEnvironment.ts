import * as core from '@actions/core';
import * as exec from '@actions/exec';

export default async function checkEnvironment() {
  // Edgio dependencies
  try {
    await exec.exec('0 --version');
  } catch (e) {
    core.setFailed(
      'Required dependencies `@layer0/cli` or `@layer0/core` not found. ' +
        'Ensure this dependencies are defined in `package.json`'
    );
    process.exit(1);
  }
}
