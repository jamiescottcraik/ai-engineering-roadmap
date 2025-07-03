/**
 * Script to test Python spawning
 */

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Try to load Python configuration
let pythonConfig = null;
try {
  const pythonConfigPath = path.join(__dirname, 'python-config.json');
  if (fs.existsSync(pythonConfigPath)) {
    pythonConfig = JSON.parse(fs.readFileSync(pythonConfigPath, 'utf8'));
    console.log(`Loaded Python configuration: ${pythonConfig.python_executable}`);
  } else {
    console.log('Python configuration not found');
  }
} catch (error) {
  console.warn('Failed to load Python configuration:', error.message);
}

// Function to test Python with different options
function testPython(executable, options = {}) {
  console.log(`\nTesting Python execution with: ${executable}`);
  console.log('Options:', JSON.stringify(options, null, 2));

  try {
    const result = spawnSync(executable, ['-c', 'import sys; print(sys.version)'], {
      encoding: 'utf8',
      ...options
    });

    if (result.status === 0) {
      console.log('✅ SUCCESS:');
      console.log(result.stdout.trim());
      return true;
    } else {
      console.log('❌ FAILED with status', result.status);
      console.log('Error:', result.stderr);
      return false;
    }
  } catch (error) {
    console.log('❌ EXCEPTION:', error.message);
    return false;
  }
}

console.log('======================================');
console.log('Python Configuration Diagnostic Tool');
console.log('======================================');

// Check if we're in Docker
const isDocker = fs.existsSync('/.dockerenv') || process.env.DOCKER_CONTAINER === 'true';
console.log(`Running in Docker: ${isDocker ? 'Yes' : 'No'}`);

// Print process info
console.log(`\nProcess Information:`);
console.log(`- Platform: ${process.platform}`);
console.log(`- Node Version: ${process.version}`);
console.log(`- User: ${process.getuid?.() || 'N/A'}`);
console.log(`- Environment: ${process.env.NODE_ENV || 'Not set'}`);

// Try various Python executables
const pythonExecutables = [
  pythonConfig?.python_executable,
  process.env.PYTHON_PATH,
  '/usr/bin/python3',
  '/usr/bin/python',
  'python3',
  'python'
].filter(Boolean); // Filter out undefined values

console.log(`\nWill test these Python executables:`, pythonExecutables);

// Test each executable with various options
for (const executable of pythonExecutables) {
  // Test with default options
  const success1 = testPython(executable);

  // If failed, try with shell: true
  if (!success1) {
    console.log('Trying with shell: true');
    const success2 = testPython(executable, { shell: true });

    // If still failed, try with other env
    if (!success2) {
      console.log('Trying with shell: true and env: PATH');
      testPython(executable, {
        shell: true,
        env: { ...process.env, PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin' }
      });
    }
  }
}

console.log('\n======================================');
console.log('Diagnostic completed');
console.log('======================================');
