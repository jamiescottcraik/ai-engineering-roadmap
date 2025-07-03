/**
 * Simple WebSocket client test for brAInwav MCP server
 */
const WebSocket = require('ws');

// Connect to the WebSocket server
const ws = new WebSocket('ws://localhost:3333/ws');

ws.on('open', function open() {
  console.log('Connected to WebSocket server');

  // Send a test message
  ws.send(JSON.stringify({
    type: 'test',
    message: 'Hello WebSocket Server',
    timestamp: new Date().toISOString()
  }));
});

ws.on('message', function incoming(data) {
  try {
    const message = JSON.parse(data);
    console.log('Received:', message);

    // Close the connection after receiving a response
    setTimeout(() => {
      console.log('Test complete, closing connection');
      ws.close();
      process.exit(0);
    }, 1000);
  } catch (err) {
    console.error('Error parsing message:', err);
  }
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
  process.exit(1);
});

// Set a timeout to exit if we don't connect
setTimeout(() => {
  console.error('Connection timed out');
  process.exit(1);
}, 5000);
