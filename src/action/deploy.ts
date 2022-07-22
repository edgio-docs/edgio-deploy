// inputs
// required:
// - deploy token
// optional:
// - environment (defaults to default)
// - deploy script (defaults to `0 deploy` or can take a package script name)
// - add pr comment after deploy

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';
import checkEnvironment from '../utils/checkEnvironment';
import getDeployURLs from '../utils/deployOutput';
import { getPackageManager, getPackage } from '../utils/packageManager';

function getBranchFromRef(ref: string) {
  if (ref.indexOf('/refs/heads/') > -1) {
    ref = ref.slice('/refs/heads/'.length);
  }

  return ref;
}

export default async function deploy(): Promise<void> {
  await checkEnvironment();

  console.log('bax');

  try {
    const $deploy_token = core.getInput('token');
    const $deploy_command = core.getInput('deployCommand');

    // set the deploy token to the env from user's input
    core.setSecret($deploy_token);
    process.env['LAYER0_DEPLOY_TOKEN'] = $deploy_token;

    const deployCmd = [];
    const deployArgs: Array<string> = [];

    const { execCmd, scriptCmd } = await getPackageManager();
    const pkg = await getPackage();

    const customDeployCmd = $deploy_command;
    //@ts-ignore
    const pkgDeployScript = pkg.scripts?.['edgio:deploy'];

    // Run a user-defined deploy command as defined on the action
    if (customDeployCmd.length) {
      deployCmd.push(customDeployCmd);
    }
    // Run the deploy script as defined in package.json as `edgio:deploy`
    else if (pkgDeployScript) {
      deployCmd.push(scriptCmd);
      deployCmd.push(pkgDeployScript);
    }
    // Fallback to the base deploy command
    else {
      deployCmd.push(execCmd);
      deployCmd.push('0 deploy');
    }

    deployArgs.push(`--branch ${getBranchFromRef(github.context.ref)}`);

    let deployOutput = '';
    let deployError = '';

    const options: exec.ExecOptions = {
      listeners: {
        stdout: (data: Buffer) => {
          deployOutput += data.toString();
        },
        stderr: (data: Buffer) => {
          deployError += data.toString();
        },
      },
    };

    // execute the deploy
    core.info('execute deploy');
    await exec.exec(deployCmd.join(' '), deployArgs, options);

    // set deploy URLs to output for following steps
    const urls = getDeployURLs(deployOutput);
    if (urls) {
      for (let key in urls) {
        core.setOutput(key, urls[key]);
      }
    }

    // TODO: publish links to PR
  } catch (error) {
    //@ts-ignore
    core.setFailed(error.message);
  }
}
