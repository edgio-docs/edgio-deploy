import * as core from '@actions/core';

export default function checkEnvironment() {
  // Edgio dependencies
  try {
    // require('@layer0/cli');
  } catch (e) {
    core.setFailed(
      'Required dependency `@layer0/cli` no founs. ' +
        'Ensure this dependency is defined in `package.json`'
    );
    process.exit(1);
  }
}
