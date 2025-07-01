const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Create Express app
const app = express();
const port = 3333;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
app.listen(port, () => {
  console.log(`Custom MCP Server running on port ${port}`);
  console.log('Available tools:');
  tools.forEach(tool => {
    console.log(`- ${tool.name}: ${tool.description}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down MCP server...');
  await pool.end();
  process.exit(0);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down MCP server...');
  await pool.end();
  process.exit(0);
});
