import { join } from 'path';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function entry(): Promise<void> {
  const path = core.getInput('path');

  process.chdir(path);
  core.addPath(join(path, 'node_modules', '.bin'));
  await exec.exec('node', [join(__dirname, 'index.js')]);
}

entry();
