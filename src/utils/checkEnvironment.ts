import * as core from '@actions/core';

export default function checkEnvironment() {
  // Edgio dependencies
  try {
    require('@layer0/cli/constants');
    require('@layer0/core/');
  } catch (e) {
    core.setFailed(
      'Required dependencies `@layer0/cli` or `@layer0/core` not found. ' +
        'Ensure this dependencies are defined in `package.json`'
    );
    process.exit(1);
  }
}
