const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Create Express app
const app = express();
const port = process.env.PORT || 3333;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load Python environment configuration if available
let pythonConfig = null;
try {
  const fs = require('fs');
  const path = require('path');
  const pythonConfigPath = path.join(__dirname, 'python-config.json');

  if (fs.existsSync(pythonConfigPath)) {
    pythonConfig = JSON.parse(fs.readFileSync(pythonConfigPath, 'utf8'));
    console.log(`Loaded Python configuration: ${pythonConfig.python_executable}`);
  } else {
    // If running in Docker, we might have PYTHON_PATH env var set
    if (process.env.PYTHON_PATH) {
      pythonConfig = {
        python_executable: process.env.PYTHON_PATH,
        platform: process.platform,
        python_version: "Environment variable defined"
      };
      console.log(`Using Python executable from environment: ${pythonConfig.python_executable}`);

      // Save this for future reference
      fs.writeFileSync(pythonConfigPath, JSON.stringify(pythonConfig, null, 2));
    } else {
      console.log('Python configuration not found, will use system Python');
    }
  }
} catch (error) {
  console.warn('Failed to load Python configuration:', error.message);
}

// --- Startup diagnostics ---
console.log('==== brAInwav MCP Server Startup Diagnostics ====');
console.log('Working directory:', process.cwd());
console.log('Node.js PATH:', process.env.PATH);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('User:', process.getuid?.() || 'N/A');
console.log('Platform:', process.platform);
console.log('===============================================');

// If pythonConfig is still null, try to auto-detect .venv/bin/python
if (!pythonConfig) {
  try {
    const fs = require('fs');
    const path = require('path');
    // Try to find the repo root (look for .git)
    let dir = process.cwd();
    let found = false;
    for (let i = 0; i < 5; i++) {
      if (fs.existsSync(path.join(dir, '.git'))) {
        found = true;
        break;
      }
      dir = path.dirname(dir);
    }
    if (found) {
      const venvPython = path.join(dir, '.venv', 'bin', 'python');
      if (fs.existsSync(venvPython)) {
        pythonConfig = {
          python_executable: venvPython,
          venv_path: path.join(dir, '.venv'),
          platform: process.platform,
          python_version: 'autodetected',
          autodetected: true
        };
        console.log('Auto-detected Python config:', pythonConfig);
      } else {
        console.warn('Could not find .venv/bin/python at', venvPython);
      }
    } else {
      console.warn('Could not find repo root for .venv autodetect');
    }
  } catch (err) {
    console.warn('Error during .venv autodetect:', err.message);
  }
}

// Initialize PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'brainwav_user',
  password: process.env.DB_PASSWORD || 'brainwav_password',
  database: process.env.DB_NAME || 'brainwav_db',
  port: 5432
});

// Custom MCP Server implementation
const tools = [
  {
    name: 'query_database',
    description: 'Query the brAInwav database with specific limitations',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The SQL query to execute. Limited to SELECT statements only.'
        }
      },
      required: ['query']
    },
    handler: async (params) => {
      const query = params.query;
      // Security check: only allow SELECT statements
      const sanitizedQuery = query.trim();
      if (!sanitizedQuery.toLowerCase().startsWith('select')) {
        return { error: 'Only SELECT queries are allowed' };
      }

      try {
        const result = await pool.query(sanitizedQuery);
        return {
          rows: result.rows,
          rowCount: result.rowCount
        };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'describe_table',
    description: 'Get the schema of a database table',
    parameters: {
      type: 'object',
      properties: {
        tableName: {
          type: 'string',
          description: 'The name of the table to describe'
        }
      },
      required: ['tableName']
    },
    handler: async (params) => {
      const tableName = params.tableName;
      try {
        const query = `
          SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `;
        const result = await pool.query(query, [tableName]);
        return {
          tableName,
          columns: result.rows
        };
      } catch (err) {
        return { error: err.message };
      }
    }
  }
];

// MCP API endpoints
app.post('/mcp/invoke', async (req, res) => {
  try {
    const { toolName, parameters } = req.body;

    // Find the requested tool
    const tool = tools.find(t => t.name === toolName);
    if (!tool) {
      return res.status(404).json({
        error: `Tool '${toolName}' not found`
      });
    }

    // Invoke the tool handler
    const result = await tool.handler(parameters);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// List available tools
app.get('/mcp/tools', (req, res) => {
  res.json({
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }))
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'healthy' });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Custom MCP Server running on port ${port}`);
  console.log('Available tools:');
  tools.forEach(tool => {
    console.log(`- ${tool.name}: ${tool.description}`);
  });
});

// Initialize WebSocket server if socket.js exists
try {
  const fs = require('fs');
  const path = require('path');

  // Look for socket.js in possible locations
  const possiblePaths = [
    path.join(__dirname, '../dist/socket.js'),
    path.join(__dirname, '/dist/socket.js'),
    path.join(__dirname, 'socket.js')
  ];

  let socketPath = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      socketPath = testPath;
      break;
    }
  }

  if (socketPath) {
    console.log(`Loading WebSocket server from ${socketPath}`);
    const { SocketServer } = require(socketPath);
    const wsServer = new SocketServer(server, '/ws');
    console.log('WebSocket server initialized successfully');
  } else {
    // If socket.js doesn't exist, create a simple in-memory WebSocket server
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ server, path: '/ws' });

    console.log('Created basic WebSocket server (fallback mode)');

    wss.on('connection', (ws) => {
      console.log('Client connected to WebSocket');

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          console.log('Received message:', data);

          // Echo back the message
          ws.send(JSON.stringify({
            type: 'echo',
            message: data,
            timestamp: new Date().toISOString()
          }));
        } catch (err) {
          console.error('Error processing message:', err);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'system',
        message: 'Connected to basic WebSocket server',
        timestamp: new Date().toISOString()
      }));
    });
  }
} catch (error) {
  console.warn('Failed to start WebSocket server:', error);
}

// Function to spawn Python processes with the correct executable
function spawnPython(args, options = {}) {
  const { spawn, spawnSync } = require('child_process');
  const fs = require('fs');
  const path = require('path');

  // Use the configured Python executable if available, fall back to system Python
  let pythonExecutable;
  const tried = [];

  // Try config
  if (pythonConfig?.python_executable && fs.existsSync(pythonConfig.python_executable)) {
    pythonExecutable = pythonConfig.python_executable;
    tried.push(pythonExecutable);
  }

  // Try python3 in PATH
  if (!pythonExecutable) {
    try {
      const result = spawnSync('python3', ['--version'], { encoding: 'utf8' });
      if (result.status === 0) {
        pythonExecutable = 'python3';
        tried.push('python3');
      }
    } catch {}
  }

  // Try python in PATH
  if (!pythonExecutable) {
    try {
      const result = spawnSync('python', ['--version'], { encoding: 'utf8' });
      if (result.status === 0) {
        pythonExecutable = 'python';
        tried.push('python');
      }
    } catch {}
  }

  // Final fallback
  if (!pythonExecutable) {
    pythonExecutable = pythonConfig?.python_executable || 'python3';
    tried.push(pythonExecutable);
    console.warn('All python detection strategies failed, using fallback:', pythonExecutable);
  }

  console.log('spawnPython: will try', pythonExecutable, 'args:', args, 'tried:', tried);

  try {
    return spawn(pythonExecutable, args, options);
  } catch (error) {
    console.error(`Failed to spawn Python process: ${error.message}`);
    throw error;
  }
}

// Python API helpers with extensive diagnostics
app.get('/api/python/version', (req, res) => {
  try {
    // First check if Python configuration exists
    const fs = require('fs');
    const path = require('path');
    const diagnostics = {
      pythonConfigExists: false,
      pythonConfig: null,
      envVars: {
        PYTHON_PATH: process.env.PYTHON_PATH || 'Not set',
        NODE_ENV: process.env.NODE_ENV || 'Not set',
        PATH: process.env.PATH ? process.env.PATH.substring(0, 100) + '...' : 'Not set'
      },
      isDocker: fs.existsSync('/.dockerenv'),
      platform: process.platform,
      nodeVersion: process.version
    };

    // Check if python-config.json exists
    const pythonConfigPath = path.join(__dirname, 'python-config.json');
    if (fs.existsSync(pythonConfigPath)) {
      diagnostics.pythonConfigExists = true;
      diagnostics.pythonConfig = pythonConfig;
    }

    console.log('Executing Python version check...');
    // Try to spawn Python process with diagnostic details
    const python = spawnPython(['-c', 'import sys, platform; print(sys.version); print("---"); print(platform.platform())']);

    let output = '';
    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    let error = '';
    python.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Set a timeout in case the process hangs
    const timeout = setTimeout(() => {
      python.kill();
      res.status(500).json({
        status: 'error',
        message: 'Python process timed out after 5 seconds',
        diagnostics
      });
    }, 5000);

    python.on('error', (err) => {
      clearTimeout(timeout);
      console.error('Python spawn error:', err);
      res.status(500).json({
        status: 'error',
        message: `Failed to spawn Python process: ${err.message}`,
        diagnostics
      });
    });

    python.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        // Parse the output - format is: version \n --- \n platform
        const parts = output.split('---').map(part => part.trim());
        res.status(200).json({
          status: 'success',
          version: parts[0],
          platform: parts[1] || 'Unknown',
          executable: pythonConfig?.python_executable || 'system',
          diagnostics
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: error || 'Unknown error',
          exitCode: code,
          diagnostics
        });
      }
    });
  } catch (error) {
    console.error('Exception in /api/python/version:', error);
    res.status(500).json({
      status: 'error',
      message: `Exception: ${error.message}`,
      stack: error.stack
    });
  }
});

// More detailed Python diagnostics endpoint
app.get('/api/python/diagnostics', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const { spawnSync } = require('child_process');

    // Collect environment information
    const diagnostics = {
      server: {
        timestamp: new Date().toISOString(),
        platform: process.platform,
        nodeVersion: process.version,
        env: process.env.NODE_ENV || 'Not set',
        isDocker: fs.existsSync('/.dockerenv'),
        uid: process.getuid?.() || 'N/A',
        gid: process.getgid?.() || 'N/A'
      },
      pythonConfig: pythonConfig || 'Not loaded',
      paths: {
        cwd: process.cwd(),
        dirName: __dirname
      },
      environmentVariables: {
        PATH: process.env.PATH,
        PYTHON_PATH: process.env.PYTHON_PATH,
        PYTHONPATH: process.env.PYTHONPATH
      },
      pythonTests: {}
    };

    // Check common Python paths
    const pythonPaths = [
      pythonConfig?.python_executable,
      process.env.PYTHON_PATH,
      '/usr/bin/python3',
      '/usr/bin/python',
      'python3',
      'python'
    ].filter(Boolean);

    // Test each Python path
    diagnostics.pythonTests = pythonPaths.reduce((results, pythonPath) => {
      results[pythonPath] = {};

      // Test 1: Does the file exist?
      if (pythonPath.startsWith('/')) {
        results[pythonPath].exists = fs.existsSync(pythonPath);
      } else {
        results[pythonPath].exists = 'N/A (not absolute path)';
      }

      // Test 2: Can we execute with direct spawn?
      try {
        const directResult = spawnSync(pythonPath, ['--version'], { encoding: 'utf8' });
        results[pythonPath].directSpawn = {
          status: directResult.status,
          stdout: directResult.stdout?.trim(),
          stderr: directResult.stderr?.trim(),
          success: directResult.status === 0
        };
      } catch (err) {
        results[pythonPath].directSpawn = {
          error: err.message,
          success: false
        };
      }

      // Test 3: Can we execute with shell: true?
      try {
        const shellResult = spawnSync(pythonPath, ['--version'], { encoding: 'utf8', shell: true });
        results[pythonPath].shellSpawn = {
          status: shellResult.status,
          stdout: shellResult.stdout?.trim(),
          stderr: shellResult.stderr?.trim(),
          success: shellResult.status === 0
        };
      } catch (err) {
        results[pythonPath].shellSpawn = {
          error: err.message,
          success: false
        };
      }

      // Test 4: Try to import sys
      try {
        const importResult = spawnSync(pythonPath, ['-c', 'import sys; print(sys.executable)'],
          { encoding: 'utf8', shell: true });
        results[pythonPath].importSys = {
          status: importResult.status,
          stdout: importResult.stdout?.trim(),
          stderr: importResult.stderr?.trim(),
          success: importResult.status === 0
        };
      } catch (err) {
        results[pythonPath].importSys = {
          error: err.message,
          success: false
        };
      }

      return results;
    }, {});

    // Generate recommendations
    const successfulPaths = Object.entries(diagnostics.pythonTests)
      .filter(([_, tests]) => tests.directSpawn?.success || tests.shellSpawn?.success)
      .map(([path, _]) => path);

    diagnostics.recommendations = {
      workingPaths: successfulPaths,
      bestPath: successfulPaths[0] || null,
      needsShell: successfulPaths.some(path =>
        !diagnostics.pythonTests[path].directSpawn?.success &&
        diagnostics.pythonTests[path].shellSpawn?.success
      )
    };

    res.status(200).json({
      status: 'success',
      diagnostics
    });
  } catch (error) {
    console.error('Error in Python diagnostics:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down MCP server...');
  await pool.end();
  process.exit(0);
});
