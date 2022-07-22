import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { getPackageManager } from '../utils/packageManager';

export default async function checkEnvironment() {
  // Edgio dependencies
  try {
    const { execCmd } = await getPackageManager();
    await exec.exec(execCmd, ['0 --version']);
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
