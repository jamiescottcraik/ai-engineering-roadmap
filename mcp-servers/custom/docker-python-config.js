/**
 * This script creates a python-config.json for Docker environments
 * It detects the Python installation and creates a configuration file
 */

const fs = require('fs');
const { execSync, spawnSync } = require('child_process');
const path = require('path');

function createPythonConfig() {
  try {
    console.log('Creating Python configuration for Docker environment...');

    // Try different ways to find Python
    const pythonPaths = [
      process.env.PYTHON_PATH,
      '/usr/bin/python3',
      '/usr/bin/python',
      'python3',
      'python'
    ].filter(Boolean); // Remove undefined values

    let pythonPath;
    let pythonVersion = 'Unknown';

    // Try each path in order
    for (const testPath of pythonPaths) {
      try {
        console.log(`Testing Python path: ${testPath}`);

        if (fs.existsSync(testPath)) {
          console.log(`Path exists: ${testPath}`);
        }

        // Try to execute Python with this path
        const result = spawnSync(testPath, ['--version'], {
          encoding: 'utf8',
          shell: true,
          stdio: 'pipe'
        });

        if (result.status === 0) {
          pythonPath = testPath;
          pythonVersion = result.stdout || result.stderr;
          console.log(`Found working Python at: ${pythonPath}`);
          console.log(`Version: ${pythonVersion}`);
          break;
        } else {
          console.log(`Failed with status ${result.status}: ${result.stderr}`);
        }
      } catch (err) {
        console.warn(`Error testing ${testPath}: ${err.message}`);
      }
    }

    if (!pythonPath) {
      console.warn('Could not find a working Python installation!');
      console.warn('Falling back to /usr/bin/python3 and hoping for the best');
      pythonPath = '/usr/bin/python3';
    }

    // Create configuration
    const config = {
      python_executable: pythonPath,
      venv_path: null, // No virtual env in Docker
      platform: process.platform,
      python_version: pythonVersion.trim(),
      shell_required: true, // In Docker, we likely need shell: true
      docker_environment: true
    };

    // Write configuration to file
    const configPath = path.join(__dirname, 'python-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log(`Python configuration created at ${configPath}`);
    console.log(`Using Python executable: ${pythonPath}`);

    // Verify Python works by running a simple command
    try {
      console.log('Testing Python by printing sys.version...');
      const test = spawnSync(pythonPath, ['-c', 'import sys; print(sys.version)'], {
        encoding: 'utf8',
        shell: true
      });
      if (test.status === 0) {
        console.log('Python test successful:');
        console.log(test.stdout);
      } else {
        console.warn('Python test failed:');
        console.warn(test.stderr);
      }
    } catch (error) {
      console.warn('Python test error:', error.message);
    }

  } catch (error) {
    console.error('Error creating Python configuration:', error.message);
    // Don't exit, create a minimal config instead
    try {
      const configPath = path.join(__dirname, 'python-config.json');
      const fallbackConfig = {
        python_executable: '/usr/bin/python3',
        platform: process.platform,
        python_version: 'Unknown (fallback)',
        shell_required: true,
        docker_environment: true
      };
      fs.writeFileSync(configPath, JSON.stringify(fallbackConfig, null, 2));
      console.log('Created fallback configuration');
    } catch (e) {
      console.error('Could not create fallback configuration:', e.message);
    }
  }
}

// Run the script
createPythonConfig();
