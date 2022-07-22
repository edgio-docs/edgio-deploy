// inputs
// required:
// - deploy token
// optional:
// - environment (defaults to production)
// - branch name (current branch default)
// - deploy script (defaults to `0 deploy` or can take a package script name)
// - add pr comment after deploy

import { join } from 'path';
import * as core from '@actions/core';
import deploy from './action';

async function run(): Promise<void> {
  const action = core.getInput('action');
  const path = core.getInput('path');

  process.chdir(path);
  core.addPath(join(path, 'node_modules', '.bin'));

  switch (action) {
    case 'deploy':
      await deploy();
  }
}

run();
