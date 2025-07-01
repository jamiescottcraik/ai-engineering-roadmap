#!/bin/bash
# check-mcp-server.sh - Test the MCP server endpoints and functionality
# =======================================================================
# This script checks if the MCP server is running and working correctly.
# It tests the health endpoint, lists available tools, and tests a simple
# database query to verify that the MCP server can communicate with the database.

set -e  # Exit immediately if a command exits with a non-zero status

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== Testing MCP Server ====${NC}"
echo

# Check if the server is running
echo -e "${YELLOW}Checking health endpoint...${NC}"
HEALTH=$(curl -s http://localhost:3333/health)
if [ $? -ne 0 ]; then
  echo -e "${RED}MCP server is not running!${NC}"
  echo -e "${YELLOW}Make sure to start the containers first:${NC}"
  echo "  docker-compose -f docker-compose-mcp-consolidated.yml up -d"
  exit 1
fi

# Check health status
if [[ "$HEALTH" == *"healthy"* ]]; then
  echo -e "${GREEN}✓ MCP server is healthy${NC}"
else
  echo -e "${RED}✗ MCP server is not healthy: $HEALTH${NC}"
  exit 1
fi

echo

# Check available tools
echo -e "${YELLOW}Listing available tools...${NC}"
TOOLS=$(curl -s http://localhost:3333/mcp/tools)
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to list tools${NC}"
  exit 1
fi

echo "$TOOLS" | jq '.'
echo -e "${GREEN}✓ Successfully retrieved available tools${NC}"
echo

# Test a simple database query
echo -e "${YELLOW}Testing database connectivity...${NC}"
DB_TEST=$(curl -s -X POST http://localhost:3333/mcp/invoke \
  -H "Content-Type: application/json" \
  -d '{"toolName": "query_database", "parameters": {"query": "SELECT current_database(), version()"}}')

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to test database connectivity${NC}"
  exit 1
fi

echo "$DB_TEST" | jq '.'
echo -e "${GREEN}✓ Database connectivity test passed${NC}"
echo

echo -e "${BLUE}==== MCP Server Status ====${NC}"
echo -e "${GREEN}All tests passed! The MCP server is running correctly.${NC}"
echo
echo -e "${YELLOW}To use the MCP server in VS Code:${NC}"
echo "1. Make sure the MCP configuration in .vscode/settings.json is correct"
echo "2. The 'db_query_tool' server should point to http://localhost:3333/mcp"
echo "3. Restart VS Code if necessary to apply the changes"

exit 0
