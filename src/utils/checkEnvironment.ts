import * as core from '@actions/core';
import * as exec from '@actions/exec';

export default async function checkEnvironment() {
  // Edgio dependencies
  try {
    core.info(`current dir: ${process.cwd()} - ${__dirname}`);
    await exec.exec('0 --version');
  } catch (e) {
    //@ts-ignore
    core.error(e.message);
    core.setFailed(
      'Required dependencies `@layer0/cli` or `@layer0/core` not found. ' +
        'Ensure this dependencies are defined in `package.json`'
    );
    process.exit(1);
  }
}
