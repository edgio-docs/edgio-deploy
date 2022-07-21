import fse from 'fs-extra';
import { join } from 'path';
import core from '@actions/core';
import { PackageJson, readPackageJSON } from 'pkg-types';

interface IPkgManager {
  isNpm: boolean;
  isYarn: boolean;
  runCmd: string;
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
    runCmd: isYarn ? 'yarn' : 'npm run',
    execCmd: isYarn ? 'yarn' : 'npx',
  };
}

/**
 * Gets the parsed package.json contents
 * @returns Promise<Object> package.json parsed
 */
export async function getPackage(): Promise<PackageJson> {
  return await readPackageJSON(join(process.cwd(), 'package.json'));
}
