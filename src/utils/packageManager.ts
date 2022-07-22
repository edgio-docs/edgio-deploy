import fse from 'fs-extra';
import { join } from 'path';
import * as core from '@actions/core';

interface IPkgManager {
  isNpm: boolean;
  isYarn: boolean;
  scriptCmd: string;
  execCmd: string;
}

/**
 * Determines the package manager to use based on the lockfile
 * @returns Promise<string> Name of the package manager
 */
export async function getPackageManager(): Promise<IPkgManager> {
  const isYarn = await fse.pathExists(join(process.cwd(), 'yarn.lock'));
  const isNpm = await fse.pathExists(join(process.cwd(), 'package-lock.json'));

  // Ensure a compatible package manager is availble
  if (!isNpm && !isYarn) {
    core.setFailed(
      'Could not identify npm or Yarn from lockfile. ' +
        'Please ensure `package-lock.json` or `yarn.lock` exists.'
    );
    process.exit(1);
  }

  return {
    isNpm,
    isYarn,
    scriptCmd: isYarn ? 'yarn' : 'npm run',
    execCmd: 'npm exec --package=@layer0/cli',
  };
}

/**
 * Gets the parsed package.json contents
 * @returns Promise<Object> package.json parsed
 */
export async function getPackage(): Promise<Object> {
  return await fse.readJson(join(process.cwd(), 'package.json'));
}
